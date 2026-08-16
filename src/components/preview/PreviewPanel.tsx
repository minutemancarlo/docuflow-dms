import React from 'react';
import {
  ExternalLink,
  FolderSymlink,
  Edit2,
  Move,
  Star,
  Copy,
  Check,
  PanelRight,
  Layers,
  Folder,
} from 'lucide-react';
import { FileItem, DocumentStatus } from '../../types';
import { MonacoEditorViewer } from './MonacoEditorViewer';
import { MarkdownViewer } from './MarkdownViewer';
import { TableViewer } from './TableViewer';
import { OfficeCardViewer } from './OfficeCardViewer';
import { FolderDetailsViewer } from './FolderDetailsViewer';
import { ImageViewer } from './ImageViewer';
import { MediaVideoViewer } from './MediaVideoViewer';
import { PdfViewer } from './PdfViewer';

interface PreviewPanelProps {
  file: FileItem | null;
  fileContent: string;
  isBinary: boolean;
  onSaveContent: (newContent: string) => Promise<boolean>;
  onOpenExternal: (file: FileItem) => void;
  onRevealInFolder: (file: FileItem) => void;
  onRename: (file: FileItem) => void;
  onMove: (file: FileItem) => void;
  onCopyPath: (file: FileItem) => void;
  onTogglePin?: (file: FileItem) => void;
  onUpdateStatus?: (file: FileItem, status: DocumentStatus) => void;
  onSelectFile?: (file: FileItem) => void;
  onNewFileInDir?: (dirPath: string) => void;
  onNewFolderInDir?: (dirPath: string) => void;
  showInspector: boolean;
  onToggleInspector: () => void;
  darkMode?: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  file,
  fileContent,
  isBinary,
  onSaveContent,
  onOpenExternal,
  onRevealInFolder,
  onRename,
  onMove,
  onCopyPath,
  onTogglePin,
  onUpdateStatus,
  onSelectFile,
  onNewFileInDir,
  onNewFolderInDir,
  showInspector,
  onToggleInspector,
  darkMode = true,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!file) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 select-none bg-[#f3f3f3] dark:bg-[#202020] p-6 transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#2c2c2c] border border-black/[0.07] dark:border-white/[0.08] flex items-center justify-center mb-3 text-neutral-400 dark:text-neutral-500 shadow-sm">
          <Layers size={28} />
        </div>
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">No Item Selected</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-xs text-center">
          Select a document, script, or folder from the explorer to view its contents, properties, and launch in default apps.
        </p>
      </div>
    );
  }

  const isDir = file.isDirectory;
  const ext = file.extension.toLowerCase();

  const isPdf = ext === '.pdf';
  const isImage = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.svg', '.ico', '.tiff', '.tif', '.psd', '.ai', '.eps'].includes(ext);
  const isMedia = ['.mp4', '.webm', '.mkv', '.mov', '.avi', '.wmv', '.flv', '.m4v', '.3gp', '.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac', '.wma', '.mid'].includes(ext);
  const isMarkdown = ext === '.md' || ext === '.markdown';
  const isTable = ext === '.csv' || ext === '.tsv' || (ext === '.json' && fileContent.trim().startsWith('['));
  const isOfficeDoc = isBinary || ['.docx', '.doc', '.docm', '.dotx', '.xlsx', '.xls', '.xlsm', '.xlsb', '.pptx', '.ppt', '.pptm', '.mpp', '.mpt', '.mpx', '.pub', '.vsdx', '.vsd', '.accdb', '.mdb', '.one', '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.iso', '.exe', '.msi', '.dll', '.sys', '.bin'].includes(ext);

  const handleCopyPath = () => {
    onCopyPath(file);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-[#202020] overflow-hidden transition-colors flex-1">
      {/* Fluent Breadcrumb & Action Bar */}
      <div className="h-11 border-b border-black/[0.06] dark:border-white/[0.08] bg-[#f3f3f3]/90 dark:bg-[#262626]/90 fluent-acrylic px-3.5 flex items-center justify-between text-xs shrink-0 select-none transition-colors">
        {/* Left: Star, Breadcrumb & Status */}
        <div className="flex items-center gap-2.5 truncate min-w-0 mr-4">
          {!isDir && (
            <button
              onClick={() => onTogglePin?.(file)}
              className="text-neutral-400 hover:text-yellow-500 transition-colors p-1"
              title={file.pinned ? 'Unpin File' : 'Pin File to Favorites'}
            >
              <Star
                size={14}
                className={file.pinned ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-400'}
              />
            </button>
          )}

          <div className="flex items-center gap-1 font-mono text-[11.5px] text-neutral-800 dark:text-neutral-200 truncate">
            {isDir ? <Folder size={13} className="text-[#0078d4] dark:text-[#60cdff] shrink-0" /> : null}
            <span className="text-neutral-600 dark:text-neutral-300 font-semibold truncate max-w-[450px]">
              {file.relativePath || file.name}
            </span>
          </div>

          {!isDir && (
            <button
              onClick={() => {
                const order: DocumentStatus[] = ['draft', 'review', 'approved', 'deprecated'];
                const curIdx = order.indexOf(file.status || 'draft');
                const next = order[(curIdx + 1) % order.length];
                onUpdateStatus?.(file, next);
              }}
              className={`text-[9.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all ${
                file.status === 'approved'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : file.status === 'review'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  : file.status === 'deprecated'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20'
              }`}
              title="Click to change document status"
            >
              {file.status || 'Draft'}
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {!isDir && (
            <button
              onClick={() => onOpenExternal(file)}
              className="px-2.5 py-1 bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 font-medium text-[11px] rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
              title="Open in System Default Application"
            >
              <ExternalLink size={12} />
              <span>Open in App</span>
            </button>
          )}

          <button
            onClick={() => onRevealInFolder(file)}
            className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] rounded-lg transition-colors"
            title="Reveal in File Explorer"
          >
            <FolderSymlink size={14} />
          </button>

          <button
            onClick={handleCopyPath}
            className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] rounded-lg transition-colors"
            title="Copy Path"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>

          <button
            onClick={() => onRename(file)}
            className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] rounded-lg transition-colors"
            title="Rename"
          >
            <Edit2 size={14} />
          </button>

          <button
            onClick={() => onMove(file)}
            className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] rounded-lg transition-colors"
            title="Move"
          >
            <Move size={14} />
          </button>

          <div className="h-4 w-[1px] bg-black/[0.08] dark:bg-white/[0.08] mx-0.5" />

          {/* Properties Toggle Button */}
          <button
            onClick={onToggleInspector}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
              showInspector
                ? 'bg-[#0078d4]/10 text-[#0067c0] dark:bg-[#60cdff]/15 dark:text-[#60cdff] border border-[#0078d4]/20 font-semibold'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] border border-transparent'
            }`}
            title={showInspector ? 'Hide Properties Panel' : 'Show Properties Panel'}
          >
            <PanelRight size={13} />
            <span>Properties</span>
          </button>
        </div>
      </div>

      {/* Main Content Workspace Area */}
      <div className="flex-1 w-full h-full overflow-hidden relative">
        {isDir ? (
          <FolderDetailsViewer
            folder={file}
            onSelectChild={onSelectFile}
            onRevealInFolder={onRevealInFolder}
            onCopyPath={onCopyPath}
            onNewFileInDir={onNewFileInDir}
            onNewFolderInDir={onNewFolderInDir}
          />
        ) : isPdf ? (
          <PdfViewer
            file={file}
            onOpenExternal={onOpenExternal}
            onRevealInFolder={onRevealInFolder}
            onCopyPath={onCopyPath}
          />
        ) : isImage ? (
          <ImageViewer
            file={file}
            onOpenExternal={onOpenExternal}
            onRevealInFolder={onRevealInFolder}
            onCopyPath={onCopyPath}
          />
        ) : isMedia ? (
          <MediaVideoViewer
            file={file}
            onOpenExternal={onOpenExternal}
            onRevealInFolder={onRevealInFolder}
            onCopyPath={onCopyPath}
          />
        ) : isMarkdown ? (
          <MarkdownViewer
            content={fileContent}
            filePath={file.path}
            onSave={onSaveContent}
            darkMode={darkMode}
          />
        ) : isTable ? (
          <TableViewer
            content={fileContent}
            extension={ext}
            filePath={file.path}
            onSave={onSaveContent}
            darkMode={darkMode}
          />
        ) : isOfficeDoc ? (
          <OfficeCardViewer
            file={file}
            onOpenExternal={onOpenExternal}
            onRevealInFolder={onRevealInFolder}
            onCopyPath={onCopyPath}
          />
        ) : (
          <MonacoEditorViewer
            content={fileContent}
            extension={ext}
            filePath={file.path}
            onSave={onSaveContent}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
};
