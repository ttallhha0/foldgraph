/* ─── Path map ───────────────────────────────────────────────────────────────
 * Her node için tam yol (full path) ve tipi hesaplar.
 * Map<id, { path, type }>
 */
function buildPathMap(tree) {
  const map = new Map();
  function walk(node, parent) {
    const path = parent ? `${parent}/${node.label}` : node.label;
    map.set(node.id, { path, type: node.type });
    (node.children || []).forEach(c => walk(c, path));
  }
  walk(tree, '');
  return map;
}

/* ─── Redundant filter ────────────────────────────────────────────────────────
 * Silinecek bir klasörün alt öğelerini listeden çıkar —
 * rm -rf parent zaten tümünü siler.
 */
function pruneChildren(items) {
  const paths = new Set(items.map(i => i.path));
  return items.filter(({ path }) => {
    const parts = path.split('/');
    for (let i = 1; i < parts.length; i++) {
      if (paths.has(parts.slice(0, i).join('/'))) return false;
    }
    return true;
  });
}

/* ─── Main diff function ──────────────────────────────────────────────────────
 * refTree  : import sırasında kaydedilen orijinal ağaç
 * curTree  : şu anki düzenlenmiş ağaç
 * mode     : 'bash' | 'powershell'
 */
const UNINSTALL_CMD = {
  npm:  (pkgs) => `npm uninstall ${pkgs}`,
  yarn: (pkgs) => `yarn remove ${pkgs}`,
  pnpm: (pkgs) => `pnpm remove ${pkgs}`,
  pip:  (pkgs) => `pip uninstall -y ${pkgs}`,
};
const INSTALL_CMD = {
  npm:  (pkgs) => `npm install ${pkgs}`,
  yarn: (pkgs) => `yarn add ${pkgs}`,
  pnpm: (pkgs) => `pnpm add ${pkgs}`,
  pip:  (pkgs) => `pip install ${pkgs}`,
};

export function generateDiffScript(refTree, curTree, mode, refDeps = [], curDeps = []) {
  if (!refTree || !curTree) return '';

  const refMap = buildPathMap(refTree);
  const curMap = buildPathMap(curTree);

  const deleted = [];
  const renamed = [];
  const added   = [];

  // Silinen + rename edilen
  for (const [id, ref] of refMap) {
    const cur = curMap.get(id);
    if (!cur) {
      deleted.push(ref);
    } else if (cur.path !== ref.path) {
      renamed.push({ oldPath: ref.path, newPath: cur.path });
    }
  }

  // Eklenen
  for (const [id, cur] of curMap) {
    if (!refMap.has(id)) added.push(cur);
  }

  // (early return removed — dep diff may still produce output)

  const prunedDeleted = pruneChildren(deleted);
  const toPath = (p) => mode === 'bash' ? p : p.replaceAll('/', '\\');

  const lines = [];

  // 1 ─ Silinenler
  if (prunedDeleted.length) {
    lines.push('# --- Remove ---');
    for (const { path } of prunedDeleted) {
      lines.push(mode === 'bash'
        ? `rm -rf "${toPath(path)}"`
        : `Remove-Item -Recurse -Force -Path "${toPath(path)}"`);
    }
  }

  // 2 ─ Taşınan / rename edilenler
  if (renamed.length) {
    if (lines.length) lines.push('');
    lines.push('# --- Rename / Move ---');
    for (const { oldPath, newPath } of renamed) {
      lines.push(mode === 'bash'
        ? `mv "${toPath(oldPath)}" "${toPath(newPath)}"`
        : `Move-Item -Path "${toPath(oldPath)}" -Destination "${toPath(newPath)}"`);
    }
  }

  // 3 ─ Eklenenler (klasörler önce, sonra dosyalar)
  if (added.length) {
    if (lines.length) lines.push('');
    lines.push('# --- Create ---');
    const folders = added.filter(a => a.type === 'folder').sort((a, b) => a.path.localeCompare(b.path));
    const files   = added.filter(a => a.type === 'file');
    for (const { path } of folders) {
      lines.push(mode === 'bash'
        ? `mkdir -p "${toPath(path)}"`
        : `New-Item -ItemType Directory -Force -Path "${toPath(path)}"`);
    }
    for (const { path } of files) {
      lines.push(mode === 'bash'
        ? `touch "${toPath(path)}"`
        : `New-Item -ItemType File -Force -Path "${toPath(path)}"`);
    }
  }

  // ─── Dependency diff ──────────────────────────────────────────────────────
  const refDepMap = new Map(refDeps.map(d => [d.name, d]));
  const curDepMap = new Map(curDeps.map(d => [d.name, d]));

  // Removed: in ref but not in current
  const removedDeps = refDeps.filter(d => !curDepMap.has(d.name));
  // Added: in current but not in ref (and not an unchanged existing package)
  const addedDeps   = curDeps.filter(d => !refDepMap.has(d.name));

  if (removedDeps.length || addedDeps.length) {
    lines.push('');
    lines.push('# --- Dependencies ---');

    // Group removals by manager
    const removeGroups = {};
    for (const d of removedDeps) {
      if (!removeGroups[d.manager]) removeGroups[d.manager] = [];
      removeGroups[d.manager].push(d.name);
    }
    for (const [mgr, pkgs] of Object.entries(removeGroups)) {
      const fn = UNINSTALL_CMD[mgr] ?? UNINSTALL_CMD.npm;
      lines.push(fn(pkgs.join(' ')));
    }

    // Group additions by manager
    const addGroups = {};
    for (const d of addedDeps) {
      if (!addGroups[d.manager]) addGroups[d.manager] = [];
      addGroups[d.manager].push(d.name);
    }
    for (const [mgr, pkgs] of Object.entries(addGroups)) {
      const fn = INSTALL_CMD[mgr] ?? INSTALL_CMD.npm;
      lines.push(fn(pkgs.join(' ')));
    }
  }

  return lines.length ? lines.join('\n') : '# No changes detected.';
}
