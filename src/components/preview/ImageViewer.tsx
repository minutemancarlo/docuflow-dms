import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  ExternalLink,
  FolderSymlink,
  Copy,
  Check,
  Image as ImageIcon,
  Grid,
  Sun,
  Moon,
  FlipHorizontal,
  RefreshCcw,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { FileItem } from '../../types';
import { api } from '../../services/apiBridge';
import { formatBytes } from '../../utils/formatters';

interface ImageViewerProps {
  file: FileItem;
  onOpenExternal: (file: FileItem) => void;
  onRevealInFolder: (file: FileItem) => void;
  onCopyPath: (file: FileItem) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  file,
  onOpenExternal,
  onRevealInFolder,
  onCopyPath,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [bgMode, setBgMode] = useState<'checker' | 'dark' | 'light'>('dark');
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Load image on file change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setPosition({ x: 0, y: 0 });
    setDimensions(null);

    const loadImage = async () => {
      try {
        const res = await api.readMediaDataUrl(file.path);
        if (isMounted) {
          setImageSrc(res.dataUrl);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load image');
          setLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [file.path]);

  // Handle Zoom In / Out
  const handleZoomIn = () => setZoom((z) => Math.min(Number((z * 1.25).toFixed(2)), 10));
  const handleZoomOut = () => setZoom((z) => Math.max(Number((z * 0.8).toFixed(2)), 0.1));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setFlipH(false);
  };

  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleFlip = () => setFlipH((f) => !f);

  // Smooth Mouse Wheel Zoom (Windows 11 Photos style)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom((prev) => {
      const next = Math.max(0.1, Math.min(10, prev * zoomFactor));
      return Number(next.toFixed(2));
    });
  }, []);

  // Mouse Drag to Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on left click
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Double click to toggle 100% <-> 200% or reset
  const handleDoubleClick = () => {
    if (zoom === 1) {
      setZoom(2);
    } else {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handleCopy = () => {
    onCopyPath(file);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0' || e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handleResetZoom();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleRotate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="h-full w-full flex flex-col bg-[#181818] text-neutral-200 overflow-hidden select-none relative transition-colors"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Windows 11 Photos Info Bar */}
      <div className="h-10 border-b border-white/[0.08] bg-[#202020]/90 px-3.5 flex items-center justify-between text-xs shrink-0 select-none z-20 backdrop-blur-md">
        <div className="flex items-center gap-2 truncate min-w-0 mr-4">
          <span className="font-mono text-[10.5px] text-[#60cdff] font-semibold uppercase bg-[#60cdff]/15 px-2 py-0.5 rounded-md border border-[#60cdff]/20">
            {file.extension.replace('.', '') || 'IMAGE'}
          </span>
          <span className="text-[11.5px] font-medium text-neutral-200 truncate">
            {file.name}
          </span>
          {dimensions && (
            <span className="text-[10.5px] text-neutral-400 font-mono hidden md:inline">
              ({dimensions.width} × {dimensions.height} px • {formatBytes(file.size)})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-1.5 rounded-lg transition-colors ${
              showInfo
                ? 'bg-[#60cdff]/20 text-[#60cdff]'
                : 'text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.06]'
            }`}
            title="Image File Info"
          >
            <Info size={14} />
          </button>

          <button
            onClick={() => onRevealInFolder(file)}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.06] rounded-lg transition-colors"
            title="Reveal in File Explorer"
          >
            <FolderSymlink size={14} />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.06] rounded-lg transition-colors"
            title="Copy Path"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>

          <div className="h-3.5 w-[1px] bg-white/[0.1] mx-0.5" />

          <button
            onClick={() => onOpenExternal(file)}
            className="flex items-center gap-1 text-[11px] font-semibold bg-[#60cdff] hover:bg-[#78d4ff] text-neutral-950 px-2.5 py-1 rounded-lg transition-all shadow-sm"
            title="Open in Windows 11 Photos App"
          >
            <ExternalLink size={12} />
            <span>Open in Photos</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas (Scroll to zoom, Click & Drag to pan) */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleDoubleClick}
        className={`flex-1 w-full h-full overflow-hidden flex items-center justify-center relative select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${
          bgMode === 'dark'
            ? 'bg-[#121212]'
            : bgMode === 'light'
            ? 'bg-[#e5e5e5]'
            : 'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-[#1a1a1a]'
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 text-neutral-400 text-xs">
            <RefreshCcw size={22} className="animate-spin text-[#60cdff]" />
            <span>Loading image preview...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 text-rose-400 text-xs p-6 bg-rose-950/30 rounded-xl border border-rose-800/40">
            <ImageIcon size={28} />
            <span>Failed to render image: {error}</span>
            <button
              onClick={() => onOpenExternal(file)}
              className="mt-2 text-xs font-semibold underline text-[#60cdff]"
            >
              Open in Windows Photos Viewer
            </button>
          </div>
        ) : imageSrc ? (
          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)',
            }}
            className="flex items-center justify-center pointer-events-none"
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt={file.name}
              onLoad={handleImageLoad}
              className="max-h-[82vh] max-w-[85vw] object-contain rounded-md shadow-2xl"
              draggable={false}
            />
          </div>
        ) : null}

        {/* Windows 11 Photos Floating Control Capsule (Bottom Center) */}
        {imageSrc && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-[#242424]/90 backdrop-blur-xl border border-white/[0.12] px-3 py-1.5 rounded-2xl shadow-2xl animate-fluent-in">
            {/* Zoom Out */}
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors"
              title="Zoom Out (Scroll Down / -)"
            >
              <ZoomOut size={15} />
            </button>

            {/* Zoom Percentage Pill */}
            <button
              onClick={handleResetZoom}
              className="px-2.5 py-1 text-xs font-mono font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors min-w-[54px] text-center"
              title="Click to Reset Zoom (100%)"
            >
              {Math.round(zoom * 100)}%
            </button>

            {/* Zoom In */}
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors"
              title="Zoom In (Scroll Up / +)"
            >
              <ZoomIn size={15} />
            </button>

            <div className="h-4 w-[1px] bg-white/[0.12] mx-1" />

            {/* Fit / Reset */}
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors"
              title="Fit to Window / Reset View"
            >
              <Maximize2 size={14} />
            </button>

            {/* Rotate 90 deg */}
            <button
              onClick={handleRotate}
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors"
              title="Rotate 90° Clockwise (R)"
            >
              <RotateCw size={14} />
            </button>

            {/* Flip Horizontal */}
            <button
              onClick={handleFlip}
              className={`p-1.5 rounded-xl transition-colors ${
                flipH
                  ? 'bg-[#60cdff]/20 text-[#60cdff]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/[0.08]'
              }`}
              title="Flip Horizontal"
            >
              <FlipHorizontal size={14} />
            </button>

            <div className="h-4 w-[1px] bg-white/[0.12] mx-1" />

            {/* Background Canvas Mode */}
            <div className="flex items-center gap-0.5 bg-black/30 p-0.5 rounded-xl">
              <button
                onClick={() => setBgMode('dark')}
                className={`p-1 rounded-lg text-xs ${
                  bgMode === 'dark' ? 'bg-[#343434] text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Dark Background"
              >
                <Moon size={12} />
              </button>
              <button
                onClick={() => setBgMode('checker')}
                className={`p-1 rounded-lg text-xs ${
                  bgMode === 'checker' ? 'bg-[#343434] text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Checkerboard Background"
              >
                <Grid size={12} />
              </button>
              <button
                onClick={() => setBgMode('light')}
                className={`p-1 rounded-lg text-xs ${
                  bgMode === 'light' ? 'bg-[#343434] text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Light Background"
              >
                <Sun size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Info Overlay Panel */}
        {showInfo && dimensions && (
          <div className="absolute top-4 right-4 z-30 w-72 bg-[#222222]/95 backdrop-blur-xl border border-white/[0.12] rounded-2xl p-4 shadow-2xl text-xs space-y-2.5 animate-fluent-in">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <span className="font-semibold text-neutral-100 uppercase tracking-wider text-[10px]">
                File Information
              </span>
              <button
                onClick={() => setShowInfo(false)}
                className="text-neutral-400 hover:text-neutral-100"
              >
                ×
              </button>
            </div>

            <div className="space-y-1.5 text-neutral-300">
              <div className="flex justify-between">
                <span className="text-neutral-500">Dimensions</span>
                <span className="font-mono">{dimensions.width} × {dimensions.height} px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">File Size</span>
                <span className="font-mono">{formatBytes(file.size)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Format</span>
                <span className="uppercase font-mono">{file.extension.replace('.', '')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Zoom Level</span>
                <span className="font-mono">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Rotation</span>
                <span className="font-mono">{rotation}°</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] text-[10px] text-neutral-400">
              💡 Scroll mouse wheel to zoom in/out. Click and drag to pan across the image. Double-click to toggle 100%/200%.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
