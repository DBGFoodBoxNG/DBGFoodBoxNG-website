"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } finally {
          router.push("/");
          router.refresh();
        }
      }}
      className="inline-flex w-full items-center justify-center rounded-full border border-cocoa/15 bg-white/60 px-4 py-2.5 text-[11.5px] font-bold text-cocoa/70 transition hover:border-velvet/40 hover:bg-white hover:text-velvet disabled:opacity-60"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
