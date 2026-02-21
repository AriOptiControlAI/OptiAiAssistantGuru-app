interface OptiAvatarProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export default function OptiAvatar({
  size = 48,
  animated = true,
  className = '',
}: OptiAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Opti — AI Automation Expert"
    >
      {/* Ambient glow ring */}
      <circle cx="40" cy="44" r="34" fill="rgba(30,58,138,0.08)" />

      {/* Antenna rod */}
      <rect x="38.5" y="5" width="3" height="11" rx="1.5" fill="#1E3A8A" />
      {/* Antenna collar */}
      <rect x="35.5" y="13.5" width="9" height="2.5" rx="1.25" fill="#1E3A8A" />
      {/* Antenna tip orb */}
      <circle cx="40" cy="5" r="2.5" fill="#2563EB" />
      {/* Antenna inner glow */}
      <circle cx="40" cy="5" r="1" fill="rgba(147,197,253,0.8)" />

      {/* Head body */}
      <rect x="9" y="16" width="62" height="52" rx="11" fill="#0D1B3E" />

      {/* Inner face panel */}
      <rect x="13" y="20" width="54" height="44" rx="9" fill="#0F2248" />

      {/* Brow ridge — subtle horizontal line */}
      <rect x="18" y="27" width="44" height="1.5" rx="0.75" fill="rgba(30,58,138,0.45)" />

      {/* Left eye socket */}
      <rect x="17" y="31" width="20" height="15" rx="5" fill="#070D1A" />

      {/* Right eye socket */}
      <rect x="43" y="31" width="20" height="15" rx="5" fill="#070D1A" />

      {/* Left eye iris */}
      <circle
        cx="27"
        cy="38.5"
        r="5.5"
        fill="#2563EB"
        className={animated ? 'opti-eye' : ''}
      />
      {/* Left pupil */}
      <circle cx="27" cy="38.5" r="2.5" fill="#1D4ED8" />
      {/* Left reflection */}
      <circle cx="29" cy="36.8" r="1.4" fill="rgba(255,255,255,0.5)" />

      {/* Right eye iris */}
      <circle
        cx="53"
        cy="38.5"
        r="5.5"
        fill="#2563EB"
        className={animated ? 'opti-eye delay' : ''}
      />
      {/* Right pupil */}
      <circle cx="53" cy="38.5" r="2.5" fill="#1D4ED8" />
      {/* Right reflection */}
      <circle cx="55" cy="36.8" r="1.4" fill="rgba(255,255,255,0.5)" />

      {/* Nose bridge */}
      <rect x="39" y="33" width="2" height="10" rx="1" fill="rgba(30,58,138,0.35)" />

      {/* Mouth track */}
      <rect x="20" y="52" width="40" height="5.5" rx="2.75" fill="#070D1A" />
      {/* Mouth fill bar */}
      <rect x="20" y="52" width="24" height="5.5" rx="2.75" fill="#1E3A8A" />
      {/* Active segment */}
      <rect x="20" y="52" width="8" height="5.5" rx="2.75" fill="#2563EB" />

      {/* Left ear */}
      <rect x="5" y="30" width="6" height="16" rx="3" fill="#0D1B3E" />
      <rect x="5" y="34" width="6" height="4" rx="2" fill="#1E3A8A" />

      {/* Right ear */}
      <rect x="69" y="30" width="6" height="16" rx="3" fill="#0D1B3E" />
      <rect x="69" y="34" width="6" height="4" rx="2" fill="#1E3A8A" />

      {/* Chin ports */}
      <rect x="29" y="63" width="6" height="2.5" rx="1.25" fill="#1E3A8A" />
      <rect x="39" y="63" width="6" height="2.5" rx="1.25" fill="rgba(30,58,138,0.5)" />
      <rect x="49" y="63" width="6" height="2.5" rx="1.25" fill="rgba(30,58,138,0.28)" />
    </svg>
  );
}
