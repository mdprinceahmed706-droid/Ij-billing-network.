import React from 'react';

interface IJLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  className?: string;
  showGlow?: boolean;
}

export const IJLogo: React.FC<IJLogoProps> = ({
  size = 'md',
  className = '',
  showGlow = true
}) => {
  const pixelSize = typeof size === 'number' ? size : {
    xs: 28,
    sm: 40,
    md: 48,
    lg: 64,
    xl: 80,
    '2xl': 110
  }[size];

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      {/* Background ambient glow effect */}
      {showGlow && (
        <div 
          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 opacity-60 blur-md pointer-events-none animate-pulse" 
          style={{ filter: 'blur(6px)' }}
        />
      )}

      {/* 3D Glossy Vector SVG Icon */}
      <svg 
        viewBox="0 0 512 512" 
        width={pixelSize} 
        height={pixelSize} 
        className="relative z-10 w-full h-full drop-shadow-xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Background Radial Glow */}
          <radialGradient id="ijBgGlow" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* 3D Cyan-Blue Gradient for 'I' */}
          <linearGradient id="ijGradI" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="35%" stopColor="#0284c7" />
            <stop offset="75%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#082f49" />
          </linearGradient>

          {/* 3D Metallic Amber-Cyan Gradient for 'J' */}
          <linearGradient id="ijGradJ" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="45%" stopColor="#0284c7" />
            <stop offset="85%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>

          {/* Fiber Glow Gradient */}
          <linearGradient id="ijFiberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Gloss Highlight */}
          <linearGradient id="ijGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Bevel Highlight */}
          <linearGradient id="ijBevel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
          </linearGradient>

          {/* Drop Shadow and Outer Glow Filter */}
          <filter id="ijShadow3d" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000000" floodOpacity="0.75" />
            <feDropShadow dx="0" dy="0" stdDeviation="16" floodColor="#0284c7" floodOpacity="0.6" />
          </filter>

          <filter id="ijWifiGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#38bdf8" floodOpacity="0.9" />
          </filter>
        </defs>

        {/* Squircle Rounded Container */}
        <rect width="512" height="512" rx="112" fill="url(#ijBgGlow)" />
        <rect width="504" height="504" x="4" y="4" rx="108" fill="none" stroke="#38bdf8" strokeWidth="4" strokeOpacity="0.5" />
        <rect width="496" height="496" x="8" y="8" rx="104" fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeOpacity="0.3" />

        {/* High-Tech Optical Waves / WiFi Rings in Background */}
        <g filter="url(#ijWifiGlow)" opacity="0.45">
          <circle cx="256" cy="180" r="140" fill="none" stroke="#0284c7" strokeWidth="4" strokeDasharray="8 12" />
          <circle cx="256" cy="180" r="190" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="16 20" />
          <circle cx="256" cy="180" r="230" fill="none" stroke="#06b6d4" strokeWidth="2" strokeOpacity="0.35" />
        </g>

        {/* Fiber Optic Data Nodes Grid Lines */}
        <g stroke="#0284c7" strokeWidth="1.5" strokeOpacity="0.3">
          <line x1="80" y1="256" x2="432" y2="256" />
          <line x1="256" y1="80" x2="256" y2="432" />
          <line x1="120" y1="120" x2="392" y2="392" strokeDasharray="4 8" />
          <line x1="392" y1="120" x2="120" y2="392" strokeDasharray="4 8" />
        </g>

        {/* Glowing Fiber Nodes */}
        <circle cx="120" cy="120" r="4" fill="#38bdf8" filter="url(#ijWifiGlow)" />
        <circle cx="392" cy="120" r="4" fill="#38bdf8" filter="url(#ijWifiGlow)" />
        <circle cx="120" cy="392" r="4" fill="#06b6d4" filter="url(#ijWifiGlow)" />
        <circle cx="392" cy="392" r="4" fill="#06b6d4" filter="url(#ijWifiGlow)" />
        <circle cx="256" cy="70" r="5" fill="#38bdf8" filter="url(#ijWifiGlow)" />

        {/* 3D LETTER 'I' */}
        <g filter="url(#ijShadow3d)">
          {/* Base 3D Extrusion Depth */}
          <path d="M 120 120 L 220 120 L 220 160 L 195 160 L 195 340 L 220 340 L 220 380 L 120 380 L 120 340 L 145 340 L 145 160 L 120 160 Z" fill="#03254c" transform="translate(0, 10)" />

          {/* Front Face with Gradient */}
          <path d="M 120 120 L 220 120 L 220 160 L 195 160 L 195 340 L 220 340 L 220 380 L 120 380 L 120 340 L 145 340 L 145 160 L 120 160 Z" fill="url(#ijGradI)" />

          {/* Metallic Top Bevel Edge */}
          <path d="M 120 120 L 220 120 L 210 130 L 130 130 Z" fill="url(#ijBevel)" />
          <path d="M 145 160 L 155 170 L 155 330 L 145 340 Z" fill="#ffffff" fillOpacity="0.25" />

          {/* Fiber Laser Stripe on 'I' */}
          <rect x="166" y="145" width="8" height="210" rx="4" fill="url(#ijFiberGlow)" opacity="0.9" />
          <circle cx="170" cy="140" r="5" fill="#ffffff" filter="url(#ijWifiGlow)" />
        </g>

        {/* 3D LETTER 'J' */}
        <g filter="url(#ijShadow3d)">
          {/* Base 3D Extrusion Depth */}
          <path d="M 270 120 L 375 120 L 375 315 C 375 365 335 390 280 390 C 235 390 205 365 205 335 L 250 335 C 250 348 262 355 280 355 C 305 355 325 340 325 315 L 325 160 L 270 160 Z" fill="#03254c" transform="translate(0, 10)" />

          {/* Front Face with Gradient */}
          <path d="M 270 120 L 375 120 L 375 315 C 375 365 335 390 280 390 C 235 390 205 365 205 335 L 250 335 C 250 348 262 355 280 355 C 305 355 325 340 325 315 L 325 160 L 270 160 Z" fill="url(#ijGradJ)" />

          {/* Metallic Top Bevel Edge */}
          <path d="M 270 120 L 375 120 L 365 130 L 280 130 Z" fill="url(#ijBevel)" />
          <path d="M 325 160 L 335 170 L 335 315 C 335 335 320 345 300 348 L 325 315 Z" fill="#ffffff" fillOpacity="0.25" />

          {/* Fiber Laser Stripe on 'J' */}
          <path d="M 346 145 L 346 310 C 346 338 325 360 285 360" fill="none" stroke="url(#ijFiberGlow)" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
          <circle cx="350" cy="140" r="5" fill="#ffffff" filter="url(#ijWifiGlow)" />
        </g>

        {/* WiFi Signal Wave Broadcast from top */}
        <g stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" fill="none" filter="url(#ijWifiGlow)">
          <path d="M 230 75 A 35 35 0 0 1 282 75" opacity="0.9" />
          <path d="M 215 55 A 58 58 0 0 1 297 55" opacity="0.75" />
          <path d="M 200 35 A 82 82 0 0 1 312 35" opacity="0.55" />
        </g>
        <circle cx="256" cy="90" r="4.5" fill="#ffffff" filter="url(#ijWifiGlow)" />

        {/* Gloss Overlay */}
        <path d="M 0 0 L 512 0 L 512 210 C 350 160 160 230 0 170 Z" fill="url(#ijGloss)" opacity="0.45" />

        {/* Sub-label banner inside logo */}
        <rect x="136" y="420" width="240" height="34" rx="10" fill="#090d16" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.7" />
        <text 
          x="256" 
          y="443" 
          textAnchor="middle" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="17" 
          fontWeight="900" 
          letterSpacing="4" 
          fill="#38bdf8"
        >
          NETWORK
        </text>
      </svg>
    </div>
  );
};
