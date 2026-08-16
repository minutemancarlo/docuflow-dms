# DocuFlow DMS - Standalone Desktop Document & File Management Hub

DocuFlow DMS is a standalone, offline-first Desktop Document Management application engineered for power users and professionals to organize, search, rename, move, edit, and launch work documents, scripts, and data files from a clean, high-performance central hub.

---

## Key Features

### 1. Light and Dark Mode Support
- **Dynamic Theme Switcher**: Toggle effortlessly between polished **Light Mode** and **Dark Mode** directly from the header toolbar.
- **Theme Persistence**: Remembers your preferred mode across sessions and defaults to your operating system's color scheme.
- **Monaco Editor Theme Sync**: Code and script editor dynamically switches between `vs-dark` and `light` themes in real time.

### 2. File Organization & Management
- **Universal Search (`Ctrl + K`)**: Instant fuzzy search across filenames, tags, and document contents with category filters.
- **In-App Rename**: Rename documents and folders with real-time Windows filename validation.
- **Interactive Move Tool**: Easily move files across directories using a searchable folder directory tree and on-the-fly subfolder creation.
- **File Creation with Templates**: Built-in templates for PowerShell scripts, Python tools, SQL migrations, Markdown SOP guides, CSV data sheets, and JSON configurations.
- **Folder & File Actions**: Duplicate, delete/recycle, and copy full/relative paths with one click.

### 3. Native OS Integration
- **Open in Default Desktop App**: One-click action or double-click to launch Word documents (`.docx`) in **Microsoft Word**, spreadsheets (`.xlsx`) in **Microsoft Excel**, PDFs in Acrobat, and scripts in your default editor.
- **Reveal in File Explorer**: Instantly open the containing folder path in Windows File Explorer with the item selected.
- **Copy Path Tools**: Copy System Path, Folder Path, or Relative Path directly to your clipboard.

### 4. Rich Multi-Format Previews & Editors
- **Monaco Code Editor**: Syntax highlighting for PowerShell, Python, SQL, TypeScript, Bash, JSON, YAML, and XML with `Ctrl + S` in-app saving.
- **Interactive Markdown Viewer**: Rendered HTML view with Table of Contents outline, checklist support, and source editor toggle.
- **Interactive Data Grid**: Sortable, searchable tabular grid for CSV, TSV, and JSON datasets with CSV export.
- **Office Document Hub**: Visual cards for Word, Excel, and PDF files with launch shortcuts and metadata summaries.

### 5. Non-Destructive Metadata & Tagging Layer
- Stored locally without modifying your original files.
- Attach custom tags (e.g. `#prod`, `#monitoring`, `#sop`), lifecycle flags (*Draft*, *In-Review*, *Approved*, *Deprecated*), and side-car sticky notes to any document.

---

## How to Run

### Option 1: Quick Launcher (Windows)
Double-click `start_docuflow.bat` inside the project folder:
```
C:\Users\Anubis\.gemini\antigravity\scratch\docuflow-dms\start_docuflow.bat
```

### Option 2: Command Line
```powershell
cd C:\Users\Anubis\.gemini\antigravity\scratch\docuflow-dms
npx electron .
```

### Option 3: Development Mode with Hot Reloading
```powershell
npm run electron:dev
```

---

## Keyboard Shortcuts
- `Ctrl + K`: Open Universal Search & Command Palette
- `Ctrl + S`: Save active document or script in the editor
- `Ctrl + N`: Create new file or script
- `Double Click`: Open file in its default registered application (MS Word, Excel, etc.)
- `Right Click`: Open context menu (Rename, Move, Duplicate, Delete, Reveal in Explorer)
- `Esc`: Close active modal or search palette
