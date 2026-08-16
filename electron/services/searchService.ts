import fs from 'fs';
import path from 'path';
import { FileItem, SearchResult } from '../types';
import { fileService } from './fileService';
import { dbService } from './dbService';

export class SearchService {
  public searchFiles(options: {
    query: string;
    workspaces: string[];
    searchContent?: boolean;
    category?: string;
    tag?: string;
  }): SearchResult[] {
    const { query, workspaces, searchContent = false, category, tag } = options;
    const cleanQuery = (query || '').trim().toLowerCase();
    const results: SearchResult[] = [];

    if (!cleanQuery && !category && !tag) {
      return [];
    }

    const seenPaths = new Set<string>();

    for (const wsPath of workspaces) {
      if (!fs.existsSync(wsPath)) continue;

      const allItems = this.collectAllFiles(wsPath);

      for (const item of allItems) {
        if (seenPaths.has(item.path)) continue;
        seenPaths.add(item.path);

        const meta = dbService.getMetadata(item.path);
        const tags = meta.tags || [];

        // Filter by category if specified
        if (category && category !== 'all') {
          if (category === 'pinned' && !meta.pinned) continue;
          if (category === 'documents' && item.category !== 'document') continue;
          if (category === 'scripts' && item.category !== 'script') continue;
          if (category === 'data' && item.category !== 'data') continue;
        }

        // Filter by tag if specified
        if (tag) {
          if (!tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
            continue;
          }
        }

        if (!cleanQuery) {
          // Matched filter without text query
          results.push({
            file: item,
            matchType: tag ? 'tag' : 'name',
          });
          continue;
        }

        // Match by filename
        if (item.name.toLowerCase().includes(cleanQuery)) {
          results.push({
            file: item,
            matchType: 'name',
            matches: [item.name],
          });
          continue;
        }

        // Match by tags
        const matchingTag = tags.find((t) => t.toLowerCase().includes(cleanQuery));
        if (matchingTag) {
          results.push({
            file: item,
            matchType: 'tag',
            matches: [matchingTag],
          });
          continue;
        }

        // Match by description / notes
        if (meta.description?.toLowerCase().includes(cleanQuery) || meta.notes?.toLowerCase().includes(cleanQuery)) {
          results.push({
            file: item,
            matchType: 'name',
            snippet: meta.description || meta.notes?.slice(0, 100),
          });
          continue;
        }

        // Match by file content (if enabled and not a directory)
        if (searchContent && !item.isDirectory) {
          try {
            const { content, isBinary } = fileService.readFile(item.path);
            if (!isBinary && content) {
              const lowerContent = content.toLowerCase();
              const idx = lowerContent.indexOf(cleanQuery);
              if (idx !== -1) {
                const start = Math.max(0, idx - 50);
                const end = Math.min(content.length, idx + cleanQuery.length + 80);
                const snippet = '...' + content.slice(start, end).replace(/\r?\n/g, ' ') + '...';
                results.push({
                  file: item,
                  matchType: 'content',
                  snippet,
                });
              }
            }
          } catch {}
        }
      }
    }

    return results.slice(0, 50);
  }

  private collectAllFiles(dirPath: string): FileItem[] {
    const list = fileService.scanDirectory(dirPath);
    const flattened: FileItem[] = [];

    const recurse = (items: FileItem[]) => {
      for (const item of items) {
        flattened.push(item);
        if (item.children && item.children.length > 0) {
          recurse(item.children);
        }
      }
    };

    recurse(list);
    return flattened;
  }
}

export const searchService = new SearchService();
