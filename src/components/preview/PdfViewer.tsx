import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  FolderSymlink,
  Copy,
  Check,
  FileText,
  RefreshCcw,
  Maximize2,
  File,
} from 'lucide-react';
import { FileItem } from '../../types';
import { api } from '../../services/apiBridge';
import { formatBytes, formatDate } from '../../utils/formatters';
import { PdfIcon } from '../icons/OfficeLogos';

interface PdfViewerProps {
  file: FileItem;
  onOpenExternal: (file: FileItem) => void;
  onRevealInFolder: (file: FileItem) => void;
  onCopyPath: (file: FileItem) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  onOpenExternal,
  onRevealInFolder,
  onCopyPath,
}) => {
  const [pdfSrc, setPdfSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setPdfSrc(null);

    const loadPdf = async () => {
      try {
        const res = await api.readMediaDataUrl(file.path);
        if (isMounted) {
          setPdfSrc(res.dataUrl);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load PDF document');
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [file.path]);

  const handleCopy = () => {
    onCopyPath(file);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-[#1f1f1f] overflow-hidden select-none transition-colors">
      {/* Top PDF Controls Header */}
      <div className="h-10 border-b border-black/[0.06] dark:border-white/[0.08] bg-neutral-50/90 dark:bg-[#252525]/90 px-3.5 flex items-center justify-between text-xs shrink-0 select-none transition-colors">
        <div className="flex items-center gap-2 truncate min-w-0 mr-4">
          <div className="p-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <PdfIcon size={16} />
          </div>
          <span className="font-mono text-[10.5px] text-rose-600 dark:text-rose-400 font-semibold uppercase bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
            PDF
          </span>
          <span className="text-[11px] text-neutral-600 dark:text-neutral-300 font-medium truncate">
            {file.name}
          </span>
          <span className="text-[10.5px] text-neutral-400 font-mono hidden md:inline">
            ({formatBytes(file.size)})
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onOpenExternal(file)}
            className="flex items-center gap-1.5 text-[11px] font-semibold bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 px-2.5 py-1 rounded-lg transition-colors shadow-sm"
            title="Open in Adobe Acrobat / System Default PDF App"
          >
            <ExternalLink size={12} />
            <span>Open in Acrobat</span>
          </button>

          <button
            onClick={() => onRevealInFolder(file)}
            className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
            title="Reveal in File Explorer"
          >
            <FolderSymlink size={13.5} />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
            title="Copy Path"
          >
            {copied ? <Check size={13.5} className="text-emerald-500" /> : <Copy size={13.5} />}
          </button>
        </div>
      </div>

      {/* Main PDF Document Canvas */}
      <div className="flex-1 w-full h-full overflow-hidden bg-neutral-100 dark:bg-[#141414] relative flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 text-neutral-400 text-xs">
            <RefreshCcw size={22} className="animate-spin text-[#0078d4] dark:text-[#60cdff]" />
            <span>Rendering PDF document...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 text-rose-500 text-xs p-6 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800/40 max-w-md text-center">
            <PdfIcon size={32} />
            <span>Failed to render PDF: {error}</span>
            <button
              onClick={() => onOpenExternal(file)}
              className="mt-2 px-3 py-1.5 bg-[#0078d4] text-white rounded-lg font-semibold"
            >
              Open in Adobe Acrobat Reader
            </button>
          </div>
        ) : pdfSrc ? (
          <iframe
            src={`${pdfSrc}#toolbar=1&navpanes=1`}
            title={file.name}
            className="w-full h-full border-0 bg-neutral-200 dark:bg-[#181818]"
          />
        ) : null}
      </div>
    </div>
  );
};
