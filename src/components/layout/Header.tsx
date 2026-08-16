import React from 'react';
import {
  FolderPlus,
  FilePlus,
  Search,
  Plus,
  Moon,
  Sun,
  Layers,
  HelpCircle,
  LayoutDashboard,
  FolderTree,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Workspace } from '../../types';
import { WorkspaceIcon } from '../dashboard/WorkspaceIcon';
import { DocuFlowLogo } from '../icons/DocuFlowLogo';

interface HeaderProps {
  activeWorkspace: Workspace | null;
  workspaces: Workspace[];
  onSelectWorkspace: (ws: Workspace) => void;
  onAddWorkspace: () => void;
  onOpenSearch: () => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenHelp: () => void;
  activeView: 'dashboard' | 'explorer';
  onToggleView: (view: 'dashboard' | 'explorer') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeWorkspace,
  workspaces,
  onSelectWorkspace,
  onAddWorkspace,
  onOpenSearch,
  onNewFile,
  onNewFolder,
  darkMode,
  onToggleTheme,
  onOpenHelp,
  activeView,
  onToggleView,
}) => {
  return (
    <header className="h-13 border-b border-black/[0.06] dark:border-white/[0.08] bg-[#f3f3f3]/95 dark:bg-[#202020]/95 fluent-acrylic px-4 flex items-center justify-between select-none z-30 shrink-0 transition-colors">
      {/* Brand & Workspace Dropdown */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2.5">
          <DocuFlowLogo size={32} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs tracking-tight text-neutral-900 dark:text-neutral-100">
                DocuFlow
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-[#0078d4]/10 dark:bg-[#60cdff]/15 text-[#0067c0] dark:text-[#60cdff] border border-[#0078d4]/20">
                DMS
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-normal truncate max-w-[160px]">
              {activeWorkspace ? activeWorkspace.name : 'No Active Vault'}
            </p>
          </div>
        </div>

        {/* View Switcher Capsule (Windows 11 Segmented Pill) */}
        <div className="flex bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-lg border border-black/[0.05] dark:border-white/[0.06] ml-2">
          <button
            onClick={() => onToggleView('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeView === 'dashboard'
                ? 'bg-white dark:bg-[#2c2c2c] text-[#0067c0] dark:text-[#60cdff] shadow-sm font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
            title="Projects & Work Folders Hub"
          >
            <LayoutDashboard size={13.5} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onToggleView('explorer')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeView === 'explorer'
                ? 'bg-white dark:bg-[#2c2c2c] text-[#0067c0] dark:text-[#60cdff] shadow-sm font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
            title="File Explorer & Preview Panel"
          >
            <FolderTree size={13.5} />
            <span>Explorer</span>
          </button>
        </div>

        {/* Workspace Quick Switcher */}
        <div className="relative group">
          <button className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white/70 dark:bg-[#2c2c2c]/80 hover:bg-white dark:hover:bg-[#343434] border border-black/[0.07] dark:border-white/[0.08] px-2.5 py-1 rounded-lg transition-all shadow-sm">
            <span
              style={{ backgroundColor: activeWorkspace?.color || '#0078d4' }}
              className="w-2 h-2 rounded-full ring-2 ring-black/5 dark:ring-white/10"
            />
            <span className="truncate max-w-[120px]">{activeWorkspace?.name || 'Select Vault'}</span>
            <ChevronDown size={12} className="text-neutral-400" />
          </button>

          <div className="absolute left-0 top-full mt-1.5 w-64 bg-white/95 dark:bg-[#2c2c2c]/95 border border-black/[0.08] dark:border-white/[0.1] rounded-xl shadow-xl dark:shadow-2xl py-1.5 hidden group-hover:block z-50 animate-fluent-in fluent-acrylic">
            <div className="px-3 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Project Vaults
            </div>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => onSelectWorkspace(ws)}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                  activeWorkspace?.id === ws.id
                    ? 'text-[#0067c0] dark:text-[#60cdff] bg-[#0078d4]/10 dark:bg-[#60cdff]/10 font-semibold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <WorkspaceIcon workspace={ws} size={14} />
                  <span className="truncate">{ws.name}</span>
                </div>
                {activeWorkspace?.id === ws.id && <Check size={13} className="text-[#0078d4] dark:text-[#60cdff]" />}
              </button>
            ))}
            <div className="border-t border-black/[0.06] dark:border-white/[0.08] my-1"></div>
            <button
              onClick={onAddWorkspace}
              className="w-full text-left px-3 py-1.5 text-xs text-[#0067c0] dark:text-[#60cdff] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center gap-2 font-medium"
            >
              <Plus size={13} /> + Configure New Project...
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons & Theme Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenSearch}
          className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-[#0078d4] dark:hover:text-[#60cdff] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
          title="Search documents, scripts, or tags (Ctrl+K)"
        >
          <Search size={15} />
        </button>

        <button
          onClick={onNewFile}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white/70 dark:bg-[#2c2c2c]/80 hover:bg-white dark:hover:bg-[#343434] border border-black/[0.07] dark:border-white/[0.08] px-2.5 py-1.5 rounded-lg transition-all shadow-sm"
          title="Create New Document or Script (Ctrl+N)"
        >
          <FilePlus size={13.5} className="text-[#0078d4] dark:text-[#60cdff]" />
          <span className="hidden sm:inline text-[11.5px]">New File</span>
        </button>

        <button
          onClick={onNewFolder}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white/70 dark:bg-[#2c2c2c]/80 hover:bg-white dark:hover:bg-[#343434] border border-black/[0.07] dark:border-white/[0.08] px-2.5 py-1.5 rounded-lg transition-all shadow-sm"
          title="Create New Folder"
        >
          <FolderPlus size={13.5} className="text-emerald-500" />
          <span className="hidden sm:inline text-[11.5px]">New Folder</span>
        </button>

        <div className="h-4 w-[1px] bg-black/[0.08] dark:bg-white/[0.08] mx-1" />

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
          title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {darkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-neutral-700" />}
        </button>

        <button
          onClick={onOpenHelp}
          className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-[#0078d4] dark:hover:text-[#60cdff] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
          title="Help & Keyboard Shortcuts"
        >
          <HelpCircle size={15} />
        </button>
      </div>
    </header>
  );
};
