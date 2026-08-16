import React, { useState, useEffect } from 'react';
import {
  X,
  FolderPlus,
  FolderSymlink,
  Image as ImageIcon,
  Check,
  Trash2,
  Upload,
  Layers,
  Settings,
} from 'lucide-react';
import { Workspace } from '../../types';
import { api } from '../../services/apiBridge';
import { BUILTIN_ICONS, WORKSPACE_COLORS, WorkspaceIcon } from '../dashboard/WorkspaceIcon';

interface ProjectFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceToEdit: Workspace | null;
  onSaveWorkspace: (workspace: Workspace) => Promise<void>;
}

export const ProjectFolderModal: React.FC<ProjectFolderModalProps> = ({
  isOpen,
  onClose,
  workspaceToEdit,
  onSaveWorkspace,
}) => {
  const [name, setName] = useState('');
  const [folderPath, setFolderPath] = useState('');
  const [description, setDescription] = useState('');
  const [iconType, setIconType] = useState<'builtin' | 'custom'>('builtin');
  const [iconValue, setIconValue] = useState('briefcase');
  const [color, setColor] = useState('#0078d4');
  const [isDefault, setIsDefault] = useState(false);
  const [iconTab, setIconTab] = useState<'builtin' | 'custom'>('builtin');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (workspaceToEdit) {
      setName(workspaceToEdit.name);
      setFolderPath(workspaceToEdit.path);
      setDescription(workspaceToEdit.description || '');
      setIconType(workspaceToEdit.iconType || 'builtin');
      setIconValue(workspaceToEdit.iconValue || 'briefcase');
      setColor(workspaceToEdit.color || '#0078d4');
      setIsDefault(workspaceToEdit.isDefault || false);
      setIconTab(workspaceToEdit.iconType === 'custom' ? 'custom' : 'builtin');
      setError(null);
    } else {
      setName('');
      setFolderPath('');
      setDescription('');
      setIconType('builtin');
      setIconValue('briefcase');
      setColor('#0078d4');
      setIsDefault(false);
      setIconTab('builtin');
      setError(null);
    }
  }, [workspaceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleBrowseFolder = async () => {
    try {
      const selected = await api.selectFolderDialog();
      if (selected) {
        setFolderPath(selected);
        if (!name) {
          setName(selected.split(/[\\/]/).pop() || selected);
        }
        setError(null);
      }
    } catch (e: any) {
      setError('Error picking folder: ' + e.message);
    }
  };

  const handlePickCustomImage = async () => {
    try {
      const imgData = await api.pickIconImage();
      if (imgData) {
        setIconType('custom');
        setIconValue(imgData);
        setIconTab('custom');
      }
    } catch (e: any) {
      setError('Error picking image: ' + e.message);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setIconType('custom');
          setIconValue(reader.result);
          setIconTab('custom');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a Project Name.');
      return;
    }
    if (!folderPath.trim()) {
      setError('Please specify or browse a Folder Path.');
      return;
    }

    setSubmitting(true);
    const ws: Workspace = {
      id: workspaceToEdit?.id || 'ws-' + Date.now(),
      name: name.trim(),
      path: folderPath.trim(),
      description: description.trim(),
      iconType,
      iconValue,
      color,
      isDefault,
      createdAt: workspaceToEdit?.createdAt || Date.now(),
      lastAccessed: Date.now(),
    };

    await onSaveWorkspace(ws);
    setSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 fluent-acrylic z-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white/95 dark:bg-[#2c2c2c]/95 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-fluent-in text-xs flex flex-col max-h-[90vh] transition-colors fluent-acrylic cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08] shrink-0">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: color }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20"
            >
              <WorkspaceIcon workspace={{ iconType, iconValue, name }} size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                {workspaceToEdit ? 'Configure Project Folder' : 'Add New Project / Work Folder'}
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Configure folder path, visual identity, and custom icons.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 flex-1 overflow-y-auto pr-1">
          {/* Project Name */}
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              Project Name:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AXIS Staging Environment, Q3 Release..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white dark:bg-[#202020] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:border-[#0078d4] dark:focus:border-[#60cdff] font-medium"
            />
          </div>

          {/* Folder Path with Browse button */}
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              Physical Folder Path:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="C:/Work/Projects/MyProjectFolder"
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                className="flex-1 bg-white dark:bg-[#202020] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100 text-xs font-mono focus:outline-none focus:border-[#0078d4] dark:focus:border-[#60cdff]"
              />
              <button
                type="button"
                onClick={handleBrowseFolder}
                className="px-3 py-2 bg-neutral-100 dark:bg-[#343434] hover:bg-neutral-200 dark:hover:bg-[#3a3a3a] text-neutral-700 dark:text-neutral-200 border border-black/[0.06] dark:border-white/[0.08] rounded-lg text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <FolderSymlink size={13.5} className="text-[#0078d4] dark:text-[#60cdff]" />
                <span>Browse...</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              Description / Notes (Optional):
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of the documents and scripts inside this project folder..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white dark:bg-[#202020] border border-black/[0.08] dark:border-white/[0.1] rounded-lg p-2.5 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:border-[#0078d4] dark:focus:border-[#60cdff] resize-none"
            />
          </div>

          {/* Color Accent Picker */}
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1.5">
              Accent Color:
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {WORKSPACE_COLORS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  style={{ backgroundColor: c.id }}
                  className={`w-7 h-7 rounded-lg transition-transform flex items-center justify-center shadow-sm ${
                    color === c.id ? 'scale-110 ring-2 ring-offset-2 dark:ring-offset-[#2c2c2c] ' + c.ringClass : 'opacity-85 hover:opacity-100'
                  }`}
                  title={c.label}
                >
                  {color === c.id && <Check size={14} className="text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-neutral-700 dark:text-neutral-300 font-semibold">
                Project Folder Icon:
              </label>
              <div className="flex bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-lg border border-black/[0.05] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    setIconTab('builtin');
                    setIconType('builtin');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    iconTab === 'builtin'
                      ? 'bg-[#0078d4] text-white dark:bg-[#60cdff] dark:text-neutral-950 shadow-sm font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  Built-in Icons
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIconTab('custom');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                    iconTab === 'custom'
                      ? 'bg-[#0078d4] text-white dark:bg-[#60cdff] dark:text-neutral-950 shadow-sm font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <ImageIcon size={12} /> Custom PNG / Image
                </button>
              </div>
            </div>

            {/* Built-in Icons Grid */}
            {iconTab === 'builtin' ? (
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2.5 bg-neutral-50 dark:bg-[#202020] border border-black/[0.06] dark:border-white/[0.08] rounded-xl max-h-40 overflow-y-auto">
                {BUILTIN_ICONS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = iconType === 'builtin' && iconValue === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => {
                        setIconType('builtin');
                        setIconValue(item.id);
                      }}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#0078d4] text-white dark:bg-[#60cdff] dark:text-neutral-950 shadow-md ring-2 ring-[#0078d4]/30'
                          : 'bg-white dark:bg-[#2c2c2c] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-[#343434] border border-black/[0.06] dark:border-white/[0.08]'
                      }`}
                      title={item.label}
                    >
                      <IconComp size={16} />
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Custom PNG / Image Upload Tab */
              <div className="p-4 bg-neutral-50 dark:bg-[#202020] border border-black/[0.06] dark:border-white/[0.08] rounded-xl space-y-3">
                <div className="flex items-center gap-4">
                  {iconType === 'custom' && iconValue ? (
                    <div className="relative group">
                      <img
                        src={iconValue}
                        alt="Project Icon"
                        className="w-14 h-14 rounded-xl object-cover border-2 border-[#0078d4] dark:border-[#60cdff] shadow-md bg-white dark:bg-[#2c2c2c]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIconType('builtin');
                          setIconValue('briefcase');
                          setIconTab('builtin');
                        }}
                        className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white p-1 rounded-full shadow hover:bg-rose-500"
                        title="Remove Custom Image"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center text-neutral-400">
                      <ImageIcon size={20} />
                      <span className="text-[8.5px] mt-0.5">No Image</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                      Upload any <strong>.png</strong>, <strong>.jpg</strong>, <strong>.svg</strong>, or <strong>.ico</strong> image from your computer to use as this project's custom badge.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePickCustomImage}
                        className="px-3 py-1.5 bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Upload size={13} /> Select PNG File...
                      </button>
                      <label className="px-3 py-1.5 bg-neutral-200 dark:bg-[#343434] hover:bg-neutral-300 dark:hover:bg-[#3a3a3a] text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium cursor-pointer transition-colors">
                        Browse Web...
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-lg border border-rose-200 dark:border-rose-800/40 text-[11px]">
              {error}
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>{submitting ? 'Saving...' : workspaceToEdit ? 'Save Changes' : 'Create Project Folder'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
