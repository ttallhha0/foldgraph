import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';

const FolderNode = memo(({ data, id }) => {
  const [isEditing, setIsEditing] = useState(data.isNew === true);
  const [label, setLabel] = useState(data.label || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) setLabel(data.label);
  }, [data.label, isEditing]);

  useEffect(() => {
    if (data.isRenaming) setIsEditing(true);
  }, [data.isRenaming]);

  const finishEditing = useCallback(() => {
    setIsEditing(false);
    data.onLabelChange?.(id, label);
    data.onRenameEnd?.();
  }, [id, label, data]);

  const handleKeyDown = useCallback((e) => {
    e.stopPropagation();
    if (e.key === 'Enter') finishEditing();
    if (e.key === 'Escape') { setLabel(data.label || 'unnamed'); setIsEditing(false); }
  }, [finishEditing, data.label]);

  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    data.onToggleCollapse?.(id);
  }, [id, data]);

  const isRoot      = data.isRoot === true;
  const hasChildren = (data.childCount ?? 0) > 0;
  const collapsed   = data.collapsed === true;

  return (
    <div
      className={`group relative min-w-[160px] max-w-[240px] rounded-xl border px-4 py-3 shadow-lg transition-all duration-200 ${
        isRoot
          ? 'border-indigo-500/40 bg-gradient-to-br from-indigo-950/60 to-violet-950/50 hover:border-indigo-400/60'
          : 'border-amber-500/30 bg-gradient-to-br from-amber-950/50 to-orange-950/40 hover:border-amber-400/50'
      }`}
    >
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-amber-500 !border-2 !border-amber-300 !rounded-full !-top-1.5 transition-all duration-200 hover:!scale-125"
        />
      )}

      <div className="flex items-center gap-2.5">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-md bg-gradient-to-br ${
          isRoot ? 'from-indigo-500 to-violet-500' : 'from-amber-500 to-orange-500'
        }`}>
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${isRoot ? 'text-indigo-400/70' : 'text-amber-400/70'}`}>
            {isRoot ? 'Root Folder' : 'Folder'}
          </span>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={finishEditing}
              onKeyDown={handleKeyDown}
              placeholder="folder name..."
              className={`bg-transparent text-sm font-medium outline-none border-b pb-0.5 w-full ${
                isRoot
                  ? 'text-indigo-100 border-indigo-400/50 placeholder:text-indigo-300/30'
                  : 'text-amber-100 border-amber-400/50 placeholder:text-amber-300/30'
              }`}
            />
          ) : (
            <span className={`truncate text-sm font-medium ${isRoot ? 'text-indigo-100' : 'text-amber-100'}`}>
              {label || 'unnamed'}
            </span>
          )}
        </div>

        {/* Collapse toggle — sadece çocuğu olan klasörlerde */}
        {hasChildren && (
          <button
            onClick={handleToggle}
            className={`ml-1 flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-all duration-150 ${
              isRoot
                ? 'text-indigo-300/60 hover:bg-indigo-500/15 hover:text-indigo-200'
                : 'text-amber-300/60 hover:bg-amber-500/15 hover:text-amber-200'
            }`}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <svg
              className={`h-3 w-3 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
              fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
            {collapsed && <span>{data.childCount}</span>}
          </button>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={`!w-3 !h-3 !border-2 !rounded-full !-bottom-1.5 transition-all duration-200 hover:!scale-125 ${
          isRoot ? '!bg-indigo-500 !border-indigo-300' : '!bg-amber-500 !border-amber-300'
        }`}
      />
    </div>
  );
});

FolderNode.displayName = 'FolderNode';
export default FolderNode;
