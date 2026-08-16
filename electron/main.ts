import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import fs from 'fs';
import { dbService } from './services/dbService';
import { fileService } from './services/fileService';
import { osService } from './services/osService';
import { searchService } from './services/searchService';
import { Workspace } from './types';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' && process.env.VITE_DEV === 'true';

function ensureDefaultWorkspace() {
  const existing = dbService.getWorkspaces();
  if (existing.length === 0) {
    const defaultDir = path.join(app.getPath('documents'), 'DocuFlow Workspace');
    if (!fs.existsSync(defaultDir)) {
      fs.mkdirSync(defaultDir, { recursive: true });
      setupSampleFiles(defaultDir);
    }
    const defaultWs: Workspace = {
      id: 'default-workspace',
      name: 'My Work Library',
      path: defaultDir,
      isDefault: true,
      color: '#0284c7',
    };
    dbService.setWorkspaces([defaultWs]);
  }
}

function setupSampleFiles(baseDir: string) {
  try {
    const folders = [
      'Microsoft Office & Projects',
      'Media & Archives',
      'Automations & Scripts',
      'Work Documents & Guides',
      'Data & Configs',
    ];
    for (const f of folders) {
      fs.mkdirSync(path.join(baseDir, f), { recursive: true });
    }

    // Media & Archive Samples
    fs.writeFileSync(path.join(baseDir, 'Media & Archives', 'System_Deployment_Release_v2.4.zip'), 'Mock Zip Archive File', 'utf-8');
    fs.writeFileSync(path.join(baseDir, 'Media & Archives', 'Production_Backup_Archive.7z'), 'Mock 7-Zip Archive File', 'utf-8');
    fs.writeFileSync(path.join(baseDir, 'Media & Archives', 'Architecture_Topology_Blueprint.png'), 'Mock PNG Image File', 'utf-8');
    fs.writeFileSync(path.join(baseDir, 'Media & Archives', 'System_Walkthrough_Demo.mp4'), 'Mock MP4 Video File', 'utf-8');

    // Microsoft Office Suite Samples
    fs.writeFileSync(path.join(baseDir, 'Microsoft Office & Projects', 'Q3_Enterprise_Migration_Plan.mpp'), 'Mock Microsoft Project File', 'utf-8');
    fs.writeFileSync(path.join(baseDir, 'Microsoft Office & Projects', 'Company_Product_Catalog.pub'), 'Mock Microsoft Publisher File', 'utf-8');
    fs.writeFileSync(path.join(baseDir, 'Microsoft Office & Projects', 'Architecture_Strategy_2026.pptx'), 'Mock Microsoft PowerPoint Presentation', 'utf-8');
    fs.writeFileSync(path.join(baseDir, 'Microsoft Office & Projects', 'Financial_Projections_Model.xlsx'), 'Mock Microsoft Excel Workbook', 'utf-8');
    fs.writeFileSync(path.join(baseDir, 'Microsoft Office & Projects', 'Standard_Operating_Agreement.docx'), 'Mock Microsoft Word Document', 'utf-8');
    fs.writeFileSync(path.join(baseDir, 'Microsoft Office & Projects', 'Infrastructure_Topology_Diagram.vsdx'), 'Mock Microsoft Visio Diagram', 'utf-8');

    // 1. Sample PowerShell Script
    const ps1Content = `# @param ServerName [default="SQL-PROD-CLUSTER01"] [type="string"] [desc="Target Database Server"]
# @param Database [default="AXIS_CORE_DB"] [type="string"] [desc="Database to inspect"]
# @param DryRun [default=true] [type="boolean"] [desc="Check status without executing changes"]

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  DocuFlow Automation: Health & Backup Check" -ForegroundColor White
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Connecting to Server: $ServerName" -ForegroundColor Yellow
Write-Host "Inspecting Database: $Database" -ForegroundColor Yellow
Write-Host "Dry Run Mode: $DryRun" -ForegroundColor Gray

Start-Sleep -Milliseconds 800
Write-Host "[1/3] Checking Disk Space & Transaction Logs..." -ForegroundColor Green
Write-Host "      Drive C: 142 GB Free (78%)"
Write-Host "      Drive D: 840 GB Free (65%)"

Start-Sleep -Milliseconds 600
Write-Host "[2/3] Checking Active Connections and Locks..." -ForegroundColor Green
Write-Host "      Active sessions: 18 | Blocked processes: 0"

Start-Sleep -Milliseconds 600
Write-Host "[3/3] Generating audit snapshot report..." -ForegroundColor Green
Write-Host "Status: ALL SYSTEMS OPERATIONAL - HEALTH INDEX 100%" -ForegroundColor Green
`;
    fs.writeFileSync(path.join(baseDir, 'Automations & Scripts', 'health_check_audit.ps1'), ps1Content, 'utf-8');

    // 2. Sample Python Data Script
    const pyContent = `# @param OutputFormat [default="json"] [type="string"] [desc="Output format (json/csv)"]
# @param Limit [default=50] [type="number"] [desc="Max records to retrieve"]
import sys
import time

print("[INFO] Initializing DocuFlow Script Engine...")
print(f"[INFO] Target Format: OutputFormat | Record Limit: 50")
time.sleep(0.5)

print("[INFO] Querying system metrics and active logs...")
for i in range(1, 6):
    time.sleep(0.2)
    print(f"  -> Batch {i}/5 processed successfully (10 records each)")

print("[SUCCESS] All 50 records processed. Task completed with exit code 0.")
`;
    fs.writeFileSync(path.join(baseDir, 'Automations & Scripts', 'data_pipeline_sync.py'), pyContent, 'utf-8');

    // 3. Sample SQL Patch Script
    const sqlContent = `-- DocuFlow SQL Release Script
-- Patch Version: 2026.08.1
-- Author: Engineering Operations

BEGIN TRANSACTION;

-- Step 1: Update configuration flags
UPDATE SystemSettings
SET ConfigValue = 'ENABLED',
    LastModified = GETDATE(),
    ModifiedBy = 'SYSTEM_DEPLOYER'
WHERE SettingKey IN ('ENABLE_BACKGROUND_EXPORT', 'ASYNC_LOGGING');

-- Step 2: Create audit index if missing
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AuditLog_CreatedDate')
BEGIN
    CREATE NONCLUSTERED INDEX IX_AuditLog_CreatedDate
    ON dbo.AuditLogs (CreatedDate DESC)
    INCLUDE (UserId, ActionType, Status);
    PRINT 'Index IX_AuditLog_CreatedDate created successfully.';
END
ELSE
BEGIN
    PRINT 'Index IX_AuditLog_CreatedDate already exists. Skipping.';
END

COMMIT TRANSACTION;
PRINT 'Patch 2026.08.1 deployed successfully.';
`;
    fs.writeFileSync(path.join(baseDir, 'Automations & Scripts', 'patch_2026_08_upgrade.sql'), sqlContent, 'utf-8');

    // 4. Sample Markdown Work Guide
    const mdContent = `# Standard Operating Procedure: Patch Release & Deployment Guide

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

## 4. Key Contacts
| Role | Contact | Escalation |
| :--- | :--- | :--- |
| Release Lead | ops-lead@company.internal | PagerDuty #101 |
| DB Admin | dba-oncall@company.internal | Ext: 4421 |
`;
    fs.writeFileSync(path.join(baseDir, 'Work Documents & Guides', 'Deployment_SOP_Guide.md'), mdContent, 'utf-8');

    // 5. Sample CSV Data File
    const csvContent = `ServiceId,ServiceName,HostName,Port,Status,UptimePercentage,LastIncident
SRV-001,Authentication Gateway,auth-node-01.internal,8080,ONLINE,99.98%,2026-07-12
SRV-002,Payment Processing Worker,pay-worker-02.internal,9200,ONLINE,99.95%,2026-06-30
SRV-003,Document Indexer Service,doc-idx-01.internal,5432,ONLINE,100.0%,None
SRV-004,Report Export Queue,export-q-01.internal,6379,ONLINE,99.90%,2026-08-01
SRV-005,Analytics Aggregator,analytics-03.internal,8443,MAINTENANCE,98.50%,2026-08-14
`;
    fs.writeFileSync(path.join(baseDir, 'Data & Configs', 'production_services_inventory.csv'), csvContent, 'utf-8');

    // 6. Sample JSON Config
    const jsonContent = JSON.stringify(
      {
        application: "DocuFlow Enterprise",
        environment: "production",
        version: "2.4.0",
        features: {
          backgroundExport: true,
          liveScriptStreaming: true,
          auditLogging: true,
          autoSync: true
        },
        database: {
          host: "sql-cluster-01.internal",
          port: 1433,
          maxConnections: 100,
          timeoutSeconds: 30
        }
      },
      null,
      2
    );
    fs.writeFileSync(path.join(baseDir, 'Data & Configs', 'appsettings.production.json'), jsonContent, 'utf-8');

    // Metadata initialization
    dbService.updateMetadata(path.join(baseDir, 'Automations & Scripts', 'health_check_audit.ps1'), {
      tags: ['power-shell', 'monitoring', 'prod-ready'],
      status: 'approved',
      pinned: true,
      description: 'Automated health & transaction log inspection for production clusters.',
    });
    dbService.updateMetadata(path.join(baseDir, 'Work Documents & Guides', 'Deployment_SOP_Guide.md'), {
      tags: ['sop', 'runbook', 'devops'],
      status: 'approved',
      pinned: true,
      description: 'Standard operating procedure for patch deployment and rollbacks.',
    });
  } catch (e) {
    console.error('Failed to create sample files:', e);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 880,
    minWidth: 1080,
    minHeight: 650,
    title: 'DocuFlow DMS - Standalone Document & Script Hub',
    backgroundColor: '#020617', // slate-950
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    autoHideMenuBar: true,
  });

  // Remove default top menu for a modern clean UI
  Menu.setApplicationMenu(null);

  const distHtml = path.join(__dirname, '../dist/index.html');

  if (isDev) {
    mainWindow.loadURL('http://localhost:4101').catch(() => {
      if (fs.existsSync(distHtml)) {
        mainWindow?.loadFile(distHtml);
      }
    });
  } else if (fs.existsSync(distHtml)) {
    mainWindow.loadFile(distHtml);
  } else {
    mainWindow.loadURL('http://localhost:4101');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function registerIpcHandlers() {
  // Workspaces
  ipcMain.handle('workspaces:getAll', () => {
    return dbService.getWorkspaces();
  });

  ipcMain.handle('workspaces:add', async (_, customPath?: string) => {
    let targetPath = customPath;
    if (!targetPath) {
      targetPath = (await osService.selectFolderDialog(mainWindow!)) || undefined;
    }
    if (!targetPath) return null;

    const name = path.basename(targetPath) || targetPath;
    const ws: Workspace = {
      id: 'ws-' + Date.now(),
      name,
      path: targetPath,
      color: '#0284c7',
    };

    const current = dbService.getWorkspaces();
    const updated = [...current.filter((w) => w.path.toLowerCase() !== targetPath!.toLowerCase()), ws];
    dbService.setWorkspaces(updated);
    return ws;
  });

  ipcMain.handle('workspaces:save', (_, workspace: Workspace) => {
    return dbService.saveWorkspace(workspace);
  });

  ipcMain.handle('workspaces:remove', (_, id: string) => {
    const current = dbService.getWorkspaces();
    const updated = current.filter((w) => w.id !== id);
    dbService.setWorkspaces(updated);
    return true;
  });

  ipcMain.handle('os:pickIconImage', async () => {
    return osService.pickIconImage(mainWindow!);
  });

  // File System
  ipcMain.handle('fs:scanDirectory', (_, dirPath: string) => {
    return fileService.scanDirectory(dirPath);
  });

  ipcMain.handle('fs:readFile', (_, filePath: string) => {
    return fileService.readFile(filePath);
  });

  ipcMain.handle('fs:readMediaDataUrl', (_, filePath: string) => {
    return fileService.readMediaDataUrl(filePath);
  });

  ipcMain.handle('fs:writeFile', (_, filePath: string, content: string) => {
    return fileService.writeFile(filePath, content);
  });

  ipcMain.handle('fs:renameFile', (_, oldPath: string, newName: string) => {
    return fileService.renameFile(oldPath, newName);
  });

  ipcMain.handle('fs:moveFile', (_, sourcePath: string, targetDir: string) => {
    return fileService.moveFile(sourcePath, targetDir);
  });

  ipcMain.handle('fs:deleteFile', (_, filePath: string) => {
    return fileService.deleteFile(filePath);
  });

  ipcMain.handle('fs:createFile', (_, dirPath: string, fileName: string, content?: string) => {
    return fileService.createFile(dirPath, fileName, content);
  });

  ipcMain.handle('fs:createFolder', (_, dirPath: string, folderName: string) => {
    return fileService.createFolder(dirPath, folderName);
  });

  ipcMain.handle('fs:duplicateFile', (_, filePath: string) => {
    return fileService.duplicateFile(filePath);
  });

  // OS Integration (Requested openExternal, revealInFolder, copy)
  ipcMain.handle('os:openExternal', async (_, filePath: string) => {
    return osService.openExternal(filePath);
  });

  ipcMain.handle('os:revealInFolder', async (_, filePath: string) => {
    return osService.revealInFolder(filePath);
  });

  ipcMain.handle('os:selectFolderDialog', async () => {
    return osService.selectFolderDialog(mainWindow!);
  });

  ipcMain.handle('os:selectFileDialog', async () => {
    return osService.selectFileDialog(mainWindow!);
  });

  ipcMain.handle('os:copyToClipboard', async (_, text: string) => {
    return osService.copyToClipboard(text);
  });

  // Metadata Store
  ipcMain.handle('metadata:get', (_, filePath: string) => {
    return dbService.getMetadata(filePath);
  });

  ipcMain.handle('metadata:update', (_, filePath: string, patch: any) => {
    return dbService.updateMetadata(filePath, patch);
  });

  ipcMain.handle('metadata:getAllTags', () => {
    return dbService.getAllTags();
  });

  // Search
  ipcMain.handle('search:query', (_, options) => {
    return searchService.searchFiles(options);
  });
}

app.whenReady().then(() => {
  ensureDefaultWorkspace();
  registerIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
