import { ElectronAPI, FileItem, FileMetadata, SearchResult, Workspace } from '../types';

// Mock workspace data for web browser preview mode fallback
const mockWorkspaces: Workspace[] = [
  {
    id: 'mock-ws-1',
    name: 'My Work Library',
    path: 'C:/Work/Documents/DocuFlow Workspace',
    description: 'Primary corporate document vault & scripts repository',
    iconType: 'builtin',
    iconValue: 'briefcase',
    isDefault: true,
    color: '#0284c7',
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'mock-ws-2',
    name: 'AXIS Staging & Releases',
    path: 'C:/Work/Projects/AXIS_Patch_2026',
    description: 'Deployment scripts, SOP manuals, and release verification assets',
    iconType: 'builtin',
    iconValue: 'rocket',
    isDefault: false,
    color: '#10b981',
    createdAt: Date.now() - 86400000 * 10,
  },
];

let mockFiles: FileItem[] = [
  {
    id: 'f0',
    name: 'Microsoft Office & Projects',
    path: 'C:/Work/Documents/DocuFlow Workspace/Microsoft Office & Projects',
    relativePath: 'Microsoft Office & Projects',
    extension: '',
    isDirectory: true,
    size: 0,
    mtime: Date.now() - 1800000,
    birthtime: Date.now() - 86400000,
    category: 'other',
    children: [
      {
        id: 'f0-1',
        name: 'Q3_Enterprise_Migration_Plan.mpp',
        path: 'C:/Work/Documents/DocuFlow Workspace/Microsoft Office & Projects/Q3_Enterprise_Migration_Plan.mpp',
        relativePath: 'Microsoft Office & Projects/Q3_Enterprise_Migration_Plan.mpp',
        extension: '.mpp',
        isDirectory: false,
        size: 324000,
        mtime: Date.now() - 1200000,
        birthtime: Date.now() - 86400000,
        category: 'office',
        officeType: 'project',
        tags: ['project-mgmt', 'gantt', 'q3-roadmap'],
        status: 'approved',
        pinned: true,
        description: 'Comprehensive Microsoft Project gantt chart and resource allocation plan.',
      },
      {
        id: 'f0-2',
        name: 'Company_Product_Catalog.pub',
        path: 'C:/Work/Documents/DocuFlow Workspace/Microsoft Office & Projects/Company_Product_Catalog.pub',
        relativePath: 'Microsoft Office & Projects/Company_Product_Catalog.pub',
        extension: '.pub',
        isDirectory: false,
        size: 512000,
        mtime: Date.now() - 5400000,
        birthtime: Date.now() - 86400000,
        category: 'office',
        officeType: 'publisher',
        tags: ['marketing', 'print', 'publisher'],
        status: 'review',
        pinned: false,
        description: 'Print-ready Microsoft Publisher product catalog layout.',
      },
      {
        id: 'f0-3',
        name: 'Architecture_Strategy_2026.pptx',
        path: 'C:/Work/Documents/DocuFlow Workspace/Microsoft Office & Projects/Architecture_Strategy_2026.pptx',
        relativePath: 'Microsoft Office & Projects/Architecture_Strategy_2026.pptx',
        extension: '.pptx',
        isDirectory: false,
        size: 1420000,
        mtime: Date.now() - 9000000,
        birthtime: Date.now() - 86400000,
        category: 'office',
        officeType: 'powerpoint',
        tags: ['slides', 'executive', 'architecture'],
        status: 'approved',
        pinned: false,
        description: 'Executive presentation deck for cloud migration.',
      },
      {
        id: 'f0-4',
        name: 'Financial_Projections_Model.xlsx',
        path: 'C:/Work/Documents/DocuFlow Workspace/Microsoft Office & Projects/Financial_Projections_Model.xlsx',
        relativePath: 'Microsoft Office & Projects/Financial_Projections_Model.xlsx',
        extension: '.xlsx',
        isDirectory: false,
        size: 98000,
        mtime: Date.now() - 14400000,
        birthtime: Date.now() - 86400000,
        category: 'office',
        officeType: 'excel',
        tags: ['finance', 'forecast', 'excel'],
        status: 'approved',
        pinned: true,
        description: 'Quarterly financial forecast and cost analysis workbook.',
      },
      {
        id: 'f0-5',
        name: 'Standard_Operating_Agreement.docx',
        path: 'C:/Work/Documents/DocuFlow Workspace/Microsoft Office & Projects/Standard_Operating_Agreement.docx',
        relativePath: 'Microsoft Office & Projects/Standard_Operating_Agreement.docx',
        extension: '.docx',
        isDirectory: false,
        size: 84000,
        mtime: Date.now() - 28800000,
        birthtime: Date.now() - 86400000,
        category: 'office',
        officeType: 'word',
        tags: ['legal', 'ms-word', 'contract'],
        status: 'approved',
        pinned: false,
        description: 'Official corporate SLA and service agreement Word document.',
      },
    ],
  },
  {
    id: 'f0-media',
    name: 'Media & Archives',
    path: 'C:/Work/Documents/DocuFlow Workspace/Media & Archives',
    relativePath: 'Media & Archives',
    extension: '',
    isDirectory: true,
    size: 0,
    mtime: Date.now() - 2000000,
    birthtime: Date.now() - 86400000,
    category: 'other',
    children: [
      {
        id: 'f0-m1',
        name: 'System_Deployment_Release_v2.4.zip',
        path: 'C:/Work/Documents/DocuFlow Workspace/Media & Archives/System_Deployment_Release_v2.4.zip',
        relativePath: 'Media & Archives/System_Deployment_Release_v2.4.zip',
        extension: '.zip',
        isDirectory: false,
        size: 15400000,
        mtime: Date.now() - 1400000,
        birthtime: Date.now() - 86400000,
        category: 'archive',
        tags: ['release', 'zip', 'build'],
        status: 'approved',
        pinned: true,
        description: 'Compressed production deployment archive bundle.',
      },
      {
        id: 'f0-m2',
        name: 'Architecture_Topology_Blueprint.png',
        path: 'C:/Work/Documents/DocuFlow Workspace/Media & Archives/Architecture_Topology_Blueprint.png',
        relativePath: 'Media & Archives/Architecture_Topology_Blueprint.png',
        extension: '.png',
        isDirectory: false,
        size: 2400000,
        mtime: Date.now() - 3200000,
        birthtime: Date.now() - 86400000,
        category: 'image',
        tags: ['diagram', 'image', 'png'],
        status: 'approved',
        pinned: false,
        description: 'High-resolution system architecture topology diagram.',
      },
      {
        id: 'f0-m3',
        name: 'System_Walkthrough_Demo.mp4',
        path: 'C:/Work/Documents/DocuFlow Workspace/Media & Archives/System_Walkthrough_Demo.mp4',
        relativePath: 'Media & Archives/System_Walkthrough_Demo.mp4',
        extension: '.mp4',
        isDirectory: false,
        size: 48000000,
        mtime: Date.now() - 7200000,
        birthtime: Date.now() - 86400000,
        category: 'video',
        tags: ['demo', 'video', 'walkthrough'],
        status: 'approved',
        pinned: false,
        description: 'Complete feature walkthrough and operational video guide.',
      },
    ],
  },
  {
    id: 'f1',
    name: 'Automations & Scripts',
    path: 'C:/Work/Documents/DocuFlow Workspace/Automations & Scripts',
    relativePath: 'Automations & Scripts',
    extension: '',
    isDirectory: true,
    size: 0,
    mtime: Date.now() - 3600000,
    birthtime: Date.now() - 86400000,
    category: 'other',
    children: [
      {
        id: 'f1-1',
        name: 'health_check_audit.ps1',
        path: 'C:/Work/Documents/DocuFlow Workspace/Automations & Scripts/health_check_audit.ps1',
        relativePath: 'Automations & Scripts/health_check_audit.ps1',
        extension: '.ps1',
        isDirectory: false,
        size: 1420,
        mtime: Date.now() - 1800000,
        birthtime: Date.now() - 86400000,
        category: 'script',
        tags: ['power-shell', 'monitoring', 'prod-ready'],
        status: 'approved',
        pinned: true,
        description: 'Automated health & transaction log inspection for production clusters.',
        notes: 'Run this before any weekly maintenance patch cycle.',
      },
      {
        id: 'f1-2',
        name: 'data_pipeline_sync.py',
        path: 'C:/Work/Documents/DocuFlow Workspace/Automations & Scripts/data_pipeline_sync.py',
        relativePath: 'Automations & Scripts/data_pipeline_sync.py',
        extension: '.py',
        isDirectory: false,
        size: 890,
        mtime: Date.now() - 7200000,
        birthtime: Date.now() - 86400000,
        category: 'script',
        tags: ['python', 'etl', 'sync'],
        status: 'review',
        pinned: false,
        description: 'Syncs batch transaction data and metrics into data lake.',
      },
      {
        id: 'f1-3',
        name: 'patch_2026_08_upgrade.sql',
        path: 'C:/Work/Documents/DocuFlow Workspace/Automations & Scripts/patch_2026_08_upgrade.sql',
        relativePath: 'Automations & Scripts/patch_2026_08_upgrade.sql',
        extension: '.sql',
        isDirectory: false,
        size: 1250,
        mtime: Date.now() - 14400000,
        birthtime: Date.now() - 86400000,
        category: 'script',
        tags: ['sql', 'database', 'patch'],
        status: 'approved',
        pinned: false,
        description: 'SQL migration script for SystemSettings and AuditLog indexes.',
      },
    ],
  },
  {
    id: 'f2',
    name: 'Work Documents & Guides',
    path: 'C:/Work/Documents/DocuFlow Workspace/Work Documents & Guides',
    relativePath: 'Work Documents & Guides',
    extension: '',
    isDirectory: true,
    size: 0,
    mtime: Date.now() - 3600000,
    birthtime: Date.now() - 86400000,
    category: 'other',
    children: [
      {
        id: 'f2-1',
        name: 'Deployment_SOP_Guide.md',
        path: 'C:/Work/Documents/DocuFlow Workspace/Work Documents & Guides/Deployment_SOP_Guide.md',
        relativePath: 'Work Documents & Guides/Deployment_SOP_Guide.md',
        extension: '.md',
        isDirectory: false,
        size: 2150,
        mtime: Date.now() - 2500000,
        birthtime: Date.now() - 86400000,
        category: 'document',
        tags: ['sop', 'runbook', 'devops'],
        status: 'approved',
        pinned: true,
        description: 'Standard operating procedure for patch deployment and rollbacks.',
        notes: 'Signed off by Lead Operations Architect on 2026-08-10.',
      },
      {
        id: 'f2-2',
        name: 'Axis_Release_Notes_Q3.docx',
        path: 'C:/Work/Documents/DocuFlow Workspace/Work Documents & Guides/Axis_Release_Notes_Q3.docx',
        relativePath: 'Work Documents & Guides/Axis_Release_Notes_Q3.docx',
        extension: '.docx',
        isDirectory: false,
        size: 48900,
        mtime: Date.now() - 86400000,
        birthtime: Date.now() - 172800000,
        category: 'document',
        tags: ['word', 'release-notes', 'audit'],
        status: 'approved',
        pinned: false,
        description: 'Official formatted Word doc for Q3 Axis release notes.',
      },
    ],
  },
  {
    id: 'f3',
    name: 'Data & Configs',
    path: 'C:/Work/Documents/DocuFlow Workspace/Data & Configs',
    relativePath: 'Data & Configs',
    extension: '',
    isDirectory: true,
    size: 0,
    mtime: Date.now() - 3600000,
    birthtime: Date.now() - 86400000,
    category: 'other',
    children: [
      {
        id: 'f3-1',
        name: 'production_services_inventory.csv',
        path: 'C:/Work/Documents/DocuFlow Workspace/Data & Configs/production_services_inventory.csv',
        relativePath: 'Data & Configs/production_services_inventory.csv',
        extension: '.csv',
        isDirectory: false,
        size: 780,
        mtime: Date.now() - 1200000,
        birthtime: Date.now() - 86400000,
        category: 'data',
        tags: ['inventory', 'servers', 'csv'],
        status: 'draft',
        pinned: false,
        description: 'Live host inventory, ports, and uptime SLA percentages.',
      },
      {
        id: 'f3-2',
        name: 'appsettings.production.json',
        path: 'C:/Work/Documents/DocuFlow Workspace/Data & Configs/appsettings.production.json',
        relativePath: 'Data & Configs/appsettings.production.json',
        extension: '.json',
        isDirectory: false,
        size: 540,
        mtime: Date.now() - 4000000,
        birthtime: Date.now() - 86400000,
        category: 'data',
        tags: ['config', 'production'],
        status: 'approved',
        pinned: false,
        description: 'Production cluster connection flags and timeout thresholds.',
      },
    ],
  },
];

const mockContents: Record<string, string> = {
  'health_check_audit.ps1': `Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  DocuFlow Automation: Health & Backup Check" -ForegroundColor White
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Connecting to Server: SQL-PROD-CLUSTER01" -ForegroundColor Yellow
Write-Host "Status: ALL SYSTEMS OPERATIONAL - HEALTH INDEX 100%" -ForegroundColor Green
`,
  'data_pipeline_sync.py': `import sys
import time

print("[INFO] Initializing DocuFlow Script Engine...")
print("[INFO] Querying system metrics and active logs...")
print("[SUCCESS] All 50 records processed. Task completed with exit code 0.")
`,
  'patch_2026_08_upgrade.sql': `-- DocuFlow SQL Release Script
-- Patch Version: 2026.08.1
-- Author: Engineering Operations

BEGIN TRANSACTION;

UPDATE SystemSettings
SET ConfigValue = 'ENABLED',
    LastModified = GETDATE(),
    ModifiedBy = 'SYSTEM_DEPLOYER'
WHERE SettingKey IN ('ENABLE_BACKGROUND_EXPORT', 'ASYNC_LOGGING');

COMMIT TRANSACTION;
PRINT 'Patch 2026.08.1 deployed successfully.';
`,
  'Deployment_SOP_Guide.md': `# Standard Operating Procedure: Patch Release & Deployment Guide

## 1. Overview
This document outlines the standard verification and deployment lifecycle for system updates, database patches, and background service releases.

> [!IMPORTANT]
> Always verify database backups before running data definition scripts in staging or production.

## 2. Pre-Deployment Checklist
- [x] Changelog verified against JIRA issues
- [x] Database migration script syntax checked
- [ ] Staging environment smoke tests passed
- [ ] Operations team notified

## 3. Rollback Strategy
In the event of unexpected latency or database deadlock:
1. Stop the worker daemon service: \`systemctl stop worker-daemon\`
2. Run the corresponding \`rollback_patch_vX.sql\` script.
3. Verify connection pools have normalized.
`,
  'production_services_inventory.csv': `ServiceId,ServiceName,HostName,Port,Status,UptimePercentage,LastIncident
SRV-001,Authentication Gateway,auth-node-01.internal,8080,ONLINE,99.98%,2026-07-12
SRV-002,Payment Processing Worker,pay-worker-02.internal,9200,ONLINE,99.95%,2026-06-30
SRV-003,Document Indexer Service,doc-idx-01.internal,5432,ONLINE,100.0%,None
SRV-004,Report Export Queue,export-q-01.internal,6379,ONLINE,99.90%,2026-08-01
SRV-005,Analytics Aggregator,analytics-03.internal,8443,MAINTENANCE,98.50%,2026-08-14
`,
  'appsettings.production.json': `{
  "application": "DocuFlow Enterprise",
  "environment": "production",
  "version": "2.4.0",
  "features": {
    "backgroundExport": true,
    "liveScriptStreaming": true,
    "auditLogging": true,
    "autoSync": true
  },
  "database": {
    "host": "sql-cluster-01.internal",
    "port": 1433,
    "maxConnections": 100,
    "timeoutSeconds": 30
  }
}`,
};

class FallbackAPI implements ElectronAPI {
  async getWorkspaces(): Promise<Workspace[]> {
    return mockWorkspaces;
  }
  async addWorkspace(folderPath?: string): Promise<Workspace | null> {
    const p = folderPath || 'C:/Work/Projects/NewProject_' + (mockWorkspaces.length + 1);
    const ws: Workspace = {
      id: 'ws-' + Date.now(),
      name: p.split(/[\\/]/).pop() || 'New Project',
      path: p,
      description: 'Configured work folder workspace',
      iconType: 'builtin',
      iconValue: 'briefcase',
      color: '#0284c7',
      createdAt: Date.now(),
    };
    mockWorkspaces.push(ws);
    return ws;
  }
  async saveWorkspace(workspace: Workspace): Promise<Workspace> {
    const idx = mockWorkspaces.findIndex((w) => w.id === workspace.id);
    if (idx !== -1) {
      mockWorkspaces[idx] = { ...mockWorkspaces[idx], ...workspace };
    } else {
      mockWorkspaces.push(workspace);
    }
    return workspace;
  }
  async removeWorkspace(id: string): Promise<boolean> {
    const idx = mockWorkspaces.findIndex((w) => w.id === id);
    if (idx !== -1) mockWorkspaces.splice(idx, 1);
    return true;
  }
  async pickIconImage(): Promise<string | null> {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%230284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>';
  }
  async scanDirectory(): Promise<FileItem[]> {
    return mockFiles;
  }
  async readFile(filePath: string): Promise<{ content: string; isBinary: boolean; size: number }> {
    const name = filePath.split(/[\\/]/).pop() || '';
    if (name.endsWith('.docx') || name.endsWith('.pdf') || name.endsWith('.mpp') || name.endsWith('.pub')) {
      return { content: '', isBinary: true, size: 48900 };
    }
    return {
      content: mockContents[name] || '# ' + name + '\n\nFile contents loaded successfully.',
      isBinary: false,
      size: 1024,
    };
  }
  async readMediaDataUrl(filePath: string): Promise<{ dataUrl: string; mimeType: string; size: number }> {
    const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mp3': 'audio/mpeg',
      '.pdf': 'application/pdf',
    };
    const mimeType = mimeMap[ext] || 'application/octet-stream';
    // Sample SVG placeholder for browser demo fallback
    const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="#0f172a"/><circle cx="300" cy="200" r="100" fill="#0078d4" opacity="0.8"/><text x="300" y="205" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">DocuFlow Media Preview</text><text x="300" y="235" fill="#94a3b8" font-family="sans-serif" font-size="13" text-anchor="middle">${filePath}</text></svg>`;
    const dataUrl = `data:image/svg+xml;base64,${btoa(sampleSvg)}`;
    return { dataUrl, mimeType, size: 204800 };
  }
  async writeFile(filePath: string, content: string): Promise<{ success: boolean }> {
    const name = filePath.split(/[\\/]/).pop() || '';
    mockContents[name] = content;
    return { success: true };
  }
  async renameFile(oldPath: string, newName: string): Promise<{ success: boolean; newPath?: string }> {
    const dir = oldPath.substring(0, Math.max(oldPath.lastIndexOf('/'), oldPath.lastIndexOf('\\')));
    const newPath = `${dir}/${newName}`;
    return { success: true, newPath };
  }
  async moveFile(sourcePath: string, targetDir: string): Promise<{ success: boolean; newPath?: string }> {
    const name = sourcePath.split(/[\\/]/).pop() || '';
    const newPath = `${targetDir}/${name}`;
    return { success: true, newPath };
  }
  async deleteFile(): Promise<{ success: boolean }> {
    return { success: true };
  }
  async createFile(dirPath: string, fileName: string, content = ''): Promise<{ success: boolean; newPath?: string }> {
    const newPath = `${dirPath}/${fileName}`;
    mockContents[fileName] = content;
    return { success: true, newPath };
  }
  async createFolder(dirPath: string, folderName: string): Promise<{ success: boolean; newPath?: string }> {
    return { success: true, newPath: `${dirPath}/${folderName}` };
  }
  async duplicateFile(filePath: string): Promise<{ success: boolean; newPath?: string }> {
    return { success: true, newPath: `${filePath}_copy` };
  }
  async openExternal(filePath: string): Promise<{ success: boolean }> {
    alert(`[OS Shell Launch]\nOpening file in its native default application:\n${filePath}`);
    return { success: true };
  }
  async revealInFolder(filePath: string): Promise<{ success: boolean }> {
    alert(`[Windows Explorer]\nRevealing folder path with item selected:\n${filePath}`);
    return { success: true };
  }
  async selectFolderDialog(): Promise<string | null> {
    return 'C:/Work/MyNewFolder';
  }
  async selectFileDialog(): Promise<string | null> {
    return 'C:/Work/SelectedDoc.docx';
  }
  async copyToClipboard(text: string): Promise<boolean> {
    navigator.clipboard.writeText(text);
    return true;
  }
  async getMetadata(filePath: string): Promise<FileMetadata> {
    return {
      path: filePath,
      tags: ['docuflow'],
      status: 'approved',
      pinned: false,
      description: '',
      notes: '',
    };
  }
  async updateMetadata(): Promise<boolean> {
    return true;
  }
  async getAllTags(): Promise<string[]> {
    return ['power-shell', 'monitoring', 'prod-ready', 'python', 'etl', 'sql', 'database', 'sop', 'runbook', 'devops', 'inventory'];
  }
  async searchFiles(): Promise<SearchResult[]> {
    return [];
  }
}

export const api: ElectronAPI = window.electronAPI || new FallbackAPI();
