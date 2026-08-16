import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import { Eye, Edit3, List, BookOpen } from 'lucide-react';
import { MonacoEditorViewer } from './MonacoEditorViewer';

interface MarkdownViewerProps {
  content: string;
  filePath: string;
  onSave?: (newContent: string) => Promise<boolean>;
  darkMode?: boolean;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  content,
  filePath,
  onSave,
  darkMode = true,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');
  const [showToc, setShowToc] = useState(true);

  // Extract Table of Contents headings
  const toc = useMemo(() => {
    const lines = content.split('\n');
    const items: { level: number; text: string; id: string }[] = [];
    lines.forEach((line) => {
      const match = line.match(/^(#{1,4})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        items.push({ level, text, id });
      }
    });
    return items;
  }, [content]);

  // Render markdown HTML
  const renderedHtml = useMemo(() => {
    try {
      return marked.parse(content, { gfm: true, breaks: true }) as string;
    } catch (e: any) {
      return `<p>Error rendering markdown: ${e.message}</p>`;
    }
  }, [content]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#202020] transition-colors">
      {/* Markdown Sub-Header Toolbar */}
      <div className="h-9 border-b border-black/[0.06] dark:border-white/[0.08] bg-neutral-50/90 dark:bg-[#252525]/90 px-3.5 flex items-center justify-between text-xs shrink-0 select-none transition-colors">
        <div className="flex items-center gap-2">
          <div className="flex bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-lg border border-black/[0.05] dark:border-white/[0.06]">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeTab === 'preview'
                  ? 'bg-[#0078d4] text-white dark:bg-[#60cdff] dark:text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Eye size={12} /> Preview
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeTab === 'edit'
                  ? 'bg-[#0078d4] text-white dark:bg-[#60cdff] dark:text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Edit3 size={12} /> Source
            </button>
          </div>

          {activeTab === 'preview' && toc.length > 0 && (
            <button
              onClick={() => setShowToc(!showToc)}
              className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                showToc
                  ? 'bg-[#0078d4]/10 dark:bg-[#60cdff]/15 border-[#0078d4]/30 text-[#0067c0] dark:text-[#60cdff] font-semibold'
                  : 'border-black/[0.06] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
              }`}
            >
              <List size={12} /> Outline ({toc.length})
            </button>
          )}
        </div>

        <div className="text-[10.5px] text-neutral-400 dark:text-neutral-500 font-mono">
          Markdown Guide
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'edit' ? (
          <div className="flex-1 h-full">
            <MonacoEditorViewer
              content={content}
              extension=".md"
              filePath={filePath}
              onSave={onSave}
              darkMode={darkMode}
            />
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Outline / Table of Contents */}
            {showToc && toc.length > 0 && (
              <div className="w-56 border-r border-black/[0.06] dark:border-white/[0.08] bg-neutral-50/70 dark:bg-[#242424]/70 p-3 overflow-y-auto shrink-0 select-none text-xs transition-colors">
                <div className="text-[9.5px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <BookOpen size={11} /> Table of Contents
                </div>
                <div className="space-y-0.5">
                  {toc.map((item, idx) => (
                    <a
                      key={idx}
                      href={`#${item.id}`}
                      style={{ paddingLeft: `${(item.level - 1) * 9 + 4}px` }}
                      className="block truncate py-1 text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-[#0078d4] dark:hover:text-[#60cdff] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-md transition-colors"
                    >
                      {item.text}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Rendered HTML */}
            <div className="flex-1 p-7 overflow-y-auto">
              <div
                className="w-full max-w-5xl mx-auto markdown-body"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
