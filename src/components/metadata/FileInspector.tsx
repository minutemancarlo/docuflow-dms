import React, { useState, useEffect } from 'react';
import {
  X,
  Tag,
  FileText,
  Copy,
  Check,
  Plus,
  StickyNote,
  ShieldCheck,
  ExternalLink,
  FolderSymlink,
  Folder,
} from 'lucide-react';
import { FileItem, DocumentStatus } from '../../types';
import { formatBytes, formatDate } from '../../utils/formatters';
import { api } from '../../services/apiBridge';

interface FileInspectorProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateMetadata: (file: FileItem, patch: any) => Promise<void>;
  onOpenExternal: (file: FileItem) => void;
  onRevealInFolder: (file: FileItem) => void;
  availableTags: string[];
}

export const FileInspector: React.FC<FileInspectorProps> = ({
  file,
  isOpen,
  onClose,
  onUpdateMetadata,
  onOpenExternal,
  onRevealInFolder,
}) => {
  const [newTag, setNewTag] = useState('');
  const [notes, setNotes] = useState('');
  const [description, setDescription] = useState('');
  const [copiedPath, setCopiedPath] = useState(false);

  useEffect(() => {
    if (file) {
      setNotes(file.notes || '');
      setDescription(file.description || '');
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const isDir = file.isDirectory;

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTag.trim().toLowerCase().replace(/^[#\s]+/, '');
    if (!clean) return;

    const currentTags = file.tags || [];
    if (!currentTags.includes(clean)) {
      const updated = [...currentTags, clean];
      await onUpdateMetadata(file, { tags: updated });
    }
    setNewTag('');
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const currentTags = file.tags || [];
    const updated = currentTags.filter((t) => t !== tagToRemove);
    await onUpdateMetadata(file, { tags: updated });
  };

  const handleStatusChange = async (status: DocumentStatus) => {
    await onUpdateMetadata(file, { status });
  };

  const handleNotesBlur = async () => {
    if (notes !== (file.notes || '')) {
      await onUpdateMetadata(file, { notes });
    }
  };

  const handleDescriptionBlur = async () => {
    if (description !== (file.description || '')) {
      await onUpdateMetadata(file, { description });
    }
  };

  const handleCopyPath = () => {
    api.copyToClipboard(file.path);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  return (
    <aside className="w-80 border-l border-black/[0.06] dark:border-white/[0.08] bg-[#f3f3f3]/90 dark:bg-[#202020]/90 fluent-acrylic flex flex-col justify-between shrink-0 select-none overflow-y-auto z-20 transition-colors">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#0078d4]/10 dark:bg-[#60cdff]/15 text-[#0067c0] dark:text-[#60cdff]">
              {isDir ? <Folder size={15} /> : <FileText size={15} />}
            </div>
            <h3 className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              {isDir ? 'Folder Properties' : 'Properties'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Quick Launch Buttons */}
        <div className="space-y-1.5">
          {!isDir && (
            <button
              onClick={() => onOpenExternal(file)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <ExternalLink size={13} /> Open in Default App
            </button>
          )}
          <button
            onClick={() => onRevealInFolder(file)}
            className="w-full flex items-center justify-center gap-2 py-1.5 bg-white/80 dark:bg-[#2c2c2c]/80 hover:bg-white dark:hover:bg-[#343434] text-neutral-700 dark:text-neutral-300 border border-black/[0.07] dark:border-white/[0.08] rounded-xl text-xs transition-colors"
          >
            <FolderSymlink size={13} className="text-neutral-400" /> Reveal in File Explorer
          </button>
        </div>

        {/* Attributes Table */}
        <div className="bg-white dark:bg-[#2c2c2c] rounded-xl p-3.5 border border-black/[0.07] dark:border-white/[0.08] space-y-2.5 text-xs shadow-sm transition-colors">
          <div>
            <span className="text-[9.5px] uppercase font-bold text-neutral-400">
              {isDir ? 'Folder Name' : 'File Name'}
            </span>
            <p className="font-semibold text-neutral-800 dark:text-neutral-200 truncate mt-0.5" title={file.name}>
              {file.name}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[9.5px] uppercase font-bold text-neutral-400">
              {isDir ? 'Total Volume' : 'Size'}
            </span>
            <span className="font-mono text-neutral-700 dark:text-neutral-300">{formatBytes(file.size)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[9.5px] uppercase font-bold text-neutral-400">Type</span>
            <span className="capitalize text-[#0067c0] dark:text-[#60cdff] font-medium">
              {isDir ? 'Directory Folder' : file.category}
            </span>
          </div>

          {isDir && file.children && (
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] uppercase font-bold text-neutral-400">Contained Items</span>
              <span className="font-mono text-neutral-700 dark:text-neutral-300">
                {file.children.length} items
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-[9.5px] uppercase font-bold text-neutral-400">Modified</span>
            <span className="text-neutral-700 dark:text-neutral-300">{formatDate(file.mtime)}</span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] uppercase font-bold text-neutral-400">Physical Path</span>
              <button
                onClick={handleCopyPath}
                className="text-[10px] text-[#0067c0] dark:text-[#60cdff] hover:underline flex items-center gap-1"
              >
                {copiedPath ? <Check size={10} /> : <Copy size={10} />}
                {copiedPath ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="font-mono text-[10px] text-neutral-600 dark:text-neutral-400 break-all select-all mt-1 bg-neutral-50 dark:bg-[#202020] p-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08]">
              {file.path}
            </p>
          </div>
        </div>

        {/* Status Lifecycle Flag (Files only) */}
        {!isDir && (
          <div>
            <label className="block text-[9.5px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <ShieldCheck size={12} /> Lifecycle Status
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'draft', label: 'Draft' },
                  { id: 'review', label: 'In Review' },
                  { id: 'approved', label: 'Approved' },
                  { id: 'deprecated', label: 'Deprecated' },
                ] as const
              ).map((st) => {
                const isSelected = (file.status || 'draft') === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => handleStatusChange(st.id)}
                    className={`py-1 px-2 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#0078d4] text-white dark:bg-[#60cdff] dark:text-neutral-950 shadow-sm font-semibold'
                        : 'bg-white/80 dark:bg-[#2c2c2c]/80 hover:bg-white dark:hover:bg-[#343434] text-neutral-600 dark:text-neutral-400 border border-black/[0.07] dark:border-white/[0.08]'
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tags Section */}
        <div>
          <label className="block text-[9.5px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Tag size={12} /> Custom Tags
          </label>

          <form onSubmit={handleAddTag} className="flex gap-1.5 mb-2">
            <input
              type="text"
              placeholder="Add new tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 bg-white dark:bg-[#202020] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#0078d4] dark:focus:border-[#60cdff]"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
            >
              <Plus size={12} />
            </button>
          </form>

          <div className="flex flex-wrap gap-1">
            {file.tags && file.tags.length > 0 ? (
              file.tags.map((t) => (
                <span
                  key={t}
                  className="bg-white dark:bg-[#2c2c2c] text-[#0067c0] dark:text-[#60cdff] border border-black/[0.07] dark:border-white/[0.08] px-2 py-0.5 rounded-md text-[10px] font-mono flex items-center gap-1 shadow-sm"
                >
                  #{t}
                  <button
                    onClick={() => handleRemoveTag(t)}
                    className="text-neutral-400 hover:text-rose-500 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-[11px] text-neutral-400 italic">No tags assigned.</span>
            )}
          </div>
        </div>

        {/* Summary Description */}
        <div>
          <label className="block text-[9.5px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <FileText size={12} /> Summary Description
          </label>
          <textarea
            rows={2}
            placeholder="Brief description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            className="w-full bg-white dark:bg-[#202020] border border-black/[0.08] dark:border-white/[0.1] rounded-lg p-2 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#0078d4] dark:focus:border-[#60cdff] resize-none"
          />
        </div>

        {/* Operational Notes */}
        <div>
          <label className="block text-[9.5px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <StickyNote size={12} /> Operational Notes
          </label>
          <textarea
            rows={3}
            placeholder="Add internal notes or reminders..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            className="w-full bg-white dark:bg-[#202020] border border-black/[0.08] dark:border-white/[0.1] rounded-lg p-2 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#0078d4] dark:focus:border-[#60cdff] resize-none font-mono text-[11px]"
          />
        </div>
      </div>
    </aside>
  );
};
