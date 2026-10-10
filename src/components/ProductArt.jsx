const PALETTES = {
  Electronics: [
    ["#2A1466", "#6C3EF4", "#B69CFF"],
    ["#0F3D6B", "#2E90D9", "#AEDCF9"],
    ["#134E3A", "#1E8E5A", "#A9E6C7"],
  ],
  Fashion: [
    ["#5C2D0C", "#E8622C", "#FCD9BC"],
    ["#7A1F4D", "#D9418F", "#F7C9E0"],
    ["#4A3418", "#B8791E", "#F4E3C1"],
  ],
  Home: [
    ["#0F3D22", "#1E8E5A", "#C7EBD3"],
    ["#3A2418", "#B8791E", "#F4E3C1"],
    ["#2A1466", "#6C3EF4", "#D9C8FF"],
  ],
  Beauty: [
    ["#7A1F1F", "#D33C3C", "#FBE4E4"],
    ["#7A1F4D", "#D9418F", "#F7C9E0"],
    ["#5C2D0C", "#E8622C", "#FCD9BC"],
  ],
  Kids: [
    ["#123A5C", "#2E90D9", "#D6ECFB"],
    ["#7A1F4D", "#D9418F", "#F7C9E0"],
    ["#134E3A", "#1E8E5A", "#A9E6C7"],
  ],
  Sport: [
    ["#211C17", "#E8622C", "#F2A93B"],
    ["#0F3D6B", "#2E90D9", "#AEDCF9"],
    ["#2A1466", "#6C3EF4", "#B69CFF"],
  ],
  Food: [
    ["#5C3D0C", "#B8791E", "#F4E3C1"],
    ["#7A1F1F", "#D33C3C", "#FBE4E4"],
    ["#134E3A", "#1E8E5A", "#A9E6C7"],
  ],
  Books: [
    ["#2A1466", "#6C3EF4", "#EFE8FF"],
    ["#5C2D0C", "#E8622C", "#FCD9BC"],
    ["#0F3D6B", "#2E90D9", "#D6ECFB"],
  ],
}

export default function ProductArt({ cat, id, className = "" }) {
  const variants = PALETTES[cat] || PALETTES.Home
  const idx = id != null ? id % variants.length : 0
  const [c1, c2, c3] = variants[idx]

  const shapes = {
    Electronics: (
      <>
        <rect x="30" y="35" width="140" height="95" rx="10" fill={c2} />
        <rect x="42" y="47" width="116" height="70" rx="4" fill={c1} />
        <circle cx="100" cy="145" r="6" fill={c3} />
      </>
    ),
    Fashion: (
      <>
        <path d="M70 30 L100 20 L130 30 L145 55 L125 65 L120 160 L80 160 L75 65 L55 55 Z" fill={c1} />
        <circle cx="100" cy="35" r="10" fill={c2} />
      </>
    ),
    Home: (
      <>
        <rect x="40" y="90" width="120" height="65" rx="6" fill={c1} />
        <path d="M35 90 L100 40 L165 90 Z" fill={c3} />
        <rect x="85" y="115" width="30" height="40" fill={c2} />
      </>
    ),
    Beauty: (
      <>
        <rect x="75" y="50" width="50" height="100" rx="14" fill={c2} />
        <rect x="85" y="35" width="30" height="25" rx="6" fill={c1} />
        <circle cx="100" cy="95" r="14" fill={c3} />
      </>
    ),
    Kids: (
      <>
        <circle cx="100" cy="95" r="55" fill={c2} />
        <circle cx="80" cy="85" r="9" fill={c1} />
        <circle cx="120" cy="85" r="9" fill={c1} />
        <path d="M75 115 Q100 135 125 115" stroke={c1} strokeWidth="6" fill="none" strokeLinecap="round" />
      </>
    ),
    Sport: (
      <>
        <circle cx="100" cy="95" r="55" fill={c2} stroke={c1} strokeWidth="4" />
        <path
          d="M45 95h110M100 40v110M62 60 A55 55 0 0 1 62 130M138 60 A55 55 0 0 0 138 130"
          stroke={c1}
          strokeWidth="3"
          fill="none"
        />
      </>
    ),
    Food: (
      <>
        <ellipse cx="100" cy="120" rx="60" ry="30" fill={c2} />
        <path d="M50 120 Q100 40 150 120" fill={c1} />
      </>
    ),
    Books: (
      <>
        <rect x="55" y="30" width="90" height="120" rx="4" fill={c1} />
        <rect x="55" y="30" width="18" height="120" fill={c3} />
        <line x1="90" y1="55" x2="130" y2="55" stroke={c2} strokeWidth="3" />
        <line x1="90" y1="70" x2="130" y2="70" stroke={c2} strokeWidth="3" />
        <line x1="90" y1="85" x2="120" y2="85" stroke={c2} strokeWidth="3" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg" className={className}>
      {shapes[cat] || shapes.Home}
    </svg>
  )
}