const INSTALL_CMD = {
  npm:  (_pkgs, _mode) => `npm install ${_pkgs}`,
  yarn: (_pkgs, _mode) => `yarn add ${_pkgs}`,
  pnpm: (_pkgs, _mode) => `pnpm add ${_pkgs}`,
  pip: (pkgs, mode) => mode === 'bash'
    ? `pip3 install ${pkgs} || pip install ${pkgs}`
    : `if (Get-Command pip3 -ErrorAction SilentlyContinue) { pip3 install ${pkgs} } else { pip install ${pkgs} }`,
};

/**
 * @param {Array<{name:string, manager:string}>} dependencies
 */
export function generateScript(tree, mode, targetDir = '', dependencies = []) {
  const lines = [];
  const sep   = mode === 'bash' ? '/' : '\\';
  const root  = tree.label?.trim() || 'project';

  if (targetDir?.trim()) {
    // Explicit target directory: navigate there directly
    lines.push(mode === 'bash' ? `cd "${targetDir.trim()}"` : `Set-Location "${targetDir.trim()}"`);
  } else {
    // Go up one level so the project folder is created alongside current dir
    lines.push(mode === 'bash' ? 'cd ..' : 'Set-Location ..');
  }
  lines.push('');

  function walk(node, pathParts) {
    const name         = node.label?.trim() || (node.type === 'folder' ? 'unnamed' : 'unnamed.txt');
    const currentParts = [...pathParts, name];
    const pathStr      = currentParts.join(sep);

    if (node.type === 'folder') {
      lines.push(mode === 'bash'
        ? `mkdir -p "${pathStr}"`
        : `New-Item -ItemType Directory -Force -Path "${pathStr}"`);
      (node.children || []).forEach((child) => walk(child, currentParts));
    } else {
      lines.push(mode === 'bash'
        ? `touch "${pathStr}"`
        : `New-Item -ItemType File -Force -Path "${pathStr}"`);
    }
  }

  walk(tree, []);

  // Navigate into the created root folder
  lines.push('');
  lines.push(mode === 'bash' ? `cd "${root}"` : `Set-Location "${root}"`);

  // Group deps by manager and emit one install command per group
  const groups = {};
  for (const dep of dependencies) {
    const mgr = dep.manager || 'npm';
    if (!groups[mgr]) groups[mgr] = [];
    groups[mgr].push(dep.name);
  }

  for (const [mgr, pkgs] of Object.entries(groups)) {
    const cmdFn = INSTALL_CMD[mgr] ?? INSTALL_CMD.npm;
    lines.push('');
    lines.push(cmdFn(pkgs.join(' '), mode));
  }

  return lines.join('\n');
}
