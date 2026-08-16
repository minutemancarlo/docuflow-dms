import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

// Authentic Zip / Archive Icon (Amber / Gold Zipper Tile)
export const ArchiveZipIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="5" y="2" width="22" height="28" rx="3.5" fill="#D97706" />
    <path
      d="M27 6.5V25.5C27 27.1569 25.6569 28.5 24 28.5H12V3.5H24C25.6569 3.5 27 4.84315 27 6.5Z"
      fill="#F59E0B"
    />
    {/* Zipper Teeth pattern */}
    <rect x="14" y="5" width="4" height="2" rx="0.5" fill="#FEF3C7" />
    <rect x="12" y="8" width="4" height="2" rx="0.5" fill="#FEF3C7" />
    <rect x="14" y="11" width="4" height="2" rx="0.5" fill="#FEF3C7" />
    <rect x="12" y="14" width="4" height="2" rx="0.5" fill="#FEF3C7" />
    <rect x="14" y="17" width="4" height="2" rx="0.5" fill="#FEF3C7" />
    {/* Zipper Pull Slider */}
    <rect x="11.5" y="20" width="7" height="6" rx="1.5" fill="#78350F" />
    <circle cx="15" cy="23" r="1.5" fill="#FDE68A" />
    <rect x="13.5" y="24" width="3" height="4" rx="1" fill="#78350F" />
  </svg>
);

// Authentic RAR / 7z Archive Icon (Purple / Indigo Multi-Volume Books)
export const ArchiveRarIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="5" y="2" width="22" height="28" rx="3.5" fill="#6D28D9" />
    <path
      d="M27 6.5V25.5C27 27.1569 25.6569 28.5 24 28.5H12V3.5H24C25.6569 3.5 27 4.84315 27 6.5Z"
      fill="#8B5CF6"
    />
    {/* Belt / Clamp Graphic */}
    <rect x="12" y="6" width="13" height="3" rx="1" fill="#4C1D95" />
    <rect x="12" y="11" width="13" height="3" rx="1" fill="#4C1D95" />
    <rect x="12" y="16" width="13" height="3" rx="1" fill="#4C1D95" />
    <rect x="8" y="5" width="6" height="16" rx="1.5" fill="#FDE047" />
    <rect x="10" y="21" width="12" height="3" rx="1" fill="#EDE9FE" />
  </svg>
);

// Authentic Image / Photo Icon (Pink / Rose Gradient Frame)
export const ImageMediaIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="4" y="4" width="24" height="24" rx="4" fill="#DB2777" />
    <path
      d="M28 8V24C28 26.2091 26.2091 28 24 28H10C12 28 28 26 28 8Z"
      fill="#F472B6"
      opacity="0.6"
    />
    {/* Sun / Moon circle */}
    <circle cx="10" cy="11" r="2.5" fill="#FEF08A" />
    {/* Mountain Landscape */}
    <path
      d="M6 24L12 16L17 21L21 15L26 24H6Z"
      fill="#FCE7F3"
    />
    <path
      d="M17 21L21 15L26 24H16L17 21Z"
      fill="#FBCFE8"
    />
  </svg>
);

// Authentic Vector SVG / Illustrator Icon (Orange / Amber Design Badge)
export const VectorSvgIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="4" y="4" width="24" height="24" rx="4" fill="#EA580C" />
    {/* Pen Tool / Vector Bezier Node */}
    <circle cx="8" cy="8" r="2" fill="#FED7AA" />
    <circle cx="24" cy="8" r="2" fill="#FED7AA" />
    <circle cx="24" cy="24" r="2" fill="#FED7AA" />
    <path d="M8 8H24V24" stroke="#FFF7ED" strokeWidth="2" strokeDasharray="2 2" />
    <path
      d="M16 11L21 18H11L16 11Z"
      fill="white"
    />
    <circle cx="16" cy="18" r="1.5" fill="#C2410C" />
  </svg>
);

// Authentic Video / Movie Clip Icon (Vibrant Violet Film Reel)
export const VideoMediaIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="4" y="4" width="24" height="24" rx="4.5" fill="#7C3AED" />
    {/* Top & Bottom Film Perforations */}
    <rect x="7" y="6" width="3" height="2.5" rx="0.5" fill="#DDD6FE" />
    <rect x="12" y="6" width="3" height="2.5" rx="0.5" fill="#DDD6FE" />
    <rect x="17" y="6" width="3" height="2.5" rx="0.5" fill="#DDD6FE" />
    <rect x="22" y="6" width="3" height="2.5" rx="0.5" fill="#DDD6FE" />

    <rect x="7" y="23.5" width="3" height="2.5" rx="0.5" fill="#DDD6FE" />
    <rect x="12" y="23.5" width="3" height="2.5" rx="0.5" fill="#DDD6FE" />
    <rect x="17" y="23.5" width="3" height="2.5" rx="0.5" fill="#DDD6FE" />
    <rect x="22" y="23.5" width="3" height="2.5" rx="0.5" fill="#DDD6FE" />

    {/* Center Play Button Triangle */}
    <polygon points="13,11 22,16 13,21" fill="white" />
  </svg>
);

// Authentic Audio / Sound Wave Icon (Cyan / Teal Musical Note)
export const AudioMediaIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="4" y="4" width="24" height="24" rx="4.5" fill="#0891B2" />
    <path
      d="M28 8V24C28 26.2091 26.2091 28 24 28H10C12 28 28 26 28 8Z"
      fill="#22D3EE"
      opacity="0.6"
    />
    {/* Sound Waves / Equalizer */}
    <rect x="8" y="14" width="2" height="6" rx="1" fill="#CFFAFE" />
    <rect x="12" y="10" width="2" height="14" rx="1" fill="#CFFAFE" />
    <rect x="16" y="7" width="2" height="18" rx="1" fill="white" />
    <rect x="20" y="11" width="2" height="12" rx="1" fill="#CFFAFE" />
    <rect x="24" y="15" width="2" height="5" rx="1" fill="#CFFAFE" />
  </svg>
);
