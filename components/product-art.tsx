import { getProductById } from "@/lib/catalog";

type Theme = {
  bgFrom: string;
  bgTo: string;
  crustFrom: string;
  crustTo: string;
  crumb: string;
  drizzle: string;
  accent: string;
  topping: "banana" | "velvet" | "oreo" | "choc" | "hazelnut" | "nuts" | "coconut" | "cocoa";
};

const THEMES: Record<string, Theme> = {
  classic: {
    bgFrom: "#F7EAD6",
    bgTo: "#EAD3B0",
    crustFrom: "#B87B45",
    crustTo: "#6B3A1E",
    crumb: "#F2D8A9",
    drizzle: "#C4884A",
    accent: "#A96B36",
    topping: "banana",
  },
  "red-velvet": {
    bgFrom: "#F6E5DE",
    bgTo: "#E5C2B8",
    crustFrom: "#9A4336",
    crustTo: "#5A1F1A",
    crumb: "#8E3B33",
    drizzle: "#F8EFE7",
    accent: "#6E2A22",
    topping: "velvet",
  },
  oreo: {
    bgFrom: "#F0E8DE",
    bgTo: "#DACBBE",
    crustFrom: "#8A5D3F",
    crustTo: "#432719",
    crumb: "#EAD8BC",
    drizzle: "#FFF8EC",
    accent: "#4A3126",
    topping: "oreo",
  },
  "chocolate-chunk": {
    bgFrom: "#F3E4D1",
    bgTo: "#DCC1A3",
    crustFrom: "#8A5530",
    crustTo: "#4A2814",
    crumb: "#EDD5B0",
    drizzle: "#412413",
    accent: "#3A2011",
    topping: "choc",
  },
  nutella: {
    bgFrom: "#F5E6D5",
    bgTo: "#E2C9AE",
    crustFrom: "#8F5C35",
    crustTo: "#4F2E19",
    crumb: "#EBD1A8",
    drizzle: "#56331D",
    accent: "#7A4A26",
    topping: "hazelnut",
  },
  "mixed-nuts": {
    bgFrom: "#F2E8D2",
    bgTo: "#DBC5A2",
    crustFrom: "#9B6A3E",
    crustTo: "#583314",
    crumb: "#F0DAB5",
    drizzle: "#B5813F",
    accent: "#6E4A24",
    topping: "nuts",
  },
  coconut: {
    bgFrom: "#F8F2E7",
    bgTo: "#E7DAC5",
    crustFrom: "#B98A5C",
    crustTo: "#7A5230",
    crumb: "#F8EDDA",
    drizzle: "#FFFFFF",
    accent: "#8C6740",
    topping: "coconut",
  },
  baileys: {
    bgFrom: "#EFE4D6",
    bgTo: "#D5C2AB",
    crustFrom: "#835034",
    crustTo: "#442614",
    crumb: "#E7CCA4",
    drizzle: "#F4E6D3",
    accent: "#5E3A22",
    topping: "cocoa",
  },
};

const TOPPING_POINTS = [
  { x: 128, y: 188, r: -18, s: 1 },
  { x: 156, y: 166, r: 12, s: 0.9 },
  { x: 186, y: 152, r: -8, s: 1.05 },
  { x: 218, y: 147, r: 6, s: 0.95 },
  { x: 250, y: 155, r: -14, s: 1 },
  { x: 278, y: 172, r: 16, s: 0.9 },
  { x: 118, y: 208, r: 22, s: 0.85 },
  { x: 168, y: 196, r: -6, s: 0.9 },
  { x: 232, y: 194, r: 9, s: 0.95 },
  { x: 296, y: 196, r: -10, s: 0.8 },
];

function Topping({ theme, x, y, r, s }: { theme: Theme; x: number; y: number; r: number; s: number }) {
  const transform = `translate(${x} ${y}) rotate(${r}) scale(${s})`;

  switch (theme.topping) {
    case "banana":
      return (
        <g transform={transform}>
          <ellipse rx="12" ry="6" fill="#EFCB75" />
          <ellipse rx="12" ry="6" fill="none" stroke="#C4963C" strokeWidth="1.1" />
          <ellipse rx="6.5" ry="2.8" fill="#F8E6B2" opacity="0.85" />
        </g>
      );
    case "velvet":
      return (
        <g transform={transform}>
          <circle r="5" fill="#F6EAE1" opacity="0.9" />
          <circle r="2.2" fill={theme.accent} opacity="0.55" />
        </g>
      );
    case "oreo":
      return (
        <g transform={transform}>
          <rect x="-9" y="-5.5" width="18" height="11" rx="3" fill="#33251F" />
          <rect x="-5.5" y="-2" width="6" height="4" rx="1.6" fill="#F3E6D8" opacity="0.85" />
        </g>
      );
    case "choc":
      return (
        <g transform={transform}>
          <rect x="-8" y="-6" width="16" height="12" rx="4" fill="#432312" />
          <path d="M-5-3h4" stroke="#6B4028" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        </g>
      );
    case "hazelnut":
      return (
        <g transform={transform}>
          <circle r="6" fill="#B9753F" />
          <circle r="6" fill="none" stroke="#7E4A22" strokeWidth="1" />
          <circle cx="-1.8" cy="-1.8" r="1.7" fill="#E7BC8F" opacity="0.7" />
        </g>
      );
    case "nuts":
      return (
        <g transform={transform}>
          <ellipse rx="9" ry="5.4" fill="#C99C63" />
          <path d="M-7 0q7-5 14 0" fill="none" stroke="#8E6233" strokeWidth="1.1" />
        </g>
      );
    case "coconut":
      return (
        <g transform={transform}>
          <rect x="-8" y="-3" width="16" height="6" rx="2.2" fill="#FFFDF6" />
          <rect x="-8" y="-3" width="16" height="2.4" rx="1.2" fill="#E6D9C2" opacity="0.75" />
        </g>
      );
    case "cocoa":
      return (
        <g transform={transform}>
          <circle r="2.6" fill="#4A2C1A" opacity="0.55" />
        </g>
      );
  }
}

export function ProductArt({
  productId,
  className = "",
  steam = false,
}: {
  productId: string;
  className?: string;
  steam?: boolean;
}) {
  const product = getProductById(productId);
  const theme = THEMES[productId] ?? THEMES.classic;
  const uid = `art-${productId}`;

  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme.bgFrom} />
          <stop offset="100%" stopColor={theme.bgTo} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="32%" r="62%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-crust`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={theme.crustFrom} />
          <stop offset="100%" stopColor={theme.crustTo} />
        </linearGradient>
        <linearGradient id={`${uid}-plate`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#${uid}-bg)`} />
      <rect width="400" height="300" fill={`url(#${uid}-glow)`} />

      <circle cx="338" cy="54" r="52" fill={theme.accent} opacity="0.1" />
      <circle cx="58" cy="246" r="40" fill="#FFFFFF" opacity="0.16" />
      <circle cx="330" cy="242" r="8" fill={theme.accent} opacity="0.16" />
      <circle cx="76" cy="66" r="5" fill={theme.accent} opacity="0.14" />

      {steam ? (
        <g
          stroke="#FFFFFF"
          strokeOpacity="0.55"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M158 104c-9-12 9-19 0-32" />
          <path d="M200 96c-9-13 9-21 0-35" />
          <path d="M242 104c-9-12 9-19 0-32" />
        </g>
      ) : null}

      <ellipse cx="200" cy="252" rx="140" ry="22" fill="#4A2E20" opacity="0.16" />
      <ellipse cx="200" cy="246" rx="136" ry="20" fill={`url(#${uid}-plate)`} />
      <ellipse
        cx="200"
        cy="246"
        rx="112"
        ry="14"
        fill="none"
        stroke="#4A2E20"
        strokeOpacity="0.12"
      />

      <path
        d="M80 222c0-50 54-94 120-94s120 44 120 94c0 18-16 29-46 29H126c-30 0-46-11-46-29Z"
        fill={`url(#${uid}-crust)`}
      />
      <path
        d="M80 222c0-50 54-94 120-94 22 0 42 5 58 15-30-5-70 2-95 24-24 21-31 49-29 71-10-4-15-11-15-21Z"
        fill="#FFFFFF"
        opacity="0.1"
      />
      <path
        d="M108 186c12-26 44-43 84-45"
        stroke="#FFFFFF"
        strokeOpacity="0.22"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />

      <g stroke={theme.crustTo} strokeOpacity="0.42" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M126 196c14-15 36-21 56-17" />
        <path d="M178 178c13-12 32-16 49-12" />
        <path d="M232 172c12-8 28-9 41-4" />
      </g>

      <path
        d="M96 202c22 15 34-5 52 9s20-9 38 5 26-7 44 7 24-6 40-1"
        fill="none"
        stroke={theme.drizzle}
        strokeWidth="7"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />

      {theme.topping === "velvet" ? (
        <path
          d="M124 188c18-14 38 8 58-5s34-13 56-2"
          fill="none"
          stroke="#F8EFE7"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />
      ) : null}

      {TOPPING_POINTS.map((point, index) => (
        <Topping key={index} theme={theme} {...point} />
      ))}

      <g fill={theme.crumb} opacity="0.8">
        <circle cx="96" cy="252" r="2.4" />
        <circle cx="112" cy="258" r="1.8" />
        <circle cx="300" cy="256" r="2.2" />
        <circle cx="318" cy="249" r="1.6" />
      </g>
    </svg>
  );
}
