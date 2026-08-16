import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  MoreVertical,
  ExternalLink,
  FolderSymlink,
  Edit2,
  Move,
  Copy,
  Trash2,
  Star,
  FilePlus,
  FolderPlus,
  Search,
  X,
} from 'lucide-react';
import { FileItem } from '../../types';
import { FileIcon } from '../../utils/fileIcons';

interface FileTreeProps {
  files: FileItem[];
  selectedFile: FileItem | null;
  onSelectFile: (file: FileItem) => void;
  onOpenExternal: (file: FileItem) => void;
  onRevealInFolder: (file: FileItem) => void;
  onRename: (file: FileItem) => void;
  onMove: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  onDuplicate: (file: FileItem) => void;
  onCopyPath: (file: FileItem) => void;
  onNewFileInDir?: (dirPath: string) => void;
  onNewFolderInDir?: (dirPath: string) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  selectedFile,
  onSelectFile,
  onOpenExternal,
  onRevealInFolder,
  onRename,
  onMove,
  onDelete,
  onDuplicate,
  onCopyPath,
  onNewFileInDir,
  onNewFolderInDir,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filterQuery, setFilterQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    file: FileItem;
  } | null>(null);

  // Auto-expand all top-level folders by default
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    files.forEach((f) => {
      if (f.isDirectory) initial[f.path] = true;
    });
    setExpanded((prev) => ({ ...initial, ...prev }));
  }, [files]);

  // Close context menu on outside click
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const toggleExpand = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleContextMenu = (e: React.MouseEvent, file: FileItem) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 220),
      y: Math.min(e.clientY, window.innerHeight - 300),
      file,
    });
  };

  // Filter tree items if in-line search is active
  const filteredFiles = useMemo(() => {
    if (!filterQuery.trim()) return files;
    const q = filterQuery.toLowerCase();

    const recurse = (items: FileItem[]): FileItem[] => {
      const result: FileItem[] = [];
      for (const item of items) {
        if (item.isDirectory) {
          const matchingChildren = item.children ? recurse(item.children) : [];
          if (item.name.toLowerCase().includes(q) || matchingChildren.length > 0) {
            result.push({
              ...item,
              children: matchingChildren.length > 0 ? matchingChildren : item.children,
            });
          }
        } else {
          if (
            item.name.toLowerCase().includes(q) ||
            item.relativePath.toLowerCase().includes(q) ||
            item.tags?.some((t) => t.toLowerCase().includes(q)) ||
            item.description?.toLowerCase().includes(q)
          ) {
            result.push(item);
          }
        }
      }
      return result;
    };

    return recurse(files);
  }, [files, filterQuery]);

  const renderTree = (items: FileItem[], depth = 0) => {
    return items.map((item) => {
      const isSelected = selectedFile?.path === item.path;
      const isDir = item.isDirectory;
      const isOpen = filterQuery.trim() ? true : expanded[item.path] || false;

      return (
        <div key={item.path} className="select-none">
          <div
            onClick={() => {
              if (isDir) {
                setExpanded((prev) => ({ ...prev, [item.path]: !prev[item.path] }));
              }
              onSelectFile(item);
            }}
            onContextMenu={(e) => handleContextMenu(e, item)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (isDir) {
                setExpanded((prev) => ({ ...prev, [item.path]: !prev[item.path] }));
              } else {
                onOpenExternal(item);
              }
            }}
            style={{ paddingLeft: `${depth * 13 + 8}px` }}
            className={`group relative flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer text-xs transition-all ${
              isSelected
                ? 'bg-[#0078d4]/10 dark:bg-[#60cdff]/15 text-[#0067c0] dark:text-[#60cdff] font-semibold border-l-2 border-[#0078d4] dark:border-[#60cdff]'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <div className="flex items-center gap-2 truncate min-w-0 pr-2">
              {isDir ? (
                <span
                  onClick={(e) => toggleExpand(e, item.path)}
                  className="p-0.5 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] rounded text-neutral-400"
                >
                  {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </span>
              ) : (
                <span className="w-3" />
              )}

              <FileIcon name={item.name} isDirectory={isDir} isOpen={isOpen} size={15} />

              <span className="truncate text-[11.5px]">{item.name}</span>

              {item.pinned && <Star size={11} className="text-yellow-400 fill-yellow-400 shrink-0" />}
            </div>

            {/* Quick Hover Actions */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {!isDir && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenExternal(item);
                  }}
                  className="p-1 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] rounded text-neutral-400 hover:text-[#0078d4] dark:hover:text-[#60cdff]"
                  title="Open in System Default Application"
                >
                  <ExternalLink size={12} />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRevealInFolder(item);
                }}
                className="p-1 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] rounded text-neutral-400 hover:text-emerald-500"
                title="Reveal in File Explorer"
              >
                <FolderSymlink size={12} />
              </button>

              <button
                onClick={(e) => handleContextMenu(e, item)}
                className="p-1 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                title="More Actions"
              >
                <MoreVertical size={12} />
              </button>
            </div>
          </div>

          {/* Child Items */}
          {isDir && isOpen && item.children && item.children.length > 0 && (
            <div className="border-l border-black/[0.05] dark:border-white/[0.06] ml-3.5 my-0.5">
              {renderTree(item.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Quick In-Line Search / Filter Input */}
      <div className="px-2.5 py-1.5 border-b border-black/[0.05] dark:border-white/[0.06] shrink-0 bg-neutral-50/60 dark:bg-[#202020]/60">
        <div className="relative flex items-center">
          <Search size={12} className="absolute left-2.5 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="Quick filter files..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#2c2c2c] border border-black/[0.06] dark:border-white/[0.08] rounded-lg pl-7 pr-6 py-1 text-[11px] text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-[#0078d4] dark:focus:border-[#60cdff] shadow-xs transition-colors"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="absolute right-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-0.5"
            >
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto p-2">
        {files.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-neutral-400 text-xs">
            <p>No documents found in this workspace view.</p>
            <p className="mt-1 text-[11px] text-neutral-500">Click "+ New File" or import a folder.</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-neutral-400 text-xs">
            <p>No matching files for "{filterQuery}".</p>
            <button
              onClick={() => setFilterQuery('')}
              className="mt-2 text-[11px] text-[#0078d4] dark:text-[#60cdff] hover:underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">{renderTree(filteredFiles)}</div>
        )}
      </div>

      {/* Fluent Acrylic Context Menu */}
      {contextMenu && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-50 w-52 bg-white/95 dark:bg-[#2c2c2c]/95 border border-black/[0.08] dark:border-white/[0.1] rounded-xl shadow-2xl py-1 text-xs text-neutral-700 dark:text-neutral-200 fluent-acrylic animate-fluent-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 text-[10px] text-neutral-400 border-b border-black/[0.06] dark:border-white/[0.08] truncate font-medium">
            {contextMenu.file.name}
          </div>

          {!contextMenu.file.isDirectory && (
            <button
              onClick={() => {
                onOpenExternal(contextMenu.file);
                setContextMenu(null);
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center gap-2 text-[#0067c0] dark:text-[#60cdff] font-medium"
            >
              <ExternalLink size={13} />
              <span>Open in Default App</span>
            </button>
          )}

          <button
            onClick={() => {
              onRevealInFolder(contextMenu.file);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center gap-2"
          >
            <FolderSymlink size={13} />
            <span>Reveal in File Explorer</span>
          </button>

          <button
            onClick={() => {
              onCopyPath(contextMenu.file);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center gap-2"
          >
            <Copy size={13} />
            <span>Copy Full Path</span>
          </button>

          <div className="border-t border-black/[0.06] dark:border-white/[0.08] my-1"></div>

          {contextMenu.file.isDirectory && (
            <>
              <button
                onClick={() => {
                  onNewFileInDir?.(contextMenu.file.path);
                  setContextMenu(null);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center gap-2"
              >
                <FilePlus size={13} className="text-[#0078d4] dark:text-[#60cdff]" />
                <span>New File Here</span>
              </button>

              <button
                onClick={() => {
                  onNewFolderInDir?.(contextMenu.file.path);
                  setContextMenu(null);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center gap-2"
              >
                <FolderPlus size={13} className="text-emerald-500" />
                <span>New Folder Here</span>
              </button>

              <div className="border-t border-black/[0.06] dark:border-white/[0.08] my-1"></div>
            </>
          )}

          <button
            onClick={() => {
              onRename(contextMenu.file);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center gap-2"
          >
            <Edit2 size={13} />
            <span>Rename...</span>
          </button>

          <button
            onClick={() => {
              onMove(contextMenu.file);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center gap-2"
          >
            <Move size={13} />
            <span>Move to Folder...</span>
          </button>

          {!contextMenu.file.isDirectory && (
            <button
              onClick={() => {
                onDuplicate(contextMenu.file);
                setContextMenu(null);
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center gap-2"
            >
              <Copy size={13} />
              <span>Duplicate</span>
            </button>
          )}

          <div className="border-t border-black/[0.06] dark:border-white/[0.08] my-1"></div>

          <button
            onClick={() => {
              onDelete(contextMenu.file);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 flex items-center gap-2"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};
