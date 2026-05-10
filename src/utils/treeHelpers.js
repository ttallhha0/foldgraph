/* ─── Tree manipulation helpers ─── */

export function findNode(node, id) {
  if (node.id === id) return node;
  for (const ch of (node.children || [])) {
    const found = findNode(ch, id);
    if (found) return found;
  }
  return null;
}

let _idSeq = 0;
export const nextId = () => `n${++_idSeq}`;

/** Update a node's properties anywhere in the tree */
export function updateInTree(node, targetId, updates) {
  if (node.id === targetId) return { ...node, ...updates };
  if (!node.children) return node;
  return { ...node, children: node.children.map((c) => updateInTree(c, targetId, updates)) };
}

/** Prepend a child under a parent (new child appears on the LEFT) */
export function addToTree(node, parentId, child) {
  if (node.id === parentId) {
    return { ...node, children: [child, ...(node.children || [])] };
  }
  if (!node.children) return node;
  return { ...node, children: node.children.map((c) => addToTree(c, parentId, child)) };
}

/** Remove a node (and its subtree) from the tree */
export function removeFromTree(node, targetId) {
  if (!node.children) return node;
  return {
    ...node,
    children: node.children
      .filter((c) => c.id !== targetId)
      .map((c) => removeFromTree(c, targetId)),
  };
}

/** Update label with uniqueness among siblings */
export function updateLabelUnique(tree, targetId, newLabel) {
  // Find parent to check siblings
  function findParent(node, target) {
    if (!node.children) return null;
    for (const ch of node.children) {
      if (ch.id === target) return node;
      const found = findParent(ch, target);
      if (found) return found;
    }
    return null;
  }

  // Find the target node to know its type
  function findNode(node, id) {
    if (node.id === id) return node;
    for (const ch of (node.children || [])) {
      const found = findNode(ch, id);
      if (found) return found;
    }
    return null;
  }

  const target = findNode(tree, targetId);
  if (!target) return tree;

  const defaultLabel = target.type === 'folder' ? 'unnamed' : 'unnamed.txt';
  let label = newLabel || defaultLabel;

  const parent = findParent(tree, targetId);
  if (parent) {
    // Only check against siblings of the SAME type so they are independent as requested
    const siblingLabels = new Set(
      parent.children
        .filter((c) => c.id !== targetId && c.type === target.type)
        .map((c) => c.label)
    );
    
    if (siblingLabels.has(label)) {
      let i = 2;
      const isFile = target.type === 'file';
      const extMatch = label.match(/(.*)(\.[^.]+)$/);
      let baseName = label;
      let ext = '';
      
      if (isFile && extMatch) {
        baseName = extMatch[1];
        ext = extMatch[2];
      }
      
      while (siblingLabels.has(`${baseName}${i}${ext}`)) {
        i++;
      }
      label = `${baseName}${i}${ext}`;
    }
  }

  return updateInTree(tree, targetId, { label, isNew: false });
}

/* ─── Tree utilities ────────────────────────────────────────────────────────── */

/** Ağaçtaki toplam düğüm sayısını döner. */
export function countTreeNodes(node) {
  return 1 + (node.children || []).reduce((s, c) => s + countTreeNodes(c), 0);
}

/** fromDepth ve üzeri derinlikteki klasör id'lerini döner (auto-collapse için). */
export function collectFolderIds(node, fromDepth, depth = 0) {
  const ids = [];
  if (depth >= fromDepth && node.type === 'folder' && (node.children || []).length > 0) {
    ids.push(node.id);
  }
  if (depth < fromDepth) {
    (node.children || []).forEach(c => ids.push(...collectFolderIds(c, fromDepth, depth + 1)));
  }
  return ids;
}

/* ─── Tree → React Flow nodes & edges ─────────────────────────────────────── */

const EDGE_STYLE = { stroke: '#4f46e5', strokeWidth: 2 };

export function treeToFlow(
  tree, layoutFn, onLabelChange, onRenameEnd, renamingId,
  collapsedIds = new Set(), onToggleCollapse
) {
  const nodes = [];
  const edges = [];

  function walk(item, depth) {
    const children   = item.children || [];
    const isCollapsed = item.type === 'folder' && collapsedIds.has(item.id);

    nodes.push({
      id: item.id,
      type: item.type,
      position: { x: 0, y: 0 },
      width: 180,
      height: 55,
      deletable: depth > 0,
      data: {
        label: item.label,
        isNew: item.isNew || false,
        isRoot: depth === 0,
        isRenaming: item.id === renamingId,
        collapsed: isCollapsed,
        childCount: children.length,
        onLabelChange,
        onRenameEnd,
        onToggleCollapse,
      },
    });

    if (!isCollapsed) {
      children.forEach((child) => {
        edges.push({
          id: `${item.id}->${child.id}`,
          source: item.id,
          target: child.id,
          type: 'smoothstep',
          style: EDGE_STYLE,
        });
        walk(child, depth + 1);
      });
    }
  }

  walk(tree, 0);
  return { nodes: layoutFn(nodes, edges), edges };
}
