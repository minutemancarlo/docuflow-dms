import React, { useState } from 'react';
import {
  Plus,
  Search,
  FolderSymlink,
  ExternalLink,
  Settings,
  Trash2,
  Copy,
  Check,
  Folder,
  Layers,
  HardDrive,
  FileCode,
  FileText,
  FileSpreadsheet,
  Star,
  Clock,
  ArrowRight,
  LayoutGrid,
} from 'lucide-react';
import { Workspace } from '../../types';
import { WorkspaceIcon } from './WorkspaceIcon';
import { formatDate } from '../../utils/formatters';

interface ProjectsDashboardProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  onSelectWorkspace: (workspace: Workspace) => void;
  onOpenWorkspaceInExplorer: (workspace: Workspace) => void;
  onAddNewWorkspace: () => void;
  onEditWorkspace: (workspace: Workspace) => void;
  onDeleteWorkspace: (workspace: Workspace) => void;
  onRevealInFolder: (filePath: string) => void;
  onCopyPath: (path: string) => void;
}

export const ProjectsDashboard: React.FC<ProjectsDashboardProps> = ({
  workspaces,
  activeWorkspace,
  onSelectWorkspace,
  onOpenWorkspaceInExplorer,
  onAddNewWorkspace,
  onEditWorkspace,
  onDeleteWorkspace,
  onRevealInFolder,
  onCopyPath,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredWorkspaces = workspaces.filter((ws) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      ws.name.toLowerCase().includes(q) ||
      ws.path.toLowerCase().includes(q) ||
      ws.description?.toLowerCase().includes(q)
    );
  });

  const handleCopy = (ws: Workspace) => {
    onCopyPath(ws.path);
    setCopiedId(ws.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-full flex-1 flex flex-col bg-[#f3f3f3] dark:bg-[#202020] overflow-y-auto select-none transition-colors">
      {/* Fluent Hero Banner */}
      <div className="p-8 pb-6 border-b border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-[#262626]/70 fluent-acrylic">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0067c0] dark:text-[#60cdff] bg-[#0078d4]/10 dark:bg-[#60cdff]/15 px-2 py-0.5 rounded-full border border-[#0078d4]/20">
                Workspaces & Repositories
              </span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
              Projects & Work Folders Hub
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
              Organize, configure custom icons, and quickly launch your work repositories, documents, and automation script directories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAddNewWorkspace}
              className="px-4 py-2 bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all transform active:scale-98"
            >
              <Plus size={15} />
              <span>Add Project Folder</span>
            </button>
          </div>
        </div>

        {/* Search & Overview Stats */}
        <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={13.5} className="absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter project folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#2c2c2c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl pl-9 pr-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#0078d4] dark:focus:border-[#60cdff] shadow-sm"
            />
          </div>

          <div className="flex items-center gap-5 text-xs text-neutral-500 dark:text-neutral-400">
            <div>
              <span className="font-bold text-neutral-800 dark:text-neutral-200">{workspaces.length}</span> Folders Configured
            </div>
            <div className="h-3 w-[1px] bg-black/[0.08] dark:bg-white/[0.1]" />
            <div>
              Active Vault: <span className="font-semibold text-[#0067c0] dark:text-[#60cdff]">{activeWorkspace?.name || 'None'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="max-w-6xl w-full mx-auto p-8">
        {filteredWorkspaces.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#2c2c2c] border border-black/[0.07] dark:border-white/[0.08] rounded-2xl p-8 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-[#343434] flex items-center justify-center mx-auto mb-3 text-neutral-400">
              <Folder size={26} />
            </div>
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">No Project Folders Found</h3>
            <p className="text-xs text-neutral-500 mt-1">
              {searchQuery ? `No results matching "${searchQuery}"` : 'Configure your first work folder to get started.'}
            </p>
            <button
              onClick={onAddNewWorkspace}
              className="mt-4 px-4 py-2 bg-[#0078d4] text-white rounded-xl text-xs font-semibold shadow-sm"
            >
              + Add Project Folder
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkspaces.map((ws) => {
              const isActive = activeWorkspace?.id === ws.id;
              const accentColor = ws.color || '#0078d4';

              return (
                <div
                  key={ws.id}
                  className={`bg-white dark:bg-[#2c2c2c] border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group relative ${
                    isActive
                      ? 'border-[#0078d4] dark:border-[#60cdff] ring-2 ring-[#0078d4]/20 dark:ring-[#60cdff]/20'
                      : 'border-black/[0.07] dark:border-white/[0.08] hover:border-black/[0.12] dark:hover:border-white/[0.15]'
                  }`}
                >
                  {/* Top Bar with Icon & Actions */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      {/* Project Icon (Custom PNG or Builtin Vector) */}
                      <div
                        style={{ backgroundColor: `${accentColor}12`, borderColor: `${accentColor}35` }}
                        className="w-13 h-13 rounded-2xl border flex items-center justify-center p-2.5 shrink-0 shadow-inner"
                      >
                        <div
                          style={{ color: accentColor }}
                          className="flex items-center justify-center"
                        >
                          <WorkspaceIcon workspace={ws} size={26} />
                        </div>
                      </div>

                      {/* Top Action Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditWorkspace(ws)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
                          title="Configure Folder Settings & Icon"
                        >
                          <Settings size={14} />
                        </button>
                        <button
                          onClick={() => onRevealInFolder(ws.path)}
                          className="p-1.5 text-neutral-400 hover:text-[#0078d4] dark:hover:text-[#60cdff] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
                          title="Reveal in Windows Explorer"
                        >
                          <FolderSymlink size={14} />
                        </button>
                        {workspaces.length > 1 && (
                          <button
                            onClick={() => onDeleteWorkspace(ws)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                            title="Remove from Dashboard"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title & Active Badge */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate" title={ws.name}>
                          {ws.name}
                        </h3>
                        {isActive && (
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full bg-[#0078d4]/10 dark:bg-[#60cdff]/15 text-[#0067c0] dark:text-[#60cdff] border border-[#0078d4]/20 shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 min-h-[30px] leading-relaxed">
                        {ws.description || 'No description provided for this work folder.'}
                      </p>
                    </div>

                    {/* System Path Snippet with Copy */}
                    <div className="bg-neutral-50 dark:bg-[#242424] p-2 rounded-xl border border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-[10.5px] mb-3.5 font-mono">
                      <span className="text-neutral-600 dark:text-neutral-400 truncate max-w-[200px]" title={ws.path}>
                        {ws.path}
                      </span>
                      <button
                        onClick={() => handleCopy(ws)}
                        className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded transition-colors"
                        title="Copy Path"
                      >
                        {copiedId === ws.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Action: Open / Enter Folder */}
                  <div>
                    <button
                      onClick={() => onOpenWorkspaceInExplorer(ws)}
                      className={`w-full py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        isActive
                          ? 'bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 shadow-md shadow-blue-500/20'
                          : 'bg-neutral-100 dark:bg-[#343434] hover:bg-neutral-200 dark:hover:bg-[#3a3a3a] text-neutral-800 dark:text-neutral-200 border border-black/[0.06] dark:border-white/[0.07]'
                      }`}
                    >
                      <span>{isActive ? 'Open in File Explorer' : 'Switch to this Project'}</span>
                      <ArrowRight size={13.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
