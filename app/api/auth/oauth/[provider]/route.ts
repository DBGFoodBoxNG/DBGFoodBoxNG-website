import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Social sign-in is intentionally not faked. Each provider needs credentials
 * that only the site owner can create, so this endpoint reports exactly what
 * is missing until those are configured.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const known = provider === "google" || provider === "apple";

  const missing =
    provider === "google"
      ? ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]
      : provider === "apple"
        ? [
            "APPLE_CLIENT_ID",
            "APPLE_TEAM_ID",
            "APPLE_KEY_ID",
            "APPLE_PRIVATE_KEY",
          ]
        : [];

  return NextResponse.json(
    {
      ok: false,
      provider,
      message: known
        ? `${provider === "google" ? "Google" : "Apple"} sign-in isn't configured yet. Add ${missing.join(", ")} to the server environment and implement the OAuth callback before this button can work.`
        : "Unknown sign-in provider.",
      requiredEnvironment: missing,
    },
    { status: 501 },
  );
}
