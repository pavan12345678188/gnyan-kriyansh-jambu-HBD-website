# Jambu Birthday V4 — fixes applied

## Fixed
- Journey reveal observer now uses the `.journey` scroll container instead of only the browser viewport.
- Added a safety fallback so memory/family content can never remain permanently invisible after a hot reload or observer failure.
- Removed the stray `}a` token from `global.css`.
- Reduced the oversized Memories heading and tightened responsive section spacing.
- Removed the duplicate `family.css` import from `App.jsx` (FamilyScene already imports it).
- Made Same Birthday 3D photos preflight through a normal browser image loader before R3F renders them, preventing a missing `/photos/us/...` file from crashing the Canvas.
- Kept the existing photo paths consistent with the uploaded `public/photos/us/` files (`us_1.jpeg` ... `us_8.jpeg`).

## Run
```bash
npm install
npm run dev
```

Do not copy `node_modules` from another operating system. Let npm install dependencies for the current machine.
