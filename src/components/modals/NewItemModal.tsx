import React, { useState } from 'react';
import {
  FilePlus,
  FolderPlus,
  X,
  Terminal,
  Code2,
  Database,
  BookOpen,
  FileSpreadsheet,
  FileCode,
  File,
  Check,
} from 'lucide-react';

interface TemplateOption {
  id: string;
  name: string;
  ext: string;
  icon: React.ReactNode;
  description: string;
  templateContent: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'ps1',
    name: 'PowerShell Script',
    ext: '.ps1',
    icon: <Terminal size={15} className="text-blue-500" />,
    description: 'PowerShell automation script template',
    templateContent: `# ============================================================
# Script: Automation & Operations Script
# Created: ${new Date().toISOString().split('T')[0]}
# ============================================================

param (
    [string]$TargetServer = "PROD-APP-01",
    [string]$Environment = "Production"
)

Write-Host "Executing operations script against $TargetServer ($Environment)..." -ForegroundColor Cyan
`,
  },
  {
    id: 'py',
    name: 'Python Automation',
    ext: '.py',
    icon: <Code2 size={15} className="text-amber-500" />,
    description: 'Python script for data processing or tools',
    templateContent: `"""
Module: Data & Automation Pipeline
Created: ${new Date().toISOString().split('T')[0]}
"""

import sys
import os

def main():
    print("DocuFlow script initialized successfully.")

if __name__ == "__main__":
    main()
`,
  },
  {
    id: 'sql',
    name: 'SQL Release Script',
    ext: '.sql',
    icon: <Database size={15} className="text-orange-500" />,
    description: 'Transactional database migration script',
    templateContent: `-- DocuFlow SQL Release Script
-- Target Database: APP_CORE
-- Created: ${new Date().toISOString().split('T')[0]}

BEGIN TRANSACTION;

-- Place your DDL / DML commands here
-- Example:
-- UPDATE SystemSettings SET ConfigValue = 'ACTIVE' WHERE SettingKey = 'FEATURE_FLAG';

COMMIT TRANSACTION;
PRINT 'Migration completed successfully.';
`,
  },
  {
    id: 'md',
    name: 'Markdown Work Guide',
    ext: '.md',
    icon: <BookOpen size={15} className="text-cyan-500" />,
    description: 'Standard operating procedure or documentation',
    templateContent: `# Document Title: SOP & Implementation Guide

## 1. Overview
Describe the purpose of this work document here.

## 2. Requirements & Checklist
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Review by Operations Lead

## 3. Deployment Steps
1. Execute pre-flight verification script.
2. Run database migration script.
3. Validate services health check.
`,
  },
  {
    id: 'csv',
    name: 'CSV Data Sheet',
    ext: '.csv',
    icon: <FileSpreadsheet size={15} className="text-emerald-500" />,
    description: 'Tabular comma-separated data matrix',
    templateContent: `Id,Name,Category,Status,Owner,LastModified
DOC-001,Service Migration Plan,Architecture,Approved,OpsLead,${new Date().toISOString().split('T')[0]}
DOC-002,Database Index Tuning,Database,Review,DBAdmin,${new Date().toISOString().split('T')[0]}
`,
  },
  {
    id: 'json',
    name: 'JSON Config File',
    ext: '.json',
    icon: <FileCode size={15} className="text-purple-500" />,
    description: 'Application environment configuration file',
    templateContent: `{
  "application": "DocuFlow System",
  "environment": "production",
  "version": "1.0.0",
  "settings": {
    "enableAsyncLogging": true,
    "maxConcurrency": 10,
    "timeoutSeconds": 30
  }
}
`,
  },
  {
    id: 'txt',
    name: 'Blank Text File',
    ext: '.txt',
    icon: <File size={15} className="text-neutral-400" />,
    description: 'Standard plaintext scratchpad or notes',
    templateContent: `DocuFlow DMS Scratchpad
Created: ${new Date().toLocaleString()}
--------------------------------------------------
`,
  },
];

interface NewItemModalProps {
  type: 'file' | 'folder';
  targetDir: string;
  isOpen: boolean;
  onClose: () => void;
  onCreateFile: (dirPath: string, fileName: string, content?: string) => Promise<boolean>;
  onCreateFolder: (dirPath: string, folderName: string) => Promise<boolean>;
}

export const NewItemModal: React.FC<NewItemModalProps> = ({
  type,
  targetDir,
  isOpen,
  onClose,
  onCreateFile,
  onCreateFolder,
}) => {
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption>(TEMPLATES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) {
      setError('Please provide a valid name.');
      return;
    }
    if (/[\\/:*?"<>|]/.test(clean)) {
      setError('A name cannot contain any of the following characters: \\ / : * ? " < > |');
      return;
    }

    setSubmitting(true);
    let ok = false;
    if (type === 'folder') {
      ok = await onCreateFolder(targetDir, clean);
    } else {
      let finalName = clean;
      if (!finalName.includes('.')) {
        finalName += selectedTemplate.ext;
      }
      ok = await onCreateFile(targetDir, finalName, selectedTemplate.templateContent);
    }
    setSubmitting(false);

    if (ok) {
      setName('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 fluent-acrylic z-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white/95 dark:bg-[#2c2c2c]/95 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fluent-in text-xs transition-colors fluent-acrylic cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-1.5 rounded-xl border ${
                type === 'folder'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-[#0078d4]/10 dark:bg-[#60cdff]/15 text-[#0067c0] dark:text-[#60cdff] border-[#0078d4]/20'
              }`}
            >
              {type === 'folder' ? <FolderPlus size={15} /> : <FilePlus size={15} />}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                {type === 'folder' ? 'Create New Folder' : 'Create New Document or Script'}
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono truncate max-w-xs">
                In: {targetDir.split(/[\\/]/).pop() || targetDir}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Template Selection (for files) */}
          {type === 'file' && (
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1.5">
                Choose Template:
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                {TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplate.id === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => {
                        setSelectedTemplate(tmpl);
                        if (!name || TEMPLATES.some((t) => name === `new_${t.id}${t.ext}`)) {
                          setName(`new_${tmpl.id}${tmpl.ext}`);
                        }
                      }}
                      className={`p-2 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                        isSelected
                          ? 'bg-[#0078d4]/10 dark:bg-[#60cdff]/15 border-[#0078d4]/30 dark:border-[#60cdff]/30 text-neutral-900 dark:text-neutral-100 shadow-sm'
                          : 'bg-neutral-50 dark:bg-[#202020] border-black/[0.06] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-[#343434] hover:text-neutral-900 dark:hover:text-neutral-200'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">{tmpl.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-xs truncate flex items-center justify-between">
                          <span>{tmpl.name}</span>
                          {isSelected && <Check size={12} className="text-[#0078d4] dark:text-[#60cdff]" />}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate mt-0.5">{tmpl.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Name input */}
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              {type === 'folder' ? 'Folder Name:' : 'File Name:'}
            </label>
            <input
              type="text"
              autoFocus
              placeholder={type === 'folder' ? 'e.g. Deployment Guides' : 'e.g. server_audit.ps1'}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className="w-full bg-white dark:bg-[#202020] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:border-[#0078d4] dark:focus:border-[#60cdff] text-xs font-medium"
            />
          </div>

          {error && (
            <div className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-lg border border-rose-200 dark:border-rose-800/40 text-[11px]">
              {error}
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
              className="px-4 py-1.5 bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating...' : `Create ${type === 'folder' ? 'Folder' : 'File'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
