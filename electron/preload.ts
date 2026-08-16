import { contextBridge, ipcRenderer } from 'electron';
import { ElectronAPI, FileMetadata, Workspace } from './types';

const api: ElectronAPI = {
  getWorkspaces: () => ipcRenderer.invoke('workspaces:getAll'),
  addWorkspace: (folderPath?: string) => ipcRenderer.invoke('workspaces:add', folderPath),
  saveWorkspace: (workspace: Workspace) => ipcRenderer.invoke('workspaces:save', workspace),
  removeWorkspace: (id: string) => ipcRenderer.invoke('workspaces:remove', id),
  pickIconImage: () => ipcRenderer.invoke('os:pickIconImage'),

  scanDirectory: (dirPath: string) => ipcRenderer.invoke('fs:scanDirectory', dirPath),
  readFile: (filePath: string) => ipcRenderer.invoke('fs:readFile', filePath),
  readMediaDataUrl: (filePath: string) => ipcRenderer.invoke('fs:readMediaDataUrl', filePath),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('fs:writeFile', filePath, content),
  renameFile: (oldPath: string, newName: string) => ipcRenderer.invoke('fs:renameFile', oldPath, newName),
  moveFile: (sourcePath: string, targetDir: string) => ipcRenderer.invoke('fs:moveFile', sourcePath, targetDir),
  deleteFile: (filePath: string) => ipcRenderer.invoke('fs:deleteFile', filePath),
  createFile: (dirPath: string, fileName: string, content?: string) => ipcRenderer.invoke('fs:createFile', dirPath, fileName, content),
  createFolder: (dirPath: string, folderName: string) => ipcRenderer.invoke('fs:createFolder', dirPath, folderName),
  duplicateFile: (filePath: string) => ipcRenderer.invoke('fs:duplicateFile', filePath),

  openExternal: (filePath: string) => ipcRenderer.invoke('os:openExternal', filePath),
  revealInFolder: (filePath: string) => ipcRenderer.invoke('os:revealInFolder', filePath),
  selectFolderDialog: () => ipcRenderer.invoke('os:selectFolderDialog'),
  selectFileDialog: () => ipcRenderer.invoke('os:selectFileDialog'),
  copyToClipboard: (text: string) => ipcRenderer.invoke('os:copyToClipboard', text),

  getMetadata: (filePath: string) => ipcRenderer.invoke('metadata:get', filePath),
  updateMetadata: (filePath: string, metadata: Partial<FileMetadata>) => ipcRenderer.invoke('metadata:update', filePath, metadata),
  getAllTags: () => ipcRenderer.invoke('metadata:getAllTags'),

  searchFiles: (options) => ipcRenderer.invoke('search:query', options),
};

contextBridge.exposeInMainWorld('electronAPI', api);
