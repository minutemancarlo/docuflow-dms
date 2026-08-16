import React, { useState, useMemo } from 'react';
import { Move, X, Folder, FolderPlus, Check, AlertCircle, Search } from 'lucide-react';
import { FileItem, Workspace } from '../../types';

interface MoveModalProps {
  file: FileItem | null;
  workspaceFiles: FileItem[];
  activeWorkspace: Workspace | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (file: FileItem, targetDir: string) => Promise<boolean>;
  onCreateSubfolder?: (parentDir: string, folderName: string) => Promise<string | null>;
}

export const MoveModal: React.FC<MoveModalProps> = ({
  file,
  workspaceFiles,
  activeWorkspace,
  isOpen,
  onClose,
  onConfirm,
  onCreateSubfolder,
}) => {
  const [selectedDir, setSelectedDir] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Collect all available directories in workspace
  const directories = useMemo(() => {
    if (!activeWorkspace) return [];
    const dirs: { name: string; path: string; relativePath: string }[] = [
      {
        name: `${activeWorkspace.name} (Root)`,
        path: activeWorkspace.path,
        relativePath: '/',
      },
    ];

    const recurse = (items: FileItem[]) => {
      for (const item of items) {
        if (item.isDirectory) {
          // Avoid moving a folder into itself
          if (!file || !item.path.startsWith(file.path)) {
            dirs.push({
              name: item.name,
              path: item.path,
              relativePath: item.relativePath,
            });
          }
          if (item.children) recurse(item.children);
        }
      }
    };

    recurse(workspaceFiles);
    return dirs;
  }, [workspaceFiles, activeWorkspace, file]);

  const filteredDirs = useMemo(() => {
    if (!searchQuery.trim()) return directories;
    const q = searchQuery.toLowerCase();
    return directories.filter(
      (d) => d.name.toLowerCase().includes(q) || d.relativePath.toLowerCase().includes(q)
    );
  }, [directories, searchQuery]);

  if (!isOpen || !file) return null;

  const currentDir = file.path.substring(0, Math.max(file.path.lastIndexOf('/'), file.path.lastIndexOf('\\')));

  const handleMove = async () => {
    const target = selectedDir || activeWorkspace?.path;
    if (!target) return;
    if (target.toLowerCase() === currentDir.toLowerCase()) {
      setError('Target folder is the same as current location.');
      return;
    }

    setSubmitting(true);
    const ok = await onConfirm(file, target);
    setSubmitting(false);
    if (ok) {
      onClose();
    }
  };

  const handleCreateSubfolder = async () => {
    if (!newFolderName.trim() || !onCreateSubfolder) return;
    const parent = selectedDir || activeWorkspace?.path || '';
    const createdPath = await onCreateSubfolder(parent, newFolderName.trim());
    if (createdPath) {
      setSelectedDir(createdPath);
      setIsCreatingFolder(false);
      setNewFolderName('');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 fluent-acrylic z-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white/95 dark:bg-[#2c2c2c]/95 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fluent-in text-xs transition-colors flex flex-col max-h-[85vh] fluent-acrylic cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Move size={15} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                Move {file.isDirectory ? 'Folder' : 'File'}
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-xs">
                {file.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Directory Search & List */}
        <div className="py-3 flex-1 flex flex-col min-h-0 space-y-3">
          <div className="relative shrink-0">
            <Search size={13.5} className="absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search destination folder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#202020] border border-black/[0.08] dark:border-white/[0.1] rounded-xl pl-9 pr-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#0078d4] dark:focus:border-[#60cdff]"
            />
          </div>

          <div className="flex-1 overflow-y-auto border border-black/[0.06] dark:border-white/[0.08] rounded-xl p-1.5 bg-neutral-50 dark:bg-[#202020] space-y-1">
            {filteredDirs.map((dir) => {
              const isSelected = (selectedDir || activeWorkspace?.path) === dir.path;
              const isCurrent = dir.path.toLowerCase() === currentDir.toLowerCase();

              return (
                <div
                  key={dir.path}
                  onClick={() => {
                    setSelectedDir(dir.path);
                    setError(null);
                  }}
                  className={`p-2 rounded-lg cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#0078d4]/10 dark:bg-[#60cdff]/15 text-[#0067c0] dark:text-[#60cdff] font-semibold border border-[#0078d4]/30'
                      : 'hover:bg-white dark:hover:bg-[#2c2c2c] text-neutral-700 dark:text-neutral-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Folder size={14} className={isSelected ? 'text-[#0078d4] dark:text-[#60cdff]' : 'text-neutral-400'} />
                    <span className="truncate">{dir.name}</span>
                  </div>
                  {isCurrent && (
                    <span className="text-[9.5px] bg-neutral-200 dark:bg-[#343434] text-neutral-500 px-1.5 py-0.2 rounded font-mono">
                      Current
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* New Subfolder creator inline */}
          {onCreateSubfolder && (
            <div className="shrink-0 pt-1">
              {isCreatingFolder ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    placeholder="New subfolder name..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="flex-1 bg-white dark:bg-[#202020] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1 text-xs text-neutral-900 dark:text-neutral-100"
                  />
                  <button
                    onClick={handleCreateSubfolder}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setIsCreatingFolder(false)}
                    className="px-2 py-1 text-neutral-500 hover:text-neutral-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreatingFolder(true)}
                  className="text-[#0078d4] dark:text-[#60cdff] text-xs flex items-center gap-1.5 hover:underline"
                >
                  <FolderPlus size={13} />
                  <span>+ Create new subfolder in selected directory</span>
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-lg border border-rose-200 dark:border-rose-800/40 text-[11px] mb-3">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleMove}
            disabled={submitting}
            className="px-4 py-1.5 bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <Check size={14} />
            <span>{submitting ? 'Moving...' : 'Move Here'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
