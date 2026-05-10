import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { templates } from '../data/templates';

const TopBar = memo(({ getScript, onLoadTemplate, onImportGithub, onImportFolder, nodeCount, hasContent }) => {
  const [dropOpen, setDropOpen] = useState(false);
  const [copied,   setCopied]   = useState(null);
  const dropRef     = useRef(null);
  const folderInput = useRef(null);

  // Templates dropdown — outside click
  useEffect(() => {
    if (!dropOpen) return;
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    window.addEventListener('mousedown', h, true);
    return () => window.removeEventListener('mousedown', h, true);
  }, [dropOpen]);

  const handleSelect = useCallback((tpl) => {
    setDropOpen(false);
    if (hasContent) {
      const ok = window.confirm('Your current graph will be replaced. Continue?');
      if (!ok) return;
    }
    onLoadTemplate(tpl);
  }, [hasContent, onLoadTemplate]);

  const copy = useCallback((shellMode) => {
    const script = getScript(shellMode);
    navigator.clipboard.writeText(script).catch(() => {});
    setCopied(shellMode);
    setTimeout(() => setCopied(null), 2000);
  }, [getScript]);

  return (
    <div className="flex h-12 w-full shrink-0 items-center gap-3 border-b border-white/[0.06] bg-[#0c0c14]" style={{ paddingLeft: '12px', paddingRight: '12px' }}>

      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[13px] font-bold tracking-tight text-white">FoldGraph</span>
          <span className="text-[10px] text-white/30">{nodeCount} nodes</span>
        </div>
      </div>

      <div className="h-5 w-px shrink-0 bg-white/[0.08]" />

      {/* Templates dropdown */}
      <div ref={dropRef} className="relative">
        <button
          onClick={() => setDropOpen((v) => !v)}
          className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-150 ${
            dropOpen
              ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
              : 'border-white/10 bg-white/[0.04] text-white/50 hover:border-white/20 hover:text-white/70'
          }`}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
          </svg>
          Templates
          <svg
            className={`h-3 w-3 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {dropOpen && (
          <div className="animate-slide-up absolute left-0 top-[calc(100%+6px)] z-50 w-64 rounded-xl border border-white/10 bg-[#13131f]/95 p-1.5 shadow-2xl backdrop-blur-xl">
            <div className="mb-1 px-3 py-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/25">
                Presets
              </span>
            </div>
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleSelect(tpl)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-100 hover:bg-white/[0.06]"
              >
                <span className="text-base leading-none">{tpl.emoji}</span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white/80">{tpl.label}</div>
                  <div className="truncate text-[10px] text-white/35">{tpl.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* GitHub Import */}
      <button
        onClick={onImportGithub}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/50 transition-all duration-150 hover:border-white/20 hover:text-white/70"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
        Import from GitHub
      </button>

      {/* Folder Import */}
      <button
        onClick={() => folderInput.current?.click()}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/50 transition-all duration-150 hover:border-white/20 hover:text-white/70"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
        </svg>
        Open Folder
      </button>
      <input
        ref={(el) => { folderInput.current = el; if (el) el.webkitdirectory = true; }}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => { onImportFolder(e.target.files); e.target.value = ''; }}
      />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Copy buttons */}
      <button
        onClick={() => copy('bash')}
        className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-150 ${
          copied === 'bash'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
            : 'border-white/10 bg-white/[0.04] text-white/50 hover:border-amber-500/25 hover:text-amber-300'
        }`}
      >
        {copied === 'bash'
          ? <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          : <span className="font-mono text-amber-400/70 text-[11px]">$</span>}
        {copied === 'bash' ? 'Copied!' : 'Copy for Bash'}
      </button>

      <button
        onClick={() => copy('powershell')}
        className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-150 ${
          copied === 'powershell'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
            : 'border-white/10 bg-white/[0.04] text-white/50 hover:border-indigo-500/25 hover:text-indigo-300'
        }`}
      >
        {copied === 'powershell'
          ? <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          : <span className="font-mono text-indigo-400/70 text-[11px]">PS</span>}
        {copied === 'powershell' ? 'Copied!' : 'Copy for PowerShell'}
      </button>
    </div>
  );
});

TopBar.displayName = 'TopBar';
export default TopBar;
