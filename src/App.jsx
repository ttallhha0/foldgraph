import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import FolderNode from './components/FolderNode';
import FileNode from './components/FileNode';
import ContextMenu from './components/ContextMenu';
import TopBar from './components/TopBar';
import GithubModal from './components/GithubModal';
import Sidebar from './components/Sidebar';
import { computeTreeLayout } from './utils/treeLayout';
import { getLayoutedElements } from './utils/layout';
import { fetchGithubRepo } from './utils/githubParser';
import { parseFolderFiles } from './utils/folderParser';
import { generateScript } from './utils/scriptGenerator';
import { generateDiffScript } from './utils/diffGenerator';
import { nextId, addToTree, removeFromTree, treeToFlow, updateLabelUnique, findNode, countTreeNodes, collectFolderIds } from './utils/treeHelpers';

const nodeTypes = { folder: FolderNode, file: FileNode };

function FlowCanvas() {
  const [tree, setTree] = useState({
    id: 'root', type: 'folder', label: 'project',
    isNew: false, children: [],
  });
  const [ctxMenu, setCtxMenu]           = useState(null);
  const [renamingId, setRenamingId]     = useState(null);
  const [githubOpen, setGithubOpen]     = useState(false);
  const [collapsedIds, setCollapsedIds] = useState(() => new Set());
  const [dependencies,        setDependencies]        = useState([]); // [{id,name,manager,isExisting?}]
  const [referenceDependencies, setReferenceDependencies] = useState([]);
  const [referenceTree,       setReferenceTree]       = useState(null);
  const [diffMode,            setDiffMode]            = useState('scratch');

  const addDep    = useCallback((dep) => setDependencies(d => [...d, dep]), []);
  const removeDep = useCallback((name) => setDependencies(d => d.filter(x => x.name !== name)), []);

  const getScript = useCallback((shellMode) => {
    if (diffMode === 'diff' && referenceTree) {
      return generateDiffScript(referenceTree, tree, shellMode, referenceDependencies, dependencies);
    }
    return generateScript(tree, shellMode, '', dependencies);
  }, [diffMode, referenceTree, tree, dependencies, referenceDependencies]);
  const { fitView } = useReactFlow();
  const historyRef  = useRef([]);
  // layoutFnRef: dagre for GitHub imports, computeTreeLayout for manual edits
  const layoutFnRef = useRef(computeTreeLayout);
  // treeRef: always mirrors `tree` state — lets callbacks read current tree
  // without being listed as deps (avoids stale closures and StrictMode issues).
  const treeRef = useRef(tree);
  useEffect(() => { treeRef.current = tree; }, [tree]);

  // Push current tree to history OUTSIDE the state updater to avoid
  // React StrictMode double-invocation creating duplicate history entries.
  const pushHistory = useCallback(() => {
    historyRef.current = [...historyRef.current.slice(-49), treeRef.current];
  }, []);

  const commitTree = useCallback((updater) => {
    pushHistory();
    setTree((prev) => typeof updater === 'function' ? updater(prev) : updater);
  }, [pushHistory]);

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const prev = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    setTree(prev);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo]);

  const loadTemplate = useCallback((tpl) => {
    pushHistory();
    setCollapsedIds(new Set());
    setTree(tpl.tree);
    setTimeout(() => fitView({ padding: 0.25, duration: 350 }), 100);
  }, [pushHistory, fitView]);

  const COLLAPSE_THRESHOLD = 80;

  const importFromFolder = useCallback(async (fileList) => {
    if (!fileList?.length) return;
    let folderTree, detectedDeps = [];
    try {
      ({ tree: folderTree, detectedDeps } = await parseFolderFiles(fileList));
    } catch (err) {
      alert(err.message);
      return;
    }
    const total = countTreeNodes(folderTree);
    const autoCollapsed = total > COLLAPSE_THRESHOLD
      ? new Set(collectFolderIds(folderTree, 2))
      : new Set();
    let idSeq = 0;
    const depObjs = detectedDeps.map(d => ({ id: ++idSeq, name: d.name, manager: d.manager, isExisting: true }));
    layoutFnRef.current = (ns, es) => getLayoutedElements(ns, es, 'TB').nodes;
    pushHistory();
    setCollapsedIds(autoCollapsed);
    setTree(folderTree);
    setReferenceTree(folderTree);
    setDependencies(depObjs);
    setReferenceDependencies(depObjs);
    setDiffMode('scratch');
    requestAnimationFrame(() => { layoutFnRef.current = computeTreeLayout; });
    setTimeout(() => fitView({ padding: 0.15, duration: 500 }), 200);
  }, [pushHistory, fitView]);

  const importFromGithub = useCallback(async (url, token) => {
    const { tree: ghTree, truncated, detectedDeps = [] } = await fetchGithubRepo(url, token);

    // Büyük repolar → depth >= 2 klasörleri otomatik daralt
    const total = countTreeNodes(ghTree);
    const autoCollapsed = total > COLLAPSE_THRESHOLD
      ? new Set(collectFolderIds(ghTree, 2))
      : new Set();

    let idSeq = 0;
    const depObjs = detectedDeps.map(d => ({ id: ++idSeq, name: d.name, manager: d.manager, isExisting: true }));
    layoutFnRef.current = (ns, es) => getLayoutedElements(ns, es, 'TB').nodes;
    pushHistory();
    setCollapsedIds(autoCollapsed);
    setTree(ghTree);
    setReferenceTree(ghTree);
    setDependencies(depObjs);
    setReferenceDependencies(depObjs);
    setDiffMode('scratch');
    requestAnimationFrame(() => { layoutFnRef.current = computeTreeLayout; });
    setTimeout(() => fitView({ padding: 0.15, duration: 500 }), 200);
    setGithubOpen(false);
    if (truncated) {
      // Truncated uyarısı — büyük repolar için
      console.warn('GitHub API: Repo çok büyük, bazı dosyalar eksik olabilir.');
    }
    return { truncated };
  }, [pushHistory, fitView]);

  const onLabelChange = useCallback((nodeId, newLabel) => {
    const target = findNode(treeRef.current, nodeId);
    // isNew=true → ilk isimlendirme, history'ye yazma (yaratma zaten kayıtlı).
    // isNew=false → rename, history'ye yaz.
    if (target && !target.isNew) pushHistory();
    setTree((prev) => updateLabelUnique(prev, nodeId, newLabel));
  }, [pushHistory]);

  const onRenameEnd = useCallback(() => setRenamingId(null), []);

  const toggleCollapse = useCallback((nodeId) => {
    setCollapsedIds(prev => {
      const next = new Set(prev);
      next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId);
      return next;
    });
  }, []);

  const { nodes, edges } = useMemo(
    () => treeToFlow(tree, layoutFnRef.current, onLabelChange, onRenameEnd, renamingId, collapsedIds, toggleCollapse),
    [tree, onLabelChange, onRenameEnd, renamingId, collapsedIds, toggleCollapse]
  );

  const onNodeContextMenu = useCallback((e, node) => {
    e.preventDefault();
    setCtxMenu({
      x: e.clientX, y: e.clientY,
      nodeId: node.id, nodeType: node.type,
      isRoot: node.data?.isRoot === true,
    });
  }, []);

  const onNodeDoubleClick = useCallback((e, node) => {
    setRenamingId(node.id);
  }, []);

  const close = useCallback(() => setCtxMenu(null), []);

  const addChild = useCallback((type) => {
    if (!ctxMenu?.nodeId) return;
    const child = {
      id: nextId(), type, label: '', isNew: true,
      children: type === 'folder' ? [] : undefined,
    };
    commitTree((t) => addToTree(t, ctxMenu.nodeId, child));
    setCtxMenu(null);
    setTimeout(() => fitView({ padding: 0.3, duration: 200 }), 80);
  }, [ctxMenu, fitView, commitTree]);

  const deleteNode = useCallback(() => {
    if (!ctxMenu?.nodeId || ctxMenu.isRoot) return;
    commitTree((t) => removeFromTree(t, ctxMenu.nodeId));
    setCtxMenu(null);
    setTimeout(() => fitView({ padding: 0.3, duration: 200 }), 80);
  }, [ctxMenu, fitView, commitTree]);

  const renameNode = useCallback(() => {
    if (!ctxMenu?.nodeId) return;
    setRenamingId(ctxMenu.nodeId);
    setCtxMenu(null);
  }, [ctxMenu]);

  const miniMapColor = useCallback((n) => {
    if (n.data?.isRoot) return '#8b5cf6';
    if (n.type === 'folder') return '#f59e0b';
    if (n.type === 'file') return '#10b981';
    return '#6366f1';
  }, []);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Top menu bar */}
      <TopBar
        getScript={getScript}
        onLoadTemplate={loadTemplate}
        onImportGithub={() => setGithubOpen(true)}
        onImportFolder={importFromFolder}
        nodeCount={nodes.length}
        hasContent={tree.children?.length > 0}
      />

      {/* Canvas + Sidebar */}
      <div className="flex flex-1 min-h-0">

        {/* Canvas */}
        <div className="relative flex-1 min-w-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeContextMenu={onNodeContextMenu}
            onNodeDoubleClick={onNodeDoubleClick}
            onPaneClick={close}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            minZoom={0.05}
            maxZoom={2}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#1e1e3a" gap={24} size={1} variant="dots" />
            <Controls position="bottom-right" showInteractive={false} />
            <MiniMap
              position="bottom-left"
              nodeColor={miniMapColor}
              nodeStrokeColor={miniMapColor}
              nodeStrokeWidth={2}
              maskColor="rgba(10, 10, 20, 0.8)"
              style={{ backgroundColor: '#1e1e2e', border: '1px solid #3a3a5a', borderRadius: '12px' }}
              pannable
              zoomable
            />
          </ReactFlow>

          {nodes.length <= 1 && (
            <div className="animate-fade-in pointer-events-none absolute inset-0 z-20 flex items-end justify-center pb-28">
              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-6 py-3 backdrop-blur-sm">
                <svg className="h-5 w-5 text-indigo-400/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <p className="text-xs text-white/40">
                  Right-click the <span className="font-semibold text-white/60">Root</span> folder to add subfolders or files
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar
          dependencies={dependencies}
          addDep={addDep}
          removeDep={removeDep}
          diffMode={diffMode}
          setDiffMode={setDiffMode}
          hasReference={referenceTree !== null}
        />
      </div>

      {githubOpen && (
        <GithubModal onImport={importFromGithub} onClose={() => setGithubOpen(false)} />
      )}

      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x} y={ctxMenu.y}
          nodeType={ctxMenu.nodeType} isRoot={ctxMenu.isRoot}
          onAddFolder={() => addChild('folder')}
          onAddFile={() => addChild('file')}
          onRename={renameNode}
          onDelete={deleteNode}
          onClose={close}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="h-screen w-screen bg-[#0a0a0f]">
      <ReactFlowProvider><FlowCanvas /></ReactFlowProvider>
    </div>
  );
}
