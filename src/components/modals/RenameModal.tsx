import React, { useState, useEffect } from 'react';
import { Edit2, X, AlertCircle, Check } from 'lucide-react';
import { FileItem } from '../../types';

interface RenameModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (file: FileItem, newName: string) => Promise<boolean>;
}

export const RenameModal: React.FC<RenameModalProps> = ({
  file,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (file) {
      setNewName(file.name);
      setError(null);
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newName.trim();
    if (!clean) {
      setError('Name cannot be empty.');
      return;
    }
    if (clean === file.name) {
      onClose();
      return;
    }
    // Check illegal chars in Windows filenames
    if (/[\\/:*?"<>|]/.test(clean)) {
      setError('A file name cannot contain any of the following characters: \\ / : * ? " < > |');
      return;
    }

    setSubmitting(true);
    const ok = await onConfirm(file, clean);
    setSubmitting(false);
    if (ok) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 fluent-acrylic z-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white/95 dark:bg-[#2c2c2c]/95 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fluent-in text-xs transition-colors fluent-acrylic cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Edit2 size={15} />
            </div>
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Rename {file.isDirectory ? 'Folder' : 'File'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              Enter new name:
            </label>
            <input
              type="text"
              autoFocus
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setError(null);
              }}
              className="w-full bg-white dark:bg-[#202020] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:border-[#0078d4] dark:focus:border-[#60cdff] text-xs font-medium"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-lg border border-rose-200 dark:border-rose-800/40 text-[11px]">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>{submitting ? 'Renaming...' : 'Rename'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
