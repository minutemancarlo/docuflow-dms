import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { FileItem } from '../types';
import { dbService } from './dbService';

const IGNORED_NAMES = new Set([
  'node_modules',
  '.git',
  '.svn',
  '.vscode',
  '.idea',
  'dist',
  'dist-electron',
  'build',
  'bin',
  'obj',
  '.docuflow_data',
  'Thumbs.db',
  'desktop.ini',
]);

const EXT_CATEGORIES: Record<string, FileItem['category']> = {
  // Microsoft Office & Productivity Suite
  '.docx': 'office',
  '.doc': 'office',
  '.docm': 'office',
  '.dotx': 'office',
  '.xlsx': 'office',
  '.xls': 'office',
  '.xlsm': 'office',
  '.xlsb': 'office',
  '.xltx': 'office',
  '.pptx': 'office',
  '.ppt': 'office',
  '.pptm': 'office',
  '.potx': 'office',
  '.mpp': 'office',   // Microsoft Project
  '.mpt': 'office',
  '.mpx': 'office',
  '.pub': 'office',   // Microsoft Publisher
  '.vsdx': 'office',  // Microsoft Visio
  '.vsd': 'office',
  '.accdb': 'office', // Microsoft Access
  '.mdb': 'office',
  '.one': 'office',   // Microsoft OneNote

  // General Documents & Notes
  '.pdf': 'document',
  '.md': 'document',
  '.markdown': 'document',
  '.txt': 'document',
  '.rtf': 'document',
  '.odt': 'document',
  '.log': 'document',

  // Scripts
  '.ps1': 'script',
  '.psm1': 'script',
  '.py': 'script',
  '.pyw': 'script',
  '.sql': 'script',
  '.bat': 'script',
  '.cmd': 'script',
  '.sh': 'script',
  '.bash': 'script',
  '.js': 'script',
  '.jsx': 'script',
  '.ts': 'script',
  '.tsx': 'script',
  '.vbs': 'script',
  '.psd1': 'script',

  // Data & Config
  '.csv': 'data',
  '.tsv': 'data',
  '.json': 'data',
  '.yaml': 'data',
  '.yml': 'data',
  '.xml': 'data',
  '.ini': 'data',
  '.toml': 'data',
  '.env': 'data',
  '.config': 'data',

  // Images
  '.png': 'image',
  '.jpg': 'image',
  '.jpeg': 'image',
  '.webp': 'image',
  '.gif': 'image',
  '.bmp': 'image',
  '.ico': 'image',
  '.tiff': 'image',
  '.tif': 'image',
  '.psd': 'image',
  '.svg': 'image',
  '.ai': 'image',
  '.eps': 'image',

  // Videos
  '.mp4': 'video',
  '.mkv': 'video',
  '.avi': 'video',
  '.mov': 'video',
  '.wmv': 'video',
  '.flv': 'video',
  '.webm': 'video',
  '.m4v': 'video',
  '.3gp': 'video',
  '.mpeg': 'video',
  '.mpg': 'video',

  // Audio
  '.mp3': 'audio',
  '.wav': 'audio',
  '.ogg': 'audio',
  '.flac': 'audio',
  '.m4a': 'audio',
  '.aac': 'audio',
  '.wma': 'audio',

  // Archives
  '.zip': 'archive',
  '.7z': 'archive',
  '.tar': 'archive',
  '.gz': 'archive',
  '.bz2': 'archive',
  '.xz': 'archive',
  '.rar': 'archive',
  '.iso': 'archive',
  '.dmg': 'archive',
  '.cab': 'archive',
};

export class FileService {
  public getCategory(ext: string): FileItem['category'] {
    const lower = ext.toLowerCase();
    return EXT_CATEGORIES[lower] || 'other';
  }

  public scanDirectory(rootPath: string, relativeTo?: string): FileItem[] {
    const baseRelative = relativeTo || rootPath;
    if (!fs.existsSync(rootPath)) return [];

    try {
      const stats = fs.statSync(rootPath);
      if (!stats.isDirectory()) return [];

      const entries = fs.readdirSync(rootPath, { withFileTypes: true });
      const items: FileItem[] = [];

      for (const entry of entries) {
        if (IGNORED_NAMES.has(entry.name) || entry.name.startsWith('.')) {
          continue;
        }

        const fullPath = path.join(rootPath, entry.name);
        const relPath = path.relative(baseRelative, fullPath).replace(/\\/g, '/');

        try {
          const itemStat = fs.statSync(fullPath);
          const isDir = itemStat.isDirectory();
          const ext = isDir ? '' : path.extname(entry.name).toLowerCase();
          const category = isDir ? 'other' : this.getCategory(ext);

          const meta = dbService.getMetadata(fullPath);

          const item: FileItem = {
            id: crypto.createHash('md5').update(fullPath).digest('hex'),
            name: entry.name,
            path: fullPath,
            relativePath: relPath,
            extension: ext,
            isDirectory: isDir,
            size: isDir ? 0 : itemStat.size,
            mtime: itemStat.mtimeMs,
            birthtime: itemStat.birthtimeMs,
            category,
            tags: meta.tags || [],
            status: meta.status || 'draft',
            pinned: meta.pinned || false,
            notes: meta.notes || '',
            description: meta.description || '',
          };

          if (isDir) {
            item.children = this.scanDirectory(fullPath, baseRelative);
          }

          items.push(item);
        } catch (e) {
          console.error(`Error reading ${fullPath}:`, e);
        }
      }

      // Sort: folders first, then alphabetical
      items.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      });

      return items;
    } catch (e) {
      console.error(`Failed to scan dir ${rootPath}:`, e);
      return [];
    }
  }

  public readFile(filePath: string): { content: string; isBinary: boolean; size: number } {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    // Check if known binary extension
    const binaryExts = new Set([
      '.docx', '.doc', '.docm', '.dotx',
      '.xlsx', '.xls', '.xlsm', '.xlsb',
      '.pptx', '.ppt', '.pptm',
      '.mpp', '.mpt', '.mpx',
      '.pub',
      '.vsdx', '.vsd',
      '.accdb', '.mdb',
      '.one',
      '.pdf',
      '.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.ico', '.tiff', '.tif', '.psd',
      '.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp', '.ts',
      '.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac', '.wma',
      '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.iso', '.dmg', '.cab',
      '.exe', '.dll', '.bin'
    ]);
    if (binaryExts.has(ext)) {
      return { content: '', isBinary: true, size: stat.size };
    }

    try {
      const buffer = fs.readFileSync(filePath);
      // Check if buffer contains null bytes
      const isBinary = buffer.includes(0);
      if (isBinary) {
        return { content: '', isBinary: true, size: stat.size };
      }
      return { content: buffer.toString('utf-8'), isBinary: false, size: stat.size };
    } catch (e: any) {
      return { content: `Error reading file: ${e.message}`, isBinary: false, size: stat.size };
    }
  }

  public readMediaDataUrl(filePath: string): { dataUrl: string; mimeType: string; size: number } {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.tiff': 'image/tiff',
      '.tif': 'image/tiff',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.ogg': 'video/ogg',
      '.mov': 'video/quicktime',
      '.mkv': 'video/x-matroska',
      '.m4v': 'video/x-m4v',
      '.3gp': 'video/3gpp',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.flac': 'audio/flac',
      '.m4a': 'audio/mp4',
      '.aac': 'audio/aac',
      '.wma': 'audio/x-ms-wma',
      '.pdf': 'application/pdf',
    };

    const mimeType = mimeMap[ext] || 'application/octet-stream';
    try {
      const buffer = fs.readFileSync(filePath);
      const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
      return { dataUrl, mimeType, size: stat.size };
    } catch (e: any) {
      throw new Error(`Failed to read binary media: ${e.message}`);
    }
  }

  public writeFile(filePath: string, content: string): { success: boolean; error?: string } {
    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  public renameFile(oldPath: string, newName: string): { success: boolean; newPath?: string; error?: string } {
    try {
      if (!fs.existsSync(oldPath)) {
        return { success: false, error: 'Target file or directory does not exist' };
      }

      const dir = path.dirname(oldPath);
      const newPath = path.join(dir, newName.trim());

      if (fs.existsSync(newPath) && newPath.toLowerCase() !== oldPath.toLowerCase()) {
        return { success: false, error: `A file or folder named "${newName}" already exists here.` };
      }

      fs.renameSync(oldPath, newPath);
      dbService.renameMetadataKey(oldPath, newPath);
      return { success: true, newPath };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  public moveFile(sourcePath: string, targetDir: string): { success: boolean; newPath?: string; error?: string } {
    try {
      if (!fs.existsSync(sourcePath)) {
        return { success: false, error: 'Source file or folder does not exist' };
      }
      if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
        return { success: false, error: 'Destination target folder does not exist' };
      }

      const fileName = path.basename(sourcePath);
      let newPath = path.join(targetDir, fileName);

      // Handle name collision
      if (fs.existsSync(newPath) && newPath.toLowerCase() !== sourcePath.toLowerCase()) {
        const ext = path.extname(fileName);
        const nameWithoutExt = path.basename(fileName, ext);
        newPath = path.join(targetDir, `${nameWithoutExt}_moved_${Date.now().toString().slice(-4)}${ext}`);
      }

      try {
        fs.renameSync(sourcePath, newPath);
      } catch (err: any) {
        // Fallback for cross-device / different drive moves
        if (fs.statSync(sourcePath).isDirectory()) {
          fs.cpSync(sourcePath, newPath, { recursive: true });
          fs.rmSync(sourcePath, { recursive: true, force: true });
        } else {
          fs.copyFileSync(sourcePath, newPath);
          fs.unlinkSync(sourcePath);
        }
      }

      dbService.renameMetadataKey(sourcePath, newPath);
      return { success: true, newPath };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  public deleteFile(filePath: string): { success: boolean; error?: string } {
    try {
      if (!fs.existsSync(filePath)) {
        return { success: true };
      }

      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }

      dbService.deleteMetadata(filePath);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  public createFile(dirPath: string, fileName: string, content = ''): { success: boolean; newPath?: string; error?: string } {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const newPath = path.join(dirPath, fileName.trim());
      if (fs.existsSync(newPath)) {
        return { success: false, error: `File "${fileName}" already exists.` };
      }

      fs.writeFileSync(newPath, content, 'utf-8');
      return { success: true, newPath };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  public createFolder(dirPath: string, folderName: string): { success: boolean; newPath?: string; error?: string } {
    try {
      const newPath = path.join(dirPath, folderName.trim());
      if (fs.existsSync(newPath)) {
        return { success: false, error: `Folder "${folderName}" already exists.` };
      }

      fs.mkdirSync(newPath, { recursive: true });
      return { success: true, newPath };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  public duplicateFile(filePath: string): { success: boolean; newPath?: string; error?: string } {
    try {
      if (!fs.existsSync(filePath)) {
        return { success: false, error: 'Source file does not exist' };
      }

      const dir = path.dirname(filePath);
      const ext = path.extname(filePath);
      const baseName = path.basename(filePath, ext);

      let copyIndex = 1;
      let newPath = path.join(dir, `${baseName}_copy${ext}`);
      while (fs.existsSync(newPath)) {
        copyIndex++;
        newPath = path.join(dir, `${baseName}_copy${copyIndex}${ext}`);
      }

      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        fs.cpSync(filePath, newPath, { recursive: true });
      } else {
        fs.copyFileSync(filePath, newPath);
      }

      return { success: true, newPath };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}

export const fileService = new FileService();
