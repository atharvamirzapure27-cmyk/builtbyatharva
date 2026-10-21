# BuiltByAtharva V6 — Futuristic Software Studio

> **IDEAS. BUILT.**  
> Independent Software Development & Creative Engineering Studio by **Atharva Mirzapure**.

---

## 🌟 Overview & Transformation (V6)

BuiltByAtharva V6 transforms the personal studio website into an advanced, futuristic, interactive software-engineering experience. It showcases high-performance web applications, 3D interactive interfaces, AI-powered tools, and bespoke digital solutions with zero agency middlemen and 100% direct client communication.

---

## 🚀 Key Features Implemented in V6

### 1. Dual-Theme Futuristic Design System
- **Dark Theme (Default)**: Near-black & deep graphite surfaces (`#07090e`, `#111726`), luminous neon borders, electric blue (`#3b82f6`), cyber cyan (`#22d3ee`), vivid orange (`#ff7843`), and violet accents.
- **Light Theme**: Soft off-white & pale blue surfaces (`#ffffff`, `#f8fafc`, `#f1f5f9`), deep charcoal typography (`#0f172a`), refined dimensional drop shadows, and vibrant accent highlights.
- **Theme Persistence**: Instant toggle in navigation bar and mobile drawer. Automatically saves choice in `localStorage` (`bba-theme`) and respects system `prefers-color-scheme` on first visit.
- **Zero Flash of Wrong Theme**: Pre-render inline script in `<head>` ensures theme is applied before painting.

### 2. Advanced Developer-Style Hero
- Distinctive kinetic **BA** brand mark with animated scanline shine.
- Large kinetic typography: `BUILTBYATHARVA` + `IDEAS. BUILT.`
- Cycling kinetic slogan: `// DESIGN. DEVELOP. DEPLOY.`
- Honest personal introduction to **Atharva Mirzapure**.
- **Interactive Developer Terminal Workstation**:
  - macOS/Linux style chrome controls (`red`, `yellow`, `green` dots).
  - Tab switcher: `studio.ts`, `services.json`, `stack.config.js` with syntax-highlighted code buffers.
  - Live status indicator: `● ENGINE ONLINE • 0 ERRORS • 100% HANDCRAFTED`.
  - Orbiting technical stack pills.

### 3. Three.js 3D Cyber-Core Centerpiece
- Geometric polyhedral centerpiece: faceted icosahedron core, outer wireframe cage, and dual concentric orbital rings rotating on separate axes.
- Floating ambient particle field.
- Pointer-responsive parallax with smooth damping.
- **Theme-Adaptive**: Lighting and materials dynamically switch between dark neon luminescence and light crystalline refraction.
- **Battery & GPU Optimization**: Pauses rendering loop via `IntersectionObserver` when the hero is scrolled out of the viewport.
- Graceful CSS/SVG fallback when WebGL is unavailable or on small mobile screens.

### 4. Simplified Compact Service Cards & Detail Modals
- **Compact Default State**: Cards display **only** the service title, futuristic icon, category mini-badge, and `Explore Scope →` indicator. All prices, long paragraphs, and feature lists are hidden initially to prevent visual clutter.
- **Rich Service Detail Modal**: Clicking any card opens a dedicated modal displaying:
  - Full in-depth service overview
  - Included features checklist with check icons
  - Example project types & deliverables
  - Technologies applied
  - Starting rates / price ranges (e.g., Starter ₹2,999 to Business Pro ₹14,999+)
  - Delivery timelines (e.g., 2 to 10 days)
  - Transparent scope limitations
  - **"Start This Project" CTA**: Pre-selects the chosen service and package in the form wizard and smoothly scrolls to `#start-project`.

### 5. Dedicated Pricing & Centralized Interactive Estimator
- **Preserved Exact Pricing**:
  - **Starter**: ₹2,999 (2-3 Days, Up to 3 Pages, Responsive, Form, SEO, Vercel)
  - **Standard**: ₹5,999 (3-5 Days, Up to 5 Pages, Premium UI, Form Delivery, SEO, 7 Days Support)
  - **Business (Most Popular)**: ₹9,999 (5-7 Days, Up to 8 Pages, Dimensional UI, GSAP Motion, 14 Days Support)
  - **Business Pro**: ₹14,999+ (7-10 Days, 10+ Pages, Interactive Workflows, 30 Days Support)
  - **Web Applications**: Basic App ₹12,999 | Advanced App ₹19,999
  - **AI & ML Solutions**: AI Feature / Bot ₹3,999+ | Complete AI Web App ₹24,999+
- **Interactive Scope Estimator**: Live category selector, base tier selector, and add-on checkboxes with real-time total calculation and 50% advance notice. "Apply Estimate to Request Form" carries values into the brief builder.
- **50% Advance Notice**: Prominently stated across pricing cards and estimator.

### 6. Authentic Portfolio & Studio Preview Modals
- Showcases genuine projects by Atharva Mirzapure:
  1. **Truth Guard**: Multimodal fake news detection system. Accurately describes natural language credibility scoring and benchmark linguistic evaluations, distinguishing machine metrics from journalistic fact verification. Includes embedded live credibility scanner simulation!
  2. **Dermatologist Visit Reminder System**: Clinic appointment scheduling and follow-up notification tracker. Distinguishes simulated notification queues from third-party live carrier delivery.
  3. **AgriVision AI**: Crop leaf disease detection and agricultural telemetry portal. Accurately describes computer vision pathology image analysis.
  4. **AyurSanjeevani**: Herbal wellness portal with an embedded 3-stage Ayurvedic Dosha diagnosis quiz simulator.
  5. **Smart OPD Queue System**: Hospital waiting room token generator and dynamic wait-time calculator. Includes embedded live interactive token dispenser simulation!
- **Studio Lightbox Modal**:
  - **Case Study Tab**: Overview, problem solved, what Atharva built, key features, technology pills, status, and prototype disclaimer.
  - **Interactive Preview Tab**: Responsive device viewport switcher (Desktop, Tablet, Mobile) with embedded interactive simulators or sandboxed iframes.

### 7. Multi-Step Project Request Form
- 4-step brief wizard:
  1. **Contact Details**: Name, Phone/WhatsApp, Email, Company.
  2. **Project Details**: Category, Title, Goals & Description, Reference link.
  3. **Requirements & Timeline**: Desired customizations, Timeline, Budget.
  4. **Review**: Comprehensive summary with printable brief download and 50% advance notice.
- Anti-spam honeypot field (`website_hp`).

### 8. Lightweight Vercel Serverless Backend (`/api/submit-project`)
- Node.js serverless function running on Vercel Edge/Serverless.
- Server-side request sanitization & validation (email format, character length limits, anti-spam honeypot).
- Dispatches notification emails to **`builtbyatharva27@gmail.com`** using **Resend** (`RESEND_API_KEY`).
- Branded, professional HTML email template detailing all client info, financials, and quick email/WhatsApp reply links.
- Honest configuration warning returned if `RESEND_API_KEY` is not yet configured.

### 9. Correct Verified WhatsApp Integration
- Number: **`+91 86260 74035`** (international format: `918626074035`).
- Correct `wa.me/918626074035?text=...` links throughout the site.
- Old incorrect number (`93220 40915`) completely purged from all files.

---

## 🛠️ Local Development & Running the Studio

### Prerequisites
- Node.js v18+ (tested on Node v22.22.0)
- npm v10+

### Installation
```bash
npm install
```

### Starting the Local Development Server
```bash
npm run dev
# Or
node dev-server.js
```
The studio will run locally at:  
👉 **`http://localhost:8080`**

### Running Serverless API Unit Tests
```bash
npm run test-api
```
Tests method rejection (405), required field validation (400), honeypot spam protection (400), and configuration warning behavior (503).

---

## ☁️ Deployment to Vercel

1. Push your repository to GitHub or run `vercel` via Vercel CLI.
2. In your Vercel Project Dashboard:
   - Go to **Settings** > **Environment Variables**.
   - Add the following variable:
     - `RESEND_API_KEY`: Your Resend API key (e.g. `re_123456789...` from [resend.com](https://resend.com)).
     - *(Optional)* `RESEND_FROM_EMAIL`: Your verified sender domain (defaults to `BuiltByAtharva Studio <onboarding@resend.dev>` for testing).
3. Deploy! Vercel will automatically host the static frontend and route `/api/submit-project` as a serverless function.

---

## 📞 Verified Studio Contact

- **Founder**: Atharva Mirzapure
- **Email**: [builtbyatharva27@gmail.com](mailto:builtbyatharva27@gmail.com)
- **WhatsApp**: [+91 86260 74035](https://wa.me/918626074035)
- **Instagram**: [@built_by_atharva](https://www.instagram.com/built_by_atharva/)
- **Live URL**: [https://builtbyatharva.vercel.app](https://builtbyatharva.vercel.app)

*BuiltByAtharva — IDEAS. BUILT.*
