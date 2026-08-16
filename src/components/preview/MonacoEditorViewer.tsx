import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Save, Check, Copy, RefreshCw } from 'lucide-react';
import { getLanguageFromExt } from '../../utils/formatters';

interface MonacoEditorViewerProps {
  content: string;
  extension: string;
  filePath: string;
  onSave?: (newContent: string) => Promise<boolean>;
  readOnly?: boolean;
  darkMode?: boolean;
}

export const MonacoEditorViewer: React.FC<MonacoEditorViewerProps> = ({
  content,
  extension,
  filePath,
  onSave,
  readOnly = false,
  darkMode = true,
}) => {
  const [currentValue, setCurrentValue] = useState(content);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentValue(content);
    setIsDirty(false);
  }, [content, filePath]);

  const language = getLanguageFromExt(extension);

  const handleSave = async () => {
    if (!onSave || !isDirty || saving) return;
    setSaving(true);
    const ok = await onSave(currentValue);
    if (ok) {
      setIsDirty(false);
    }
    setSaving(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentValue, isDirty]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#1e1e1e] transition-colors">
      {/* Editor Sub-Header Toolbar */}
      <div className="h-9 border-b border-black/[0.06] dark:border-white/[0.08] bg-neutral-50/90 dark:bg-[#252525]/90 px-3.5 flex items-center justify-between text-xs shrink-0 select-none transition-colors">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10.5px] text-[#0067c0] dark:text-[#60cdff] font-semibold uppercase bg-[#0078d4]/10 dark:bg-[#60cdff]/15 px-2 py-0.5 rounded-md border border-[#0078d4]/20">
            {language}
          </span>
          {isDirty && (
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] px-2.5 py-1 rounded-lg transition-colors shadow-sm"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy All'}</span>
          </button>

          {onSave && !readOnly && (
            <button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className={`flex items-center gap-1 text-[11px] px-3 py-1 rounded-lg font-semibold transition-all ${
                isDirty
                  ? 'bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 shadow-sm'
                  : 'bg-black/[0.04] dark:bg-white/[0.04] text-neutral-400 dark:text-neutral-600 cursor-not-allowed border border-transparent'
              }`}
            >
              {saving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Monaco Code Editor Canvas */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={currentValue}
          theme={darkMode ? 'vs-dark' : 'light'}
          onChange={(val) => {
            setCurrentValue(val || '');
            setIsDirty(true);
          }}
          options={{
            readOnly,
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "'Cascadia Code', 'JetBrains Mono', 'Fira Code', Consolas, monospace",
            minimap: { enabled: true, scale: 0.8 },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            renderLineHighlight: 'all',
            padding: { top: 12, bottom: 12 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
          }}
        />
      </div>
    </div>
  );
};
