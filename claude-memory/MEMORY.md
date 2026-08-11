# Mike's Delivery — Landing Page Project Memory

## Project Overview
- **Single-page HTML** landing site for CDL-A Reefer Driver recruitment
- **Domain**: mikesdelivery.org (hosted on Porkbun, PHP 8.0.25, Openresty)
- **Repo**: github.com:Jodtados/mikes-delivery-landing.git (SSH, port 22 sometimes blocked)
- **Branch**: main
- **File**: `index.html` (single file, inline CSS + JS, Tailwind CDN)

## Tech Stack
- Tailwind CSS via CDN
- Google Fonts: Oswald (headings) + Heebo (body)
- Custom CSS animations (scroll reveal, marquee, dropdowns)
- Playwright installed locally for mobile screenshots (`node _screenshot.js`)
- Web3Forms API for form submissions (key: `a88f4164-a51f-49b8-96e1-d741aac119e7`)
- **Prettier 3.9.6** installed as devDependency + VS Code extension `esbenp.prettier-vscode`
- `@prettier/plugin-php` for `send.php`
- PIL/Pillow available for image processing

## Key Architecture Decisions
- Hero section: `align-items: flex-start` on mobile (not center) to keep content under header
- Hamburger: sidebar from right, 55vw, semi-transparent (0.5), no dark backdrop
- Phone mask: +1 (XXX) XXX-XXXX, auto-format on input
- Real-time validation on blur: fullName (required/too short), email (format), phone (10 digits)
- Form sends via Web3Forms to contact@mikesdelivery.org (line 1517 of index.html)
- Footer: minimal — just copyright centered
- Counters use IntersectionObserver — animate only when #stats in view

## Stat Cards (section #stats, updated 2026-08-11)
- Grid: `grid-cols-2 md:grid-cols-4` (8 cards, 2 rows of 4 on desktop)
- Order + delay-N classes (1→8 in order):
  1. $0.95 Per Mile (was $0.80)
  2. 6,000 Miles Weekly (was 4,000)
  3. 32% Of Gross (was 30%)
  4. Personal Dispatcher — Dedicated
  5. Inspection Bonuses — Extra Pay
  6. Flexible Schedule — Your Way
  7. 90% Owner Operators — Earn Up To (NEW)
  8. Car Haul & Van — Available (NEW)
- CSS `.delay-7` (0.7s) and `.delay-8` (0.8s) added at line ~313

## Contact Block (section #apply, "PREFER TO CONTACT US DIRECTLY?")
- Grid: `grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto`
- **Card 1 "OFFICE / MOBILE"** — объединённая, содержит 3 tel: ссылки:
  - +1 (916) 990-3670 (mobile/dispatch)
  - +1 (916) 314-2434 (office)
  - +1 (916) 770-7787 (secondary, NEW 2026-08-11)
- **Card 2 "EMAIL"** — contact@mikesdelivery.org (`break-all` to prevent overflow)

## Minimal Hosting Upload Set (4 файла)
- index.html, logo.png, favicon-32.png, favicon-16.png
- Остальное — CDN (Tailwind, Google Fonts, Pexels, Web3Forms)
- send.php НЕ используется index.html (форма идёт через Web3Forms fetch)

## User Preferences
- Communicates in Russian, expects Russian responses
- Prefers to be asked before replacing photos/content
- Wants compact, clean design — no unnecessary elements
- Uses bugs/ folder for mobile screenshots
- Testing via Playwright before asking user to check
- Не любит избыточные вопросы — уточнять только по существу
- Backup делает в родительскую папку PROJECTS (не внутрь проекта)

## Photo Assets (Pexels)
- Hero slides: 37753989, 27099095, 2199293, 6574072, 28520996, 38779041, 35332904
- "BUILT FOR DRIVERS" section: 37753989 (same as hero slide 1)
- Favicon: favicon_new.png (source), favicon-32/16.png auto-generated

## Prettier Setup (2026-08-11)
- `.prettierrc.json` — printWidth 120, 2-space, single quotes, PHP plugin
- `.prettierignore` — исключает node_modules, bugs, _Source, Previous Versions, From Claude fix, тестовые _*.js
- npm scripts: `format`, `format:check`, `screenshot`
- ВАЖНО: авто-форматирование `index.html` НЕ запускали — может дать большой diff

## Backup
- Последний: `C:\Users\Sakyy\PROJECTS\Mikes-Delivery-backup-2026-08-11.tar.gz` (119 МБ, 861 файл)
- Команда: `tar -czf "Mikes-Delivery-backup-$(date +%F).tar.gz "2026-08-05 Mike's Delivery landing web-site"`

## Pending / Next Tasks
- **Web3Forms file upload feature** — detailed notes in `file-upload-feature.md`
- Site currently on GitHub Pages; could migrate to Porkbun cPanel hosting for PHP form handler
- Auto-deploy через GitHub Pages включён (коммит `0b6b87f`)

## Commits (недавние)
- `0e0fe0a` Update prices, add Owner Operators/Car Haul cards, combine contact phones (2026-08-11)
- `4155a6e` Update logo
- `4632f0d` Switch form recipient to contact@mikesdelivery.org, fix success-on-error bug
