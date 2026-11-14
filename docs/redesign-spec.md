# Redesign spec — "Mission Control for an Autonomous Agent"

The visitor watches a live system boot, perceive, learn and act. Each section is
a subsystem panel of that machine. Cinematic, precise, engineered.

## 0. Hard rules (apply to every phase)

- `src/data/portfolio.ts` is frozen. Do not edit it.
- Every visible string that exists today stays word-for-word: section eyebrows
  and titles, the About paragraphs, "My Passion and Goals", "Currently
  Exploring" chips, the Contact paragraph, button/link labels ("Explore My
  Projects", "About Me", "Connect With Me", "Visit my GitHub", "View source on
  GitHub", "View post on LinkedIn", "View more (N more projects)", "View less",
  "View certificate", "Contact me"), footer line, alt texts, aria-labels.
  The old `src/routes/index.tsx` at git `main` is the source of truth for copy:
  `git show main:src/routes/index.tsx`.
- New decorative HUD microcopy is allowed (e.g. `SUBSYSTEM 03/09`, boot lines)
  but must be `aria-hidden`, must not state facts about the person, and must
  not invent metrics or achievements.
- Images: the `projectImages` and `certificationMedia` maps keep their exact
  keys/values/order; they only move to `src/lib/media.ts`. `*.asset.json` and
  image files are untouched. Visit collages stay ordered pairs, `object-contain`.
- Section ids and order: home, about, skills, projects, research, experience,
  certifications, journey, contact. `#projects-<key>` anchors keep working.
- Behaviour kept: per-category "first 2 + View more/View less" with the same
  label logic (visits vs projects), project/visit counts shown separately,
  link label by `kind`, status badge by `status`, journey markers driven by
  `item.status` (never an index), dark default + `localStorage.theme`.
- Route `head` in `index.tsx` (meta, og, canonical) stays as is.
- `vite.config.ts` untouched. Never add vite plugins. SSR-safe: no
  `window`/`document` at module scope or during render; use effects.
- AGENTS.md: the cursor layer lives inside the page's `isolate` stacking
  context, above section surfaces, `pointer-events: none`, theme-specific
  blend tokens.
- Git: stay on branch `redesign`. Do not commit, push, or touch git history —
  the lead commits. Do not commit lockfiles created by npm.
- Deps allowed: `motion` (import from `motion/react`). Keep `lenis`. Nothing
  else without asking the lead. No three.js — canvases are hand-written 2D.

## 1. Direction (chosen: A)

A. **VOID / REWARD** — blue-black void, acid "reward" lime signal, amber
   alert. Archivo (variable width) + Hanken Grotesk + Geist Mono.
B. DEEP FIELD — navy, cyan signal, orange alert, Michroma + Inter Tight.
Chosen A: lime-on-void is rarer than sci-fi cyan; "reward green" is literally
the RL signal; Archivo's width axis gives kinetic type for free.

## 2. Tokens (`src/styles.css`)

Keep the shadcn variable names (so `components/ui` still works) and remap them.
Add the extra tokens below. Expose all through `@theme inline`.

Dark (default, `.dark`):
- `--background #05070C`, `--surface #090D14`, `--card #0D121B`,
  `--popover #111823`, `--muted #121925`, `--accent #162030`
- neutral ramp `--n-1 #1B2431` (hairline/border) `--n-2 #2A3546`
  `--n-3 #5B6779` `--n-4 #8C98AA` (muted text) `--n-5 #E7ECF2` (text)
- `--border = --n-1`, `--input = --n-2`, `--foreground = --n-5`,
  `--muted-foreground = --n-4`
- `--primary #B6FF3C` (signal), `--primary-foreground #081200`,
  `--secondary #FFA62B` (alert amber), `--secondary-foreground #1A0E00`,
  `--destructive #FF4D4D`, `--ring = --primary`
- `--signal-dim: color-mix(in oklab, var(--primary) 14%, transparent)`
- `--grid-line: rgb(255 255 255 / .045)`, `--grain-opacity .07`
- cursor: `--cursor-core`, `--cursor-halo` lime at low alpha, `--cursor-blend screen`

Light ("blueprint paper", `:root`):
- `--background #EAF0F4`, `--surface #E1E9EF`, `--card #F6F9FB`,
  `--popover #FFFFFF`, `--muted #DCE5EC`, `--accent #D3E0EA`
- ramp `--n-1 #C2CFDA` `--n-2 #9FB0BF` `--n-3 #6B7C8D` `--n-4 #45586A` `--n-5 #0A1A2B`
- `--primary #1443D6` (blueprint cobalt), `--primary-foreground #F4F8FF`,
  `--secondary #B45A00`, `--destructive #C22B2B`
- `--grid-line: rgb(20 67 214 / .09)`, `--grain-opacity .05`, `--cursor-blend multiply`

Shape: `--radius 2px` (sharp, engineered). Panels use hairline borders plus
corner brackets, never soft shadows. Glow only on focus/active.

Type (Google Fonts link in `__root.tsx`):
- `--font-display "Archivo"` — load `Archivo:wdth,wght@62..125,100..900`.
  Headlines: `font-stretch: 125%`, weight 800, uppercase, tracking -0.02em,
  line-height 0.92. Kinetic moments animate `font-stretch` 62%→125%.
- `--font-sans "Hanken Grotesk"` 400/500/600. `--font-mono "Geist Mono"` 400/500.
- Fluid scale: `--step--1 clamp(.72rem,.7rem + .1vw,.8rem)`, `--step-0
  clamp(.95rem,.9rem + .2vw,1.06rem)`, `--step-1 clamp(1.15rem,1rem + .6vw,1.5rem)`,
  `--step-2 clamp(1.5rem,1.1rem + 1.6vw,2.4rem)`, `--step-3 clamp(2.1rem,1.2rem +
  3.6vw,4.4rem)`, `--step-4 clamp(2.8rem,1rem + 7.5vw,8.5rem)` (hero),
  numerals `clamp(5rem, 16vw, 15rem)` outlined (`-webkit-text-stroke`).
- Telemetry labels: mono, 10–11px, uppercase, tracking .18em, tabular-nums.

Motion tokens: `--ease-out-expo cubic-bezier(.16,1,.3,1)`, `--ease-in-out-quart
cubic-bezier(.76,0,.24,1)`, `--ease-snap cubic-bezier(.2,.9,.1,1)`;
`--dur-1 160ms --dur-2 320ms --dur-3 640ms --dur-4 1100ms`; `--stagger 60ms`.
JS mirror in `src/lib/motion.ts` (`ease`, `dur`, `spring = {stiffness:260,
damping:26, mass:.9}`).

Texture: fixed full-page SVG-noise grain layer; blueprint grid utility with
coordinate ticks; `::selection` signal bg; custom thin scrollbar (track
transparent, thumb `--n-2`, hover signal); focus ring 1px signal + 3px offset
+ soft glow.

Layout: container `max-w-[1400px]`, gutters `clamp(1rem,4vw,3.5rem)`, 12-col
grid, asymmetric compositions, sections `min-h` generous, each section differs.

## 3. File layout

```
src/routes/index.tsx            Route head (unchanged) + <Portfolio/> composition only
src/lib/media.ts                projectImages, certificationMedia, navItems (moved verbatim)
src/lib/motion.ts               easing/duration/spring constants
src/hooks/                      useLenis, useFinePointer, usePrefersReducedMotion,
                                useActiveSection, useInViewOnce, useIsClient
src/components/shell/           Nav, MobileMenu, ThemeToggle, BootLoader, Cursor,
                                SideRail, ScrollProgress, Footer, Grain
src/components/motion/          Decode, MaskLines, Counter, Magnetic, Tilt, Panel,
                                SectionHeader, StatusLight, Chip, DrawLink, Button
src/components/canvas/          AgentSim (hero), ResearchVisual, shared canvas utils
src/components/sections/        Hero, About, Skills, Projects, Research, Experience,
                                Certifications, Journey, Contact
```

Shared primitives (built in phase 1, used by every section):
- `SectionHeader({ index, id, eyebrow, title })` — huge outlined numeral
  (`01`…`09`), mono eyebrow with a drawing rule, `<h2>` with `Decode`.
- `Decode` — scramble-to-text on first view; renders the final text in the DOM
  from the start (SSR + a11y: `aria-label` = final text, scrambled glyphs
  `aria-hidden`), fixed width to avoid layout shift.
- `MaskLines` — paragraph revealed line by line from a clip mask.
- `Counter` — counts to a number on view, tabular-nums.
- `Panel` — hairline box with four corner brackets, optional header strip
  (`label`, right-aligned `meta`), optional scanline on hover.
- `StatusLight({ tone: "ok"|"active"|"idle"|"warn" })` — pulsing state light.
- `Chip`, `DrawLink` (underline draws in), `Button` (primary/ghost; press
  state; sheen sweep on hover), `Magnetic` (fine pointer only), `Tilt`
  (3D tilt + light-tracking highlight via CSS vars, fine pointer only).
- Everything respects `usePrefersReducedMotion()` → renders final state.

## 4. Global chrome

- **BootLoader**: full-screen void, 5–6 mono system-check lines typing in with
  `[ OK ]` ticks, a progress bar and percentage, then a vertical clip-path wipe
  revealing the page. ≤1.8s. Skipped when `sessionStorage.booted` is set or
  reduced motion. Must not block SSR content (overlay only) or LCP for long.
- **Cursor**: reticle (small ring + centre dot + 4 ticks) following with a
  spring; morphs per target via `data-cursor="link|card|drag|image"` and a
  default for `a,button` (ring expands, ticks rotate, optional mono label like
  `OPEN`, `DRAG`, `VIEW`). Plus a soft trailing spotlight. Both in one fixed,
  `pointer-events:none` layer inside the `isolate` root, `mix-blend-mode:
  var(--cursor-blend)` for the spotlight. Native cursor hidden only when the
  custom one is active (fine pointer, no reduced motion).
- **Nav**: floating HUD bar, inset from the top, hairline + blur; full width at
  top, condenses (shrinks, shows only monogram + active section name + menu
  affordances) after scroll. Active section indicator slides between items
  (`layoutId`). Projects dropdown animates open with staggered category rows
  and their counts. Scroll-progress hairline along the bar's bottom edge.
  Monogram + name left; theme toggle and "Explore Projects" right.
- **MobileMenu**: full-screen takeover, clip-path reveal, giant kinetic
  list items (index numerals, staggered, width-axis animation), project
  category sub-links, focus trapped, Esc closes, body scroll locked.
- **SideRail** (≥lg): fixed left/right edge vertical rail: `SUBSYSTEM 03/09`,
  section name rotated, tick marks per section (click to jump), progress fill.
- **ThemeToggle**: icon morph; uses `document.startViewTransition` with a
  circular clip-path sweep from the button when available, plain swap otherwise.
- **Footer**: system status strip — live local time (client only), monogram,
  name, the existing tagline sentence, footer nav, social links, copyright;
  a large outlined name wordmark behind.
- **404 / error pages** in `__root.tsx`: restyled in the same language
  (`SIGNAL LOST`-style decorative label is fine; keep the existing headings,
  body copy and button labels).

## 5. Sections — one signature each

1. **Hero** — full-viewport `AgentSim` canvas behind everything: a grid world
   where a tabular Q-learning agent actually learns to reach a goal around
   obstacles. Cells glow by learned value, the agent leaves a fading trail,
   episode / reward / epsilon readouts tick in a corner HUD. Pointer: hover
   highlights a cell, click toggles an obstacle (agent re-plans). Headline
   (`headlineA` + `headlineB`) in huge kinetic Archivo, `headlineB` in signal
   colour, width axis animating in. Eyebrow, intro, the three CTAs, socials,
   status line. Portrait in an "operator ID" panel: corner brackets, scan-line
   reveal, slight pointer parallax. Identity card as a telemetry readout that
   types in row by row.
2. **About** — left: sticky header; the intro paragraph large; the three
   labelled blocks (My mindset / Beyond technology / What drives me) as
   "camera feed" panels that swap as you scroll a pinned scene (sticky +
   scroll progress), with feed labels `CAM 01..03` decorative. Then "My
   Passion and Goals": four numbered module cards with `Tilt` + light tracking.
3. **Skills** — a layered node graph (SVG): each skill group is a column/
   layer, skills are nodes, edges drawn between adjacent layers; hovering or
   focusing a group lights its nodes and pulses its edges; level label shown
   as a 3-bar signal-strength meter (Currently Practicing / Working Knowledge
   / Engineering Foundations are *labels*, do not rank them as better/worse —
   use three distinct glyph patterns, not "weak/strong"). Under the graph, the
   full accessible list: 8 group panels with all skills as chips. On <lg the
   graph is replaced by the panel list with a small animated header glyph.
4. **Projects** — intro line + "Visit my GitHub". Each category is a band:
   sticky left column with a huge outlined index numeral, the category label
   and the counts (`N PROJECTS`, `N INDUSTRIAL VISITS`); right column holds
   the cards. Cards: image with a clip-path reveal mask on enter, zoom on
   hover, status as `StatusLight` + label, mono category label, title (linked
   when `link`), summary, details list, tech chips staggering in, source link.
   "View more" expands with `motion` layout animation (`AnimatePresence`).
5. **Research** — four full-width "channels" A–D stacked as an accordion of
   tall rows; the hovered/focused/active row expands, others compress; each
   has a small generative canvas (`ResearchVisual`) themed to its topic
   (A: agent trajectories, B: control response curve, C: scan grid/bounding
   boxes, D: conveyor/PLC signal ladder). Topics as chips. On touch: tap to
   expand, first open by default.
6. **Experience** — vertical log: a central/left line that draws with scroll
   progress; each entry "stamped" in with a mono log prefix built from its
   `kind` and `period`; education docked at the end as a wide `Panel` with
   the graduation cap.
7. **Certifications** — a fanned 3D deck of the six certificates (thumbs) on
   desktop; hover lifts a card, click selects it: it flies (shared `layoutId`)
   into a viewer dialog showing the large image, award, title, issuer,
   period, body and the "View certificate" link (opens `media.full` in a new
   tab — PDFs too). Dialog: focus trap, Esc, backdrop click. Below the deck, or
   instead of it on mobile, a grid of the same cards so everything is reachable.
8. **Journey** — an SVG trajectory winding down the section like a plotted
   robot path; `pathLength` tied to scroll; waypoints at each step: completed
   = lit node, in-progress = pulsing amber node with the "IN PROGRESS" badge,
   ahead = hollow node on a dashed segment with "AHEAD". Step number, title,
   body alternate sides on desktop, single column on mobile. "Currently
   Exploring" chips as the final "next targets" panel.
9. **Contact** — the title as huge kinetic type; paragraph; "Contact me";
   four channels as large rows with `Magnetic` icons and `DrawLink` values; a
   copy-email button with a confirmation animation; a decorative terminal
   handshake strip (`> open channel … link established`) aria-hidden.

## 6. Quality bars

- 60fps target: canvases pause when off-screen or tab hidden, DPR capped at
  1.5–2, no layout thrash (transform/opacity only), `will-change` sparingly.
- Reduced motion: no loader, no custom cursor, no scramble, canvases render a
  single static frame, all content visible.
- Touch / coarse pointer: no cursor, no tilt/magnetic, lighter sim.
- 360–1920px, no horizontal overflow, keyboard reachable, visible focus, AA
  contrast in both themes, no console errors, no hydration warnings.
- `npm run build`, `npm run test`, `npm run lint` must pass.
