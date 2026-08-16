import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from './services/apiBridge';
import { DocumentCategory, DocumentStatus, FileItem, OfficeAppType, Workspace } from './types';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { FileTree } from './components/explorer/FileTree';
import { PreviewPanel } from './components/preview/PreviewPanel';
import { RenameModal } from './components/modals/RenameModal';
import { MoveModal } from './components/modals/MoveModal';
import { NewItemModal } from './components/modals/NewItemModal';
import { SearchPalette } from './components/modals/SearchPalette';
import { HelpModal } from './components/modals/HelpModal';
import { FileInspector } from './components/metadata/FileInspector';
import { ProjectsDashboard } from './components/dashboard/ProjectsDashboard';
import { ProjectFolderModal } from './components/modals/ProjectFolderModal';

export const App: React.FC = () => {
  // Theme State with LocalStorage Persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('docuflow_dark_mode');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('docuflow_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // View state (Dashboard Hub vs Explorer)
  const [activeView, setActiveView] = useState<'dashboard' | 'explorer'>('dashboard');

  // Workspaces & Files State
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isBinary, setIsBinary] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  // Filter States
  const [activeCategory, setActiveCategory] = useState<DocumentCategory>('all');
  const [selectedOfficeType, setSelectedOfficeType] = useState<OfficeAppType | 'all' | null>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | null>(null);

  // Modals & Drawers
  const [showSearchPalette, setShowSearchPalette] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [fileToRename, setFileToRename] = useState<FileItem | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [fileToMove, setFileToMove] = useState<FileItem | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newModalType, setNewModalType] = useState<'file' | 'folder'>('file');
  const [newModalDir, setNewModalDir] = useState<string>('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showInspector, setShowInspector] = useState(false);

  // Project Folder Configuration Modal
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [workspaceToEdit, setWorkspaceToEdit] = useState<Workspace | null>(null);

  // Load Workspaces on mount
  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const wsList = await api.getWorkspaces();
      setWorkspaces(wsList);
      if (wsList.length > 0 && !activeWorkspace) {
        setActiveWorkspace(wsList[0]);
      }
    } catch (e) {
      console.error('Failed to load workspaces:', e);
    }
  };

  // Load files when active workspace changes
  const loadFiles = useCallback(async () => {
    if (!activeWorkspace) return;
    try {
      const scanned = await api.scanDirectory(activeWorkspace.path);
      setFiles(scanned);

      const allTags = await api.getAllTags();
      setTags(allTags);

      // Auto-select first file if none selected
      if (!selectedFile && scanned.length > 0) {
        const findFirstFile = (items: FileItem[]): FileItem | null => {
          for (const it of items) {
            if (!it.isDirectory) return it;
            if (it.children) {
              const res = findFirstFile(it.children);
              if (res) return res;
            }
          }
          return null;
        };
        const first = findFirstFile(scanned);
        if (first) {
          handleSelectFile(first);
        }
      }
    } catch (e) {
      console.error('Failed to scan workspace:', e);
    }
  }, [activeWorkspace, selectedFile]);

  useEffect(() => {
    loadFiles();
  }, [activeWorkspace]);

  // Handle File Selection
  const handleSelectFile = async (file: FileItem) => {
    setSelectedFile(file);
    if (file.isDirectory) {
      setFileContent('');
      setIsBinary(false);
      return;
    }

    try {
      const res = await api.readFile(file.path);
      setFileContent(res.content);
      setIsBinary(res.isBinary);
    } catch (e) {
      console.error('Error reading file:', e);
      setFileContent('Error loading file contents.');
    }
  };

  // Save File Content
  const handleSaveContent = async (newContent: string): Promise<boolean> => {
    if (!selectedFile) return false;
    try {
      const res = await api.writeFile(selectedFile.path, newContent);
      if (res.success) {
        setFileContent(newContent);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to save file:', e);
      return false;
    }
  };

  // Open with External App (MS Word, Excel, PowerPoint, Project, Publisher, etc.)
  const handleOpenExternal = async (file: FileItem) => {
    try {
      const res = await api.openExternal(file.path);
      if (!res.success && res.error) {
        alert(`Error opening file: ${res.error}`);
      }
    } catch (e: any) {
      alert(`Error launching external application: ${e.message}`);
    }
  };

  // Reveal in Windows File Explorer
  const handleRevealInFolder = async (filePath: string) => {
    try {
      await api.revealInFolder(filePath);
    } catch (e: any) {
      alert(`Error revealing file: ${e.message}`);
    }
  };

  // Copy File / Folder Path
  const handleCopyPath = async (path: string) => {
    await api.copyToClipboard(path);
  };

  // Rename File / Folder
  const handleRenameConfirm = async (file: FileItem, newName: string): Promise<boolean> => {
    try {
      const res = await api.renameFile(file.path, newName);
      if (res.success && res.newPath) {
        await loadFiles();
        if (selectedFile?.path === file.path) {
          setSelectedFile({ ...selectedFile, name: newName, path: res.newPath });
        }
        return true;
      } else {
        alert(res.error || 'Failed to rename item.');
        return false;
      }
    } catch (e: any) {
      alert(`Rename error: ${e.message}`);
      return false;
    }
  };

  // Move File / Folder
  const handleMoveConfirm = async (file: FileItem, targetDir: string): Promise<boolean> => {
    try {
      const res = await api.moveFile(file.path, targetDir);
      if (res.success && res.newPath) {
        await loadFiles();
        if (selectedFile?.path === file.path) {
          setSelectedFile({ ...selectedFile, path: res.newPath });
        }
        return true;
      } else {
        alert(res.error || 'Failed to move item.');
        return false;
      }
    } catch (e: any) {
      alert(`Move error: ${e.message}`);
      return false;
    }
  };

  // Delete File / Folder
  const handleDeleteFile = async (file: FileItem) => {
    const isDir = file.isDirectory;
    const confirm = window.confirm(
      `Are you sure you want to permanently delete ${isDir ? 'folder' : 'file'} "${file.name}"?`
    );
    if (!confirm) return;

    try {
      const res = await api.deleteFile(file.path);
      if (res.success) {
        if (selectedFile?.path === file.path) {
          setSelectedFile(null);
          setFileContent('');
        }
        await loadFiles();
      }
    } catch (e: any) {
      alert(`Delete error: ${e.message}`);
    }
  };

  // Duplicate File
  const handleDuplicateFile = async (file: FileItem) => {
    try {
      const res = await api.duplicateFile(file.path);
      if (res.success) {
        await loadFiles();
      }
    } catch (e: any) {
      alert(`Duplicate error: ${e.message}`);
    }
  };

  // Create File / Folder
  const handleCreateFile = async (dirPath: string, fileName: string, content = ''): Promise<boolean> => {
    try {
      const res = await api.createFile(dirPath, fileName, content);
      if (res.success && res.newPath) {
        await loadFiles();
        return true;
      }
      alert(res.error || 'Failed to create file.');
      return false;
    } catch (e: any) {
      alert(`Create file error: ${e.message}`);
      return false;
    }
  };

  const handleCreateFolder = async (dirPath: string, folderName: string): Promise<boolean> => {
    try {
      const res = await api.createFolder(dirPath, folderName);
      if (res.success) {
        await loadFiles();
        return true;
      }
      alert(res.error || 'Failed to create folder.');
      return false;
    } catch (e: any) {
      alert(`Create folder error: ${e.message}`);
      return false;
    }
  };

  // Update Metadata & Tags
  const handleUpdateMetadata = async (file: FileItem, patch: any) => {
    try {
      await api.updateMetadata(file.path, patch);
      if (selectedFile?.path === file.path) {
        setSelectedFile({ ...selectedFile, ...patch });
      }
      await loadFiles();
    } catch (e) {
      console.error('Failed to update metadata:', e);
    }
  };

  // Save / Update Project Folder Workspace
  const handleSaveWorkspaceConfig = async (ws: Workspace) => {
    try {
      await api.saveWorkspace(ws);
      await loadWorkspaces();
      if (activeWorkspace?.id === ws.id) {
        setActiveWorkspace(ws);
      }
    } catch (e) {
      console.error('Error saving workspace:', e);
    }
  };

  // Delete / Remove Project Folder Workspace
  const handleDeleteWorkspace = async (ws: Workspace) => {
    const confirm = window.confirm(`Are you sure you want to remove project folder "${ws.name}" from your dashboard?`);
    if (!confirm) return;
    try {
      await api.removeWorkspace(ws.id);
      const updated = workspaces.filter((w) => w.id !== ws.id);
      setWorkspaces(updated);
      if (activeWorkspace?.id === ws.id) {
        setActiveWorkspace(updated.length > 0 ? updated[0] : null);
      }
    } catch (e) {
      console.error('Error removing workspace:', e);
    }
  };

  // Open Workspace in File Explorer View
  const handleOpenWorkspaceInExplorer = (ws: Workspace) => {
    setActiveWorkspace(ws);
    setActiveView('explorer');
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchPalette((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setNewModalType('file');
        setNewModalDir(activeWorkspace?.path || '');
        setShowNewModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWorkspace]);

  // Helper to identify specific Office app subtype
  const getOfficeApp = useCallback((item: FileItem): OfficeAppType | null => {
    if (item.officeType) return item.officeType;
    const ext = item.extension.toLowerCase();
    if (['.docx', '.doc', '.docm', '.dotx'].includes(ext)) return 'word';
    if (['.xlsx', '.xls', '.xlsm', '.xlsb', '.xltx', '.csv'].includes(ext)) return 'excel';
    if (['.pptx', '.ppt', '.pptm', '.potx'].includes(ext)) return 'powerpoint';
    if (['.pdf'].includes(ext)) return 'pdf';
    if (['.mpp', '.mpt', '.mpx'].includes(ext)) return 'project';
    if (['.pub'].includes(ext)) return 'publisher';
    if (['.vsdx', '.vsd'].includes(ext)) return 'visio';
    if (['.accdb', '.mdb'].includes(ext)) return 'access';
    if (['.one'].includes(ext)) return 'onenote';
    return null;
  }, []);

  // Filtered files according to category / tag / status
  const filteredFiles = useMemo(() => {
    // When viewing Pinned Favorites: return a flat list of ONLY files (no folder containers)
    if (activeCategory === 'pinned') {
      const pinnedList: FileItem[] = [];
      const extractPinned = (items: FileItem[]) => {
        for (const item of items) {
          if (!item.isDirectory && item.pinned) {
            let keep = true;
            if (selectedTag && (!item.tags || !item.tags.includes(selectedTag))) keep = false;
            if (selectedStatus && item.status !== selectedStatus) keep = false;
            if (keep) pinnedList.push(item);
          }
          if (item.children) extractPinned(item.children);
        }
      };
      extractPinned(files);
      return pinnedList;
    }

    const filterList = (items: FileItem[]): FileItem[] => {
      const result: FileItem[] = [];

      for (const item of items) {
        if (item.isDirectory) {
          const matchingChildren = item.children ? filterList(item.children) : [];
          if (matchingChildren.length > 0 || (activeCategory === 'all' && !selectedTag && !selectedStatus)) {
            result.push({ ...item, children: matchingChildren });
          }
        } else {
          let keep = true;
          const officeApp = getOfficeApp(item);

          // Category filter
          if (activeCategory === 'office') {
            if (!officeApp) {
              keep = false;
            } else if (selectedOfficeType && selectedOfficeType !== 'all') {
              if (officeApp !== selectedOfficeType) keep = false;
            }
          } else if (activeCategory === 'documents' && (item.category !== 'document' || officeApp !== null)) {
            keep = false;
          } else if (activeCategory === 'scripts' && item.category !== 'script') {
            keep = false;
          } else if (activeCategory === 'data' && item.category !== 'data') {
            keep = false;
          }

          // Tag filter
          if (selectedTag && (!item.tags || !item.tags.includes(selectedTag))) keep = false;

          // Status filter
          if (selectedStatus && item.status !== selectedStatus) keep = false;

          if (keep) result.push(item);
        }
      }
      return result;
    };

    return filterList(files);
  }, [files, activeCategory, selectedOfficeType, selectedTag, selectedStatus, getOfficeApp]);

  // Statistics
  const stats = useMemo(() => {
    let office = 0;
    let docs = 0;
    let scripts = 0;
    let data = 0;
    let pinned = 0;
    const officeCounts = {
      word: 0,
      excel: 0,
      powerpoint: 0,
      pdf: 0,
      project: 0,
      publisher: 0,
      visio: 0,
      access: 0,
    };

    const count = (items: FileItem[]) => {
      for (const it of items) {
        if (!it.isDirectory) {
          const officeApp = getOfficeApp(it);
          if (officeApp) {
            office++;
            if (officeApp === 'word') officeCounts.word++;
            else if (officeApp === 'excel') officeCounts.excel++;
            else if (officeApp === 'powerpoint') officeCounts.powerpoint++;
            else if (officeApp === 'pdf') officeCounts.pdf++;
            else if (officeApp === 'project') officeCounts.project++;
            else if (officeApp === 'publisher') officeCounts.publisher++;
            else if (officeApp === 'visio') officeCounts.visio++;
            else if (officeApp === 'access') officeCounts.access++;
          } else if (it.category === 'document') {
            docs++;
          } else if (it.category === 'script') {
            scripts++;
          } else if (it.category === 'data') {
            data++;
          }

          if (it.pinned) pinned++;
        }
        if (it.children) count(it.children);
      }
    };
    count(files);
    return {
      totalOffice: office,
      totalDocs: docs,
      totalScripts: scripts,
      totalData: data,
      pinnedCount: pinned,
      officeCounts,
    };
  }, [files, getOfficeApp]);

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${darkMode ? 'dark' : ''} bg-[#f3f3f3] dark:bg-[#202020] text-neutral-900 dark:text-neutral-100 transition-colors`}>
      {/* Top Header */}
      <Header
        activeWorkspace={activeWorkspace}
        workspaces={workspaces}
        onSelectWorkspace={setActiveWorkspace}
        onAddWorkspace={() => {
          setWorkspaceToEdit(null);
          setShowProjectModal(true);
        }}
        onOpenSearch={() => setShowSearchPalette(true)}
        onNewFile={() => {
          setNewModalType('file');
          setNewModalDir(activeWorkspace?.path || '');
          setShowNewModal(true);
        }}
        onNewFolder={() => {
          setNewModalType('folder');
          setNewModalDir(activeWorkspace?.path || '');
          setShowNewModal(true);
        }}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenHelp={() => setShowHelpModal(true)}
        activeView={activeView}
        onToggleView={setActiveView}
      />

      {/* Main View: Projects Hub Dashboard vs File Explorer */}
      {activeView === 'dashboard' ? (
        <ProjectsDashboard
          workspaces={workspaces}
          activeWorkspace={activeWorkspace}
          onSelectWorkspace={setActiveWorkspace}
          onOpenWorkspaceInExplorer={handleOpenWorkspaceInExplorer}
          onAddNewWorkspace={() => {
            setWorkspaceToEdit(null);
            setShowProjectModal(true);
          }}
          onEditWorkspace={(ws) => {
            setWorkspaceToEdit(ws);
            setShowProjectModal(true);
          }}
          onDeleteWorkspace={handleDeleteWorkspace}
          onRevealInFolder={handleRevealInFolder}
          onCopyPath={handleCopyPath}
        />
      ) : (
        /* Explorer Three-Panel Workspace View */
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Sidebar */}
          <Sidebar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            selectedOfficeType={selectedOfficeType}
            onSelectOfficeType={setSelectedOfficeType}
            onOpenDashboard={() => setActiveView('dashboard')}
            onOpenSearch={() => setShowSearchPalette(true)}
            activeView={activeView}
            totalProjectsCount={workspaces.length}
            tags={tags}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            stats={stats}
          />

          {/* Middle File Tree Explorer */}
          <div className="w-72 border-r border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-[#242424]/70 flex flex-col shrink-0 transition-colors fluent-acrylic">
            <div className="h-10 px-3.5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-semibold select-none shrink-0 bg-black/[0.02] dark:bg-white/[0.02]">
              <span className="truncate">{activeWorkspace?.name || 'Explorer'}</span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono font-normal">
                {files.length} items
              </span>
            </div>

            <FileTree
              files={filteredFiles}
              selectedFile={selectedFile}
              onSelectFile={handleSelectFile}
              onOpenExternal={handleOpenExternal}
              onRevealInFolder={(f) => handleRevealInFolder(f.path)}
              onRename={(f) => {
                setFileToRename(f);
                setShowRenameModal(true);
              }}
              onMove={(f) => {
                setFileToMove(f);
                setShowMoveModal(true);
              }}
              onDelete={handleDeleteFile}
              onDuplicate={handleDuplicateFile}
              onCopyPath={(f) => handleCopyPath(f.path)}
              onNewFileInDir={(dir) => {
                setNewModalType('file');
                setNewModalDir(dir);
                setShowNewModal(true);
              }}
              onNewFolderInDir={(dir) => {
                setNewModalType('folder');
                setNewModalDir(dir);
                setShowNewModal(true);
              }}
            />
          </div>

          {/* Central Document & Script Preview/Editor Panel */}
          <div className="flex-1 flex overflow-hidden">
            <PreviewPanel
              file={selectedFile}
              fileContent={fileContent}
              isBinary={isBinary}
              onSaveContent={handleSaveContent}
              onOpenExternal={handleOpenExternal}
              onRevealInFolder={(f) => handleRevealInFolder(f.path)}
              onRename={(f) => {
                setFileToRename(f);
                setShowRenameModal(true);
              }}
              onMove={(f) => {
                setFileToMove(f);
                setShowMoveModal(true);
              }}
              onCopyPath={(f) => handleCopyPath(f.path)}
              onTogglePin={(f) => handleUpdateMetadata(f, { pinned: !f.pinned })}
              onUpdateStatus={(f, st) => handleUpdateMetadata(f, { status: st })}
              onSelectFile={handleSelectFile}
              onNewFileInDir={(dir) => {
                setNewModalType('file');
                setNewModalDir(dir);
                setShowNewModal(true);
              }}
              onNewFolderInDir={(dir) => {
                setNewModalType('folder');
                setNewModalDir(dir);
                setShowNewModal(true);
              }}
              showInspector={showInspector}
              onToggleInspector={() => setShowInspector(!showInspector)}
              darkMode={darkMode}
            />
          </div>

          {/* Right Metadata Inspector Drawer */}
          <FileInspector
            file={selectedFile}
            isOpen={showInspector}
            onClose={() => setShowInspector(false)}
            onUpdateMetadata={handleUpdateMetadata}
            onOpenExternal={handleOpenExternal}
            onRevealInFolder={(f) => handleRevealInFolder(f.path)}
            availableTags={tags}
          />
        </div>
      )}

      {/* Project Folder Configuration Modal */}
      <ProjectFolderModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        workspaceToEdit={workspaceToEdit}
        onSaveWorkspace={handleSaveWorkspaceConfig}
      />

      {/* Rename Modal */}
      <RenameModal
        file={fileToRename}
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        onConfirm={handleRenameConfirm}
      />

      {/* Move Modal */}
      <MoveModal
        file={fileToMove}
        workspaceFiles={files}
        activeWorkspace={activeWorkspace}
        isOpen={showMoveModal}
        onClose={() => setShowMoveModal(false)}
        onConfirm={handleMoveConfirm}
        onCreateSubfolder={async (parent, name) => {
          const res = await api.createFolder(parent, name);
          if (res.success && res.newPath) {
            await loadFiles();
            return res.newPath;
          }
          return null;
        }}
      />

      {/* New File / Folder Modal */}
      <NewItemModal
        type={newModalType}
        targetDir={newModalDir || activeWorkspace?.path || ''}
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onCreateFile={handleCreateFile}
        onCreateFolder={handleCreateFolder}
      />

      {/* Universal Search & Command Palette */}
      <SearchPalette
        isOpen={showSearchPalette}
        onClose={() => setShowSearchPalette(false)}
        allFiles={files}
        onSelectFile={handleSelectFile}
        onOpenExternal={handleOpenExternal}
        onRevealInFolder={(f) => handleRevealInFolder(f.path)}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
};

export default App;
