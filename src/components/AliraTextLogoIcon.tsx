import React from 'react';

export const AliraTextLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 150 60"
    aria-label="Alira logo"
    {...props}
  >
    <text 
      x="50%" 
      y="50%" 
      dy=".35em"
      textAnchor="middle" 
      fontFamily="Lora, Georgia, serif"
      fontSize="52"
      fontWeight="600"
      fill="currentColor"
    >
      Alira
    </text>
  </svg>
);
