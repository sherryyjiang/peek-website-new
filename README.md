# Peek website (MagicPath)

Marketing landing page for [Peek](https://peek.money): worth-it spending, personal stories, and humane budgets. Design lives in [MagicPath](https://www.magicpath.ai); this repo holds the **editable source** synced from the canvas for version control and agent polish (e.g. [Impeccable](https://impeccable.style/)).

## MagicPath

| | |
|---|---|
| **Project** | [Peek Website](https://www.magicpath.ai/files/412449171589701632) |
| **Component** | Peek Landing Page (`warm-year-6379`) |
| **Canvas size** | 1440 × 5600 |

## Repo layout

```
mp-peek-landing/          # MagicPath code session (React + Tailwind v4)
  src/
    App.tsx
    index.css
    components/generated/
      PeekLandingPage.tsx
      PeekMascot.tsx
  magicpath-code.json     # Session metadata (component/project IDs)
PRODUCT.md                # Brand + product context for design agents
```

`mp-peek-landing` is the slice MagicPath exposes for editing, not a standalone deployable app. Preview and publish happen on the MagicPath canvas.

## Sync with MagicPath

Requires [MagicPath CLI](https://www.npmjs.com/package/magicpath-ai) and login:

```bash
npx -y magicpath-ai login
```

**Pull latest from canvas**

```bash
cd mp-peek-landing
npx -y magicpath-ai code start --component 412449284668157952 --dir .
```

**Push local edits back to canvas**

```bash
cd mp-peek-landing
npx -y magicpath-ai code submit --dir . --wait -o json
```

Then commit in git:

```bash
cd ..
git add -A
git commit -m "describe your change"
git push
```

## Design direction

Sticker-scrapbook brand: purple (`#37004B`), cream, orange mascot, Baloo 2 + Poppins + Caveat. Interactive demos include worth-it rating and spending-story reveal. See `PRODUCT.md` for audience, tone, and anti-patterns.

## Related

- Production site codebase may live separately (e.g. `peek-v4-website` on GitHub).
- Install design into a Next.js app later with `npx -y magicpath-ai add warm-year-6379` when ready to integrate.
