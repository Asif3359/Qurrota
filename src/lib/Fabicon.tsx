type Props = {
    width?: number | string;
    height?: number | string;
    className?: string;
    title?: string;
  };
  
  export default function Fabicon({ width = 160, height = 50, className, title = 'Qurrota logo' }: Props) {
    return (
      <svg 
        viewBox="0 0 310 100" 
        xmlns="http://www.w3.org/2000/svg" 
        width={width} 
        height={height} 
        className={className} 
        role="img"
        aria-label={title} 
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Enhanced gradients with better color progression */}
          <linearGradient id="qGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2AB6E8" />
            <stop offset="50%" stopColor="#1E90D4" />
            <stop offset="100%" stopColor="#0D6EB8" />
          </linearGradient>
          {/* Improved shadow for better depth */}
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feOffset dx="0" dy="3"/>
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0.3 0"/>
            <feBlend in="SourceGraphic" mode="normal"/>
          </filter>
  
          {/* Inner glow effect */}
          <filter id="innerGlow">
            <feFlood floodColor="white" floodOpacity="0.3"/>
            <feComposite in2="SourceAlpha" operator="in"/>
            <feGaussianBlur stdDeviation="1.5"/>
            <feComposite in="SourceGraphic" operator="over"/>
          </filter>
        </defs>
  
        {/* Main logo container with optimized positioning - starting closer */}
        <g transform="translate(5, 5)" filter="url(#softShadow)" strokeLinejoin="round">
          
          {/* Enhanced Crown - larger and clearer above Q */}
          <g transform="translate(21, 15) scale(1.2)">
            <path 
              d="M 0 12 L 4 0 L 8 8 L 12 0 L 16 8 L 20 0 L 24 12 L 12 16 Z" 
              fill="#FFD700" 
              stroke="#E6B800" 
              strokeWidth="2"
              filter="url(#innerGlow)"
            />
            <circle cx="12" cy="4" r="2.5" fill="#FF6B9D" stroke="#C5005A" strokeWidth="0.8"/>
            <circle cx="6" cy="7" r="1.2" fill="#4DD4F5" stroke="#1E90D4" strokeWidth="0.5"/>
            <circle cx="18" cy="7" r="1.2" fill="#A78BFF" stroke="#5e40b9" strokeWidth="0.5"/>
          </g>
  
          {/* Q - Moved closer to start */}
          <g>
            <ellipse cx="35" cy="65" rx="22" ry="25" fill="url(#qGradient)" stroke="#5e40b9" strokeWidth="3.5"/>
            <ellipse cx="35" cy="65" rx="11" ry="13" fill="white" opacity="0.9"/>
            <path d="M 44 78 L 54 90" stroke="#5e40b9" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M 43 77 L 53 89" stroke="url(#qGradient)" strokeWidth="2.5" strokeLinecap="round"/>
          </g>
        </g>
      </svg>
    );
  } 