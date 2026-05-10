import { memo, useState, useCallback, useEffect, useRef } from 'react';

const GithubModal = memo(({ onImport, onClose }) => {
  const [url,       setUrl]       = useState('');
  const [token,     setToken]     = useState('');
  const [showToken, setShowToken] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!url.trim()) { setError('Please enter a GitHub URL.'); return; }
    setError('');
    setLoading(true);
    try {
      await onImport(url.trim(), token.trim());
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [url, token, onImport]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="animate-slide-up w-full max-w-md rounded-2xl border border-white/10 bg-[#13131f] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Import from GitHub</h2>
              <p className="text-[10px] text-white/35">Automatically visualize repo structure</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/25 transition-colors hover:text-white/60">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-white/40">
              GitHub Repo URL
            </label>
            <input
              ref={inputRef}
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(''); }}
              placeholder="https://github.com/user/repo"
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/20 outline-none transition-colors focus:border-indigo-500/50 focus:bg-white/[0.07] disabled:opacity-50"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowToken(v => !v)}
              className="flex items-center gap-1.5 text-[11px] text-white/30 transition-colors hover:text-white/50"
            >
              <svg
                className={`h-3 w-3 transition-transform duration-200 ${showToken ? 'rotate-90' : ''}`}
                fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              GitHub Token (optional, for rate limits)
            </button>
            {showToken && (
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/20 outline-none transition-colors focus:border-indigo-500/50 focus:bg-white/[0.07] disabled:opacity-50"
              />
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-xs leading-relaxed text-rose-300">{error}</p>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-sm font-semibold text-white/40 transition-colors hover:bg-white/[0.07] hover:text-white/60 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Loading...
                </>
              ) : 'Generate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

GithubModal.displayName = 'GithubModal';
export default GithubModal;
