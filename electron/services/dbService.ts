import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { FileMetadata, Workspace } from '../types';

export class DbService {
  private dataDir: string;
  private metadataFile: string;
  private settingsFile: string;
  private metadataCache: Record<string, FileMetadata> = {};
  private workspacesCache: Workspace[] = [];

  constructor() {
    try {
      this.dataDir = path.join(app.getPath('userData'), 'docuflow_data');
    } catch {
      this.dataDir = path.join(process.cwd(), '.docuflow_data');
    }

    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    this.metadataFile = path.join(this.dataDir, 'metadata.json');
    this.settingsFile = path.join(this.dataDir, 'settings.json');

    this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(this.metadataFile)) {
        const raw = fs.readFileSync(this.metadataFile, 'utf-8');
        this.metadataCache = JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load metadata cache:', e);
      this.metadataCache = {};
    }

    try {
      if (fs.existsSync(this.settingsFile)) {
        const raw = fs.readFileSync(this.settingsFile, 'utf-8');
        const settings = JSON.parse(raw);
        this.workspacesCache = settings.workspaces || [];
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
      this.workspacesCache = [];
    }
  }

  private saveMetadata() {
    try {
      fs.writeFileSync(this.metadataFile, JSON.stringify(this.metadataCache, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save metadata:', e);
    }
  }

  private saveSettings() {
    try {
      fs.writeFileSync(this.settingsFile, JSON.stringify({ workspaces: this.workspacesCache }, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  public getMetadata(filePath: string): FileMetadata {
    const normalized = path.normalize(filePath);
    if (!this.metadataCache[normalized]) {
      this.metadataCache[normalized] = {
        path: normalized,
        tags: [],
        status: 'draft',
        pinned: false,
        description: '',
        notes: '',
      };
    }
    return this.metadataCache[normalized];
  }

  public updateMetadata(filePath: string, patch: Partial<FileMetadata>): boolean {
    const normalized = path.normalize(filePath);
    const existing = this.getMetadata(normalized);
    this.metadataCache[normalized] = { ...existing, ...patch, path: normalized };
    this.saveMetadata();
    return true;
  }

  public renameMetadataKey(oldPath: string, newPath: string) {
    const normOld = path.normalize(oldPath);
    const normNew = path.normalize(newPath);
    if (this.metadataCache[normOld]) {
      this.metadataCache[normNew] = { ...this.metadataCache[normOld], path: normNew };
      delete this.metadataCache[normOld];
      this.saveMetadata();
    }
  }

  public deleteMetadata(filePath: string) {
    const normalized = path.normalize(filePath);
    if (this.metadataCache[normalized]) {
      delete this.metadataCache[normalized];
      this.saveMetadata();
    }
  }

  public getAllTags(): string[] {
    const tagSet = new Set<string>();
    for (const meta of Object.values(this.metadataCache)) {
      if (Array.isArray(meta.tags)) {
        meta.tags.forEach((t) => tagSet.add(t));
      }
    }
    return Array.from(tagSet).sort();
  }

  public getWorkspaces(): Workspace[] {
    return this.workspacesCache;
  }

  public setWorkspaces(workspaces: Workspace[]) {
    this.workspacesCache = workspaces;
    this.saveSettings();
  }

  public saveWorkspace(workspace: Workspace): Workspace {
    const idx = this.workspacesCache.findIndex((w) => w.id === workspace.id);
    if (idx !== -1) {
      this.workspacesCache[idx] = { ...this.workspacesCache[idx], ...workspace };
    } else {
      this.workspacesCache.push(workspace);
    }
    this.saveSettings();
    return workspace;
  }
}

export const dbService = new DbService();
