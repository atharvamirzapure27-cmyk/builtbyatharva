# BuiltByAtharva — Official Brand Assets Directory

This directory is the **centralized home for official BuiltByAtharva brand assets**.

## Official Logo Placement
Place your official BuiltByAtharva logo image file at this exact location:

`public/assets/brand/logo.png`

### Asset Requirements:
- **Format:** PNG with transparent or dark background, or high-resolution JPG/WEBP.
- **Aspect Ratio:** Square (1:1) or horizontal (proportional).
- **Resolution:** Recommended 512x512px or higher for crisp display across High-DPI screens and PDF receipts.
- **Naming:** Must be named `logo.png` (or `builtbyatharva-logo.jpg`).

### How the Website & PDF Generator Use This File:
1. **Website (All Pages):** The header, mobile navigation, footer, developer card, and receipt modals dynamically load `public/assets/brand/logo.png`.
2. **Text Fallback:** If `logo.png` is missing or fails to load, a styled typographic `BuiltByAtharva` badge is automatically displayed without broken image icons.
3. **PDF Generator (`lib/generate-receipt-pdf.js`):** When client receipts are generated via serverless functions or local preview, this image is embedded directly in the A4 PDF header and subtle background watermark.

*Updating or replacing `logo.png` in this folder automatically updates the logo across all pages, components, and generated PDFs.*
