import { shell, clipboard, dialog, BrowserWindow } from 'electron';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export class OsService {
  public async openExternal(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!fs.existsSync(filePath)) {
        return { success: false, error: 'File does not exist at path: ' + filePath };
      }

      // shell.openPath opens the file in its registered system default application
      const errorMsg = await shell.openPath(filePath);
      if (errorMsg) {
        // Fallback for Windows shell start command
        return new Promise((resolve) => {
          exec(`start "" "${filePath}"`, (err) => {
            if (err) {
              resolve({ success: false, error: errorMsg || err.message });
            } else {
              resolve({ success: true });
            }
          });
        });
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  public async revealInFolder(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!fs.existsSync(filePath)) {
        return { success: false, error: 'Target path does not exist: ' + filePath };
      }

      shell.showItemInFolder(filePath);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  public async copyToClipboard(text: string): Promise<boolean> {
    try {
      clipboard.writeText(text);
      return true;
    } catch (e) {
      console.error('Clipboard write failed:', e);
      return false;
    }
  }

  public async selectFolderDialog(window?: BrowserWindow): Promise<string | null> {
    const result = await dialog.showOpenDialog(window || BrowserWindow.getFocusedWindow()!, {
      title: 'Select Workspace or Folder to Manage',
      properties: ['openDirectory', 'createDirectory'],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    return result.filePaths[0];
  }

  public async selectFileDialog(window?: BrowserWindow): Promise<string | null> {
    const result = await dialog.showOpenDialog(window || BrowserWindow.getFocusedWindow()!, {
      title: 'Select File to Import or Open',
      properties: ['openFile'],
    });

    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  }

  public async pickIconImage(window?: BrowserWindow): Promise<string | null> {
    const result = await dialog.showOpenDialog(window || BrowserWindow.getFocusedWindow()!, {
      title: 'Select Project Icon Image (PNG, JPG, SVG, WebP, ICO)',
      properties: ['openFile'],
      filters: [
        { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'svg', 'webp', 'ico'] }
      ]
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    const imgPath = result.filePaths[0];
    try {
      const ext = path.extname(imgPath).toLowerCase().replace('.', '');
      const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
      const buf = fs.readFileSync(imgPath);
      return `data:${mime};base64,${buf.toString('base64')}`;
    } catch (e) {
      console.error('Failed to read icon image:', e);
      return null;
    }
  }
}

export const osService = new OsService();
