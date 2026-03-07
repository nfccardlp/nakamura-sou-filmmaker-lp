# 中村颯 Filmmaker LP

Cinematic Brutalism landing page for video creator / director 中村颯 (Nakamura Sou).

## Design Concept

**Cinematic Brutalism** — The visual language of film applied to web.

- Film leader countdown opening animation
- Viewfinder crosshair custom cursor with REC indicator
- Massive glitch title with CSS chromatic aberration (red/cyan)
- Text scramble on hover (WeakMap-based, no duplicates)
- Magnetic buttons
- Film strip with sprocket holes
- Works grid with colored gradient thumbnails
- Red stats band with animated counters
- Giant background text on contact section
- SVG feTurbulence grain overlay

## Color Palette

| Variable | Value | Use |
|---|---|---|
| `--bg` | `#050505` | Absolute black background |
| `--red` | `#CC0022` | Cinematic red accent |
| `--cream` | `#F2EDE4` | Celluloid white text |
| `--cyan` | `#00DDFF` | Glitch effect only |

## Typography

- **Bebas Neue** — Display headings, stats, section titles
- **Noto Serif JP** — Japanese text, hero title
- **Courier Prime** — Monospace labels, timecodes, metadata
- **DM Sans** — Body text, descriptions

## Sections

1. Film leader opening (countdown 3→2→1→ACTION)
2. Hero — glitch title, showreel frame with timecode
3. Film strip marquee
4. About — director profile
5. Works — 5-card grid
6. Stats band
7. Services list
8. Contact — LET'S CREATE SOMETHING UNFORGETTABLE
9. Footer

## Usage

```bash
python -m http.server 8080
```

Open `http://localhost:8080`
