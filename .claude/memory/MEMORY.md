# Mike's Delivery — Landing Page Project Memory

## Project Overview
- **Single-page HTML** landing site for CDL-A Reefer Driver recruitment
- **Domain**: mikesdelivery.org (hosted on Porkbun, PHP 8.0.25, Openresty)
- **Repo**: github.com:Jodtados/mikes-delivery-landing.git
- **Branch**: main
- **File**: `index.html` (single file, inline CSS + JS, Tailwind CDN)

## Tech Stack
- Tailwind CSS via CDN
- Google Fonts: Oswald (headings) + Heebo (body)
- Custom CSS animations (scroll reveal, marquee, dropdowns)
- Playwright installed locally for mobile screenshots (`node _screenshot.js`)
- Web3Forms API for form submissions (key: `a88f4164-...`)
- PIL/Pillow available for image processing

## Key Architecture Decisions
- Hero section: `align-items: flex-start` on mobile (not center) to keep content under header
- Hamburger: sidebar from right, 55vw, semi-transparent (0.5), no dark backdrop
- Phone mask: +1 (XXX) XXX-XXXX, auto-format on input
- Real-time validation on blur: fullName (required/too short), email (format), phone (10 digits)
- Form sends to jodtados@gmail.com via Web3Forms
- Footer: minimal — just copyright centered

## User Preferences
- Communicates in Russian, expects Russian responses
- Prefers to be asked before replacing photos/content
- Wants compact, clean design — no unnecessary elements
- Uses bugs/ folder for mobile screenshots
- Testing via Playwright before asking user to check

## Photo Assets (Pexels)
- Hero slides: 37753989, 27099095, 2199293, 6574072, 28520996, 38779041, 35332904
- "BUILT FOR DRIVERS" section: 37753989 (same as hero slide 1 — truck on bridge)
- Favicon: favicon_new.png (custom), favicon-32.png, favicon-16.png auto-generated

## Pending / Future
- Site currently on GitHub Pages; could migrate to Porkbun cPanel hosting for PHP form handler (no Web3Forms needed)
- Contact email: contact@mikesdelivery.org, phone: +1 (916) 990-3670, office: +1 (916) 314-2434
