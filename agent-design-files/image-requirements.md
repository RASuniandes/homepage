# Image Requirements — RAS Uniandes Homepage Redesign

All images go in `/public/` and are referenced as `${REPO_NAME}/filename.ext`.

---

## Required — New Photos

### 1. `team-banner.jpg`
- **Section:** Hero (right column)
- **Aspect ratio:** 4:3 (e.g. 1400 × 1050 px)
- **Subject:** Group shot of the full RAS team, ideally holding or displayed next to the chapter flag/banner. Uniandes campus or makerspace preferred.
- **Style:** Candid or posed, faces visible, warm and professional.
- **Notes:** This is the most prominent image on the page — quality matters most here.

### 2. `team-project.jpg`
- **Section:** Nosotros / About (left column)
- **Aspect ratio:** 5:4 (e.g. 1200 × 960 px)
- **Subject:** Team members actively working on or presenting the robot project — ideally in a lab or workshop context.
- **Style:** Shows hands-on engagement; people and robot both visible.
- **Notes:** Used alongside the "¿Qué es RAS Uniandes?" copy.

### 3. `robot-project.png`
- **Section:** Proyecto insignia (left column)
- **Aspect ratio:** 4:3 (e.g. 1400 × 1050 px)
- **Subject:** Close-up or mid-shot of the SWARM robot clearly showing its technical components — sensors, PCBs, wheels, vision system, etc.
- **Style:** Technical and detailed; editorial look. No people strictly required (robot is the subject).
- **Notes:** `object-position: center 40%` — frame with the most relevant hardware in the upper-center area.

### 4. `robot-spark-session.jpg`
- **Section:** RAS Robot Spark (right column)
- **Aspect ratio:** 5:4 (e.g. 1200 × 960 px)
- **Subject:** A Robot Spark formative session: RAS members working with high-school students, kids interacting with robots or electronics.
- **Style:** Community, education, warmth. Natural light preferred.
- **Notes:** `object-position: center 30%` — frame with faces in the upper portion.

---

## Existing — Check & Verify

### `ras_logo_black.png` ✅ (exists at `/public/ras_logo_black.png`)
- **Used in:** Navigation header (34 px tall, inverted to white in dark mode)
- **Recommended update (optional):** A tighter crop showing only the "RA" monogram would
  look cleaner at small sizes. Current full-lockup version works as a fallback.

### `ras_logo.png` ✅ (exists at `/public/ras_logo.png`)
- **Used in:** Footer (56 px tall, inverted in dark mode)
- **Check:** Confirm the image has a transparent background and the color version
  is the official vinotinto mark, not a rasterized screenshot.

---

## Optional / Nice-to-Have

### `ra-mark.png`
- **Would replace:** `ras_logo_black.png` in the nav
- **Spec:** Just the standalone "RA" symbol or monogram, square-ish crop, transparent background.
- **Why:** The nav brand area is small (34 px height); a compact mark looks better than the full text lockup at that size.

---

## Naming & Format Checklist

| File | Format | Max size | Loading |
|------|--------|----------|---------|
| `team-banner.jpg` | JPEG, quality 85 | ≤ 300 KB | eager (hero, above fold) |
| `team-project.jpg` | JPEG, quality 82 | ≤ 250 KB | lazy |
| `robot-project.png` | JPEG, quality 82 | ≤ 250 KB | lazy |
| `robot-spark-session.jpg` | JPEG, quality 82 | ≤ 250 KB | lazy |

Place all files in `/public/` at the repository root.
