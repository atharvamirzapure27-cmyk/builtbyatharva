/**
 * BuiltByAtharva — Central Configuration System (V6)
 * Brand: BuiltByAtharva (IDEAS. BUILT.)
 * Founder: Atharva Mirzapure | Independent Software Developer & Creative Technologist
 * Instagram: @built_by_atharva | https://instagram.com/built_by_atharva
 * Email: builtbyatharva27@gmail.com
 * WhatsApp: +91 8626074035 (Verified international: 918626074035)
 *
 * Central single source of truth for:
 * - Brand identity & verified contact links
 * - Service catalog & deep modal specifications
 * - Capability systems & architectural use-cases
 * - Centralized pricing, packages & configurator add-ons
 * - Authentic portfolio data, case studies & interactive simulators
 * - 7-step signature engineering process
 * - Serverless API endpoint configuration
 */

const CONFIG = {
  BRAND: {
    name: "BuiltByAtharva",
    tagline: "IDEAS. BUILT.",
    subTagline: "Futuristic Creative Technology & Software Studio",
    founder: "Atharva Mirzapure",
    role: "Independent Software Developer & Creative Technologist",
    logoPath: "public/assets/brand/logo.png",
    fallbackLogoPath: "assets/brand/logo.png",
    logoAlt: "BuiltByAtharva — IDEAS. BUILT.",
    logoFallbackText: "BuiltByAtharva",
    location: "India (Available Globally)",
    email: "builtbyatharva27@gmail.com",
    instagram: "@built_by_atharva",
    instagramUrl: "https://www.instagram.com/built_by_atharva/",
    // Verified WhatsApp number (international format with country code, no + or spaces for wa.me)
    whatsappNumber: "918626074035",
    whatsappDisplay: "+91 86260 74035",
    whatsappLink: "https://wa.me/918626074035",
    siteUrl: "https://builtbyatharva.netlify.app",
    paymentPolicy: "50% advance payment is required after project scope and quotation are agreed. Payment details and payment QR code will be shared personally by Atharva."
  },

  // Centralized Pricing & Package Structure
  PRICING: {
    // Website Development Tiers
    WEBSITE_PACKAGES: [
      {
        id: "starter",
        name: "Starter",
        price: 2999,
        priceDisplay: "₹2,999",
        timeline: "2 - 3 Days",
        desc: "Ideal for clean personal portfolios, resumes, and single-page landing showcases.",
        features: [
          "Up to 3 Custom Web Pages",
          "Fully Mobile & Tablet Responsive",
          "Contact / Lead Form Integration",
          "Clean Semantic HTML5 & Modern CSS",
          "Basic SEO & Social Meta Tags",
          "Vercel Deployment Setup"
        ],
        featured: false,
        advanceNotice: "50% Advance Required (₹1,500)"
      },
      {
        id: "standard",
        name: "Standard",
        price: 5999,
        priceDisplay: "₹5,999",
        timeline: "3 - 5 Days",
        desc: "Great for small businesses, personal brands, creators, and service providers.",
        features: [
          "Up to 5 Custom Styled Pages",
          "Futuristic Light/Dark UI & Micro-Interactions",
          "Reliable Serverless Email Dispatch",
          "Social Media & Google Map Integration",
          "On-Page SEO Optimization & Speed Tuning",
          "7 Days Post-Launch Support"
        ],
        featured: false,
        advanceNotice: "50% Advance Required (₹3,000)"
      },
      {
        id: "business",
        name: "Business",
        price: 9999,
        priceDisplay: "₹9,999",
        timeline: "5 - 7 Days",
        desc: "Complete custom digital presence for growing companies, agencies, and studios.",
        features: [
          "Up to 8 Custom Responsive Pages",
          "High-End Dimensional UI & GSAP Motion",
          "Interactive Calculators / Filter Systems",
          "Fast Performance & Lighthouse Optimization",
          "Custom Open Graph Sharing Previews",
          "14 Days Post-Launch Support"
        ],
        featured: true,
        badge: "Most Popular",
        advanceNotice: "50% Advance Required (₹5,000)"
      },
      {
        id: "business-pro",
        name: "Business Pro",
        price: 14999,
        priceDisplay: "₹14,999+",
        timeline: "7 - 10 Days",
        desc: "Advanced multi-section corporate experience with custom workflows and animations.",
        features: [
          "10+ Custom Structured Pages",
          "Choreographed GSAP & ScrollTrigger Motion",
          "Multi-Step Inquiry & Brief Wizards",
          "Interactive Component Prototyping",
          "Speed, Contrast & Accessibility Audit",
          "Priority Development & 30 Days Support"
        ],
        featured: false,
        advanceNotice: "50% Advance Required (from ₹7,500)"
      }
    ],

    // Web Applications & AI Solutions Tiers
    APP_PACKAGES: [
      {
        id: "basic-app",
        name: "Basic Web App",
        category: "Web Application",
        price: 12999,
        priceDisplay: "₹12,999",
        timeline: "7 - 10 Days",
        desc: "Dynamic client-side tool with intuitive UI logic, CRUD data views, and utility workflows.",
        features: [
          "Interactive Web Application Dashboard",
          "Client-Side Data Management & State",
          "Search, Filtering & Sorting Controls",
          "Responsive Cross-Device Layout",
          "Vercel Deployment & Handover"
        ],
        advanceNotice: "50% Advance Required"
      },
      {
        id: "advanced-app",
        name: "Advanced Web App",
        category: "Web Application",
        price: 19999,
        priceDisplay: "₹19,999",
        timeline: "10 - 14 Days",
        desc: "Complex interactive dashboard application with real-time UI states and simulated/external APIs.",
        features: [
          "Multi-View Dynamic Application Architecture",
          "Complex Data Visualization & Graphs",
          "External API & Service Integration",
          "Exportable Reports / Print Layouts",
          "Comprehensive Testing & Optimization"
        ],
        advanceNotice: "50% Advance Required"
      },
      {
        id: "ai-bot",
        name: "AI Feature / Bot",
        category: "AI & ML Solution",
        price: 3999,
        priceDisplay: "₹3,999+",
        timeline: "3 - 5 Days",
        desc: "Integrating modern AI capabilities (OpenAI, Claude, or custom endpoints) into existing web UI.",
        features: [
          "Custom AI Chatbot or Assistant UI",
          "Prompt Engineering & Response Streaming",
          "External API Connection via Serverless Proxy",
          "Mobile Responsive Chat Interface"
        ],
        advanceNotice: "50% Advance Required"
      },
      {
        id: "ai-webapp",
        name: "Complete AI Web App",
        category: "AI & ML Solution",
        price: 24999,
        priceDisplay: "₹24,999+",
        timeline: "12 - 18 Days",
        desc: "Full-scale AI-powered web tool with generative analysis, scoring systems, and custom frontend workflows.",
        features: [
          "End-to-End AI Web Tool Interface",
          "Multi-Model Analysis & Result Visualization",
          "History Logs & Client-Side Caching",
          "Custom Interactive Dashboard Views",
          "Comprehensive Scope Confirmation & Testing"
        ],
        advanceNotice: "50% Advance Required"
      }
    ],

    // Starting rates for services
    OTHER_SERVICES: {
      specialWebsites: { price: 1499, display: "₹1,499" },
      uiUxDesign: { price: 1999, display: "₹1,999+" },
      integrations: { price: 1000, display: "₹1,000+" },
      maintenance: { price: 500, display: "₹500/mo" }
    },

    // Configurator Add-On Features
    ADDONS: [
      {
        id: "extra-pages",
        name: "Extra Web Pages",
        price: 1500,
        priceDisplay: "+₹1,500",
        desc: "2 to 3 additional styled pages for expanded content or case studies"
      },
      {
        id: "ai-integration",
        name: "AI Feature Integration",
        price: 3000,
        priceDisplay: "+₹3,000",
        desc: "AI API chatbot, content generator, or intelligent text analysis tool"
      },
      {
        id: "custom-animations",
        name: "Custom GSAP & 3D Motion",
        price: 2000,
        priceDisplay: "+₹2,000",
        desc: "Choreographed entrance reveals, scroll triggers, and dimensional depth"
      },
      {
        id: "whatsapp-integration",
        name: "WhatsApp Direct Chat",
        price: 1000,
        priceDisplay: "+₹1,000",
        desc: "One-click pre-filled consultation button connected directly to your number"
      },
      {
        id: "maps-integration",
        name: "Interactive Google Maps",
        price: 1000,
        priceDisplay: "+₹1,000",
        desc: "Custom embedded responsive map for clinic, studio, or store location"
      },
      {
        id: "express-delivery",
        name: "Express Rush Delivery",
        price: 1500,
        priceDisplay: "+₹1,500",
        desc: "Priority development queue with accelerated turnaround"
      },
      {
        id: "extended-support",
        name: "Extended 30-Day Support",
        price: 1500,
        priceDisplay: "+₹1,500",
        desc: "Dedicated post-launch bug fixes, text updates, and guidance"
      },
      {
        id: "auth-ui-setup",
        name: "Authentication UI Setup",
        price: 3500,
        priceDisplay: "+₹3,500",
        desc: "Login/signup modal flows & account state UI (External auth service required)"
      }
    ]
  },

  // 7 Core Engineering Services (Compact cards + deep modal details)
  SERVICES_CATALOG: [
    {
      id: "website-dev",
      title: "Website Development",
      icon: "globe",
      categoryBadge: "Core Engineering",
      color: "blue",
      shortDesc: "High-performance websites, personal brand showcases, and responsive landing pages.",
      fullDesc: "Bespoke web development engineered with clean semantic HTML5, modern CSS3, Vanilla JavaScript, and optional GSAP motion choreography. Engineered for sub-second load times, search engine visibility, seamless cross-device adaptability, and zero bloated template overhead.",
      projectTypes: [
        "Personal Portfolios & CV Showcases",
        "Company & Startup Landing Pages",
        "Local Business & Studio Websites",
        "Restaurant, Café & Hospitality Menus",
        "Product Launch & Teaser Pages"
      ],
      features: [
        "100% Mobile, Tablet & Desktop Responsive Layouts",
        "Futuristic Dimensional UI with Light/Dark Theme Support",
        "Direct Serverless Email & Lead Capture Integration",
        "On-Page SEO Meta Tags & Custom OpenGraph Social Cards",
        "Global Edge Deployment on Vercel with Instant SSL",
        "Clean Modular Code Handover & Complete Ownership"
      ],
      customizations: [
        "Three.js 3D interactive centerpieces",
        "Scroll-triggered interactive timelines",
        "Multi-language UI switches",
        "Interactive price calculators and estimators"
      ],
      technologies: ["HTML5", "CSS3 / Custom Properties", "Vanilla JS (ES6+)", "Three.js", "GSAP Motion", "Vercel Edge"],
      priceRange: "Starting from ₹2,999 (Starter) to ₹14,999+ (Business Pro)",
      deliveryRange: "2 to 10 Days",
      addOns: [
        "Extra Web Pages (+₹1,500)",
        "Interactive Google Maps (+₹1,000)",
        "WhatsApp Direct Chat (+₹1,000)",
        "Express Rush Delivery (+₹1,500)"
      ],
      limitations: [
        "Static frontend architecture; dynamic multi-user database backends or complex CMS portals are scoped under Web Applications.",
        "Custom domain registration and business email hosting are billed directly to the client's registrar."
      ],
      formCategory: "Website Development",
      defaultTier: "standard"
    },
    {
      id: "web-apps",
      title: "Web Applications",
      icon: "layout-template",
      categoryBadge: "Interactive Systems",
      color: "cyan",
      shortDesc: "Dynamic client-side tools, dashboards, queue trackers, and workflow systems.",
      fullDesc: "Interactive web applications designed with responsive client-side state architecture, data visualizers, utility calculators, and automated workflows. Focuses on intuitive user experience, instant feedback, and clean architecture without unnecessary server complexity.",
      projectTypes: [
        "Analytical & Operational Dashboards",
        "Hospital Waiting Room & Token Trackers",
        "Clinical Follow-up & Appointment Loggers",
        "Interactive Budget & Financial Estimators",
        "Client-Side CRUD Data Management Portals"
      ],
      features: [
        "Reactive Client-Side State Management",
        "Interactive Data Tables with Search, Filter & Sort",
        "Dynamic SVG & Canvas Data Visualizations",
        "Local Storage & Session Persistence",
        "Exportable Reports (CSV / Print-Ready PDF)",
        "Cross-Browser Compatibility & Touch Optimization"
      ],
      customizations: [
        "External REST API Connections",
        "Custom Algorithmic Calculation Engines",
        "Simulated or Real-Time WebSockets",
        "Role-Based UI Views and Status Toggles"
      ],
      technologies: ["Vanilla JavaScript / TypeScript", "Chart / Canvas APIs", "Fetch API", "Local Storage", "Vercel Serverless"],
      priceRange: "₹12,999 (Basic App) to ₹19,999 (Advanced App)",
      deliveryRange: "7 to 14 Days",
      addOns: [
        "Auth UI Setup (+₹3,500)",
        "Extended 30-Day Support (+₹1,500)",
        "Express Rush Delivery (+₹2,500)"
      ],
      limitations: [
        "Production authentication, payment gateways, and persistent relational cloud databases require external backend services (e.g. Supabase, Firebase, or custom API endpoints) which are scoped separately."
      ],
      formCategory: "Web Application",
      defaultTier: "basic-app"
    },
    {
      id: "ai-solutions",
      title: "AI & ML Solutions",
      icon: "cpu",
      categoryBadge: "AI & Automation",
      color: "orange",
      shortDesc: "Modern AI model integrations, conversational bots, and diagnostic interfaces.",
      fullDesc: "Connecting web interfaces with modern AI model APIs (OpenAI, Anthropic Claude, Hugging Face, or custom ML models). We build responsive chatbot interfaces, intelligent document analyzers, automated text classification, and diagnostic vision interfaces.",
      projectTypes: [
        "Intelligent Customer Support Chatbots",
        "NLP Content & Misinformation Scanners",
        "Computer Vision & Leaf/Image Diagnostic Portals",
        "AI-Powered Text Summarization & Generation",
        "Custom Prompt Engineering & Assistant Tools"
      ],
      features: [
        "Streaming AI Response Displays & Typing Effects",
        "Multi-Modal Image & Text Input Dropzones",
        "Confidence Score & Reliability Visualizers",
        "Conversation History & Prompt Templates",
        "API Key Protection via Serverless Functions",
        "Mobile-Optimized Conversational UI"
      ],
      customizations: [
        "Custom Model Fine-Tuning Integration",
        "RAG / Document Context Injection UI",
        "Structured JSON Schema Output Parsing",
        "Custom Avatar & Visual Personas"
      ],
      technologies: ["AI APIs (OpenAI, Claude, Custom)", "Vercel Serverless Functions", "JavaScript", "Markdown Streaming", "CSS Animations"],
      priceRange: "₹3,999+ (AI Feature/Bot) to ₹24,999+ (Full AI Web App)",
      deliveryRange: "3 to 18 Days",
      addOns: [
        "Custom GSAP & 3D Motion (+₹2,000)",
        "Extended 30-Day Support (+₹1,500)"
      ],
      limitations: [
        "Third-party AI token usage and API credits (OpenAI/Anthropic) are billed directly to the client's API provider account. Model accuracy reflects underlying model evaluation metrics and does not guarantee absolute factuality without human oversight."
      ],
      formCategory: "AI & ML Solution",
      defaultTier: "ai-bot"
    },
    {
      id: "special-websites",
      title: "Special & Personal Websites",
      icon: "sparkles",
      categoryBadge: "Creative Moments",
      color: "pink",
      shortDesc: "Custom celebration pages, birthday surprises, digital invitations, and micro-sites.",
      fullDesc: "Bespoke digital experiences crafted for special personal milestones, creative showcases, digital invitations, anniversaries, and birthday surprises. Infused with interactive surprises, music players, photo memories carousels, and playful animations.",
      projectTypes: [
        "Birthday Surprise Micro-Sites",
        "Digital Wedding & Event Invitations",
        "Couple Anniversary & Relationship Storybooks",
        "Interactive Resume & Creative Portfolios",
        "Memorial & Tribute Showcases"
      ],
      features: [
        "Personalized Interactive Greeting Animations",
        "Curated Photo & Video Memory Gallery",
        "Interactive Wishes / Guest Message Board",
        "Background Audio & Sound Effects",
        "Password Protection / Secret Code Access",
        "Private Vercel Share Link"
      ],
      customizations: [
        "Virtual Gift Box Unwrapping Animations",
        "Interactive Timeline of Memories",
        "Countdown Timers to Event",
        "Custom Color Palette & Typography"
      ],
      technologies: ["HTML5", "CSS3 Animations", "JavaScript", "Audio API", "Canvas Confetti"],
      priceRange: "Starting from ₹1,499",
      deliveryRange: "1 to 3 Days",
      addOns: [
        "Custom GSAP Motion (+₹1,000)",
        "WhatsApp RSVP Trigger (+₹500)"
      ],
      limitations: [
        "Tailored for personal and social occasions; commercial e-commerce or complex business features are not included."
      ],
      formCategory: "Special / Personal Site",
      defaultTier: "starter"
    },
    {
      id: "ui-ux-design",
      title: "UI/UX & Creative Design",
      icon: "palette",
      categoryBadge: "Interface Design",
      color: "violet",
      shortDesc: "Modern design systems, wireframes, dimensional layouts, and design audits.",
      fullDesc: "High-craft digital interface design focusing on futuristic typography, dark/light dimensional color hierarchies, fluid micro-interactions, and accessible layouts. We turn rough ideas into crisp design prototypes ready for engineering.",
      projectTypes: [
        "Website & Landing Page UI Concepts",
        "Web Application Dashboard Wireframes",
        "Mobile-First Component Design Systems",
        "Theme & Palette Strategy (Dark/Light)",
        "Design Audits & UX Refinements"
      ],
      features: [
        "Harmonious Color Palette & Type Scales",
        "Component-Driven Design Hierarchy",
        "Interactive Micro-Animation Prototypes",
        "Dark & Light Theme Specifications",
        "High-Fidelity Visual Mockups",
        "Development-Ready Asset Export"
      ],
      customizations: [
        "Custom 3D Iconography Exploration",
        "Design System Styleguides",
        "Accessibility & Contrast Compliance Audits"
      ],
      technologies: ["Figma / Penpot Workflows", "CSS Tokens", "Google Fonts / Web Typography", "SVG"],
      priceRange: "Starting from ₹1,999+",
      deliveryRange: "2 to 5 Days",
      addOns: [
        "Full Frontend HTML/CSS Implementation (+Standard Package Rate)"
      ],
      limitations: [
        "Design-only deliverables unless combined with frontend development packages."
      ],
      formCategory: "Website Development",
      defaultTier: "standard"
    },
    {
      id: "integrations-apis",
      title: "Integrations & APIs",
      icon: "link-2",
      categoryBadge: "Connectors",
      color: "cyan",
      shortDesc: "Form services, serverless endpoints, third-party APIs, and automation.",
      fullDesc: "Connecting your existing frontend to modern digital services. From email notification services (Resend, Web3Forms, Formspree), interactive maps (Google Maps, Leaflet), to custom Vercel serverless functions and WhatsApp consultation triggers.",
      projectTypes: [
        "Direct Inbox Form Integrations",
        "Vercel Serverless API Functions",
        "Interactive Google Maps / Store Locators",
        "WhatsApp & Social Trigger Integrations",
        "Analytics & Conversion Tracking"
      ],
      features: [
        "Reliable Server-Side Form Validation",
        "Anti-Spam / Honeypot Protection",
        "Clean API Request / Response Handling",
        "Secure Environment Variable Setup",
        "Zero Secret Exposure on Frontend",
        "Handover Documentation"
      ],
      customizations: [
        "Multi-Step Wizard Connectors",
        "Webhooks & Automation Triggers (Zapier / Make)",
        "Custom Email Template Styling"
      ],
      technologies: ["Node.js / Vercel Serverless", "REST APIs", "Resend / Web3Forms", "Google Maps Platform"],
      priceRange: "Starting from ₹1,000+",
      deliveryRange: "1 to 3 Days",
      addOns: [
        "Custom Email Notification Templates (+₹1,000)"
      ],
      limitations: [
        "Requires client to hold or create accounts on third-party service platforms."
      ],
      formCategory: "Website Development",
      defaultTier: "starter"
    },
    {
      id: "maintenance-support",
      title: "Maintenance & Support",
      icon: "shield-check",
      categoryBadge: "Longevity",
      color: "blue",
      shortDesc: "Content updates, speed tuning, domain DNS support, and bug fixes.",
      fullDesc: "Keep your digital presence fast, secure, and up-to-date. Regular maintenance services ensure your website continues running smoothly on Vercel's global edge network, with prompt updates for new announcements, images, and copy.",
      projectTypes: [
        "Monthly Content & Copy Updates",
        "DNS & Custom Domain Setup / Migration",
        "Performance & Lighthouse Speed Tuning",
        "Browser Compatibility & Bug Fixes",
        "Security Header & Meta Tag Audits"
      ],
      features: [
        "Guaranteed Turnaround on Updates",
        "Vercel Deployment Verification",
        "Mobile Viewport Checkups",
        "Link Integrity & Form Testing",
        "Direct Priority WhatsApp Access"
      ],
      customizations: [
        "Quarterly Feature Refresh",
        "Design System Enhancements"
      ],
      technologies: ["Vercel Edge", "DNS Configuration", "HTML/CSS/JS", "Lighthouse Audits"],
      priceRange: "Starting from ₹500/month or ₹1,500 one-time",
      deliveryRange: "Ongoing / Same-Day Turnaround",
      addOns: [
        "Extra Major Feature Add-On (Quoted on scope)"
      ],
      limitations: [
        "Covers minor updates, bug fixes, and maintenance within original scope. Complete site redesigns are scoped as new projects."
      ],
      formCategory: "Website Development",
      defaultTier: "starter"
    }
  ],

  // 3 Capability Systems (Compact cards + deep modal details)
  CAPABILITIES_CATALOG: [
    {
      id: "cap-system-websites",
      title: "Web & Brand Showcases",
      subtitle: "01. High-Impact Portfolios & Digital Identity",
      icon: "globe",
      color: "blue",
      shortDesc: "High-converting websites, portfolios, and brand platforms built for speed and visual elegance.",
      tags: [
        "Portfolio Websites",
        "Personal Brand Sites",
        "Business Websites",
        "Company Portals",
        "Restaurant / Café Sites",
        "Small Business Catalogs",
        "Product Landing Pages",
        "Event & Invitation Sites",
        "Birthday Surprise Pages",
        "Relationship Celebration Sites"
      ],
      techStack: ["HTML5", "Modern CSS3", "Vanilla JS", "Three.js 3D", "GSAP Motion", "Vercel Edge"],
      deliveryTimeline: "2 to 7 Days",
      typicalBudget: "₹2,999 - ₹9,999",
      formCategory: "Website Development"
    },
    {
      id: "cap-system-apps",
      title: "Web Applications & Systems",
      subtitle: "02. Reactive Dashboards, Trackers & Utilities",
      icon: "layout-template",
      color: "cyan",
      shortDesc: "Dynamic client-side tools, interactive dashboards, queue trackers, and custom utilities.",
      tags: [
        "Analytical Dashboards",
        "Hospital Queue Trackers",
        "Clinic Appointment Loggers",
        "Interactive Utility Calculators",
        "Client-Side Data Portals",
        "Custom Workflow Tools"
      ],
      techStack: ["Vanilla JavaScript / TypeScript", "Chart.js", "LocalStorage / IndexedDB", "REST APIs", "Vercel Functions"],
      deliveryTimeline: "7 to 14 Days",
      typicalBudget: "₹12,999 - ₹19,999",
      formCategory: "Web Application"
    },
    {
      id: "cap-system-ai",
      title: "AI & ML Powered Solutions",
      subtitle: "03. Machine Learning Prototypes & APIs",
      icon: "cpu",
      color: "orange",
      shortDesc: "Integrating modern AI models (OpenAI, Claude, custom prototypes) into responsive web interfaces.",
      tags: [
        "AI Web Tool Interfaces",
        "Chatbot Integrations",
        "Misinformation & Text Scanners",
        "Image Diagnostic Web Portals",
        "Third-Party AI API Connectors"
      ],
      techStack: ["OpenAI / Claude APIs", "Computer Vision Prototypes", "NLP Processing", "Serverless Edge", "Responsive CSS"],
      deliveryTimeline: "3 to 18 Days",
      typicalBudget: "₹3,999+ - ₹24,999+",
      formCategory: "AI & ML Solution"
    }
  ],

  // Authentic Portfolio Projects & Studio Case Studies
  REAL_PROJECTS: [
    {
      id: "truth-guard",
      title: "Truth Guard",
      subtitle: "Multimodal Fake News Detection System",
      category: "ai",
      categoryLabel: "AI & ML Solution",
      status: "Research Prototype & Evaluation",
      badgeColor: "orange",
      image: "assets/portfolio-1.jpg",
      shortDesc: "AI-assisted misinformation detection platform evaluating news claims and article credibility using natural language analysis.",
      liveUrl: "", // Pending live URL configuration by owner
      repoUrl: "", // Pending public repository configuration by owner
      hasSimulator: true,
      simulatorType: "truth-scanner",
      tech: ["AI / NLP", "Vanilla JavaScript", "HTML5 & CSS3", "Vercel Deploy"],
      keyFeatures: [
        "Real-time claim input & text credibility scoring",
        "Source reliability breakdown with confidence levels",
        "Multimodal analysis conceptual layout",
        "History log of evaluated statements"
      ],
      contribution: "Designed and implemented the complete frontend interface, interactive credibility breakdown cards, and API response visualization.",
      caseStudy: {
        problem: "Misinformation spreads rapidly across social channels. Users need a transparent, easy-to-use interface to examine suspicious headlines and understand credibility factors.",
        solution: "Built a responsive, distraction-free analysis dashboard where claims can be inspected with clear visual confidence indicators and source verification signals.",
        evaluatedResults: "Tested on benchmark linguistic datasets for fake news detection; clearly separates machine confidence metrics from absolute real-world verification.",
        disclaimer: "Truth Guard is an evaluated research prototype. Final factual truth requires journalistic verification."
      }
    },
    {
      id: "dermatologist-reminder",
      title: "Dermatologist Visit Reminder",
      subtitle: "Patient Follow-up & Appointment Notification System",
      category: "webapp",
      categoryLabel: "Web Application",
      status: "In Development / Prototype",
      badgeColor: "cyan",
      image: "assets/portfolio-3.jpg",
      shortDesc: "Automated patient appointment schedule & follow-up notification application tailored for dermatology clinics.",
      liveUrl: "", // Pending live URL configuration by owner
      repoUrl: "", // Pending public repository configuration by owner
      hasSimulator: false,
      tech: ["Vanilla JavaScript", "Calendar UI", "Notification Queue", "Custom CSS"],
      keyFeatures: [
        "Patient appointment scheduling calendar",
        "Automated follow-up notification queue simulation",
        "Treatment procedure history logs",
        "Doctor daily agenda overview"
      ],
      contribution: "Architected clinic workflow UI, appointment queue visualizer, and responsive appointment status cards.",
      caseStudy: {
        problem: "Dermatology clinics experience high no-show rates for routine skin checkups and follow-up treatment sessions without timely reminders.",
        solution: "Engineered a clean clinical schedule interface that tracks patient appointments and queues automated SMS/Email reminders at configurable intervals.",
        evaluatedResults: "Functional prototype tested with simulated patient queues and notification scheduling.",
        disclaimer: "Live SMS/WhatsApp transmission requires a connected third-party carrier API (e.g. Twilio/Gupshup)."
      }
    },
    {
      id: "agrivision-ai",
      title: "AgriVision AI",
      subtitle: "Crop Leaf Disease Detection & Analytics Portal",
      category: "ai",
      categoryLabel: "AI & ML Solution",
      status: "Research Prototype",
      badgeColor: "orange",
      image: "assets/portfolio-4.jpg",
      shortDesc: "AI-assisted crop disease diagnostic portal and yield health dashboard designed for smart agricultural monitoring.",
      liveUrl: "", // Pending live URL configuration by owner
      repoUrl: "", // Pending public repository configuration by owner
      hasSimulator: false,
      tech: ["AI Machine Vision", "JavaScript", "HTML5 / CSS3", "Analytics UI"],
      keyFeatures: [
        "Leaf health image upload & inspection preview",
        "Visual diagnostic disease match with severity scale",
        "Preventive treatment and fertilizer recommendations",
        "Farm environmental telemetry dashboard"
      ],
      contribution: "Built the web inspection portal, interactive image preview dropzone, and responsive agricultural metrics dashboard.",
      caseStudy: {
        problem: "Early detection of crop blights and fungal infections is critical to prevent devastating agricultural yield losses.",
        solution: "Crafted a lightweight web interface where farmers and agronomists can upload plant photos to inspect disease symptoms and read actionable treatment guides.",
        evaluatedResults: "Evaluated on public plant pathology image sets for model interface demonstration.",
        disclaimer: "Field decisions should be cross-verified with certified agricultural specialists."
      }
    },
    {
      id: "ayur-sanjeevani",
      title: "AyurSanjeevani",
      subtitle: "Herbal Wellness & Ayurvedic Consultation Portal",
      category: "website",
      categoryLabel: "Website Development",
      status: "Completed / Prototype Demo",
      badgeColor: "blue",
      image: "assets/portfolio-5.jpg",
      shortDesc: "Herbal medicine & Ayurvedic wellness web portal featuring personalized Dosha constitution diagnosis and consultation booking.",
      liveUrl: "", // Pending live URL configuration by owner
      repoUrl: "", // Pending public repository configuration by owner
      hasSimulator: true,
      simulatorType: "dosha-quiz",
      tech: ["Modern Web", "Interactive Quiz Engine", "Custom CSS", "Form Integration"],
      keyFeatures: [
        "Interactive 3-stage Ayurvedic Dosha diagnosis quiz",
        "Herbal product and remedy directory",
        "Direct appointment consultation booking",
        "Botanical aesthetic with responsive card grid"
      ],
      contribution: "Designed and developed the entire website, quiz scoring algorithm (Vata, Pitta, Kapha), and mobile-responsive botanical UI.",
      caseStudy: {
        problem: "Traditional Ayurvedic practices needed a fresh, modern, accessible online presence that educates visitors while simplifying consultation booking.",
        solution: "Created an engaging digital portal featuring an interactive self-assessment quiz that calculates dominant Ayurvedic body types and recommends lifestyle advice.",
        evaluatedResults: "Completed web build with fully functional client-side scoring logic and booking flow.",
        disclaimer: "Educational wellness guide; not intended as medical diagnosis."
      }
    },
    {
      id: "smart-opd",
      title: "Smart OPD Queue System",
      subtitle: "Hospital Patient Token & Waiting Room Tracker",
      category: "webapp",
      categoryLabel: "Web Application",
      status: "Completed / Prototype",
      badgeColor: "cyan",
      image: "assets/portfolio-2.jpg",
      shortDesc: "Real-time hospital OPD queue tracker & patient token management web application for live waiting room visibility.",
      liveUrl: "", // Pending live URL configuration by owner
      repoUrl: "", // Pending public repository configuration by owner
      hasSimulator: true,
      simulatorType: "opd-queue",
      tech: ["Web App", "Real-Time JS", "HTML5 & CSS3", "Responsive UI"],
      keyFeatures: [
        "Live token generation and waiting room status display",
        "Estimated wait-time calculator based on queue depth",
        "Doctor department panel with status toggling",
        "High-contrast display mode for clinic screens"
      ],
      contribution: "Programmed the interactive token generation engine, real-time wait-time calculation logic, and responsive OPD board.",
      caseStudy: {
        problem: "Overcrowded hospital outpatient waiting rooms cause high patient anxiety and inefficient consultation sequencing.",
        solution: "Developed an intuitive waiting room tracker that provides live token visibility, wait time projections, and department calling signals.",
        evaluatedResults: "Tested in simulated clinic queue scenarios with dynamic token issuing.",
        disclaimer: "Standalone web interface ready for integration with hospital management databases."
      }
    }
  ],

  // 7-Step Signature Engineering Process
  PROCESS_STEPS: [
    {
      step: "01",
      title: "Tell Me Your Idea",
      desc: "Share your vision, project goals, must-have features, and design preferences through our request brief or direct message.",
      accent: "blue"
    },
    {
      step: "02",
      title: "Discuss Requirements",
      desc: "I personally review your submission and connect with you directly via email or WhatsApp to clarify scope, timeline, and technical expectations.",
      accent: "cyan"
    },
    {
      step: "03",
      title: "Get Your Quote",
      desc: "You receive a clear, honest, fixed-scope quotation with exact milestones. No hidden fees or unexpected post-launch surprises.",
      accent: "orange"
    },
    {
      step: "04",
      title: "50% Advance",
      desc: "Payment details and QR are shared directly. Work begins immediately upon 50% advance confirmation to secure your development slot.",
      accent: "yellow"
    },
    {
      step: "05",
      title: "Development",
      desc: "I build your solution with clean code, modern typography, responsive layouts, and visual depth — sharing live progress updates along the way.",
      accent: "pink"
    },
    {
      step: "06",
      title: "Testing & Refinement",
      desc: "You receive a private live preview link to test interactions on your devices, share feedback, and request revisions within agreed scope.",
      accent: "blue"
    },
    {
      step: "07",
      title: "Delivery & Launch",
      desc: "Upon final approval and remaining payment, your website is deployed live on Vercel with clean code handover and domain setup support.",
      accent: "green"
    }
  ],

  // Serverless Backend Configuration
  BACKEND: {
    endpoint: "/api/submit-project",
    recipientEmail: "builtbyatharva27@gmail.com"
  }
};

if (typeof window !== 'undefined') {
  window.APP_CONFIG = CONFIG;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
