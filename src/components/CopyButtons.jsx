import { memo, useState, useCallback } from 'react';
import { generateScript } from '../utils/scriptGenerator';

const CopyButtons = memo(({ tree }) => {
  const [copied, setCopied] = useState(null); // 'bash' | 'powershell' | null

  const copy = useCallback((mode) => {
    const script = generateScript(tree, mode, '');
    navigator.clipboard.writeText(script).catch(() => {});
    setCopied(mode);
    setTimeout(() => setCopied(null), 2000);
  }, [tree]);

  return (
    <div className="absolute right-4 top-4 z-30 flex gap-2">
      <button
        onClick={() => copy('bash')}
        className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold shadow-xl backdrop-blur-xl transition-all duration-200 ${
          copied === 'bash'
            ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
            : 'border-white/10 bg-[#1a1a2e]/90 text-white/60 hover:border-amber-500/30 hover:text-amber-300'
        }`}
      >
        {copied === 'bash' ? (
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <span className="font-mono text-amber-400/80">$</span>
        )}
        {copied === 'bash' ? 'Kopyalandı' : 'Copy for Bash'}
      </button>

      <button
        onClick={() => copy('powershell')}
        className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold shadow-xl backdrop-blur-xl transition-all duration-200 ${
          copied === 'powershell'
            ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
            : 'border-white/10 bg-[#1a1a2e]/90 text-white/60 hover:border-indigo-500/30 hover:text-indigo-300'
        }`}
      >
        {copied === 'powershell' ? (
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <span className="font-mono text-indigo-400/80">PS</span>
        )}
        {copied === 'powershell' ? 'Kopyalandı' : 'Copy for PowerShell'}
      </button>
    </div>
  );
});

CopyButtons.displayName = 'CopyButtons';
export default CopyButtons;
