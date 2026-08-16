import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

// Authentic Microsoft Word Icon (Fluent Blue)
export const WordIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="6" y="2" width="22" height="28" rx="3" fill="#185ABD" />
    <path
      d="M28 6.5V25.5C28 27.1569 26.6569 28.5 25 28.5H12V3.5H25C26.6569 3.5 28 4.84315 28 6.5Z"
      fill="#2B7CD3"
    />
    <rect x="2" y="7" width="16" height="18" rx="2.5" fill="#103F91" />
    <path
      d="M5.5 11.5H7.2L8.6 18.2L10.1 11.5H11.5L13 18.2L14.4 11.5H16.1L13.8 20.5H12.2L10.8 14.2L9.4 20.5H7.8L5.5 11.5Z"
      fill="white"
    />
  </svg>
);

// Authentic Microsoft Excel Icon (Fluent Emerald Green)
export const ExcelIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="6" y="2" width="22" height="28" rx="3" fill="#107C41" />
    <path
      d="M28 6.5V25.5C28 27.1569 26.6569 28.5 25 28.5H12V3.5H25C26.6569 3.5 28 4.84315 28 6.5Z"
      fill="#188C43"
    />
    <rect x="2" y="7" width="16" height="18" rx="2.5" fill="#0E5C2F" />
    <path
      d="M6.2 11.5H8.3L10.8 15.6L13.3 11.5H15.4L11.9 16L15.6 20.5H13.5L10.8 16.4L8.1 20.5H6L9.7 16L6.2 11.5Z"
      fill="white"
    />
  </svg>
);

// Authentic Microsoft PowerPoint Icon (Fluent Orange/Red)
export const PowerPointIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="6" y="2" width="22" height="28" rx="3" fill="#C43E1C" />
    <path
      d="M28 6.5V25.5C28 27.1569 26.6569 28.5 25 28.5H12V3.5H25C26.6569 3.5 28 4.84315 28 6.5Z"
      fill="#D9532F"
    />
    <rect x="2" y="7" width="16" height="18" rx="2.5" fill="#992B10" />
    <path
      d="M6.5 11.5H10.5C12.5 11.5 13.8 12.6 13.8 14.5C13.8 16.4 12.5 17.5 10.5 17.5H8.5V20.5H6.5V11.5ZM8.5 15.7H10.3C11.3 15.7 11.9 15.2 11.9 14.5C11.9 13.8 11.3 13.3 10.3 13.3H8.5V15.7Z"
      fill="white"
    />
  </svg>
);

// Authentic Microsoft Project Icon (Fluent Teal)
export const ProjectIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="6" y="2" width="22" height="28" rx="3" fill="#25825F" />
    <path
      d="M28 6.5V25.5C28 27.1569 26.6569 28.5 25 28.5H12V3.5H25C26.6569 3.5 28 4.84315 28 6.5Z"
      fill="#2BA77A"
    />
    {/* Gantt Bar Accents */}
    <rect x="15" y="8" width="8" height="2.5" rx="1" fill="#8CE1C2" />
    <rect x="18" y="13" width="7" height="2.5" rx="1" fill="#8CE1C2" />
    <rect x="14" y="18" width="9" height="2.5" rx="1" fill="#8CE1C2" />
    <rect x="2" y="7" width="16" height="18" rx="2.5" fill="#185E43" />
    <path
      d="M6.5 11.5H10.5C12.5 11.5 13.8 12.6 13.8 14.5C13.8 16.4 12.5 17.5 10.5 17.5H8.5V20.5H6.5V11.5ZM8.5 15.7H10.3C11.3 15.7 11.9 15.2 11.9 14.5C11.9 13.8 11.3 13.3 10.3 13.3H8.5V15.7Z"
      fill="white"
    />
  </svg>
);

// Authentic Microsoft Publisher Icon (Fluent Turquoise)
export const PublisherIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="6" y="2" width="22" height="28" rx="3" fill="#00757F" />
    <path
      d="M28 6.5V25.5C28 27.1569 26.6569 28.5 25 28.5H12V3.5H25C26.6569 3.5 28 4.84315 28 6.5Z"
      fill="#0097A7"
    />
    {/* Page layout graphics */}
    <rect x="15" y="7" width="10" height="9" rx="1" fill="#80DEEA" />
    <rect x="15" y="19" width="10" height="5" rx="1" fill="#B2EBF2" />
    <rect x="2" y="7" width="16" height="18" rx="2.5" fill="#005B60" />
    <path
      d="M6.5 11.5H10.5C12.5 11.5 13.8 12.6 13.8 14.5C13.8 16.4 12.5 17.5 10.5 17.5H8.5V20.5H6.5V11.5ZM8.5 15.7H10.3C11.3 15.7 11.9 15.2 11.9 14.5C11.9 13.8 11.3 13.3 10.3 13.3H8.5V15.7Z"
      fill="white"
    />
  </svg>
);

// Authentic Adobe Acrobat / PDF Icon (Adobe Crimson)
export const PdfIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="4" y="2" width="24" height="28" rx="4" fill="#D32F2F" />
    <path
      d="M20.5 14C19.8 12.8 18.5 10.5 18.2 8.5C18.1 7.8 17.6 7 16.8 7C16 7 15.5 7.7 15.6 8.5C15.8 10.8 16.8 13.8 17.5 15.5C16.8 17.5 15.2 20.8 13.8 22.2C12.5 23.4 10.8 24.2 9.5 24C8.5 23.8 8 22.8 8.4 21.8C9 20.2 11.8 19.5 14.2 19C16.2 17 17.8 15 18.8 13.5C20.5 14.5 23.2 15.5 24.5 15.5C25.4 15.5 25.8 14.8 25.5 14C24.8 12.8 22.5 13.5 20.5 14ZM10 22.5C9.8 22.6 9.5 22.5 9.5 22.2C9.5 21.6 11 20.8 12.8 20.2C11.5 21.2 10.5 22.1 10 22.5ZM17 9.2C17.2 8.5 17.4 8.5 17.4 8.8C17.4 9.8 16.8 11.8 16.5 12.8C16.5 11.2 16.8 9.8 17 9.2ZM19.2 15C18.2 16.2 16.8 18 15.5 19.5C16.5 17.8 17.2 15.8 17.8 14.5C18.2 14.8 18.8 14.8 19.2 15ZM24 14.5C23.8 14.5 22.8 14.2 21.2 13.8C22.8 13.5 23.8 14 24 14.5Z"
      fill="white"
    />
  </svg>
);

// Authentic Microsoft Visio Icon (Fluent Indigo)
export const VisioIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="6" y="2" width="22" height="28" rx="3" fill="#3955A3" />
    <path
      d="M28 6.5V25.5C28 27.1569 26.6569 28.5 25 28.5H12V3.5H25C26.6569 3.5 28 4.84315 28 6.5Z"
      fill="#4769C2"
    />
    {/* Diagram shapes */}
    <rect x="15" y="7" width="8" height="5" rx="1" fill="#A4B5E8" />
    <rect x="19" y="18" width="7" height="5" rx="1" fill="#A4B5E8" />
    <path d="M19 12V18" stroke="#D1DCFA" strokeWidth="1.5" />
    <rect x="2" y="7" width="16" height="18" rx="2.5" fill="#293D75" />
    <path
      d="M6 11.5H8.2L10.5 17.8L12.8 11.5H15L11.6 20.5H9.4L6 11.5Z"
      fill="white"
    />
  </svg>
);

// Authentic Microsoft Access Icon (Fluent Maroon/Crimson)
export const AccessIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="6" y="2" width="22" height="28" rx="3" fill="#A4373A" />
    <path
      d="M28 6.5V25.5C28 27.1569 26.6569 28.5 25 28.5H12V3.5H25C26.6569 3.5 28 4.84315 28 6.5Z"
      fill="#C14346"
    />
    <rect x="2" y="7" width="16" height="18" rx="2.5" fill="#752224" />
    <path
      d="M10.2 11.5L6.2 20.5H8.3L9.2 18.2H12.8L13.7 20.5H15.8L11.8 11.5H10.2ZM10 16.5L11 13.8L12 16.5H10Z"
      fill="white"
    />
  </svg>
);

// Authentic Microsoft OneNote Icon (Fluent Purple)
export const OneNoteIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect x="6" y="2" width="22" height="28" rx="3" fill="#7719AA" />
    <path
      d="M28 6.5V25.5C28 27.1569 26.6569 28.5 25 28.5H12V3.5H25C26.6569 3.5 28 4.84315 28 6.5Z"
      fill="#8C24C2"
    />
    <rect x="2" y="7" width="16" height="18" rx="2.5" fill="#540C7B" />
    <path
      d="M6.5 11.5H8.5L12.5 17.5V11.5H14.5V20.5H12.5L8.5 14.5V20.5H6.5V11.5Z"
      fill="white"
    />
  </svg>
);
