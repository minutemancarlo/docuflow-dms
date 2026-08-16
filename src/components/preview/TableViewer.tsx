import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { Search, Download, Table as TableIcon, Code, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { MonacoEditorViewer } from './MonacoEditorViewer';

interface TableViewerProps {
  content: string;
  extension: string;
  filePath: string;
  onSave?: (newContent: string) => Promise<boolean>;
  darkMode?: boolean;
}

export const TableViewer: React.FC<TableViewerProps> = ({
  content,
  extension,
  filePath,
  onSave,
  darkMode = true,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'raw'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Parse CSV or JSON data
  const { headers, rows } = useMemo(() => {
    try {
      if (extension === '.json') {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
          const keys = Object.keys(parsed[0]);
          const dataRows = parsed.map((item) => keys.map((k) => String(item[k] ?? '')));
          return { headers: keys, rows: dataRows };
        }
      }

      const results = Papa.parse(content, { skipEmptyLines: true });
      if (results.data && results.data.length > 0) {
        const head = (results.data[0] as string[]) || [];
        const body = (results.data.slice(1) as string[][]) || [];
        return { headers: head, rows: body };
      }
    } catch (e) {
      console.error('Failed to parse table data:', e);
    }
    return { headers: [], rows: [] };
  }, [content, extension]);

  // Filter and Sort rows
  const filteredRows = useMemo(() => {
    let result = rows;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) =>
        row.some((cell) => String(cell).toLowerCase().includes(q))
      );
    }

    if (sortCol !== null) {
      result = [...result].sort((a, b) => {
        const valA = a[sortCol] || '';
        const valB = b[sortCol] || '';
        const numA = Number(valA);
        const numB = Number(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortAsc ? numA - numB : numB - numA;
        }
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }

    return result;
  }, [rows, searchQuery, sortCol, sortAsc]);

  const handleHeaderClick = (colIdx: number) => {
    if (sortCol === colIdx) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(colIdx);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse({ fields: headers, data: filteredRows });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export_' + Date.now() + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#202020] transition-colors">
      {/* Sub-Header Toolbar */}
      <div className="h-9 border-b border-black/[0.06] dark:border-white/[0.08] bg-neutral-50/90 dark:bg-[#252525]/90 px-3.5 flex items-center justify-between text-xs shrink-0 select-none transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="flex bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-lg border border-black/[0.05] dark:border-white/[0.06]">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#0078d4] text-white dark:bg-[#60cdff] dark:text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <TableIcon size={12} /> Data Grid
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                viewMode === 'raw'
                  ? 'bg-[#0078d4] text-white dark:bg-[#60cdff] dark:text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Code size={12} /> Raw Code
            </button>
          </div>

          {viewMode === 'grid' && (
            <div className="relative w-44">
              <Search size={12} className="absolute left-2.5 top-2 text-neutral-400" />
              <input
                type="text"
                placeholder="Filter table rows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#202020] border border-black/[0.08] dark:border-white/[0.1] rounded-lg pl-7 pr-2.5 py-1 text-xs text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-[#0078d4] dark:focus:border-[#60cdff]"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[10.5px] text-neutral-500 dark:text-neutral-400 font-mono">
            {filteredRows.length} rows • {headers.length} cols
          </span>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-[11px] text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] px-2.5 py-1 rounded-lg transition-colors shadow-sm"
          >
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>

      {/* Main Table Grid / Raw Viewer */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'raw' ? (
          <MonacoEditorViewer
            content={content}
            extension={extension}
            filePath={filePath}
            onSave={onSave}
            darkMode={darkMode}
          />
        ) : headers.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-400 text-xs">
            No tabular data found or invalid structure.
          </div>
        ) : (
          <div className="min-w-full inline-block align-middle">
            <table className="min-w-full divide-y divide-black/[0.06] dark:divide-white/[0.08] text-xs">
              <thead className="bg-neutral-100/90 dark:bg-[#282828] sticky top-0 z-10 select-none">
                <tr>
                  <th className="w-10 px-3 py-2 text-left text-[10.5px] font-semibold text-neutral-500 dark:text-neutral-400 border-r border-black/[0.06] dark:border-white/[0.08]">
                    #
                  </th>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      onClick={() => handleHeaderClick(i)}
                      className="px-3 py-2 text-left text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 border-r border-black/[0.06] dark:border-white/[0.08] cursor-pointer hover:bg-neutral-200 dark:hover:bg-[#343434] select-none group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{h}</span>
                        {sortCol === i ? (
                          sortAsc ? <ChevronUp size={12} className="text-[#0078d4] dark:text-[#60cdff]" /> : <ChevronDown size={12} className="text-[#0078d4] dark:text-[#60cdff]" />
                        ) : (
                          <ArrowUpDown size={11} className="text-neutral-400 opacity-0 group-hover:opacity-100" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05] bg-white dark:bg-[#202020] font-mono text-[11px]">
                {filteredRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                    <td className="px-3 py-1.5 text-neutral-400 text-[10px] border-r border-black/[0.04] dark:border-white/[0.05] bg-neutral-50/50 dark:bg-[#242424]/50">
                      {rIdx + 1}
                    </td>
                    {headers.map((_, cIdx) => (
                      <td
                        key={cIdx}
                        className="px-3 py-1.5 text-neutral-800 dark:text-neutral-300 border-r border-black/[0.04] dark:border-white/[0.05] whitespace-nowrap"
                      >
                        {row[cIdx] !== undefined ? String(row[cIdx]) : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
