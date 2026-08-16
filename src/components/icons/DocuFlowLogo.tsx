import React from 'react';
import { APP_ICON_DATA } from '../../assets/iconBase64';

interface DocuFlowLogoProps {
  size?: number;
  className?: string;
  useVectorFallback?: boolean;
}

export const DocuFlowLogo: React.FC<DocuFlowLogoProps> = ({
  size = 32,
  className = '',
  useVectorFallback = false,
}) => {
  if (!useVectorFallback && APP_ICON_DATA) {
    return (
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`relative rounded-lg overflow-hidden flex items-center justify-center shadow-md shadow-blue-500/20 bg-slate-900 border border-white/10 shrink-0 ${className}`}
      >
        <img
          src={APP_ICON_DATA}
          alt="DocuFlow Logo"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Windows 11 Fluent 3D Vector Glass Sheets Logo
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-md ${className}`}
    >
      <defs>
        <linearGradient id="df-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="sheet1" x1="8" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0078d4" />
          <stop offset="100%" stopColor="#004e8c" />
        </linearGradient>
        <linearGradient id="sheet2" x1="14" y1="12" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60cdff" />
          <stop offset="100%" stopColor="#0078d4" />
        </linearGradient>
        <linearGradient id="sheet3" x1="18" y1="16" x2="44" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Squircle Container */}
      <rect width="48" height="48" rx="12" fill="url(#df-bg)" />
      <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke="rgba(255,255,255,0.12)" />

      {/* Back Layer Sheet */}
      <path
        d="M18 14H34C35.1 14 36 14.9 36 16V36C36 37.1 35.1 38 34 38H18C16.9 38 16 37.1 16 36V16C16 14.9 16.9 14 18 14Z"
        fill="url(#sheet1)"
        opacity="0.6"
        transform="rotate(6 26 26)"
      />

      {/* Middle Layer Sheet */}
      <path
        d="M15 12H31C32.1 12 33 12.9 33 14V34C33 35.1 32.1 36 31 36H15C13.9 36 13 35.1 13 34V14C13 12.9 13.9 12 15 12Z"
        fill="url(#sheet2)"
        opacity="0.8"
        transform="rotate(2 23 24)"
      />

      {/* Front Curved Glass Sheet with Fold */}
      <path
        d="M12 10H25L32 17V32C32 33.1 31.1 34 30 34H12C10.9 34 10 33.1 10 32V12C10 10.9 10.9 10 12 10Z"
        fill="url(#sheet3)"
      />
      {/* Corner Fold */}
      <path
        d="M25 10V17H32L25 10Z"
        fill="#e0f2fe"
        opacity="0.95"
      />
      <path
        d="M14 20H28M14 24H25M14 28H21"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
};
