import React from 'react';
import {
  Folder,
  FolderOpen,
  FolderSymlink,
  Copy,
  Check,
  FilePlus,
  FolderPlus,
  HardDrive,
  Calendar,
  Layers,
  FileText,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { FileItem } from '../../types';
import { formatBytes, formatDate } from '../../utils/formatters';
import { FileIcon } from '../../utils/fileIcons';

interface FolderDetailsViewerProps {
  folder: FileItem;
  onSelectChild?: (child: FileItem) => void;
  onRevealInFolder: (file: FileItem) => void;
  onCopyPath: (file: FileItem) => void;
  onNewFileInDir?: (dirPath: string) => void;
  onNewFolderInDir?: (dirPath: string) => void;
}

export const FolderDetailsViewer: React.FC<FolderDetailsViewerProps> = ({
  folder,
  onSelectChild,
  onRevealInFolder,
  onCopyPath,
  onNewFileInDir,
  onNewFolderInDir,
}) => {
  const [copied, setCopied] = React.useState(false);

  const children = folder.children || [];
  const filesCount = children.filter((c) => !c.isDirectory).length;
  const subfoldersCount = children.filter((c) => c.isDirectory).length;

  // Calculate total folder size recursively
  const calculateTotalSize = (items: FileItem[]): number => {
    let sum = 0;
    for (const item of items) {
      if (item.isDirectory && item.children) {
        sum += calculateTotalSize(item.children);
      } else {
        sum += item.size || 0;
      }
    }
    return sum;
  };
  const totalFolderSize = calculateTotalSize(children);

  const handleCopy = () => {
    onCopyPath(folder);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full w-full p-6 sm:p-8 bg-[#f3f3f3] dark:bg-[#202020] overflow-y-auto transition-colors flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white dark:bg-[#2c2c2c] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-2xl transition-all space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="w-20 h-20 rounded-2xl bg-[#0078d4]/10 dark:bg-[#60cdff]/15 border border-[#0078d4]/20 flex items-center justify-center shrink-0 shadow-inner p-3 text-[#0078d4] dark:text-[#60cdff]">
            <FolderOpen size={48} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-[#0078d4]/10 text-[#0067c0] dark:text-[#60cdff] border-[#0078d4]/20">
                Directory / Workspace Folder
              </span>
              <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 font-mono">
                {children.length} {children.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 truncate" title={folder.name}>
              {folder.name}
            </h2>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 font-mono">
                <HardDrive size={12} /> {formatBytes(totalFolderSize)} total
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} /> Modified {formatDate(folder.mtime)}
              </span>
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onRevealInFolder(folder)}
            className="h-10 bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98"
          >
            <FolderSymlink size={15} />
            <span>Open in File Explorer</span>
          </button>

          {onNewFileInDir && (
            <button
              onClick={() => onNewFileInDir(folder.path)}
              className="h-10 bg-neutral-100 dark:bg-[#343434] hover:bg-neutral-200 dark:hover:bg-[#3a3a3a] text-neutral-800 dark:text-neutral-200 text-xs font-medium rounded-xl border border-black/[0.06] dark:border-white/[0.07] flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <FilePlus size={14} className="text-[#0078d4] dark:text-[#60cdff]" />
              <span>+ New File Here</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="h-10 bg-neutral-100 dark:bg-[#343434] hover:bg-neutral-200 dark:hover:bg-[#3a3a3a] text-neutral-800 dark:text-neutral-200 text-xs font-medium rounded-xl border border-black/[0.06] dark:border-white/[0.07] flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Path Copied!' : 'Copy Folder Path'}</span>
          </button>
        </div>

        {/* Folder Stats & Path Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-50 dark:bg-[#242424] rounded-xl p-4 border border-black/[0.05] dark:border-white/[0.06] text-xs">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Subfolders</span>
            <div className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mt-1">
              {subfoldersCount} <span className="text-xs font-normal text-neutral-500">directories</span>
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-[#242424] rounded-xl p-4 border border-black/[0.05] dark:border-white/[0.06] text-xs">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Contained Files</span>
            <div className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mt-1">
              {filesCount} <span className="text-xs font-normal text-neutral-500">documents & scripts</span>
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-[#242424] rounded-xl p-4 border border-black/[0.05] dark:border-white/[0.06] text-xs">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Total Volume</span>
            <div className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mt-1 font-mono">
              {formatBytes(totalFolderSize)}
            </div>
          </div>
        </div>

        {/* Physical Location Details */}
        <div className="bg-neutral-50 dark:bg-[#242424] rounded-xl p-4 border border-black/[0.05] dark:border-white/[0.06] space-y-2 text-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Physical Directory Location</span>
          <div className="font-mono text-neutral-800 dark:text-neutral-300 break-all select-all text-[11px] bg-white dark:bg-[#2c2c2c] p-2.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] shadow-sm">
            {folder.path}
          </div>
        </div>

        {/* Directory Contents List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              Contents ({children.length})
            </span>
            {onNewFolderInDir && (
              <button
                onClick={() => onNewFolderInDir(folder.path)}
                className="text-[11px] text-[#0078d4] dark:text-[#60cdff] hover:underline flex items-center gap-1"
              >
                <FolderPlus size={12} />
                <span>+ New Subfolder</span>
              </button>
            )}
          </div>

          {children.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-black/[0.1] dark:border-white/[0.1] rounded-xl text-neutral-400 text-xs">
              This folder is currently empty. Use the buttons above to create new documents or subfolders.
            </div>
          ) : (
            <div className="border border-black/[0.06] dark:border-white/[0.08] rounded-xl overflow-hidden divide-y divide-black/[0.04] dark:divide-white/[0.05] bg-white dark:bg-[#2c2c2c]">
              {children.map((item) => (
                <div
                  key={item.path}
                  onClick={() => onSelectChild?.(item)}
                  className="flex items-center justify-between p-3 hover:bg-neutral-50 dark:hover:bg-[#343434] cursor-pointer transition-colors text-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileIcon name={item.name} isDirectory={item.isDirectory} size={18} />
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-[#0078d4] dark:group-hover:text-[#60cdff] truncate block">
                        {item.name}
                      </span>
                      <span className="text-[10.5px] text-neutral-400 font-mono">
                        {item.isDirectory ? 'Folder' : formatBytes(item.size)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-neutral-400">
                    <span className="text-[10.5px] font-mono hidden sm:inline">
                      {formatDate(item.mtime)}
                    </span>
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
