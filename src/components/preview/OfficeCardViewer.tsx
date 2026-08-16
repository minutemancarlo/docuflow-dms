import React from 'react';
import {
  ExternalLink,
  FolderSymlink,
  Copy,
  Check,
  HardDrive,
  Calendar,
  Tag,
  FileText,
  Clock,
  ShieldCheck,
  Folder,
  AppWindow,
  Package,
  Terminal,
  Binary,
  FileCog,
  File,
} from 'lucide-react';
import { FileItem } from '../../types';
import { formatBytes, formatDate } from '../../utils/formatters';
import { getOfficeType, FileIcon } from '../../utils/fileIcons';
import {
  WordIcon,
  ExcelIcon,
  PowerPointIcon,
  ProjectIcon,
  PublisherIcon,
  PdfIcon,
  VisioIcon,
  AccessIcon,
  OneNoteIcon,
} from '../icons/OfficeLogos';
import {
  ArchiveZipIcon,
  ArchiveRarIcon,
  ImageMediaIcon,
  VectorSvgIcon,
  VideoMediaIcon,
  AudioMediaIcon,
} from '../icons/MediaLogos';

interface OfficeCardViewerProps {
  file: FileItem;
  onOpenExternal: (file: FileItem) => void;
  onRevealInFolder: (file: FileItem) => void;
  onCopyPath: (file: FileItem) => void;
}

export const OfficeCardViewer: React.FC<OfficeCardViewerProps> = ({
  file,
  onOpenExternal,
  onRevealInFolder,
  onCopyPath,
}) => {
  const [copied, setCopied] = React.useState(false);
  const ext = file.extension.toLowerCase();
  const officeType = getOfficeType(ext);

  let appName = 'Default Desktop Application';
  let badgeColor = 'bg-[#0078d4]/10 text-[#0067c0] dark:text-[#60cdff] border-[#0078d4]/20';
  let appIcon: React.ReactNode = <File size={52} className="text-neutral-400 dark:text-neutral-500" />;
  let actionLabel = 'Open in System Default App';

  if (officeType) {
    switch (officeType) {
      case 'word':
        appName = 'Microsoft Word';
        badgeColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
        appIcon = <WordIcon size={56} />;
        actionLabel = 'Open in Microsoft Word';
        break;
      case 'excel':
        appName = 'Microsoft Excel';
        badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
        appIcon = <ExcelIcon size={56} />;
        actionLabel = 'Open in Microsoft Excel';
        break;
      case 'powerpoint':
        appName = 'Microsoft PowerPoint';
        badgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
        appIcon = <PowerPointIcon size={56} />;
        actionLabel = 'Open in Microsoft PowerPoint';
        break;
      case 'project':
        appName = 'Microsoft Project';
        badgeColor = 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';
        appIcon = <ProjectIcon size={56} />;
        actionLabel = 'Open in Microsoft Project';
        break;
      case 'publisher':
        appName = 'Microsoft Publisher';
        badgeColor = 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
        appIcon = <PublisherIcon size={56} />;
        actionLabel = 'Open in Microsoft Publisher';
        break;
      case 'visio':
        appName = 'Microsoft Visio';
        badgeColor = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
        appIcon = <VisioIcon size={56} />;
        actionLabel = 'Open in Microsoft Visio';
        break;
      case 'access':
        appName = 'Microsoft Access';
        badgeColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
        appIcon = <AccessIcon size={56} />;
        actionLabel = 'Open in Microsoft Access';
        break;
      case 'onenote':
        appName = 'Microsoft OneNote';
        badgeColor = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
        appIcon = <OneNoteIcon size={56} />;
        actionLabel = 'Open in Microsoft OneNote';
        break;
      case 'pdf':
        appName = 'Adobe Acrobat / PDF Reader';
        badgeColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
        appIcon = <PdfIcon size={56} />;
        actionLabel = 'Open in PDF Reader';
        break;
    }
  } else if (['.exe', '.com', '.scr'].includes(ext)) {
    appName = 'Windows Executable Application (.exe)';
    badgeColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    appIcon = <AppWindow size={52} className="text-blue-600 dark:text-blue-400" />;
    actionLabel = 'Run Executable Application';
  } else if (['.msi', '.appx', '.msix', '.apk'].includes(ext)) {
    appName = 'Windows Installer Package (.msi)';
    badgeColor = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
    appIcon = <Package size={52} className="text-indigo-600 dark:text-indigo-400" />;
    actionLabel = 'Run Windows Installer';
  } else if (['.dll', '.sys', '.drv', '.ocx', '.bin', '.dat'].includes(ext)) {
    appName = 'System Dynamic Library (.dll / .sys)';
    badgeColor = 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    appIcon = <Binary size={52} className="text-slate-600 dark:text-slate-400" />;
    actionLabel = 'Reveal / Inspect in Explorer';
  } else if (['.reg', '.ini', '.cfg', '.conf'].includes(ext)) {
    appName = 'System Configuration File';
    badgeColor = 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
    appIcon = <FileCog size={52} className="text-cyan-600 dark:text-cyan-400" />;
    actionLabel = 'Open Configuration File';
  } else if (['.bat', '.cmd', '.sh', '.bash'].includes(ext)) {
    appName = 'Command Script Batch';
    badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    appIcon = <Terminal size={52} className="text-emerald-600 dark:text-emerald-400" />;
    actionLabel = 'Open / Execute Script';
  } else if (['.zip', '.tar', '.gz', '.bz2', '.xz', '.cab', '.tgz'].includes(ext)) {
    appName = 'WinRAR / 7-Zip / File Explorer';
    badgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    appIcon = <ArchiveZipIcon size={56} />;
    actionLabel = 'Open in Archive Utility';
  } else if (['.rar', '.7z', '.iso', '.dmg', '.jar'].includes(ext)) {
    appName = '7-Zip / WinRAR Extractor';
    badgeColor = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    appIcon = <ArchiveRarIcon size={56} />;
    actionLabel = 'Open in 7-Zip / WinRAR';
  } else if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.ico', '.tiff', '.psd'].includes(ext)) {
    appName = 'Windows Photos / Image Viewer';
    badgeColor = 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20';
    appIcon = <ImageMediaIcon size={56} />;
    actionLabel = 'Open in Image Viewer';
  } else if (['.svg', '.ai', '.eps'].includes(ext)) {
    appName = 'Vector Graphics / Illustrator';
    badgeColor = 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    appIcon = <VectorSvgIcon size={56} />;
    actionLabel = 'Open in Vector Editor';
  } else if (['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp'].includes(ext)) {
    appName = 'Windows Media Player / Movies & TV';
    badgeColor = 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20';
    appIcon = <VideoMediaIcon size={56} />;
    actionLabel = 'Play in Windows Media Player';
  } else if (['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac', '.wma'].includes(ext)) {
    appName = 'Audio Player / Media Player';
    badgeColor = 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
    appIcon = <AudioMediaIcon size={56} />;
    actionLabel = 'Play in Audio Player';
  }

  const handleCopy = () => {
    onCopyPath(file);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full w-full p-6 sm:p-8 bg-[#f3f3f3] dark:bg-[#202020] overflow-y-auto transition-colors flex flex-col items-center">
      {/* Stretched Out Centered Container */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#2c2c2c] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-2xl transition-all space-y-6">
        {/* Top Header with App Icon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="w-20 h-20 rounded-2xl bg-neutral-50 dark:bg-[#242424] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center shrink-0 shadow-inner p-3">
            {appIcon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                {appName}
              </span>
              {file.status && (
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider border ${
                  file.status === 'approved'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : file.status === 'review'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : file.status === 'deprecated'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20'
                }`}>
                  {file.status}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 truncate" title={file.name}>
              {file.name}
            </h2>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 font-mono"><HardDrive size={12} /> {formatBytes(file.size)}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> Modified {formatDate(file.mtime)}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="space-y-2.5">
          <button
            onClick={() => onOpenExternal(file)}
            className="w-full h-11 bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98"
          >
            <ExternalLink size={15} />
            <span>{actionLabel}</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onRevealInFolder(file)}
              className="h-10 bg-neutral-100 dark:bg-[#343434] hover:bg-neutral-200 dark:hover:bg-[#3a3a3a] text-neutral-800 dark:text-neutral-200 text-xs font-medium rounded-xl border border-black/[0.06] dark:border-white/[0.07] flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <FolderSymlink size={14} className="text-[#0078d4] dark:text-[#60cdff]" />
              <span>Reveal in File Explorer</span>
            </button>

            <button
              onClick={handleCopy}
              className="h-10 bg-neutral-100 dark:bg-[#343434] hover:bg-neutral-200 dark:hover:bg-[#3a3a3a] text-neutral-800 dark:text-neutral-200 text-xs font-medium rounded-xl border border-black/[0.06] dark:border-white/[0.07] flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? 'Path Copied!' : 'Copy Physical Path'}</span>
            </button>
          </div>
        </div>

        {/* Expanded 2-Column Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Physical Path & Notes */}
          <div className="bg-neutral-50 dark:bg-[#242424] rounded-xl p-4 border border-black/[0.05] dark:border-white/[0.06] space-y-3 text-xs transition-colors">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1">
                <Folder size={11} /> File Location
              </span>
              <div className="font-mono text-neutral-800 dark:text-neutral-300 break-all select-all text-[11px] mt-1.5 bg-white dark:bg-[#2c2c2c] p-2.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] shadow-sm leading-relaxed">
                {file.path}
              </div>
            </div>

            {file.description ? (
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1">
                  <FileText size={11} /> Description
                </span>
                <p className="text-neutral-700 dark:text-neutral-300 mt-1 text-[11.5px] leading-relaxed">
                  {file.description}
                </p>
              </div>
            ) : null}

            {file.notes ? (
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Internal Notes
                </span>
                <p className="text-neutral-700 dark:text-neutral-300 mt-1 text-[11px] font-mono whitespace-pre-line bg-white dark:bg-[#2c2c2c] p-2 rounded-lg border border-black/[0.06] dark:border-white/[0.08]">
                  {file.notes}
                </p>
              </div>
            ) : null}
          </div>

          {/* Right Column: Properties Summary */}
          <div className="bg-neutral-50 dark:bg-[#242424] rounded-xl p-4 border border-black/[0.05] dark:border-white/[0.06] space-y-2.5 text-xs transition-colors">
            <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-1 flex items-center gap-1">
              <ShieldCheck size={11} /> File Properties
            </div>

            <div className="flex items-center justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.05]">
              <span className="text-neutral-500 text-[11px]">Format / Extension:</span>
              <span className="font-mono text-neutral-800 dark:text-neutral-200 font-semibold">{file.extension || 'None'}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.05]">
              <span className="text-neutral-500 text-[11px]">File Category:</span>
              <span className="capitalize text-[#0067c0] dark:text-[#60cdff] font-semibold">{file.category}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.05]">
              <span className="text-neutral-500 text-[11px]">File Size:</span>
              <span className="font-mono text-neutral-800 dark:text-neutral-200">{formatBytes(file.size)}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.05]">
              <span className="text-neutral-500 text-[11px]">Relative Path:</span>
              <span className="font-mono text-neutral-600 dark:text-neutral-400 truncate max-w-[180px]">{file.relativePath}</span>
            </div>

            {file.tags && file.tags.length > 0 && (
              <div className="pt-1">
                <span className="text-neutral-500 text-[11px] block mb-1">Assigned Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {file.tags.map((t) => (
                    <span
                      key={t}
                      className="bg-white dark:bg-[#2c2c2c] text-[#0067c0] dark:text-[#60cdff] border border-black/[0.06] dark:border-white/[0.08] px-2 py-0.5 rounded-md text-[10px] font-mono shadow-sm"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
