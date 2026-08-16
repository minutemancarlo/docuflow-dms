import React from 'react';
import {
  FileCode,
  FileText,
  FileSpreadsheet,
  Folder,
  FolderOpen,
  File,
  Terminal,
  Database,
  Code2,
  BookOpen,
  AppWindow,
  Package,
  FileCog,
  Binary,
} from 'lucide-react';
import { OfficeAppType } from '../types';
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
} from '../components/icons/OfficeLogos';
import {
  ArchiveZipIcon,
  ArchiveRarIcon,
  ImageMediaIcon,
  VectorSvgIcon,
  VideoMediaIcon,
  AudioMediaIcon,
} from '../components/icons/MediaLogos';

interface FileIconProps {
  name: string;
  isDirectory?: boolean;
  isOpen?: boolean;
  className?: string;
  size?: number;
}

export function getOfficeType(ext: string): OfficeAppType | null {
  const lower = ext.toLowerCase();
  switch (lower) {
    case '.docx':
    case '.doc':
    case '.docm':
    case '.dotx':
      return 'word';

    case '.xlsx':
    case '.xls':
    case '.xlsm':
    case '.xlsb':
    case '.xltx':
      return 'excel';

    case '.pptx':
    case '.ppt':
    case '.pptm':
    case '.potx':
    case '.ppsx':
      return 'powerpoint';

    case '.mpp':
    case '.mpt':
    case '.mpx':
      return 'project';

    case '.pub':
      return 'publisher';

    case '.vsdx':
    case '.vsd':
    case '.vssx':
    case '.vstx':
      return 'visio';

    case '.accdb':
    case '.mdb':
    case '.accde':
      return 'access';

    case '.one':
    case '.onetoc2':
      return 'onenote';

    case '.pdf':
      return 'pdf';

    default:
      return null;
  }
}

export const FileIcon: React.FC<FileIconProps> = ({
  name,
  isDirectory = false,
  isOpen = false,
  className = '',
  size = 18,
}) => {
  if (isDirectory) {
    if (isOpen) {
      return <FolderOpen size={size} className={`text-[#0078d4] dark:text-[#60cdff] shrink-0 ${className}`} />;
    }
    return <Folder size={size} className={`text-[#0078d4] dark:text-[#60cdff] shrink-0 ${className}`} />;
  }

  const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
  const officeType = getOfficeType(ext);

  if (officeType) {
    switch (officeType) {
      case 'word':
        return <WordIcon size={size} className={className} />;
      case 'excel':
        return <ExcelIcon size={size} className={className} />;
      case 'powerpoint':
        return <PowerPointIcon size={size} className={className} />;
      case 'project':
        return <ProjectIcon size={size} className={className} />;
      case 'publisher':
        return <PublisherIcon size={size} className={className} />;
      case 'visio':
        return <VisioIcon size={size} className={className} />;
      case 'access':
        return <AccessIcon size={size} className={className} />;
      case 'onenote':
        return <OneNoteIcon size={size} className={className} />;
      case 'pdf':
        return <PdfIcon size={size} className={className} />;
    }
  }

  switch (ext) {
    // Executables & Installers
    case '.exe':
    case '.com':
    case '.scr':
      return <AppWindow size={size} className={`text-blue-600 dark:text-blue-400 shrink-0 ${className}`} />;

    case '.msi':
    case '.appx':
    case '.msix':
    case '.apk':
      return <Package size={size} className={`text-indigo-600 dark:text-indigo-400 shrink-0 ${className}`} />;

    case '.dll':
    case '.sys':
    case '.drv':
    case '.ocx':
    case '.bin':
    case '.dat':
      return <Binary size={size} className={`text-slate-500 dark:text-slate-400 shrink-0 ${className}`} />;

    case '.reg':
    case '.ini':
    case '.cfg':
    case '.conf':
    case '.config':
      return <FileCog size={size} className={`text-cyan-600 dark:text-cyan-400 shrink-0 ${className}`} />;

    // Compressed Archives & Packages
    case '.zip':
    case '.tar':
    case '.gz':
    case '.bz2':
    case '.xz':
    case '.cab':
    case '.tgz':
      return <ArchiveZipIcon size={size} className={className} />;

    case '.rar':
    case '.7z':
    case '.iso':
    case '.dmg':
    case '.jar':
    case '.war':
      return <ArchiveRarIcon size={size} className={className} />;

    // Image & Graphic Formats
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.webp':
    case '.gif':
    case '.bmp':
    case '.ico':
    case '.tiff':
    case '.tif':
    case '.psd':
    case '.raw':
      return <ImageMediaIcon size={size} className={className} />;

    case '.svg':
    case '.ai':
    case '.eps':
      return <VectorSvgIcon size={size} className={className} />;

    // Video Formats
    case '.mp4':
    case '.mkv':
    case '.avi':
    case '.mov':
    case '.wmv':
    case '.flv':
    case '.webm':
    case '.m4v':
    case '.3gp':
    case '.mpeg':
    case '.mpg':
      return <VideoMediaIcon size={size} className={className} />;

    // Audio Formats
    case '.mp3':
    case '.wav':
    case '.ogg':
    case '.flac':
    case '.m4a':
    case '.aac':
    case '.wma':
    case '.mid':
    case '.midi':
      return <AudioMediaIcon size={size} className={className} />;

    // Scripts & Automations
    case '.ps1':
    case '.psm1':
    case '.psd1':
      return <Terminal size={size} className={`text-blue-500 shrink-0 ${className}`} />;

    case '.py':
    case '.pyw':
      return <Code2 size={size} className={`text-amber-500 shrink-0 ${className}`} />;

    case '.sql':
      return <Database size={size} className={`text-orange-500 shrink-0 ${className}`} />;

    case '.bat':
    case '.cmd':
    case '.sh':
    case '.bash':
      return <Terminal size={size} className={`text-emerald-500 shrink-0 ${className}`} />;

    case '.js':
    case '.jsx':
    case '.ts':
    case '.tsx':
      return <FileCode size={size} className={`text-yellow-500 shrink-0 ${className}`} />;

    // General Documents
    case '.md':
    case '.markdown':
      return <BookOpen size={size} className={`text-cyan-500 shrink-0 ${className}`} />;

    case '.txt':
    case '.log':
      return <FileText size={size} className={`text-slate-400 shrink-0 ${className}`} />;

    // Data & Config
    case '.csv':
    case '.tsv':
      return <FileSpreadsheet size={size} className={`text-emerald-500 shrink-0 ${className}`} />;

    case '.json':
    case '.yaml':
    case '.yml':
    case '.xml':
    case '.toml':
      return <FileCode size={size} className={`text-purple-500 shrink-0 ${className}`} />;

    default:
      return <File size={size} className={`text-slate-400 shrink-0 ${className}`} />;
  }
};
