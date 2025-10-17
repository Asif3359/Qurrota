type Props = {
  width?: number | string;
  height?: number | string;
  className?: string;
  title?: string;
};

export default function QurrotaLogo({ width = 160, height = 50, className, title = 'Qurrota logo' }: Props) {
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
        
        <linearGradient id="uGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE169" />
          <stop offset="50%" stopColor="#F5C842" />
          <stop offset="100%" stopColor="#E6B400" />
        </linearGradient>
        
        <linearGradient id="rGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD669" />
          <stop offset="50%" stopColor="#F5B842" />
          <stop offset="100%" stopColor="#E6A000" />
        </linearGradient>
        
        <linearGradient id="rGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFBD69" />
          <stop offset="50%" stopColor="#F59842" />
          <stop offset="100%" stopColor="#E68300" />
        </linearGradient>
        
        <linearGradient id="oGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFA569" />
          <stop offset="50%" stopColor="#F57842" />
          <stop offset="100%" stopColor="#E65C00" />
        </linearGradient>
        
        <linearGradient id="tGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B19CFF" />
          <stop offset="50%" stopColor="#5e40b9" />
          <stop offset="100%" stopColor="#5D3FB8" />
        </linearGradient>
        
        <linearGradient id="aGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF95D5" />
          <stop offset="50%" stopColor="#E96BBF" />
          <stop offset="100%" stopColor="#D44FA8" />
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
        <g transform="translate(20, 6) scale(1.2)">
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

        {/* u - Adjusted spacing */}
        <g>
          <path d="M 65 52 L 65 68 Q 65 82 77 82 Q 89 82 89 68 L 89 52" fill="none" stroke="#5e40b9" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M 67 52 L 67 68 Q 67 78 77 78 Q 87 78 87 68 L 87 52" fill="none" stroke="url(#uGradient)" strokeWidth="10" strokeLinecap="round"/>
        </g>

        {/* r - Adjusted spacing */}
        <g>
          <path d="M 100 80 L 100 54 Q 100 47 107 47" fill="none" stroke="#5e40b9" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M 102 80 L 102 54 Q 102 49 106 49" fill="none" stroke="url(#rGradient1)" strokeWidth="10" strokeLinecap="round"/>
        </g>

        {/* r - Second r - Adjusted spacing */}
        <g>
          <path d="M 120 80 L 120 54 Q 120 47 127 47" fill="none" stroke="#5e40b9" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M 122 80 L 122 54 Q 122 49 126 49" fill="none" stroke="url(#rGradient2)" strokeWidth="10" strokeLinecap="round"/>
        </g>

        {/* o - Adjusted spacing */}
        <g>
          <ellipse cx="155" cy="65" rx="22" ry="25" fill="url(#oGradient)" stroke="#5e40b9" strokeWidth="3.5"/>
          <ellipse cx="155" cy="65" rx="11" ry="13" fill="white" opacity="0.9"/>
        </g>

        {/* t - Adjusted spacing */}
        <g>
          <path d="M 187 37 L 187 80 Q 187 87 192 87" fill="none" stroke="#5e40b9" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M 189 37 L 189 80 Q 189 83 191 83" fill="none" stroke="url(#tGradient)" strokeWidth="10" strokeLinecap="round"/>
          {/* crossbar outline in purple for visibility */}
          <line x1="176" y1="54" x2="199" y2="54" stroke="#5e40b9" strokeWidth="6" strokeLinecap="round"/>
          <line x1="178" y1="54" x2="197" y2="54" stroke="url(#tGradient)" strokeWidth="9" strokeLinecap="round"/>
        </g>

        {/* a - Final letter with adjusted spacing */}
        <g>
          <ellipse cx="225" cy="65" rx="22" ry="25" fill="url(#aGradient)" stroke="#5e40b9" strokeWidth="3.5"/>
          <ellipse cx="225" cy="65" rx="11" ry="13" fill="white" opacity="0.9"/>
          <path d="M 247 54 L 247 80" fill="none" stroke="#5e40b9" strokeWidth="7" strokeLinecap="round"/>
          <path d="M 245 54 L 245 80" fill="none" stroke="url(#aGradient)" strokeWidth="10" strokeLinecap="round"/>
        </g>

        {/* Enhanced decorative stars - adjusted positions */}
        {/* <g transform="translate(110, 15)">
          <path 
            d="M 0,-7 L 2,-2 L 7,0 L 2,2 L 0,7 L -2,2 L -7,0 L -2,-2 Z" 
            fill="#FF6B9D" 
            stroke="#C5005A" 
            strokeWidth="0.8"
            filter="url(#innerGlow)"
          />
        </g> */}
        
        {/* <g transform="translate(130, 28)">
          <path 
            d="M 0,-6 L 1.5,-1.5 L 6,0 L 1.5,1.5 L 0,6 L -1.5,1.5 L -6,0 L -1.5,-1.5 Z" 
            fill="#FFA500" 
            stroke="#CC8400" 
            strokeWidth="0.7"
          />
        </g> */}
        
        <g transform="translate(190, 22) scale(1.35)">
          <path 
            d="M 0,-6 L 1.5,-1.5 L 6,0 L 1.5,1.5 L 0,6 L -1.5,1.5 L -6,0 L -1.5,-1.5 Z" 
            fill="#4DD4F5" 
            stroke="#1E90D4" 
            strokeWidth="0.7"
          />
        </g>

        <g transform="translate(220, 22) scale(1.35)">
          <path 
            d="M 0,-6 L 1.5,-1.5 L 6,0 L 1.5,1.5 L 0,6 L -1.5,1.5 L -6,0 L -1.5,-1.5 Z" 
            fill="#A78BFF" 
            stroke="#5e40b9" 
            strokeWidth="0.7"
          />
        </g>

        {/* Additional small sparkle - adjusted position */}
        <g transform="translate(155, 18) scale(1.45)">
          <path 
            d="M 0,-4 L 1,-1 L 4,0 L 1,1 L 0,4 L -1,1 L -4,0 L -1,-1 Z" 
            fill="#FFE169" 
            stroke="#F5C842" 
            strokeWidth="1.7"
          />
        </g>
      </g>
    </svg>
  );
}