import { parsePackageJson, parseRequirementsTxt } from './depFileParser';

// Filtrelenecek klasörler
const BLACKLIST = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', 'out',
  '__pycache__', '.venv', 'venv', 'env', '.env',
  '.cache', 'coverage', '.nyc_output', '.svelte-kit', '.nuxt',
  'target', '.gradle', 'vendor', '.parcel-cache', 'storybook-static',
  '.turbo', '.vercel', '.netlify',
]);

const RAW_LIMIT = 5_000;   // Array.from'dan önce — bellek patlamasını önler
const MAX_FILES = 300;     // Filtreden sonra

/**
 * FileList → App tree formatı
 * @throws {Error} limit aşılırsa
 */
export async function parseFolderFiles(fileList) {
  // Ham sayıyı kontrol et — Array.from bile yapmadan önce
  if (fileList.length > RAW_LIMIT) {
    throw new Error(
      `Too many files selected (${fileList.length.toLocaleString()}). Max: ${RAW_LIMIT.toLocaleString()}.\nPlease select a smaller subfolder.`
    );
  }

  const all = Array.from(fileList);

  // Kara listedeki klasörleri filtrele
  const filtered = all.filter((file) => {
    const parts = file.webkitRelativePath.split('/');
    return !parts.some((part) => BLACKLIST.has(part));
  });

  if (filtered.length === 0) {
    throw new Error('No displayable files found in the selected folder.');
  }

  if (filtered.length > MAX_FILES) {
    throw new Error(
      `Too many files after filtering (${filtered.length}). Max: ${MAX_FILES}.\nPlease select a smaller subfolder.`
    );
  }

  const tree = buildTree(filtered);
  const rootName = filtered[0].webkitRelativePath.split('/')[0];

  // Dep files okuma — kök dizinde package.json / requirements.txt ara
  const detectedDeps = [];
  const pkgFile = all.find(f => f.webkitRelativePath === `${rootName}/package.json`);
  const reqFile  = all.find(f => f.webkitRelativePath === `${rootName}/requirements.txt`);

  if (pkgFile) {
    try { detectedDeps.push(...parsePackageJson(await pkgFile.text())); } catch {}
  }
  if (reqFile) {
    try { detectedDeps.push(...parseRequirementsTxt(await reqFile.text())); } catch {}
  }

  return { tree, detectedDeps };
}

function buildTree(files) {
  let seq = 0;
  const uid = () => `lf-${++seq}`;
  const byPath = new Map();

  // İlk dosyanın yolundan kök klasör adını al
  const rootName = files[0].webkitRelativePath.split('/')[0] || 'project';

  const root = { id: 'root', type: 'folder', label: rootName, isNew: false, children: [] };
  byPath.set(rootName, root);

  for (const file of files) {
    const parts = file.webkitRelativePath.split('/');

    // Ara klasörleri oluştur (root hariç, son segment hariç)
    for (let i = 1; i < parts.length - 1; i++) {
      const path = parts.slice(0, i + 1).join('/');
      if (!byPath.has(path)) {
        const parentPath = parts.slice(0, i).join('/');
        const parent = byPath.get(parentPath);
        if (!parent) continue;
        const node = { id: uid(), type: 'folder', label: parts[i], isNew: false, children: [] };
        byPath.set(path, node);
        parent.children.push(node);
      }
    }

    // Dosya node'u ekle
    const fileName   = parts[parts.length - 1];
    const parentPath = parts.slice(0, -1).join('/');
    const parent     = byPath.get(parentPath);
    if (parent) {
      parent.children.push({ id: uid(), type: 'file', label: fileName, isNew: false });
    }
  }

  return root;
}
