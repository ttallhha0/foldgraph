import { memo } from 'react';

const ContextMenu = memo(({ x, y, nodeType, isRoot, onAddFolder, onAddFile, onRename, onDelete, onClose }) => {
  const isFolder = nodeType === 'folder';

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="animate-slide-up fixed z-50 min-w-[200px] rounded-xl border border-white/10 bg-[#1a1a2e]/95 p-1.5 shadow-2xl backdrop-blur-xl"
        style={{ left: x, top: y }}
      >
        {isFolder && (
          <>
            <div className="mb-1 px-3 py-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Add New</span>
            </div>
            <button
              onClick={onAddFolder}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-amber-200 transition-all duration-150 hover:bg-amber-500/10"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <span>Add Folder</span>
            </button>
            <button
              onClick={onAddFile}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-emerald-200 transition-all duration-150 hover:bg-emerald-500/10"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-sm">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <span>Add File</span>
            </button>
          </>
        )}

        {!isRoot && (
          <>
            {isFolder && <div className="my-1 h-px bg-white/5" />}
            <button
              onClick={onRename}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-indigo-300 transition-all duration-150 hover:bg-indigo-500/10"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 shadow-sm">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              </div>
              <span>Rename</span>
            </button>
          </>
        )}

        {!isRoot && (
          <>
            <div className="my-1 h-px bg-white/5" />
            <button
              onClick={onDelete}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-300 transition-all duration-150 hover:bg-rose-500/10"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-rose-500 to-pink-600 shadow-sm">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <span>Delete</span>
            </button>
          </>
        )}
      </div>
    </>
  );
});

ContextMenu.displayName = 'ContextMenu';
export default ContextMenu;
