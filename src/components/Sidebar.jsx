import { memo, useState, useCallback, useRef, useEffect } from 'react';

const MANAGERS = [
  { value: 'npm',  label: 'npm',  color: '#cb3837' },
  { value: 'yarn', label: 'Yarn', color: '#2c8ebb' },
  { value: 'pnpm', label: 'pnpm', color: '#f69220' },
  { value: 'pip',  label: 'pip',  color: '#3776ab' },
];

const Sidebar = memo(({ dependencies, addDep, removeDep, diffMode, setDiffMode, hasReference }) => {
  const [open,        setOpen]        = useState(true);
  const [manager,     setManager]     = useState('npm');
  const [input,       setInput]       = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching,   setSearching]   = useState(false);
  const [activeIdx,   setActiveIdx]   = useState(-1);
  const inputRef = useRef(null);
  const dropRef  = useRef(null);
  const timerRef = useRef(null);
  const idRef    = useRef(0);

  // ── npm autocomplete (300 ms debounce) ───────────────────────────────────
  useEffect(() => {
    const q = input.trim();
    if (!q) { setSuggestions([]); setSearching(false); return; }
    setSearching(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(q)}&size=6`);
        const data = await res.json();
        setSuggestions(data.objects?.map(o => ({
          name:        o.package.name,
          description: o.package.description,
          version:     o.package.version,
        })) ?? []);
      } catch { setSuggestions([]); }
      finally  { setSearching(false); }
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [input]);

  // ── Dışarı tıkla → dropdown kapat ───────────────────────────────────────
  useEffect(() => {
    if (!suggestions.length) return;
    const h = (e) => {
      if (!dropRef.current?.contains(e.target) && !inputRef.current?.contains(e.target))
        setSuggestions([]);
    };
    window.addEventListener('mousedown', h, true);
    return () => window.removeEventListener('mousedown', h, true);
  }, [suggestions.length]);

  // ── Paket ekle ────────────────────────────────────────────────────────────
  const pick = useCallback((name) => {
    const n = name?.trim();
    if (!n || dependencies.some(d => d.name === n)) return;
    addDep({ id: ++idRef.current, name: n, manager });
    setInput('');
    setSuggestions([]);
    setActiveIdx(-1);
    inputRef.current?.focus();
  }, [dependencies, addDep, manager]);

  const handleAdd = useCallback(() => pick(input), [input, pick]);

  const handleKey = useCallback((e) => {
    if (suggestions.length) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); return; }
      if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); pick(suggestions[activeIdx].name); return; }
      if (e.key === 'Escape')    { setSuggestions([]); setActiveIdx(-1); return; }
    }
    if (e.key === 'Enter') handleAdd();
  }, [suggestions, activeIdx, pick, handleAdd]);

  const mgrMeta = (m) => MANAGERS.find(x => x.value === m) ?? MANAGERS[0];

  // ── Collapsed strip ───────────────────────────────────────────────────────
  if (!open) {
    return (
      <div className="flex w-10 shrink-0 flex-col items-center gap-4 border-l border-white/[0.06] bg-[#0e0e16] py-4">
        <button onClick={() => setOpen(true)} title="Dependencies"
          className="text-white/25 transition-colors hover:text-white/60">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="select-none text-[9px] font-bold uppercase tracking-widest text-white/15 [writing-mode:vertical-rl] rotate-180">
          Dependencies
        </span>
        {dependencies.length > 0 && (
          <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400">
            {dependencies.length}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-72 shrink-0 flex-col border-l border-white/[0.06] bg-[#0e0e16]">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_6px_2px_rgba(139,92,246,0.35)]" />
          <span className="text-xs font-semibold text-white/60">Dependencies</span>
          {dependencies.length > 0 && (
            <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400">
              {dependencies.length}
            </span>
          )}
        </div>
        <button onClick={() => setOpen(false)}
          className="text-white/25 transition-colors hover:text-white/60">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col flex-1 min-h-0 overflow-auto">
        <div className="space-y-3 px-4 py-4">

          {/* Script mode toggle */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-white/30">
              Script Mode
            </label>
            <div className="flex rounded-lg overflow-hidden border border-white/10">
              <button
                onClick={() => setDiffMode('scratch')}
                className={`flex-1 py-2 text-xs font-semibold transition-all duration-150 ${
                  diffMode === 'scratch'
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'text-white/30 hover:text-white/50 hover:bg-white/5'
                }`}
              >
                From Scratch
              </button>
              <button
                onClick={() => hasReference && setDiffMode('diff')}
                disabled={!hasReference}
                title={!hasReference ? 'Import a folder or GitHub repo first' : ''}
                className={`flex-1 py-2 text-xs font-semibold transition-all duration-150 ${
                  !hasReference
                    ? 'cursor-not-allowed opacity-30 text-white/20'
                    : diffMode === 'diff'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'text-white/30 hover:text-white/50 hover:bg-white/5'
                }`}
              >
                Apply Changes
              </button>
            </div>
            {diffMode === 'diff' && (
              <p className="mt-1.5 text-[10px] text-amber-400/60">
                Copy buttons will output only the diff (rm, mv, mkdir…)
              </p>
            )}
          </div>

          <div className="h-px bg-white/[0.06]" />

          {/* Manager dropdown */}
          <select
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#1a1a2e] px-3 py-2 text-xs font-semibold text-white/70 outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
          >
            {MANAGERS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          {/* Package search + add */}
          <div className="relative">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); setActiveIdx(-1); }}
                onKeyDown={handleKey}
                placeholder="package name…"
                autoComplete="off"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white/80 placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-colors"
              />
              <button onClick={handleAdd} disabled={!input.trim()}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-30">
                Add
              </button>
            </div>

            {/* Autocomplete dropdown */}
            {(suggestions.length > 0 || searching) && (
              <div ref={dropRef}
                className="absolute left-0 right-10 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-white/10 bg-[#13131f]/98 shadow-2xl backdrop-blur-xl">
                {searching && !suggestions.length && (
                  <div className="flex items-center gap-2 px-3 py-2.5 text-xs text-white/30">
                    <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Searching…
                  </div>
                )}
                {suggestions.map((s, i) => {
                  const already = dependencies.some(d => d.name === s.name);
                  return (
                    <button key={s.name}
                      onMouseDown={(e) => { e.preventDefault(); if (!already) pick(s.name); }}
                      className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors ${
                        already ? 'cursor-default opacity-40'
                          : i === activeIdx ? 'bg-indigo-500/15'
                          : 'hover:bg-white/[0.05]'
                      }`}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-white/80">{s.name}</span>
                          <span className="text-[10px] text-white/25">{s.version}</span>
                          {already && <span className="text-[10px] text-emerald-400/60">✓ added</span>}
                        </div>
                        {s.description && (
                          <p className="mt-0.5 truncate text-[10px] text-white/30">{s.description}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Package list */}
          {dependencies.length > 0 && (
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-white/30">
                Packages ({dependencies.length})
              </label>
              <div className="space-y-1.5">
                {dependencies.map((dep) => {
                  const meta = mgrMeta(dep.manager);
                  return (
                    <div key={dep.id ?? dep.name}
                      className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="shrink-0 rounded px-1.5 py-px text-[9px] font-bold uppercase"
                          style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>
                          {meta.label}
                        </span>
                        <span className="truncate font-mono text-xs text-white/70">{dep.name}</span>
                      </div>
                      <button onClick={() => removeDep(dep.name)}
                        className="ml-2 shrink-0 text-white/20 transition-colors hover:text-rose-400">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {dependencies.length === 0 && (
            <p className="pt-2 text-center text-xs text-white/15">
              Select a package manager and add packages
            </p>
          )}

        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;
