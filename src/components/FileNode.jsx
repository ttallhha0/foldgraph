import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { getFileIcon } from '../utils/fileIcons';

const FileNode = memo(({ data, id }) => {
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

  const handleKeyDown = useCallback(
    (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') finishEditing();
      if (e.key === 'Escape') {
        setLabel(data.label || 'unnamed.txt');
        setIsEditing(false);
      }
    },
    [finishEditing, data.label]
  );

  const displayName = label || 'unnamed.txt';
  const [IconComponent, iconColor] = getFileIcon(isEditing ? label : displayName);

  return (
    <div
      className="group relative min-w-[160px] max-w-[240px] rounded-xl px-4 py-3 shadow-lg transition-all duration-200"
      style={{
        border: `1px solid ${iconColor}40`,
        background: `linear-gradient(135deg, ${iconColor}0d 0%, ${iconColor}06 100%)`,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: iconColor, borderColor: `${iconColor}99` }}
        className="!w-3 !h-3 !border-2 !rounded-full !-top-1.5 transition-all duration-200 hover:!scale-125"
      />

      <div className="flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-md"
          style={{ backgroundColor: `${iconColor}20`, border: `1px solid ${iconColor}40` }}
        >
          <IconComponent style={{ color: iconColor, fontSize: '1rem' }} />
        </div>

        <div className="flex flex-col min-w-0">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: `${iconColor}99` }}
          >
            File
          </span>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={finishEditing}
              onKeyDown={handleKeyDown}
              placeholder="file name..."
              className="bg-transparent text-sm font-medium outline-none pb-0.5 w-full"
              style={{
                color: iconColor,
                borderBottom: `1px solid ${iconColor}60`,
              }}
            />
          ) : (
            <span
              className="truncate text-sm font-medium"
              style={{ color: iconColor }}
            >
              {displayName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

FileNode.displayName = 'FileNode';
export default FileNode;
