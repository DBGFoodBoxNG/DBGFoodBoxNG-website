type BrandMarkProps = {
  className?: string;
  /** Set when the mark sits next to the visible wordmark. */
  decorative?: boolean;
};

export function BrandMark({
  className = "h-10 w-10",
  decorative = false,
}: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "DBGfoodboxng"}
    >
      <rect width="64" height="64" rx="18" fill="#633D29" />
      <path
        d="M13 38.5c0-9.4 8.6-16 19-16s19 6.6 19 16c0 4.3-3.5 6.9-9.6 6.9H22.6C16.5 45.4 13 42.8 13 38.5Z"
        fill="#D9AD75"
      />
      <path
        d="M23.5 37.6c2.8-2.6 5.5-3.9 8.5-3.9s5.7 1.3 8.5 3.9"
        stroke="#633D29"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="26" cy="31.5" r="1.6" fill="#633D29" opacity="0.55" />
      <circle cx="38" cy="30.5" r="1.6" fill="#633D29" opacity="0.55" />
      <path
        d="M20 22c2.6-1.8 5.4-2.7 8.4-2.7"
        stroke="#FBF6EC"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

type WordmarkProps = {
  tone?: "light" | "dark";
  className?: string;
};

export function Wordmark({ tone = "dark", className = "" }: WordmarkProps) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="flex items-baseline gap-1">
        <span
          className={`text-[19px] font-extrabold tracking-tight ${
            tone === "light" ? "text-cream" : "text-cocoa"
          }`}
        >
          DBG
        </span>
        <span
          className={`text-[19px] font-light tracking-tight ${
            tone === "light" ? "text-cream/85" : "text-choco"
          }`}
        >
          foodboxng
        </span>
      </span>
      <span
        className={`mt-1 text-[8px] font-bold uppercase tracking-[0.28em] ${
          tone === "light" ? "text-caramel" : "text-caramel-600"
        }`}
      >
        Banana bread bakery
      </span>
    </span>
  );
}
