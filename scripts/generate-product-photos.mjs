// Regenerate the banana bread product photography.
//
// The images currently in `public/images/products` were generated as launch
// placeholders (see CREDITS.md). When you have real photographs of your Mini,
// Midi and Regular loaves, replace the files directly — no code changes needed.
//
// To generate a higher-fidelity placeholder set with FLUX.1-schnell:
//
//   1. Create a free Hugging Face read token: https://huggingface.co/settings/tokens
//   2. $env:HF_TOKEN = "hf_..."           (PowerShell)
//      export HF_TOKEN="hf_..."           (bash)
//   3. npm run photos
//
// FLUX runs on a shared GPU demo with a small daily quota, so the script
// generates sequentially and retries politely. Without HF_TOKEN it falls back
// to Pollinations, which needs no account but produces lower-detail images.
//
//   npm run photos -- --only classic,oreo
//   npm run photos -- --provider pollinations

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "images", "products");

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const provider = flag("provider", process.env.HF_TOKEN ? "flux" : "pollinations");
const only = flag("only", null)?.split(",").map((id) => id.trim());
const steps = Number(flag("steps", "8"));

const recipe = (detail) =>
  [
    "Professional editorial food photography for a premium banana bread bakery.",
    "A freshly baked banana bread loaf, half sliced with two thick slices fanned forward,",
    `${detail}.`,
    "The cut faces show a moist, tender crumb with an open, uneven texture and tiny air pockets.",
    "Deep golden-brown crust with a soft sheen.",
    "Styled simply on a matte warm-cream ceramic plate on an off-white linen surface.",
    "Soft natural window light from the upper left, gentle realistic shadows, warm inviting tones.",
    "Shallow depth of field, 50mm lens, mouth-watering, ultra realistic food texture, editorial quality.",
    "No text, no people, no hands, no watermark, no cartoon, no illustration.",
  ].join(" ");

const flavours = [
  {
    id: "classic",
    seed: 101101,
    detail:
      "Classic banana bread with a pale golden crumb flecked with dark banana strands, a few thin banana slices and a light dusting of cinnamon beside the plate",
  },
  {
    id: "red-velvet",
    seed: 202204,
    detail:
      "Red velvet banana bread with a vivid deep ruby-red crumb and a subtle cocoa tint, a thin cream cheese swirl, a few red crumbs on the plate",
  },
  {
    id: "oreo",
    seed: 303303,
    detail:
      "Oreo banana bread with dark chocolate cookie chunks baked through the crumb and crushed chocolate sandwich cookies scattered on the plate",
  },
  {
    id: "chocolate-chunk",
    seed: 404404,
    detail:
      "Chocolate chunk banana bread with melting dark chocolate chunks throughout the crumb and glossy pools of softened chocolate in the slices",
  },
  {
    id: "chocolate-chip",
    seed: 909909,
    detail:
      "Chocolate chip banana bread with small chocolate chips distributed through the crumb, a few chips scattered on the plate",
  },
  {
    id: "nutella",
    seed: 505505,
    detail:
      "Nutella banana bread with a rich hazelnut chocolate swirl marbled through the crumb and a glossy ribbon of chocolate hazelnut spread across the top",
  },
  {
    id: "mixed-nuts",
    seed: 606606,
    detail:
      "Mixed nut banana bread with chopped walnuts, pecans and almonds baked through the crumb, whole toasted nuts scattered around the loaf",
  },
  {
    id: "coconut",
    seed: 707707,
    detail:
      "Coconut banana bread with toasted desiccated coconut through the crumb, golden toasted coconut flakes on the crust and a small pile on the plate",
  },
  {
    id: "baileys",
    seed: 808808,
    detail:
      "Baileys banana bread with a dark caramel-toned crumb and a glossy Irish cream glaze drizzled over the top, warm amber tones",
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function flux(prompt, seed, width, height) {
  const space = "https://black-forest-labs-flux-1-schnell.hf.space";
  const token = process.env.HF_TOKEN;
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const start = await fetch(`${space}/gradio_api/call/infer`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data: [prompt, seed, false, width, height, steps] }),
  });
  if (!start.ok) throw new Error(`FLUX start ${start.status}`);
  const { event_id: eventId } = await start.json();

  const stream = await fetch(`${space}/gradio_api/call/infer/${eventId}`, { headers });
  const text = await stream.text();
  const last = text
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .filter(Boolean)
    .at(-1);
  const payload = JSON.parse(last);
  const first = Array.isArray(payload) ? payload[0] : payload?.data?.[0];
  if (!first?.url) {
    throw new Error(
      "FLUX returned no image. The free GPU quota is likely exhausted — retry later or use --provider pollinations.",
    );
  }
  const image = await fetch(first.url, { headers });
  if (!image.ok) throw new Error(`FLUX download ${image.status}`);
  return Buffer.from(await image.arrayBuffer());
}

async function pollinations(prompt, seed, width, height) {
  const negative =
    "text, watermark, logo, people, hands, cartoon, illustration, cake, muffin, cupcake";
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=${width}&height=${height}&nologo=true&nofeed=true&seed=${seed}&model=sana` +
    `&negative_prompt=${encodeURIComponent(negative)}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (res.status !== 200) {
    throw new Error(`Pollinations ${res.status}: ${(await res.text()).slice(0, 160)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

const generate = provider === "flux" ? flux : pollinations;
const [width, height] = provider === "flux" ? [1216, 912] : [1216, 912];

fs.mkdirSync(OUT_DIR, { recursive: true });
console.log(`provider: ${provider} · ${width}x${height}`);

for (const flavour of flavours) {
  if (only && !only.includes(flavour.id)) continue;
  const prompt = recipe(flavour.detail);
  let saved = false;

  for (let attempt = 1; attempt <= 3 && !saved; attempt += 1) {
    try {
      const buffer = await generate(prompt, flavour.seed, width, height);
      const target = path.join(OUT_DIR, `${flavour.id}.webp`);
      const info = await sharp(buffer).webp({ quality: 84, effort: 6 }).toFile(target);
      console.log(
        `OK ${flavour.id.padEnd(16)} ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`,
      );
      saved = true;
    } catch (error) {
      console.log(`retry ${flavour.id} (${attempt}/3): ${error.message}`);
      await sleep(provider === "flux" ? 8000 : 45000);
    }
  }

  if (!saved) console.log(`FAIL ${flavour.id}`);
  // Be gentle with the free tiers.
  await sleep(provider === "flux" ? 2000 : 46000);
}
