import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  ExternalLink,
  Calendar,
  Clock,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { FileItem } from '../../types';
import { FileIcon } from '../../utils/fileIcons';
import { formatDate, formatTimeAgo } from '../../utils/formatters';

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  allFiles: FileItem[];
  onSelectFile: (file: FileItem) => void;
  onOpenExternal: (file: FileItem) => void;
  onRevealInFolder: (file: FileItem) => void;
}

type DateFilterOption = 'all' | 'today' | '7days' | '30days' | '90days' | 'year';

export const SearchPalette: React.FC<SearchPaletteProps> = ({
  isOpen,
  onClose,
  allFiles,
  onSelectFile,
  onOpenExternal,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'office' | 'script' | 'document' | 'data' | 'media'>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Flatten files for search (files only, not folder directories)
  const flattenedFiles = useMemo(() => {
    const list: FileItem[] = [];
    const recurse = (items: FileItem[]) => {
      for (const item of items) {
        if (!item.isDirectory) list.push(item);
        if (item.children) recurse(item.children);
      }
    };
    recurse(allFiles);
    return list;
  }, [allFiles]);

  // Filter matching results by query, category, and modified date
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = Date.now();

    return flattenedFiles.filter((item) => {
      // Category filter
      if (filterType !== 'all') {
        if (filterType === 'office') {
          const isOffice = [
            '.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt',
            '.mpp', '.mpt', '.pub', '.vsdx', '.vsd', '.accdb',
            '.mdb', '.one', '.csv'
          ].some((ext) => item.name.toLowerCase().endsWith(ext));
          if (!isOffice) return false;
        } else if (filterType === 'media') {
          const isMedia = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.svg', '.ai', '.mp4', '.mkv', '.avi', '.mov', '.wmv', '.mp3', '.wav', '.flac', '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.iso'].some((ext) => item.name.toLowerCase().endsWith(ext));
          if (!isMedia && item.category !== 'image' && item.category !== 'video' && item.category !== 'audio' && item.category !== 'archive') {
            return false;
          }
        } else if (item.category !== filterType) {
          return false;
        }
      }

      // Date Filter
      if (dateFilter !== 'all') {
        const itemDate = item.mtime || item.birthtime || 0;
        const diffMs = now - itemDate;
        const oneDay = 24 * 60 * 60 * 1000;

        if (dateFilter === 'today' && diffMs > oneDay) return false;
        if (dateFilter === '7days' && diffMs > 7 * oneDay) return false;
        if (dateFilter === '30days' && diffMs > 30 * oneDay) return false;
        if (dateFilter === '90days' && diffMs > 90 * oneDay) return false;
        if (dateFilter === 'year' && diffMs > 365 * oneDay) return false;
      }

      if (!q) return true;

      // Check text search including date formats (e.g. 2026-08, Aug 16)
      const nameMatch = item.name.toLowerCase().includes(q);
      const pathMatch = item.relativePath.toLowerCase().includes(q);
      const tagMatch = item.tags?.some((t) => t.toLowerCase().includes(q));
      const descMatch = item.description?.toLowerCase().includes(q);
      const notesMatch = item.notes?.toLowerCase().includes(q);
      const formattedDate = formatDate(item.mtime).toLowerCase();
      const dateMatch = formattedDate.includes(q);

      return nameMatch || pathMatch || tagMatch || descMatch || notesMatch || dateMatch;
    }).slice(0, 30);
  }, [flattenedFiles, query, filterType, dateFilter]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIdx(0);
    } else {
      setQuery('');
      setDateFilter('all');
      setFilterType('all');
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIdx(0);
    itemRefs.current = [];
  }, [query, filterType, dateFilter]);

  // Scroll active item into view during arrow navigation
  useEffect(() => {
    if (itemRefs.current[selectedIdx]) {
      itemRefs.current[selectedIdx]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIdx]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIdx]) {
        onSelectFile(results[selectedIdx]);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  const dateFilterLabels: Record<DateFilterOption, string> = {
    all: 'Any Time',
    today: 'Today',
    '7days': 'Last 7 Days',
    '30days': 'Last 30 Days',
    '90days': 'Last 90 Days',
    year: 'This Year',
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 fluent-acrylic z-50 flex items-start justify-center pt-16 px-4 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white/95 dark:bg-[#2c2c2c]/95 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fluent-in flex flex-col max-h-[82vh] transition-colors fluent-acrylic cursor-default"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Input */}
        <div className="p-3.5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center gap-3 shrink-0">
          <Search size={16} className="text-[#0078d4] dark:text-[#60cdff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search documents, scripts, tags, paths, or modified dates (e.g. 'Aug 16', 'ps1', 'word')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-xs focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-0.5 text-[10.5px] font-mono text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 border border-black/[0.08] dark:border-white/[0.1] rounded-md"
          >
            Esc
          </button>
        </div>

        {/* Filter Chips & Date Filter Row */}
        <div className="px-3.5 py-2 border-b border-black/[0.04] dark:border-white/[0.06] bg-neutral-50/70 dark:bg-[#242424]/70 flex flex-wrap items-center justify-between gap-2 shrink-0 select-none">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mr-1">
              Type:
            </span>
            {(
              [
                { id: 'all', label: 'All Files' },
                { id: 'office', label: 'Office' },
                { id: 'script', label: 'Scripts' },
                { id: 'document', label: 'Docs' },
                { id: 'data', label: 'Data' },
                { id: 'media', label: 'Media' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`text-[10.5px] px-2.5 py-0.5 rounded-full transition-colors ${
                  filterType === f.id
                    ? 'bg-[#0078d4] text-white dark:bg-[#60cdff] dark:text-neutral-950 font-semibold shadow-sm'
                    : 'bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Modified Date Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className={`flex items-center gap-1.5 text-[10.5px] px-2.5 py-0.5 rounded-md border transition-colors ${
                dateFilter !== 'all'
                  ? 'bg-[#0078d4]/10 dark:bg-[#60cdff]/15 border-[#0078d4]/30 text-[#0067c0] dark:text-[#60cdff] font-semibold'
                  : 'bg-black/[0.04] dark:bg-white/[0.06] border-black/[0.06] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Calendar size={11} className="text-[#0078d4] dark:text-[#60cdff]" />
              <span>{dateFilterLabels[dateFilter]}</span>
              <ChevronDown size={10} />
            </button>

            {showDateDropdown && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white/95 dark:bg-[#2c2c2c]/95 border border-black/[0.08] dark:border-white/[0.1] rounded-xl shadow-xl py-1 z-50 animate-fluent-in fluent-acrylic">
                <div className="px-3 py-1 text-[9.5px] font-bold text-neutral-400 uppercase tracking-wider">
                  Filter by Modified Date
                </div>
                {(
                  [
                    'all',
                    'today',
                    '7days',
                    '30days',
                    '90days',
                    'year',
                  ] as DateFilterOption[]
                ).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setDateFilter(opt);
                      setShowDateDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                      dateFilter === opt
                        ? 'bg-[#0078d4]/10 dark:bg-[#60cdff]/15 text-[#0067c0] dark:text-[#60cdff] font-semibold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>{dateFilterLabels[opt]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results List */}
        <div ref={listContainerRef} className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {results.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs">
              No matching files found. Try adjusting your query or date filter.
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIdx;
              return (
                <div
                  key={item.path}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  onClick={() => {
                    onSelectFile(item);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIdx(idx)}
                  className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#0078d4]/10 dark:bg-[#60cdff]/15 text-neutral-900 dark:text-neutral-100 border border-[#0078d4]/30 dark:border-[#60cdff]/30'
                      : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04] text-neutral-700 dark:text-neutral-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <FileIcon name={item.name} size={17} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs truncate">{item.name}</span>
                        {item.status && (
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-black/[0.04] dark:bg-white/[0.06] text-neutral-500 font-mono">
                            {item.status}
                          </span>
                        )}
                      </div>
                      <div className="text-[10.5px] text-neutral-400 dark:text-neutral-500 font-mono truncate mt-0.5">
                        {item.relativePath}
                      </div>
                    </div>
                  </div>

                  {/* Modified Date & Tags and Actions */}
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <div className="flex items-center gap-1 text-[10.5px] text-neutral-500 dark:text-neutral-400">
                      <Clock size={11} className="text-neutral-400" />
                      <span>{formatTimeAgo(item.mtime)}</span>
                    </div>

                    {item.tags && item.tags.slice(0, 1).map((t) => (
                      <span
                        key={t}
                        className="text-[9.5px] bg-black/[0.04] dark:bg-white/[0.06] text-[#0067c0] dark:text-[#60cdff] px-1.5 py-0.5 rounded font-mono"
                      >
                        #{t}
                      </span>
                    ))}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenExternal(item);
                        onClose();
                      }}
                      className="p-1 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] rounded-lg text-neutral-400 hover:text-[#0078d4] dark:hover:text-[#60cdff] transition-colors"
                      title="Open in Default Application"
                    >
                      <ExternalLink size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-2.5 border-t border-black/[0.06] dark:border-white/[0.08] bg-neutral-50/80 dark:bg-[#242424]/80 flex items-center justify-between text-[10.5px] text-neutral-500 dark:text-neutral-400 shrink-0 select-none">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="bg-neutral-200 dark:bg-[#383838] px-1 py-0.5 rounded text-neutral-700 dark:text-neutral-300">↑</kbd>{' '}
              <kbd className="bg-neutral-200 dark:bg-[#383838] px-1 py-0.5 rounded text-neutral-700 dark:text-neutral-300">↓</kbd> navigate
            </span>
            <span>
              <kbd className="bg-neutral-200 dark:bg-[#383838] px-1.5 py-0.5 rounded text-neutral-700 dark:text-neutral-300">Enter</kbd> open
            </span>
            <span>
              <kbd className="bg-neutral-200 dark:bg-[#383838] px-1.5 py-0.5 rounded text-neutral-700 dark:text-neutral-300">Esc</kbd> dismiss
            </span>
          </div>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
};
