import React from 'react';
import { HelpCircle, X, ExternalLink, FolderSymlink, Edit2, Move, Check } from 'lucide-react';
import { DocuFlowLogo } from '../icons/DocuFlowLogo';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + K', desc: 'Open Universal Search & Command Palette' },
    { key: 'Ctrl + N', desc: 'Create New Document or Script' },
    { key: 'Ctrl + S', desc: 'Save current document or script' },
    { key: 'Double Click', desc: 'Launch document in Microsoft Word, Excel or default application' },
    { key: 'Right Click', desc: 'Context menu (Rename, Move, Duplicate, Delete, Reveal)' },
    { key: 'Escape', desc: 'Close any active modal or search palette' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 fluent-acrylic z-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white/95 dark:bg-[#2c2c2c]/95 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fluent-in text-xs transition-colors fluent-acrylic cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <DocuFlowLogo size={28} />
            <div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">DocuFlow DMS Guide</h3>
              <p className="text-[10px] text-neutral-400">Windows 11 Fluent Document & Media Workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div>
            <h4 className="font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[9.5px] mb-2">
              Key Features & Operations
            </h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
              <li className="flex items-start gap-2">
                <ExternalLink size={13.5} className="text-[#0078d4] dark:text-[#60cdff] shrink-0 mt-0.5" />
                <span>
                  <strong>Open in Default App:</strong> Immediately launches Word (.docx), Excel (.xlsx), PDF, or Media files in its Windows registered application.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FolderSymlink size={13.5} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Reveal in File Explorer:</strong> Opens the containing folder path in Windows Explorer with the item highlighted.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Edit2 size={13.5} className="text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>In-App Rename:</strong> Safely rename documents with Windows filename validation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Move size={13.5} className="text-purple-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Move & Organize:</strong> Move files between directories with a visual destination tree.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[9.5px] mb-2">
              Keyboard Shortcuts
            </h4>
            <div className="space-y-1.5 bg-neutral-50 dark:bg-[#202020] p-3 rounded-xl border border-black/[0.06] dark:border-white/[0.08]">
              {shortcuts.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-neutral-600 dark:text-neutral-400">{s.desc}</span>
                  <kbd className="bg-white dark:bg-[#2c2c2c] px-2 py-0.5 rounded-md text-[#0067c0] dark:text-[#60cdff] font-mono text-[10.5px] border border-black/[0.08] dark:border-white/[0.1] shadow-sm">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 font-semibold rounded-lg shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <Check size={14} />
            <span>Got it</span>
          </button>
        </div>
      </div>
    </div>
  );
};
