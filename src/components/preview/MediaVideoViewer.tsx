import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  ExternalLink,
  FolderSymlink,
  Copy,
  Check,
  Music,
  Video as VideoIcon,
  RefreshCcw,
  Gauge,
} from 'lucide-react';
import { FileItem } from '../../types';
import { api } from '../../services/apiBridge';
import { formatBytes } from '../../utils/formatters';

interface MediaVideoViewerProps {
  file: FileItem;
  onOpenExternal: (file: FileItem) => void;
  onRevealInFolder: (file: FileItem) => void;
  onCopyPath: (file: FileItem) => void;
}

export const MediaVideoViewer: React.FC<MediaVideoViewerProps> = ({
  file,
  onOpenExternal,
  onRevealInFolder,
  onCopyPath,
}) => {
  const [mediaSrc, setMediaSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const ext = file.extension.toLowerCase();
  const isAudio = ['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac', '.wma', '.mid', '.midi'].includes(ext);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setMediaSrc(null);
    setIsPlaying(false);

    const loadMedia = async () => {
      try {
        const res = await api.readMediaDataUrl(file.path);
        if (isMounted) {
          setMediaSrc(res.dataUrl);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load media file');
          setLoading(false);
        }
      }
    };

    loadMedia();

    return () => {
      isMounted = false;
    };
  }, [file.path]);

  const handleCopy = () => {
    onCopyPath(file);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
    if (audioRef.current) audioRef.current.playbackRate = speed;
  };

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-[#181818] overflow-hidden select-none transition-colors">
      {/* Top Header Controls Toolbar */}
      <div className="h-10 border-b border-black/[0.06] dark:border-white/[0.08] bg-neutral-50/90 dark:bg-[#252525]/90 px-3.5 flex items-center justify-between text-xs shrink-0 select-none transition-colors">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#0078d4]/10 dark:bg-[#60cdff]/15 text-[#0067c0] dark:text-[#60cdff]">
            {isAudio ? <Music size={14} /> : <VideoIcon size={14} />}
          </div>
          <span className="font-mono text-[10.5px] text-[#0067c0] dark:text-[#60cdff] font-semibold uppercase bg-[#0078d4]/10 dark:bg-[#60cdff]/15 px-2 py-0.5 rounded-md border border-[#0078d4]/20">
            {ext.replace('.', '') || (isAudio ? 'AUDIO' : 'VIDEO')}
          </span>
          <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
            {formatBytes(file.size)}
          </span>
        </div>

        {/* Speed Controls & Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-lg border border-black/[0.05] dark:border-white/[0.06]">
            {[0.75, 1, 1.25, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`px-1.5 py-0.5 rounded text-[10.5px] font-mono transition-colors ${
                  playbackRate === s
                    ? 'bg-[#0078d4] text-white dark:bg-[#60cdff] dark:text-neutral-950 font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={() => onOpenExternal(file)}
            className="flex items-center gap-1 text-[11px] font-semibold bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#60cdff] dark:hover:bg-[#78d4ff] text-white dark:text-neutral-950 px-2.5 py-1 rounded-lg transition-colors shadow-sm"
            title="Open in Windows Media Player"
          >
            <ExternalLink size={12} />
            <span>Open in App</span>
          </button>
        </div>
      </div>

      {/* Main Playback Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 bg-[#f3f3f3] dark:bg-[#181818] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 text-neutral-400 text-xs">
            <RefreshCcw size={22} className="animate-spin text-[#0078d4] dark:text-[#60cdff]" />
            <span>Loading {isAudio ? 'audio' : 'video'} stream...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 text-rose-500 text-xs p-6 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800/40 max-w-md text-center">
            {isAudio ? <Music size={28} /> : <VideoIcon size={28} />}
            <span>Failed to decode media: {error}</span>
            <button
              onClick={() => onOpenExternal(file)}
              className="mt-2 px-3 py-1.5 bg-[#0078d4] text-white rounded-lg font-semibold"
            >
              Play in Windows Media Player
            </button>
          </div>
        ) : isAudio ? (
          /* Dedicated Audio Player Card */
          <div className="w-full max-w-xl bg-white dark:bg-[#262626] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-7 shadow-xl space-y-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0078d4] to-[#60cdff] flex items-center justify-center shadow-lg shadow-blue-500/25 text-white animate-pulse">
              <Music size={44} />
            </div>

            <div className="text-center min-w-0 max-w-full">
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 truncate" title={file.name}>
                {file.name}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5 font-mono">
                {formatBytes(file.size)} • {ext.toUpperCase()} Audio Track
              </p>
            </div>

            {mediaSrc && (
              <audio
                ref={audioRef}
                controls
                src={mediaSrc}
                className="w-full rounded-xl focus:outline-none"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            )}
          </div>
        ) : (
          /* Dedicated Video Player Canvas */
          <div className="w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-black/[0.1] dark:border-white/[0.1] flex flex-col items-center">
            {mediaSrc && (
              <video
                ref={videoRef}
                controls
                src={mediaSrc}
                className="w-full max-h-[72vh] rounded-2xl bg-black object-contain focus:outline-none"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
