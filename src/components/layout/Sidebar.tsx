import React, { useState } from 'react';
import {
  FileText,
  Code2,
  Star,
  Clock,
  Tag,
  FileSpreadsheet,
  Layers,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
} from 'lucide-react';
import { DocumentCategory, DocumentStatus, OfficeAppType } from '../../types';
import {
  WordIcon,
  ExcelIcon,
  PowerPointIcon,
  PdfIcon,
  ProjectIcon,
  PublisherIcon,
  VisioIcon,
  AccessIcon,
} from '../icons/OfficeLogos';

interface SidebarProps {
  activeCategory: DocumentCategory;
  onSelectCategory: (category: DocumentCategory) => void;
  selectedOfficeType: OfficeAppType | 'all' | null;
  onSelectOfficeType: (type: OfficeAppType | 'all' | null) => void;
  onOpenDashboard?: () => void;
  onOpenSearch?: () => void;
  activeView?: 'dashboard' | 'explorer';
  totalProjectsCount?: number;
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  selectedStatus: DocumentStatus | null;
  onSelectStatus: (status: DocumentStatus | null) => void;
  stats: {
    totalOffice: number;
    totalDocs: number;
    totalScripts: number;
    totalData: number;
    pinnedCount: number;
    officeCounts: {
      word: number;
      excel: number;
      powerpoint: number;
      pdf: number;
      project: number;
      publisher: number;
      visio: number;
      access: number;
    };
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  onSelectCategory,
  selectedOfficeType,
  onSelectOfficeType,
  onOpenDashboard,
  onOpenSearch,
  activeView = 'explorer',
  totalProjectsCount = 1,
  tags,
  selectedTag,
  onSelectTag,
  selectedStatus,
  onSelectStatus,
  stats,
}) => {
  const [officeMenuOpen, setOfficeMenuOpen] = useState(true);

  const officeSubmenuItems: {
    id: OfficeAppType | 'all';
    label: string;
    icon: React.ReactNode;
    count: number;
  }[] = [
    {
      id: 'all',
      label: 'All Office Files',
      icon: <LayoutGrid size={14} className="text-[#0078d4] dark:text-[#60cdff]" />,
      count: stats.totalOffice,
    },
    {
      id: 'word',
      label: 'Microsoft Word',
      icon: <WordIcon size={14} />,
      count: stats.officeCounts.word,
    },
    {
      id: 'excel',
      label: 'Microsoft Excel',
      icon: <ExcelIcon size={14} />,
      count: stats.officeCounts.excel,
    },
    {
      id: 'powerpoint',
      label: 'Microsoft PowerPoint',
      icon: <PowerPointIcon size={14} />,
      count: stats.officeCounts.powerpoint,
    },
    {
      id: 'pdf',
      label: 'PDF Documents',
      icon: <PdfIcon size={14} />,
      count: stats.officeCounts.pdf,
    },
    {
      id: 'project',
      label: 'Microsoft Project',
      icon: <ProjectIcon size={14} />,
      count: stats.officeCounts.project,
    },
    {
      id: 'publisher',
      label: 'Microsoft Publisher',
      icon: <PublisherIcon size={14} />,
      count: stats.officeCounts.publisher,
    },
    {
      id: 'visio',
      label: 'Microsoft Visio',
      icon: <VisioIcon size={14} />,
      count: stats.officeCounts.visio,
    },
    {
      id: 'access',
      label: 'Microsoft Access',
      icon: <AccessIcon size={14} />,
      count: stats.officeCounts.access,
    },
  ];

  const categories: { id: DocumentCategory; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'all', label: 'All Library Items', icon: <Layers size={14} /> },
    {
      id: 'documents',
      label: 'Guides & Markdown',
      icon: <FileText size={14} className="text-cyan-500" />,
      count: stats.totalDocs,
    },
    {
      id: 'scripts',
      label: 'Scripts & Automation',
      icon: <Code2 size={14} className="text-amber-500" />,
      count: stats.totalScripts,
    },
    {
      id: 'data',
      label: 'Data & Workbooks',
      icon: <FileSpreadsheet size={14} className="text-emerald-500" />,
      count: stats.totalData,
    },
    {
      id: 'pinned',
      label: 'Pinned Favorites',
      icon: <Star size={14} className="text-yellow-400 fill-yellow-400" />,
      count: stats.pinnedCount,
    },
    { id: 'recent', label: 'Recent Activity', icon: <Clock size={14} className="text-slate-400" /> },
  ];

  const statuses: { id: DocumentStatus; label: string; color: string; ringColor: string }[] = [
    { id: 'approved', label: 'Approved', color: 'bg-emerald-500', ringColor: 'ring-emerald-500/20' },
    { id: 'review', label: 'In Review', color: 'bg-amber-500', ringColor: 'ring-amber-500/20' },
    { id: 'draft', label: 'Draft', color: 'bg-slate-400', ringColor: 'ring-slate-400/20' },
    { id: 'deprecated', label: 'Deprecated', color: 'bg-rose-500', ringColor: 'ring-rose-500/20' },
  ];

  const isOfficeCategoryActive = activeCategory === 'office';

  const handleSelectOfficeSubmenu = (officeId: OfficeAppType | 'all') => {
    onSelectCategory('office');
    onSelectOfficeType(officeId);
  };

  const handleSelectGeneralCategory = (catId: DocumentCategory) => {
    onSelectCategory(catId);
    onSelectOfficeType(null);
  };

  return (
    <aside className="w-60 border-r border-black/[0.06] dark:border-white/[0.08] bg-[#f3f3f3]/90 dark:bg-[#202020]/90 fluent-acrylic flex flex-col justify-between shrink-0 select-none overflow-y-auto transition-colors">
      <div className="p-2.5 space-y-4">
        {/* Quick Hub Navigation Button */}
        {onOpenDashboard && (
          <div>
            <button
              onClick={onOpenDashboard}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'dashboard'
                  ? 'bg-[#0078d4] text-white dark:bg-[#60cdff] dark:text-neutral-950 shadow-md shadow-blue-500/20'
                  : 'bg-white/80 dark:bg-[#2c2c2c]/80 border border-black/[0.07] dark:border-white/[0.08] text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-[#343434] shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid size={14} className={activeView === 'dashboard' ? 'text-white dark:text-neutral-950' : 'text-[#0078d4] dark:text-[#60cdff]'} />
                <span>Projects Hub</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeView === 'dashboard' ? 'bg-black/20 dark:bg-black/30 text-white dark:text-neutral-950' : 'bg-black/[0.05] dark:bg-white/[0.08] text-neutral-500'
              }`}>
                {totalProjectsCount}
              </span>
            </button>
          </div>
        )}

        {/* Global Search Button in Sidebar */}
        {onOpenSearch && (
          <div>
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/80 dark:bg-[#2c2c2c]/80 border border-black/[0.07] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-300 hover:border-[#0078d4] dark:hover:border-[#60cdff] hover:text-[#0067c0] dark:hover:text-[#60cdff] shadow-sm transition-all text-xs font-medium group"
              title="Search documents, scripts, tags, or modified dates (Ctrl+K)"
            >
              <div className="flex items-center gap-2">
                <Search size={14} className="text-[#0078d4] dark:text-[#60cdff]" />
                <span className="text-[11.5px]">Search Files...</span>
              </div>
              <kbd className="text-[9.5px] bg-black/[0.04] dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-400 px-1.5 py-0.5 rounded font-mono border border-black/[0.06] dark:border-white/[0.08]">
                Ctrl+K
              </kbd>
            </button>
          </div>
        )}

        {/* Office Apps Submenu Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[9.5px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Office Suite
            </span>
            <button
              onClick={() => setOfficeMenuOpen(!officeMenuOpen)}
              className="p-0.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded"
              title={officeMenuOpen ? 'Collapse Submenu' : 'Expand Submenu'}
            >
              {officeMenuOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>
          </div>

          {/* Collapsible Submenu Container */}
          <div className="space-y-0.5">
            {/* Header / Parent Button */}
            <button
              onClick={() => {
                handleSelectOfficeSubmenu('all');
                if (!officeMenuOpen) setOfficeMenuOpen(true);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isOfficeCategoryActive && (selectedOfficeType === 'all' || !selectedOfficeType)
                  ? 'bg-[#0078d4]/10 dark:bg-[#60cdff]/15 text-[#0067c0] dark:text-[#60cdff] font-semibold'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutGrid size={14} className="text-[#0078d4] dark:text-[#60cdff]" />
                <span className="text-[11.5px]">Office & Productivity</span>
              </div>
              {stats.totalOffice > 0 && (
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 bg-black/[0.05] dark:bg-white/[0.08] px-1.5 py-0.2 rounded-full font-mono">
                  {stats.totalOffice}
                </span>
              )}
            </button>

            {/* Expanded Child Items */}
            {officeMenuOpen && (
              <div className="pl-3.5 space-y-0.5 border-l-2 border-black/[0.06] dark:border-white/[0.08] ml-3.5 my-1">
                {officeSubmenuItems
                  .filter((item) => item.id !== 'all')
                  .map((item) => {
                    const isSelected = isOfficeCategoryActive && selectedOfficeType === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectOfficeSubmenu(item.id)}
                        className={`w-full flex items-center justify-between px-2 py-1.2 rounded-md text-[11px] font-normal transition-all ${
                          isSelected
                            ? 'bg-[#0078d4]/15 dark:bg-[#60cdff]/20 text-[#0067c0] dark:text-[#60cdff] font-semibold'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-neutral-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {item.icon}
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.count > 0 && (
                          <span className="text-[9.5px] text-neutral-400 dark:text-neutral-500 font-mono">
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* General Categories */}
        <div>
          <div className="px-2 mb-1 text-[9.5px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            Categories
          </div>
          <div className="space-y-0.5">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id && !isOfficeCategoryActive;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectGeneralCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#0078d4]/10 dark:bg-[#60cdff]/15 text-[#0067c0] dark:text-[#60cdff] font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {cat.icon}
                    <span className="text-[11.5px]">{cat.label}</span>
                  </div>
                  {cat.count !== undefined && cat.count > 0 && (
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 bg-black/[0.05] dark:bg-white/[0.08] px-1.5 py-0.2 rounded-full font-mono">
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter by Status */}
        <div>
          <div className="px-2 mb-1.5 flex items-center justify-between">
            <span className="text-[9.5px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-1">
              <Filter size={10} className="text-[#0078d4] dark:text-[#60cdff]" /> Filter by Status
            </span>
            {selectedStatus && (
              <button
                onClick={() => onSelectStatus(null)}
                className="text-[9.5px] text-[#0078d4] dark:text-[#60cdff] font-semibold hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1 px-1">
            {statuses.map((st) => (
              <button
                key={st.id}
                onClick={() => onSelectStatus(selectedStatus === st.id ? null : st.id)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] transition-all ${
                  selectedStatus === st.id
                    ? 'bg-white dark:bg-[#2c2c2c] text-[#0067c0] dark:text-[#60cdff] font-semibold shadow-sm border border-[#0078d4]/30 dark:border-[#60cdff]/30 ring-1 ring-[#0078d4]/20'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${st.color}`} />
                <span className="truncate">{st.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter by Tags */}
        {tags.length > 0 && (
          <div>
            <div className="px-2 mb-1.5 flex items-center justify-between">
              <span className="text-[9.5px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                <Tag size={10} className="text-[#0078d4] dark:text-[#60cdff]" /> Filter by Tags
              </span>
              {selectedTag && (
                <button
                  onClick={() => onSelectTag(null)}
                  className="text-[9.5px] text-[#0078d4] dark:text-[#60cdff] font-semibold hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1 px-1 max-h-36 overflow-y-auto pr-0.5">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => onSelectTag(selectedTag === t ? null : t)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-all ${
                    selectedTag === t
                      ? 'bg-[#0078d4] dark:bg-[#60cdff] text-white dark:text-neutral-950 font-semibold shadow-sm ring-1 ring-blue-400'
                      : 'bg-white/80 dark:bg-[#2c2c2c]/80 text-neutral-600 dark:text-neutral-400 border border-black/[0.06] dark:border-white/[0.07] hover:border-black/[0.15]'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-black/[0.06] dark:border-white/[0.08] text-[10px] text-neutral-400 dark:text-neutral-500 flex items-center justify-between">
        <span>DocuFlow v2.4</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Offline Ready
        </span>
      </div>
    </aside>
  );
};
