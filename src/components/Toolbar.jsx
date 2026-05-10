import { memo } from 'react';

const Toolbar = memo(({ nodeCount, edgeCount }) => {
  return (
    <div className="absolute left-4 top-4 z-30">
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#1a1a2e]/90 px-4 py-2.5 shadow-xl backdrop-blur-xl">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-white">FoldGraph</span>
          <span className="text-[10px] text-white/40">
            {nodeCount} düğüm · {edgeCount} bağlantı
          </span>
        </div>
      </div>
    </div>
  );
});

Toolbar.displayName = 'Toolbar';
export default Toolbar;
