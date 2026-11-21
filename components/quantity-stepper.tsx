"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-cocoa/15 bg-white/70">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease quantity of ${label}`}
        className="grid h-9 w-9 place-items-center rounded-full text-choco transition hover:bg-cream disabled:opacity-40"
      >
        <MinusIcon className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-[13px] font-bold text-cocoa" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase quantity of ${label}`}
        className="grid h-9 w-9 place-items-center rounded-full text-choco transition hover:bg-cream disabled:opacity-40"
      >
        <PlusIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function RemoveButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Remove ${label} from cart`}
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold text-cocoa/60 transition hover:bg-velvet/10 hover:text-velvet"
    >
      <TrashIcon className="h-3.5 w-3.5" />
      Remove
    </button>
  );
}
