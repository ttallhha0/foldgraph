# FoldGraph

**Visit: [https://ttallhha0.github.io/foldgraph/](https://ttallhha0.github.io/foldgraph/)**
A visual file/folder structure designer that generates terminal scripts — runs entirely in the browser, no server required.

## What it does

Draw your project structure as a node graph, then copy the shell commands to create it on your machine.

- **Design** — right-click any folder node to add subfolders or files
- **Import** — load an existing project from your local machine or a GitHub repo URL
- **Export** — copy a ready-to-run Bash or PowerShell script

## Features

### Graph Editor
- Right-click a folder → **Add Folder** / **Add File** / **Rename** / **Delete**
- Double-click any node to rename it inline
- File nodes automatically show the icon for their extension (`.py`, `.ts`, `.go`, etc.)
- Collapse large folders by clicking the **▼** toggle on a folder node
- **⌘Z** (Mac) or **Ctrl+Z** (Windows/Linux) undoes the last action — works for adding, deleting, renaming, loading templates, and importing repos

### Import
- **Open Folder** — select a local directory; `node_modules`, `.git`, `dist` and similar folders are filtered out automatically
- **Import from GitHub** — paste a repo URL and the full tree is fetched via the GitHub API (optional personal token for rate limits)
- `package.json` and `requirements.txt` are read automatically on import to populate the dependency list
- Large repos (80+ nodes) are auto-collapsed for readability

### Presets
18 ready-made project templates: React + Vite, Next.js, Vue 3, Angular, SvelteKit, Express MVC, MERN, Go + Gin, Spring Boot, Laravel, Django, FastAPI, Flask, Flutter, React Native, Electron, T3 Stack, HTML/CSS/JS.

### Script Generation

| Mode | Output |
|------|--------|
| **Full Script** | `mkdir -p` / `touch` for the entire structure |
| **Apply Changes** | Diff only — `rm`, `mv`, new `mkdir`/`touch`, install/uninstall |

The script starts with `cd ..` so it runs from your current directory, then ends with `cd <project-name>` to enter the new folder.

### Dependency Manager
- Search npm packages with autocomplete (300ms debounce)
- Common pip packages detected automatically by name
- Install commands are appended to the script (`pip3 install … || pip install …` fallback for Python)

## Running locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Stack

[React 19](https://react.dev/) · [Vite](https://vitejs.dev/) · [@xyflow/react](https://reactflow.dev/) · [Dagre](https://github.com/dagrejs/dagre) · [Tailwind CSS v4](https://tailwindcss.com/)
