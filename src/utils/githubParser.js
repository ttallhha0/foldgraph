import { parsePackageJson, parseRequirementsTxt } from './depFileParser';

/* ─── GitHub Repo → App Tree Parser ─────────────────────────────────────────
 *
 * Ana akış:
 *   fetchGithubRepo(url, token?)
 *     → parseGithubUrl       → { owner, repo, branch }
 *     → getDefaultBranch     → gerçek branch adı (yoksa)
 *     → fetchGitTree         → düz dosya listesi
 *     → flatTreeToAppTree    → iç ağaç formatı (App state ile uyumlu)
 */

// ─── URL Parser ──────────────────────────────────────────────────────────────

export function parseGithubUrl(raw) {
  const url = raw.trim().replace(/\/$/, '');
  const match = url.match(
    /github\.com\/([^/\s?#]+)\/([^/\s?#]+?)(?:\.git)?(?:\/tree\/([^/\s?#]+))?(?:\/.*)?$/
  );
  if (!match) throw new Error('Geçerli bir GitHub URL\'si girin.\nÖrnek: https://github.com/facebook/react');
  return { owner: match[1], repo: match[2], branch: match[3] || null };
}

// ─── GitHub API fetch (error handling + optional token) ──────────────────────

async function ghFetch(url, token) {
  const headers = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, { headers });
  } catch {
    throw new Error('Ağ hatası: GitHub\'a bağlanılamadı.');
  }

  if (res.status === 403) {
    const body = await res.json().catch(() => ({}));
    if (
      body.message?.toLowerCase().includes('rate limit') ||
      res.headers.get('x-ratelimit-remaining') === '0'
    ) {
      throw new Error(
        'GitHub API limitine takıldınız. Bir süre bekleyip tekrar deneyin ya da kişisel erişim tokeni (PAT) girin.'
      );
    }
    throw new Error('GitHub API erişim hatası (403). Repo özel olabilir.');
  }

  if (res.status === 404)
    throw new Error('Repo bulunamadı (404). URL\'yi ve erişim iznini kontrol edin.');

  if (res.status === 422)
    throw new Error('Repo çok büyük: GitHub tek seferde bu kadar dosya döndüremiyor.');

  if (!res.ok)
    throw new Error(`GitHub API hatası: ${res.status} ${res.statusText}`);

  return res.json();
}

// ─── Default branch ───────────────────────────────────────────────────────────

async function getDefaultBranch(owner, repo, token) {
  const data = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`, token);
  return data.default_branch;
}

// ─── Git Tree API ─────────────────────────────────────────────────────────────

async function fetchGitTree(owner, repo, branch, token) {
  const data = await ghFetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    token
  );
  return { items: data.tree ?? [], truncated: data.truncated ?? false };
}

// ─── Flat list → App tree ────────────────────────────────────────────────────

function flatTreeToAppTree(items, repoName) {
  let seq = 0;
  const uid = () => `gh-${++seq}`;

  // path → node lookup
  const byPath = new Map();

  const root = {
    id: 'root',
    type: 'folder',
    label: repoName,
    isNew: false,
    children: [],
  };
  byPath.set('', root);

  // Ensure all ancestor folders exist (handles repos where dirs may be implicit)
  function ensureFolder(parts) {
    for (let i = 1; i <= parts.length; i++) {
      const path = parts.slice(0, i).join('/');
      if (byPath.has(path)) continue;
      const parentPath = parts.slice(0, i - 1).join('/');
      const parent = byPath.get(parentPath);
      const node = { id: uid(), type: 'folder', label: parts[i - 1], isNew: false, children: [] };
      byPath.set(path, node);
      parent.children.push(node);
    }
  }

  // Sort so parent dirs always come before their contents
  const sorted = [...items].sort((a, b) => a.path.localeCompare(b.path));

  for (const item of sorted) {
    if (item.type !== 'blob' && item.type !== 'tree') continue;

    const parts  = item.path.split('/');
    const name   = parts[parts.length - 1];
    const parentParts = parts.slice(0, -1);

    // Make sure every ancestor folder node exists
    ensureFolder(parentParts);

    // Skip if this path was already created by ensureFolder
    if (byPath.has(item.path)) continue;

    const parent = byPath.get(parentParts.join('/'));

    const node =
      item.type === 'tree'
        ? { id: uid(), type: 'folder', label: name, isNew: false, children: [] }
        : { id: uid(), type: 'file',   label: name, isNew: false };

    byPath.set(item.path, node);
    parent.children.push(node);
  }

  return root;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * GitHub repo URL'sinden uygulama ağacı oluşturur.
 *
 * @param {string} url    - GitHub repo URL'si
 * @param {string} [token] - Opsiyonel kişisel erişim tokeni (rate limit için)
 * @returns {Promise<{ tree: object, truncated: boolean, branch: string }>}
 */
async function fetchRawFile(owner, repo, branch, path, token) {
  try {
    const data = await ghFetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      token
    );
    if (data.encoding === 'base64') return atob(data.content.replace(/\n/g, ''));
    return null;
  } catch { return null; }
}

export async function fetchGithubRepo(url, token = '') {
  const { owner, repo, branch: urlBranch } = parseGithubUrl(url);

  const branch = urlBranch || (await getDefaultBranch(owner, repo, token));

  const { items, truncated } = await fetchGitTree(owner, repo, branch, token);

  const tree = flatTreeToAppTree(items, repo);

  // Dep files
  const [pkgContent, reqContent] = await Promise.all([
    fetchRawFile(owner, repo, branch, 'package.json',    token),
    fetchRawFile(owner, repo, branch, 'requirements.txt', token),
  ]);
  const detectedDeps = [
    ...(pkgContent ? parsePackageJson(pkgContent)       : []),
    ...(reqContent ? parseRequirementsTxt(reqContent)   : []),
  ];

  return { tree, truncated, branch, owner, repo, detectedDeps };
}
