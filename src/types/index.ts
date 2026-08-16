export type DocumentCategory = 'all' | 'office' | 'documents' | 'scripts' | 'data' | 'recent' | 'pinned';

export type DocumentStatus = 'draft' | 'review' | 'approved' | 'deprecated';

export type OfficeAppType =
  | 'word'
  | 'excel'
  | 'powerpoint'
  | 'project'
  | 'publisher'
  | 'visio'
  | 'access'
  | 'onenote'
  | 'pdf'
  | 'other';

export interface FileItem {
  id: string;
  name: string;
  path: string;
  relativePath: string;
  extension: string;
  isDirectory: boolean;
  size: number;
  mtime: number;
  birthtime: number;
  children?: FileItem[];
  category: 'office' | 'document' | 'script' | 'data' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  officeType?: OfficeAppType;
  tags?: string[];
  status?: DocumentStatus;
  pinned?: boolean;
  notes?: string;
  description?: string;
}

export interface Workspace {
  id: string;
  name: string;
  path: string;
  description?: string;
  iconType?: 'builtin' | 'custom';
  iconValue?: string; // Builtin icon key (e.g. 'briefcase', 'rocket', 'code') or custom PNG base64 / url
  color?: string;
  isDefault?: boolean;
  tags?: string[];
  createdAt?: number;
  lastAccessed?: number;
}

export interface FileMetadata {
  path: string;
  tags: string[];
  status: DocumentStatus;
  pinned: boolean;
  description: string;
  notes: string;
  lastOpened?: number;
}

export interface SearchResult {
  file: FileItem;
  matchType: 'name' | 'path' | 'tag' | 'content' | 'date';
  matches?: string[];
  snippet?: string;
}

export interface ElectronAPI {
  getWorkspaces: () => Promise<Workspace[]>;
  addWorkspace: (folderPath?: string) => Promise<Workspace | null>;
  saveWorkspace: (workspace: Workspace) => Promise<Workspace>;
  removeWorkspace: (id: string) => Promise<boolean>;
  pickIconImage: () => Promise<string | null>;
  scanDirectory: (dirPath: string) => Promise<FileItem[]>;
  readFile: (filePath: string) => Promise<{ content: string; isBinary: boolean; size: number }>;
  readMediaDataUrl: (filePath: string) => Promise<{ dataUrl: string; mimeType: string; size: number }>;
  writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
  renameFile: (oldPath: string, newName: string) => Promise<{ success: boolean; newPath?: string; error?: string }>;
  moveFile: (sourcePath: string, targetDir: string) => Promise<{ success: boolean; newPath?: string; error?: string }>;
  deleteFile: (filePath: string) => Promise<{ success: boolean; error?: string }>;
  createFile: (dirPath: string, fileName: string, content?: string) => Promise<{ success: boolean; newPath?: string; error?: string }>;
  createFolder: (dirPath: string, folderName: string) => Promise<{ success: boolean; newPath?: string; error?: string }>;
  duplicateFile: (filePath: string) => Promise<{ success: boolean; newPath?: string; error?: string }>;
  openExternal: (filePath: string) => Promise<{ success: boolean; error?: string }>;
  revealInFolder: (filePath: string) => Promise<{ success: boolean; error?: string }>;
  selectFolderDialog: () => Promise<string | null>;
  selectFileDialog: () => Promise<string | null>;
  copyToClipboard: (text: string) => Promise<boolean>;
  getMetadata: (filePath: string) => Promise<FileMetadata>;
  updateMetadata: (filePath: string, metadata: Partial<FileMetadata>) => Promise<boolean>;
  getAllTags: () => Promise<string[]>;
  searchFiles: (options: {
    query: string;
    workspaces: string[];
    searchContent?: boolean;
    category?: string;
    tag?: string;
    dateFilter?: string;
  }) => Promise<SearchResult[]>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
