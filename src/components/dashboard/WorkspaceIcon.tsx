import React from 'react';
import {
  Briefcase,
  Folder,
  Code2,
  Terminal,
  Database,
  Kanban,
  Layers,
  Server,
  Rocket,
  Cpu,
  Shield,
  Book,
  Globe,
  Flame,
  Cloud,
  Zap,
  Box,
  Archive,
  Bookmark,
  Compass,
  HardDrive,
  Workflow,
  FileText,
  Sparkles,
  LucideIcon,
} from 'lucide-react';
import { Workspace } from '../../types';

export const BUILTIN_ICONS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'briefcase', label: 'Briefcase', icon: Briefcase },
  { id: 'folder', label: 'Folder', icon: Folder },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'kanban', label: 'Project Board', icon: Kanban },
  { id: 'layers', label: 'Layers', icon: Layers },
  { id: 'server', label: 'Server', icon: Server },
  { id: 'rocket', label: 'Rocket', icon: Rocket },
  { id: 'cpu', label: 'System / CPU', icon: Cpu },
  { id: 'shield', label: 'Security / Shield', icon: Shield },
  { id: 'book', label: 'Documentation', icon: Book },
  { id: 'globe', label: 'Web / Cloud', icon: Globe },
  { id: 'sparkles', label: 'AI / Innovation', icon: Sparkles },
  { id: 'workflow', label: 'Workflow', icon: Workflow },
  { id: 'hard-drive', label: 'Storage', icon: HardDrive },
  { id: 'box', label: 'Package', icon: Box },
  { id: 'zap', label: 'Fast / Performance', icon: Zap },
  { id: 'flame', label: 'High Priority', icon: Flame },
  { id: 'cloud', label: 'Cloud Infrastructure', icon: Cloud },
  { id: 'file-text', label: 'Documents', icon: FileText },
  { id: 'archive', label: 'Archive', icon: Archive },
  { id: 'bookmark', label: 'Bookmarked', icon: Bookmark },
  { id: 'compass', label: 'Operations', icon: Compass },
];

export const WORKSPACE_COLORS = [
  { id: '#0284c7', label: 'Sky Blue', bgClass: 'bg-sky-600', ringClass: 'ring-sky-500' },
  { id: '#10b981', label: 'Emerald', bgClass: 'bg-emerald-600', ringClass: 'ring-emerald-500' },
  { id: '#6366f1', label: 'Indigo', bgClass: 'bg-indigo-600', ringClass: 'ring-indigo-500' },
  { id: '#f59e0b', label: 'Amber', bgClass: 'bg-amber-600', ringClass: 'ring-amber-500' },
  { id: '#f43f5e', label: 'Rose', bgClass: 'bg-rose-600', ringClass: 'ring-rose-500' },
  { id: '#a855f7', label: 'Purple', bgClass: 'bg-purple-600', ringClass: 'ring-purple-500' },
  { id: '#14b8a6', label: 'Teal', bgClass: 'bg-teal-600', ringClass: 'ring-teal-500' },
  { id: '#06b6d4', label: 'Cyan', bgClass: 'bg-cyan-600', ringClass: 'ring-cyan-500' },
  { id: '#64748b', label: 'Slate', bgClass: 'bg-slate-600', ringClass: 'ring-slate-500' },
];

interface WorkspaceIconProps {
  workspace: Partial<Workspace>;
  size?: number;
  className?: string;
  imgClassName?: string;
}

export const WorkspaceIcon: React.FC<WorkspaceIconProps> = ({
  workspace,
  size = 24,
  className = '',
  imgClassName = '',
}) => {
  const iconType = workspace.iconType || 'builtin';
  const iconValue = workspace.iconValue || 'briefcase';

  // Custom PNG or Image Upload
  if (iconType === 'custom' && iconValue) {
    return (
      <img
        src={iconValue}
        alt={workspace.name || 'Workspace Icon'}
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`object-cover rounded-lg shrink-0 ${imgClassName}`}
      />
    );
  }

  // Built-in Vector Icon
  const found = BUILTIN_ICONS.find((i) => i.id === iconValue);
  const IconComponent = found ? found.icon : Briefcase;

  return <IconComponent size={size} className={`shrink-0 ${className}`} />;
};
