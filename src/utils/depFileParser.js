/** package.json → [{name, manager:'npm'}] */
export function parsePackageJson(content) {
  try {
    const pkg = JSON.parse(content);
    const names = new Set([
      ...Object.keys(pkg.dependencies    || {}),
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]);
    return [...names].map(name => ({ name, manager: 'npm' }));
  } catch {
    return [];
  }
}

/** requirements.txt → [{name, manager:'pip'}] */
export function parseRequirementsTxt(content) {
  return content
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#') && !l.startsWith('-r') && !l.startsWith('--'))
    .map(l => {
      // Strip version specifiers and extras: numpy>=1.0[extra]; python_requires...
      const name = l.split(/[>=<!~\s\[;#]/)[0].trim().toLowerCase();
      return name ? { name, manager: 'pip' } : null;
    })
    .filter(Boolean);
}
