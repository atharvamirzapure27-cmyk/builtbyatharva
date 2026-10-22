# BuiltByAtharva — Futuristic Creative Technology & Software Studio

> **IDEAS. BUILT.**  
> Independent Software Development & Creative Engineering Studio by **Atharva Mirzapure**.

---

## 🌟 Overview & Master Studio Redesign

BuiltByAtharva is an advanced, futuristic, interactive creative technology studio website. It showcases high-performance web applications, interactive 3D spatial experiences, AI-powered tools, and bespoke digital solutions with zero agency middlemen and 100% direct client communication.

- **Brand**: BuiltByAtharva
- **Tagline**: IDEAS. BUILT.
- **Production Host**: Netlify
- **Live URL**: [https://builtbyatharva.netlify.app/](https://builtbyatharva.netlify.app/)
- **GitHub Repository**: [https://github.com/atharvamirzapure27-cmyk/builtbyatharva](https://github.com/atharvamirzapure27-cmyk/builtbyatharva)
- **Local Dev Server**: `http://localhost:8080/`

---

## 🚀 Key Architecture & Features

### 1. Cinematic Launch Sequence
- **Brand Reveal**: Kinetic intro with logo reveal, cyber scanline animation, and audio-visual cues.
- **Session Persistence**: Plays on initial visit; skippable via `Esc` key or "Skip Intro" button; replayable anytime via the "Replay Intro" button. Respects `prefers-reduced-motion`.

### 2. Three.js 3D Spatial Cyber-Core
- **Centerpiece**: Polyhedral icosahedron core enclosed in a dynamic wireframe cage and 3 concentric orbital rings spinning on independent axes.
- **Interactive**: Mouse/touch reactive parallax with smooth damping.
- **GPU Optimized**: Auto-pauses animation loop when scrolled out of viewport using `IntersectionObserver`.
- **Graceful Fallback**: CSS/SVG fallback when WebGL is unavailable or on low-power devices.

### 3. Multi-Page Architecture & Clean Navigation
- **Homepage (`index.html`)**: Cinematic intro, 3D cyber-core hero, quick service discovery, featured projects, dynamic stats, testimonials, and FAQ.
- **Services (`services.html`)**: Clean service cards with initial prices hidden to encourage interactive scope exploration. Clicking any card opens a rich modal with detailed deliverables, scope limits, timelines, and pre-selected CTA.
- **Pricing & Estimator (`pricing.html`)**: Complete transparent pricing tables, feature comparison matrix, and an interactive real-time cost estimator with 50% advance notice.
- **Work & Case Studies (`work.html` & `case-study.html`)**: Deep-dive portfolio with interactive in-browser simulators (Truth Guard Credibility Scanner, Smart OPD Queue Generator, Ayurvedic Dosha Diagnosis, AgriVision AI Leaf Pathology).
- **About (`about.html`)**: Founder biography, design philosophy, direct engineering manifesto, and technical stack.
- **Contact (`contact.html`)**: Direct verified WhatsApp, email, quick booking calendar, and location information.
- **Start Project Brief Wizard (`start-project.html`)**: Adaptive 5-step inquiry builder with live summary and instant PDF receipt download.
- **Custom 404 (`404.html`)**: Futuristic terminal-themed missing route handler with quick navigation back to base.

### 4. Adaptive 5-Step Project Wizard
- **Step 1**: Project Type Selection (Website, Web Application, AI / ML Solution, UI/UX & Interactive 3D).
- **Step 2**: Adaptive Dynamic Questions & Custom Features tailored to the selected project type.
- **Step 3**: Budget Range & Timeline Selection with clear 50% advance terms.
- **Step 4**: Client Contact Validation (RFC 5322 email, international phone/WhatsApp format, anti-spam honeypot).
- **Step 5**: Comprehensive Review & Instant Submission with live PDF receipt generation.

### 5. Single-Page A4 PDF Receipt Generator (`lib/pdf-receipt.js`)
- Server-side PDFKit generator strictly formatted to fit a single A4 page with zero multi-page overflow.
- Embeds authentic studio logo, unique reference ID (`BBA-YYYYMMDD-XXXX`), submission timestamp, client details, project scope, budget, and next steps.
- Downloadable directly in-browser or delivered with confirmation emails.

### 6. Production Netlify Serverless Backend (`netlify/functions/submit-project.js`)
- Dual-path routing: native `/.netlify/functions/submit-project` and rewrite `/api/submit-project`.
- Backward-compatible adapter maintained at `api/submit-project.js`.
- Security: RFC 5322 regex validation, 50KB payload ceiling, honeypot anti-spam defense, in-memory IP rate limiting, and CORS headers.
- Email delivery via **Resend** Node.js SDK:
  - Formatted HTML business notification dispatched to `CONTACT_EMAIL` (`builtbyatharva27@gmail.com`).
  - Optional client auto-reply confirmation (`RESEND_CLIENT_CONFIRMATION=true` when custom domain is verified).

### 7. Verified Studio Contacts
- **Founder**: Atharva Mirzapure
- **Email**: [builtbyatharva27@gmail.com](mailto:builtbyatharva27@gmail.com)
- **WhatsApp**: [+91 86260 74035](https://wa.me/918626074035) (International format: `918626074035`)

---

## 🛠️ Local Development & Testing

### Installation
```bash
npm install
```

### Start Development Server
```bash
npm run dev
# or
node dev-server.js
```
The studio runs locally at **`http://localhost:8080`**.

### Run Automated Test Suite
```bash
# Run all tests (audit + backend + PDF)
npm test

# Run HTML/SEO/asset audit (9 pages, 39 images, 0 broken links)
npm run test:audit

# Run API, Rate Limit, Honeypot, Resend Mock & PDF tests
npm run test:api

# Syntax check all JavaScript files
npm run check
```

---

## ☁️ Environment Configuration (Netlify)

In Netlify Dashboard (**Site Configuration** > **Environment variables**):
- `RESEND_API_KEY`: Your Resend API key (`re_...` from [resend.com/api-keys](https://resend.com/api-keys)).
- `CONTACT_EMAIL`: (Optional) Lead notification recipient (defaults to `builtbyatharva27@gmail.com`).
- `RESEND_FROM_EMAIL`: (Optional) Verified sender address (defaults to `BuiltByAtharva Studio <onboarding@resend.dev>`).
- `RESEND_CLIENT_CONFIRMATION`: (Optional) Set to `true` after verifying a custom domain in Resend to enable automated client receipts.

*BuiltByAtharva — IDEAS. BUILT.*
