export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(timestamp: number): string {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTimeAgo(timestamp: number): string {
  if (!timestamp) return '—';
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(timestamp);
}

export function truncatePath(fullPath: string, maxLength = 45): string {
  if (!fullPath || fullPath.length <= maxLength) return fullPath;
  const parts = fullPath.split(/[\\/]/);
  if (parts.length <= 2) return fullPath;
  const first = parts[0];
  const last = parts[parts.length - 1];
  return `${first}/.../${last}`;
}

export function getLanguageFromExt(ext: string): string {
  const map: Record<string, string> = {
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.py': 'python',
    '.pyw': 'python',
    '.ps1': 'powershell',
    '.psm1': 'powershell',
    '.psd1': 'powershell',
    '.sql': 'sql',
    '.bat': 'bat',
    '.cmd': 'bat',
    '.sh': 'shell',
    '.bash': 'shell',
    '.json': 'json',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.xml': 'xml',
    '.html': 'html',
    '.css': 'css',
    '.md': 'markdown',
    '.markdown': 'markdown',
    '.txt': 'plaintext',
    '.log': 'plaintext',
    '.ini': 'ini',
    '.toml': 'ini',
    '.cs': 'csharp',
  };
  return map[ext.toLowerCase()] || 'plaintext';
}
