# Product photography — provenance and replacement

## What ships today

**Three of the nine** flavour images in `public/images/products/` are
**AI-generated launch placeholders**, not photographs of DBGfoodboxng loaves.
They stay in place only until real photography exists, and the bakery should
replace them before launch.

- Generated: 14 November 2026
- Provider: [Pollinations](https://pollinations.ai) free tier, `sana` model
- Output: WebP, 886 × 665 px (4:3), 48–61 KB each, stripped of metadata
- Files: `oreo`, `nutella`, `baileys` (`.webp`)

### Real photography supplied by the bakery

Six flavours are now **real photographs supplied by the owner**, converted to
the catalogue's 4:3 card format. They replace the AI placeholders and set the
reference for the remaining three.

| File | Source | Output | Size |
| --- | --- | --- | --- |
| `classic.webp` | 1280 × 853 JPEG, 21 Nov 2026 | 1137 × 853 WebP, q86 | 165 KB |
| `red-velvet.webp` | 1280 × 853 JPEG, 14 Nov 2026 | 1137 × 853 WebP, q86 | 212 KB |
| `mixed-nuts.webp` | 1280 × 853 JPEG, 14 Nov 2026 | 1137 × 853 WebP, q86 | 211 KB |
| `chocolate-chip.webp` | 1280 × 853 JPEG, 14 Nov 2026 | 1137 × 853 WebP, q86 | 218 KB |
| `chocolate-chunk.webp` | 1280 × 853 JPEG, 21 Nov 2026 | 1137 × 853 WebP, q86 | 184 KB |
| `coconut.webp` | 1280 × 853 JPEG, 14 Nov 2026 | 1137 × 853 WebP, q86 | 195 KB |

- Crop: 4:3, centre, to line up with the product cards
- `sharp` (`fit: cover`, `withoutEnlargement`) — one encode, metadata stripped
- The first chocolate photo (14 Nov, `14.00.47.jpeg`) is now the **Chocolate Chip**
  product; the second (21 Nov, `13.01.26.jpeg`) replaced it as **Chocolate Chunk**
  at the owner's instruction. No re-encode was needed for the first swap.
- The `coconut.webp` photo was supplied as "the above pic is coconut flavour"
  alongside `WhatsApp Image 2026-11-14 at 13.50.25.jpeg`.

Re-convert any new photo with the same pipeline:

```bash
node convert-flavour-photo.mjs <source.jpeg> public/images/products/<id>.webp
```

### Shared prompt recipe

Each flavour used the same photographic recipe, with only the flavour-specific
sentence changed:

> Professional editorial food photography for a premium banana bread bakery. A
> freshly baked banana bread loaf, half sliced with two thick slices fanned
> forward, {flavour detail}. The cut faces show a moist, tender crumb with an
> open, uneven texture and tiny air pockets. Deep golden-brown crust with a soft
> sheen. Styled simply on a matte warm-cream ceramic plate on an off-white linen
> surface. Soft natural window light from the upper left, gentle realistic
> shadows, warm inviting tones. Shallow depth of field, 50mm lens,
> mouth-watering, ultra realistic food texture, editorial quality. No text, no
> people, no hands, no watermark, no cartoon, no illustration.

## Known limitations

- Generated food can show small artefacts in the crumb, crust and props. Review
  each image at full size before launch.
- Flavour fidelity is only as good as the model. Oreo pieces, coconut flakes and
  nut shapes may be approximate.
- 886 px wide is enough for cards and mobile, but only just for the hero on
  high-density screens.
- AI output is not a substitute for showing customers the real product. The
  brief is to replace these with actual Mini, Midi and Regular loaves.

## Replacing them with real photography

1. Shoot on a plain warm background with soft window light, at least
   **1600 × 1200 px** (4:3), the loaf as the main subject, sliced to show the
   crumb.
2. Export as WebP (quality ~85) or JPEG, and name the file after the product id:
   `classic.webp`, `red-velvet.webp`, `oreo.webp`, `chocolate-chunk.webp`,
   `nutella.webp`, `mixed-nuts.webp`, `coconut.webp`, `baileys.webp`.
3. Drop the files into `public/images/products/`, overwriting the placeholders.
4. If you change a filename or extension, update `image` in
   `data/products.json` for that product.
5. Rebuild (`npm run build`). `next/image` generates responsive sizes
   automatically.

Keep the same 4:3 crop for every flavour so cards line up. The `ProductPhoto`
component (`components/product-photo.tsx`) handles `object-cover`, responsive
`sizes` and lazy loading, and falls back to the inline SVG `ProductArt` if a
product has `"image": null`.

## Regenerating AI placeholders

```bash
# Better quality, needs a free Hugging Face read token
$env:HF_TOKEN = "hf_..."
npm run photos

# No account needed, lower detail
npm run photos -- --provider pollinations

# Only some flavours
npm run photos -- --only classic,oreo
```

The script is `scripts/generate-product-photos.mjs`. FLUX.1-schnell runs on a
shared demo GPU with a small daily quota; Pollinations allows roughly one image
per 45 seconds.

## Licence

The generated images contain no third-party photography, logos, people or
trademarks. They are placeholders supplied with this project so the storefront
is never empty; the bakery should replace them with its own photography before
launch. AI-generated output may not attract copyright protection, which is
another reason not to rely on it as the brand's permanent product imagery.
