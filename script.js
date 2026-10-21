/**
 * BuiltByAtharva — V6 Creative Software Studio Engine
 * Founder: Atharva Mirzapure | Brand: BuiltByAtharva | Tagline: IDEAS. BUILT.
 * Stack: HTML5 + CSS3 + Vanilla JS + Three.js + GSAP + ScrollTrigger + Lenis
 * Verified WhatsApp: +91 8626074035 (918626074035)
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.APP_CONFIG || {};
  const brand = config.BRAND || {
    name: "BuiltByAtharva",
    email: "builtbyatharva27@gmail.com",
    whatsappNumber: "918626074035",
    whatsappDisplay: "+91 86260 74035"
  };

  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Initialize Light / Dark Theme Manager
  let currentTheme = initTheme();

  // 3. Initialize Smooth Scrolling (Lenis)
  let lenis = null;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.Lenis && !isReducedMotion) {
    try {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.4,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {
      console.warn("Lenis init skipped, using native smooth scroll.", e);
    }
  }

  // 4. Scroll Progress Bar
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });

  // 5. Initialize Three.js 3D Futuristic Centerpiece
  const threeScene = initThreeJSHero();

  // 6. Initialize GSAP & ScrollTrigger Animations
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0, 0);
    }

    initGSAPAnimations();
  }

  // 7. Initialize Studio Components
  initCustomCursor();
  initNavigation();
  initTerminalWorkstation();
  initKineticTypography();
  initCompactServices();
  initCompactCapabilities();
  initPricingAndEstimator();
  initRealPortfolioStudio();
  initFormWizard();
  initPrintBrief();
  initWhatsAppLinks();

  /* ==========================================================================
     1. THEME MANAGER (LIGHT / DARK DUAL THEME WITH LOCALSTORAGE)
     ========================================================================== */
  function initTheme() {
    const savedTheme = localStorage.getItem('bba-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', theme);

    // Toggle button listeners
    const toggleBtns = [
      document.getElementById('theme-toggle-btn'),
      document.getElementById('mobile-theme-toggle-btn')
    ];

    toggleBtns.forEach(btn => {
      btn?.addEventListener('click', () => {
        theme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('bba-theme', theme);
        
        // Notify Three.js scene of theme change
        if (threeScene && typeof threeScene.updateTheme === 'function') {
          threeScene.updateTheme(theme);
        }

        if (window.lucide) window.lucide.createIcons();
      });
    });

    // Listen to system changes if no manual preference saved
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('bba-theme')) {
        theme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        if (threeScene && typeof threeScene.updateTheme === 'function') {
          threeScene.updateTheme(theme);
        }
      }
    });

    return theme;
  }

  /* ==========================================================================
     2. THREE.JS FUTURISTIC CYBER-CORE CENTERPIECE
     ========================================================================== */
  function initThreeJSHero() {
    const canvas = document.getElementById('hero-3d-canvas');
    const fallbackGraphic = document.getElementById('hero-fallback-graphic');

    if (!canvas) return null;

    const isWebGLAvailable = () => {
      try {
        const testCanvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    };

    if (isReducedMotion || !window.THREE || !isWebGLAvailable() || window.innerWidth <= 768) {
      if (fallbackGraphic) fallbackGraphic.style.display = 'block';
      canvas.style.display = 'none';
      return null;
    }

    let scene, camera, renderer, coreGroup, animFrameId;
    let isVisible = true;
    let targetX = 0, targetY = 0;
    let coreMesh, wireframeMesh, ringOuter, ringInner, particles;
    let dirLightBlue, dirLightOrange, ambientLight;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.z = 6.2;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // Dual ambient & directional lighting
      ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      dirLightBlue = new THREE.DirectionalLight(0x3b82f6, 1.8);
      dirLightBlue.position.set(5, 5, 5);
      scene.add(dirLightBlue);

      dirLightOrange = new THREE.DirectionalLight(0xff7843, 1.5);
      dirLightOrange.position.set(-5, -4, 4);
      scene.add(dirLightOrange);

      coreGroup = new THREE.Group();

      // 1. Inner Faceted Icosahedron (Cyber Core)
      const coreGeo = new THREE.IcosahedronGeometry(1.2, 0);
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      
      const coreMat = new THREE.MeshPhongMaterial({
        color: isDark ? 0x1d4ed8 : 0x2563eb,
        emissive: isDark ? 0x0f172a : 0x1e3a8a,
        shininess: 120,
        transparent: true,
        opacity: 0.88,
        flatShading: true
      });
      coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreGroup.add(coreMesh);

      // 2. Outer Wireframe Cage
      const wireframeGeo = new THREE.IcosahedronGeometry(1.35, 1);
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: isDark ? 0x22d3ee : 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.45 : 0.25
      });
      wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
      coreGroup.add(wireframeMesh);

      // 3. Concentric Orbital Ring 1 (Electric Blue)
      const ringOuterGeo = new THREE.TorusGeometry(1.9, 0.035, 16, 80);
      const ringOuterMat = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.7
      });
      ringOuter = new THREE.Mesh(ringOuterGeo, ringOuterMat);
      ringOuter.rotation.x = Math.PI / 3;
      coreGroup.add(ringOuter);

      // 4. Concentric Orbital Ring 2 (Orange Accent)
      const ringInnerGeo = new THREE.TorusGeometry(2.2, 0.025, 16, 80);
      const ringInnerMat = new THREE.MeshBasicMaterial({
        color: 0xff7843,
        transparent: true,
        opacity: 0.6
      });
      ringInner = new THREE.Mesh(ringInnerGeo, ringInnerMat);
      ringInner.rotation.y = Math.PI / 4;
      coreGroup.add(ringInner);

      // 5. Floating Ambient Particles
      const particleCount = 45;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 7;
        positions[i + 1] = (Math.random() - 0.5) * 7;
        positions[i + 2] = (Math.random() - 0.5) * 5;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.055,
        color: isDark ? 0x38bdf8 : 0x2563eb,
        transparent: true,
        opacity: 0.75
      });
      particles = new THREE.Points(particleGeo, particleMat);
      coreGroup.add(particles);

      scene.add(coreGroup);

      // Pointer-Responsive Parallax
      const handleMouseMove = (e) => {
        const halfX = window.innerWidth / 2;
        const halfY = window.innerHeight / 2;
        targetX = (e.clientX - halfX) * 0.0005;
        targetY = (e.clientY - halfY) * 0.0005;
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      // Pause rendering when hero is offscreen
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });

      const heroEl = document.getElementById('hero');
      if (heroEl) heroObserver.observe(heroEl);

      // Animation Render Loop
      function animate() {
        animFrameId = requestAnimationFrame(animate);
        if (!isVisible) return;

        coreMesh.rotation.x += 0.004;
        coreMesh.rotation.y += 0.006;
        wireframeMesh.rotation.x -= 0.002;
        wireframeMesh.rotation.y -= 0.003;
        ringOuter.rotation.z += 0.008;
        ringInner.rotation.x += 0.006;
        particles.rotation.y += 0.001;

        // Smooth Parallax Damping
        coreGroup.rotation.y += (targetX - coreGroup.rotation.y) * 0.05;
        coreGroup.rotation.x += (targetY - coreGroup.rotation.x) * 0.05;

        renderer.render(scene, camera);
      }
      animate();

      // Responsive Resize
      window.addEventListener('resize', () => {
        if (!canvas) return;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      }, { passive: true });

      // Return updateTheme hook
      return {
        updateTheme: (newTheme) => {
          const dark = newTheme === 'dark';
          coreMesh.material.color.setHex(dark ? 0x1d4ed8 : 0x2563eb);
          coreMesh.material.emissive.setHex(dark ? 0x0f172a : 0x1e3a8a);
          wireframeMesh.material.color.setHex(dark ? 0x22d3ee : 0x06b6d4);
          particleMat.color.setHex(dark ? 0x38bdf8 : 0x2563eb);
          ambientLight.intensity = dark ? 0.75 : 0.95;
          dirLightBlue.intensity = dark ? 2.0 : 1.4;
          dirLightOrange.intensity = dark ? 1.6 : 1.2;
        }
      };

    } catch (err) {
      console.warn("WebGL initialization issue, displaying clean fallback:", err);
      if (fallbackGraphic) fallbackGraphic.style.display = 'block';
      canvas.style.display = 'none';
      if (animFrameId) cancelAnimationFrame(animFrameId);
      return null;
    }
  }

  /* ==========================================================================
     3. DEVELOPER TERMINAL WORKSTATION TABS
     ========================================================================== */
  function initTerminalWorkstation() {
    const tabs = document.querySelectorAll('.term-tab');
    const codeBody = document.getElementById('terminal-code-body');
    if (!codeBody || !tabs.length) return;

    const snippets = {
      'studio.ts': `<span class="code-comment">// BuiltByAtharva Studio Engine v6.0</span>
<span class="code-keyword">export const</span> <span class="code-prop">studio</span> = {
  <span class="code-prop">founder</span>: <span class="code-string">"Atharva Mirzapure"</span>,
  <span class="code-prop">role</span>: <span class="code-string">"Software Developer & Creator"</span>,
  <span class="code-prop">tagline</span>: <span class="code-string">"IDEAS. BUILT."</span>,
  <span class="code-prop">speciality</span>: [<span class="code-string">"Web Apps"</span>, <span class="code-string">"Three.js 3D"</span>, <span class="code-string">"AI Prototypes"</span>],
  <span class="code-prop">delivery</span>: <span class="code-function">async</span> () =&gt; {
    <span class="code-keyword">return</span> <span class="code-string">"High-craft engineering ready for launch."</span>;
  }
};`,
      'services.json': `{
  <span class="code-prop">"services"</span>: [
    <span class="code-string">"Website Development"</span>,
    <span class="code-string">"Web Applications"</span>,
    <span class="code-string">"AI & ML Solutions"</span>,
    <span class="code-string">"Special / Personal Sites"</span>
  ],
  <span class="code-prop">"communication"</span>: <span class="code-string">"Direct with Atharva"</span>,
  <span class="code-prop">"paymentTerms"</span>: <span class="code-string">"50% Advance Upon Agreed Scope"</span>
}`,
      'stack.config.js': `<span class="code-keyword">export default</span> {
  <span class="code-prop">frontend</span>: [<span class="code-string">"HTML5"</span>, <span class="code-string">"Modern CSS"</span>, <span class="code-string">"Vanilla JS"</span>],
  <span class="code-prop">visuals</span>: [<span class="code-string">"Three.js WebGL"</span>, <span class="code-string">"GSAP & ScrollTrigger"</span>],
  <span class="code-prop">backend</span>: [<span class="code-string">"Vercel Serverless"</span>, <span class="code-string">"Resend Email API"</span>],
  <span class="code-prop">deployment</span>: <span class="code-string">"Global Edge Network"</span>
};`
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const file = tab.getAttribute('data-file');
        if (snippets[file]) {
          codeBody.innerHTML = snippets[file];
        }
      });
    });
  }

  /* ==========================================================================
     4. KINETIC TYPOGRAPHY LOOP
     ========================================================================== */
  function initKineticTypography() {
    const phraseEl = document.getElementById('kinetic-phrase');
    if (!phraseEl) return;

    const phrases = [
      "// DESIGN. DEVELOP. DEPLOY.",
      "// ZERO MIDDLEMEN • HANDCRAFTED CODE",
      "// MODERN WEB • THREE.JS 3D • AI",
      "// IDEAS. BUILT."
    ];
    let idx = 0;

    setInterval(() => {
      idx = (idx + 1) % phrases.length;
      if (window.gsap && !isReducedMotion) {
        gsap.to(phraseEl, {
          opacity: 0,
          y: -4,
          duration: 0.25,
          onComplete: () => {
            phraseEl.textContent = phrases[idx];
            gsap.to(phraseEl, { opacity: 1, y: 0, duration: 0.35 });
          }
        });
      } else {
        phraseEl.textContent = phrases[idx];
      }
    }, 3800);
  }

  /* ==========================================================================
     5. COMPACT SERVICES CARDS & DETAIL MODAL
     ========================================================================== */
  function initCompactServices() {
    const serviceCards = document.querySelectorAll('.service-card-compact');
    const modal = document.getElementById('service-detail-modal');
    const closeBtn = document.getElementById('service-modal-close-corner');
    const startProjectBtn = document.getElementById('btn-start-service-project');

    const modalTitle = document.getElementById('modal-service-title');
    const modalCategory = document.getElementById('modal-service-category');
    const modalDesc = document.getElementById('modal-service-desc');
    const modalPrice = document.getElementById('modal-service-price');
    const modalDelivery = document.getElementById('modal-service-delivery');
    const modalFeatures = document.getElementById('modal-service-features');
    const modalTypes = document.getElementById('modal-service-types');
    const modalTech = document.getElementById('modal-service-tech');
    const modalLimitations = document.getElementById('modal-service-limitations');
    const modalIconWrap = document.getElementById('modal-service-icon');

    let currentSelectedService = null;

    serviceCards.forEach(card => {
      card.addEventListener('click', () => {
        const serviceId = card.getAttribute('data-service-id');
        const catalog = config.SERVICES_CATALOG || [];
        const serviceData = catalog.find(s => s.id === serviceId);

        if (!serviceData) return;
        currentSelectedService = serviceData;

        // Populate Modal Fields
        if (modalTitle) modalTitle.textContent = serviceData.title;
        if (modalCategory) modalCategory.textContent = serviceData.categoryBadge;
        if (modalDesc) modalDesc.textContent = serviceData.fullDesc;
        if (modalPrice) modalPrice.textContent = serviceData.priceRange;
        if (modalDelivery) modalDelivery.textContent = serviceData.deliveryRange;

        if (modalIconWrap) {
          modalIconWrap.innerHTML = `<i data-lucide="${serviceData.icon}"></i>`;
        }

        // Features Checklist
        if (modalFeatures) {
          modalFeatures.innerHTML = serviceData.features.map(f => `
            <li><i data-lucide="check"></i> <span>${escapeHtml(f)}</span></li>
          `).join('');
        }

        // Project Types
        if (modalTypes) {
          modalTypes.innerHTML = serviceData.projectTypes.map(t => `
            <span class="capability-tag-pill">${escapeHtml(t)}</span>
          `).join('');
        }

        // Technologies
        if (modalTech) {
          modalTech.innerHTML = serviceData.technologies.map(t => `
            <span class="tech-pill">${escapeHtml(t)}</span>
          `).join('');
        }

        // Limitations
        if (modalLimitations) {
          modalLimitations.innerHTML = `<strong>Scope Notice:</strong> ${serviceData.limitations.join(' ')}`;
        }

        if (window.lucide) window.lucide.createIcons();

        // Open Modal
        openModal(modal);
      });
    });

    closeBtn?.addEventListener('click', () => closeModal(modal));

    // "Start This Project" from service modal
    startProjectBtn?.addEventListener('click', () => {
      if (currentSelectedService) {
        // Carry into form
        preselectServiceInForm(currentSelectedService.formCategory, currentSelectedService.defaultTier);
      }
      closeModal(modal);
      // Smooth scroll to form
      const formSection = document.getElementById('start-project');
      formSection?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     6. COMPACT CAPABILITY CARDS & MODAL
     ========================================================================== */
  function initCompactCapabilities() {
    const capCards = document.querySelectorAll('.capability-system-card');
    const modal = document.getElementById('capability-detail-modal');
    const closeBtn = document.getElementById('cap-modal-close-corner');
    const startCapBtn = document.getElementById('btn-start-cap-project');

    const modalTitle = document.getElementById('modal-cap-title');
    const modalSubtitle = document.getElementById('modal-cap-subtitle');
    const modalDesc = document.getElementById('modal-cap-desc');
    const modalTags = document.getElementById('modal-cap-tags');
    const modalTech = document.getElementById('modal-cap-tech');
    const modalIcon = document.getElementById('modal-cap-icon');

    let currentSelectedCap = null;

    capCards.forEach(card => {
      card.addEventListener('click', () => {
        const capId = card.getAttribute('data-cap-id');
        const catalog = config.CAPABILITIES_CATALOG || [];
        const capData = catalog.find(c => c.id === capId);

        if (!capData) return;
        currentSelectedCap = capData;

        if (modalTitle) modalTitle.textContent = capData.title;
        if (modalSubtitle) modalSubtitle.textContent = capData.subtitle;
        if (modalDesc) modalDesc.textContent = capData.shortDesc;

        if (modalIcon) {
          modalIcon.innerHTML = `<i data-lucide="${capData.icon}"></i>`;
        }

        if (modalTags) {
          modalTags.innerHTML = capData.tags.map(t => `
            <span class="capability-tag-pill">${escapeHtml(t)}</span>
          `).join('');
        }

        if (modalTech) {
          modalTech.innerHTML = capData.techStack.map(t => `
            <span class="tech-pill">${escapeHtml(t)}</span>
          `).join('');
        }

        if (window.lucide) window.lucide.createIcons();
        openModal(modal);
      });
    });

    closeBtn?.addEventListener('click', () => closeModal(modal));

    startCapBtn?.addEventListener('click', () => {
      if (currentSelectedCap) {
        preselectServiceInForm(currentSelectedCap.formCategory, 'standard');
      }
      closeModal(modal);
      const formSection = document.getElementById('start-project');
      formSection?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     7. PRICING SELECTION & SMART CONFIGURATOR
     ========================================================================== */
  function initPricingAndEstimator() {
    // Select buttons in the dedicated pricing section
    const pricingSelectBtns = document.querySelectorAll('.select-pricing-btn');
    pricingSelectBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = btn.getAttribute('data-type');
        const tier = btn.getAttribute('data-tier');
        const price = btn.getAttribute('data-price');
        preselectServiceInForm(type, tier, price);
      });
    });

    // Configurator state
    let activeCategory = "Website Development";
    let activeTier = "standard";
    let basePrice = 5999;
    let addOnsPrice = 0;

    const catBtns = document.querySelectorAll('.config-cat-btn');
    const tierCards = document.querySelectorAll('.config-tier-card');
    const addonCheckboxes = document.querySelectorAll('.addon-card input[type="checkbox"]');
    const totalDisplay = document.getElementById('config-total-display');
    const categoryDisplay = document.getElementById('summary-category-display');
    const advanceDisplay = document.getElementById('summary-advance-display');
    const applyBtn = document.getElementById('config-apply-btn');

    // Category Buttons
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-category');
        recalcEstimate();
      });
    });

    // Tier Cards
    tierCards.forEach(card => {
      card.addEventListener('click', () => {
        tierCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        activeTier = card.getAttribute('data-tier');
        basePrice = parseInt(card.getAttribute('data-price') || '5999', 10);
        recalcEstimate();
      });
    });

    // Add-on checkboxes
    addonCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        let sum = 0;
        addonCheckboxes.forEach(item => {
          if (item.checked) {
            const parent = item.closest('.addon-card');
            sum += parseInt(parent?.getAttribute('data-price') || '0', 10);
          }
        });
        addOnsPrice = sum;
        recalcEstimate();
      });
    });

    function recalcEstimate() {
      const total = basePrice + addOnsPrice;
      const advance = Math.round(total * 0.5);

      if (totalDisplay) totalDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
      if (advanceDisplay) advanceDisplay.textContent = `₹${advance.toLocaleString('en-IN')}`;

      const tierTitle = activeTier.charAt(0).toUpperCase() + activeTier.slice(1);
      if (categoryDisplay) {
        categoryDisplay.textContent = `${activeCategory} — ${tierTitle} Scope`;
      }
    }

    // Apply button
    applyBtn?.addEventListener('click', () => {
      const total = basePrice + addOnsPrice;
      const tierTitle = activeTier.charAt(0).toUpperCase() + activeTier.slice(1);
      preselectServiceInForm(activeCategory, tierTitle, `₹${total.toLocaleString('en-IN')}`);
      const formEl = document.getElementById('start-project');
      formEl?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function preselectServiceInForm(category, tier, customPrice) {
    const typeInput = document.getElementById('form-project-type');
    const tierInput = document.getElementById('form-selected-tier');
    const costInput = document.getElementById('form-estimated-cost');

    if (typeInput) typeInput.value = category || "Website Development";
    if (tierInput) tierInput.value = tier || "Standard";
    if (costInput && customPrice) costInput.value = customPrice;

    // Highlight category in form wizard step 2
    const formCatCards = document.querySelectorAll('.type-select-card');
    formCatCards.forEach(c => {
      if (c.getAttribute('data-type') === category) {
        c.classList.add('selected');
      } else {
        c.classList.remove('selected');
      }
    });
  }

  /* ==========================================================================
     8. AUTHENTIC REAL PORTFOLIO & STUDIO LIGHTBOX / PREVIEW
     ========================================================================== */
  function initRealPortfolioStudio() {
    // 1. Portfolio Category Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.portfolio-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // 2. Project Studio Modal
    const modal = document.getElementById('project-studio-modal');
    const closeBtn = document.getElementById('project-modal-close-corner');
    const modalBtns = document.querySelectorAll('.portfolio-modal-btn');

    const tabCaseStudy = document.getElementById('tab-btn-casestudy');
    const tabPreview = document.getElementById('tab-btn-preview');
    const contentCaseStudy = document.getElementById('project-casestudy-tab');
    const contentPreview = document.getElementById('project-preview-tab');

    const modalTitle = document.getElementById('modal-project-title');
    const modalSubtitle = document.getElementById('modal-project-subtitle');
    const modalCat = document.getElementById('modal-project-cat');
    const modalStatus = document.getElementById('modal-project-status');
    const modalImg = document.getElementById('modal-project-img');
    const modalDesc = document.getElementById('modal-project-desc');
    const modalProblem = document.getElementById('modal-project-problem');
    const modalBuilt = document.getElementById('modal-project-built');
    const modalFeatures = document.getElementById('modal-project-features');
    const modalDisclaimer = document.getElementById('modal-project-disclaimer');
    const modalTech = document.getElementById('modal-project-tech');
    const modalExtLink = document.getElementById('modal-project-ext-link');
    const switchToPreviewBtn = document.getElementById('btn-switch-to-preview');

    const previewViewport = document.getElementById('preview-dynamic-viewport');
    const previewStageUrl = document.getElementById('preview-stage-url');
    const previewNotice = document.getElementById('preview-status-notice');
    const previewStageContainer = document.getElementById('preview-stage-container');
    const deviceBtns = document.querySelectorAll('.preview-device-btn');

    let currentProject = null;

    modalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = btn.getAttribute('data-project');
        const startMode = btn.getAttribute('data-mode') || 'casestudy';
        const catalog = config.REAL_PROJECTS || [];
        const projectData = catalog.find(p => p.id === projectId);

        if (!projectData) return;
        currentProject = projectData;

        // Populate Case Study View
        if (modalTitle) modalTitle.textContent = projectData.title;
        if (modalSubtitle) modalSubtitle.textContent = projectData.subtitle;
        if (modalCat) modalCat.textContent = projectData.categoryLabel;
        if (modalStatus) modalStatus.textContent = projectData.status;
        if (modalImg) modalImg.src = projectData.image;
        if (modalDesc) modalDesc.textContent = projectData.shortDesc;
        if (modalProblem) modalProblem.textContent = projectData.caseStudy?.problem || "High-value digital solution.";
        if (modalBuilt) modalBuilt.textContent = projectData.contribution || "Architected and implemented full frontend.";

        if (modalFeatures) {
          modalFeatures.innerHTML = (projectData.keyFeatures || []).map(f => `
            <li><i data-lucide="check"></i> <span>${escapeHtml(f)}</span></li>
          `).join('');
        }

        if (modalDisclaimer) {
          modalDisclaimer.innerHTML = `ℹ️ <strong>Positioning Notice:</strong> ${projectData.caseStudy?.disclaimer || 'Research prototype evaluation.'}`;
        }

        if (modalTech) {
          modalTech.innerHTML = (projectData.tech || []).map(t => `
            <span class="tech-pill">${escapeHtml(t)}</span>
          `).join('');
        }

        // External Link Button (only if real URL exists)
        if (modalExtLink) {
          if (projectData.liveUrl && projectData.liveUrl.trim() !== '') {
            modalExtLink.href = projectData.liveUrl;
            modalExtLink.style.display = 'inline-flex';
          } else {
            modalExtLink.style.display = 'none';
          }
        }

        // Switch to appropriate tab
        if (startMode === 'preview') {
          showTab('preview');
        } else {
          showTab('casestudy');
        }

        if (window.lucide) window.lucide.createIcons();
        openModal(modal);
      });
    });

    closeBtn?.addEventListener('click', () => closeModal(modal));

    // Tab Navigation
    tabCaseStudy?.addEventListener('click', () => showTab('casestudy'));
    tabPreview?.addEventListener('click', () => showTab('preview'));
    switchToPreviewBtn?.addEventListener('click', () => showTab('preview'));

    function showTab(tabName) {
      if (tabName === 'preview') {
        tabPreview?.classList.add('active');
        tabCaseStudy?.classList.remove('active');
        if (contentPreview) contentPreview.style.display = 'block';
        if (contentCaseStudy) contentCaseStudy.style.display = 'none';
        renderPreviewContent(currentProject);
      } else {
        tabCaseStudy?.classList.add('active');
        tabPreview?.classList.remove('active');
        if (contentCaseStudy) contentCaseStudy.style.display = 'block';
        if (contentPreview) contentPreview.style.display = 'none';
      }
      if (window.lucide) window.lucide.createIcons();
    }

    // Responsive Device Frame Switcher
    deviceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        deviceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const device = btn.getAttribute('data-device');
        if (previewStageContainer) {
          previewStageContainer.className = `preview-iframe-container ${device}`;
        }
      });
    });

    // Render Preview Logic: Embedded Simulator OR External Iframe OR Blocked Fallback
    function renderPreviewContent(project) {
      if (!previewViewport || !project) return;

      if (previewStageUrl) {
        previewStageUrl.textContent = `${project.id}.builtbyatharva.studio`;
      }

      // Check if project has an embedded interactive simulator
      if (project.hasSimulator && project.simulatorType) {
        if (project.simulatorType === 'opd-queue') {
          renderOpdSimulator(previewViewport);
          if (previewNotice) {
            previewNotice.innerHTML = '⚡ <strong>Live Embedded Simulation:</strong> Generating patient consultation tokens and computing dynamic waiting room wait-time client-side.';
          }
          return;
        }

        if (project.simulatorType === 'truth-scanner') {
          renderTruthScanner(previewViewport);
          if (previewNotice) {
            previewNotice.innerHTML = '⚡ <strong>Live Embedded Simulation:</strong> Natural language statement credibility scanner using heuristic linguistic analysis.';
          }
          return;
        }

        if (project.simulatorType === 'dosha-quiz') {
          renderDoshaQuiz(previewViewport);
          if (previewNotice) {
            previewNotice.innerHTML = '⚡ <strong>Live Embedded Simulation:</strong> 3-stage Ayurvedic Dosha constitution assessment calculating dominant metabolic profile.';
          }
          return;
        }
      }

      // If liveUrl exists and permits embedding
      if (project.liveUrl && project.liveUrl.trim() !== '') {
        previewViewport.innerHTML = `
          <div style="position:relative; width:100%; height:380px;">
            <div id="iframe-loader" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:var(--text-muted); font-size:0.9rem;">
              <i data-lucide="loader-2" class="spin"></i> Loading live project preview...
            </div>
            <iframe src="${project.liveUrl}" sandbox="allow-scripts allow-same-origin allow-forms" style="width:100%; height:100%; border:none;" onload="document.getElementById('iframe-loader').style.display='none';"></iframe>
          </div>
        `;
        if (previewNotice) {
          previewNotice.innerHTML = `ℹ️ <strong>Live Preview:</strong> Embedded from ${project.liveUrl}. Note: If your browser blocks embedding, click 'Open Live External Website'.`;
        }
      } else {
        // Honest fallback: Real screenshots walkthrough + note that live URL is pending configuration
        previewViewport.innerHTML = `
          <div style="text-align:center; padding:30px 16px;">
            <div style="max-width:480px; margin:0 auto;">
              <img src="${project.image}" alt="${project.title} Preview" style="width:100%; border-radius:8px; border:1px solid var(--border-medium); margin-bottom:16px;">
              <h4 style="margin-bottom:8px;">${project.title} Interface Walkthrough</h4>
              <p style="font-size:0.875rem; color:var(--text-muted); margin-bottom:14px;">
                Verified high-resolution application screenshot. Live external deployment URL is currently unconfigured by owner.
              </p>
              <div style="display:inline-flex; gap:8px;">
                <span class="tech-pill"><i data-lucide="check"></i> Verified Screenshot</span>
                <span class="tech-pill"><i data-lucide="cpu"></i> ${project.categoryLabel}</span>
              </div>
            </div>
          </div>
        `;
        if (previewNotice) {
          previewNotice.innerHTML = 'ℹ️ <strong>Notice:</strong> Live external URL unconfigured. Interface preview and technical architecture documented in case study.';
        }
      }

      if (window.lucide) window.lucide.createIcons();
    }
  }

  // --- Embedded Interactive Simulators ---
  function renderOpdSimulator(container) {
    let currentToken = 104;
    let waiting = 3;

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="background:var(--bg-code); border:1px solid var(--border-medium); border-radius:8px; padding:20px; color:#ffffff;">
          <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:0.75rem; color:#94a3b8; font-family:var(--font-mono);">
            <span>CLINIC STATUS: <strong style="color:#34d399;">ONLINE</strong></span>
            <span>OPD ROOM 3</span>
          </div>
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <div>
              <span style="font-size:0.75rem; color:#94a3b8; text-transform:uppercase;">Now Calling</span>
              <div id="sim-opd-token" style="font-size:3rem; font-family:var(--font-heading); font-weight:900; color:#34d399; line-height:1;">A-104</div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.75rem; color:#94a3b8; display:block;">Waiting</span>
              <strong id="sim-opd-waiting" style="font-size:1.5rem; color:#ffffff;">3 Patients</strong>
              <div id="sim-opd-time" style="font-size:0.8rem; color:#60a5fa;">Est: ~15 mins</div>
            </div>
          </div>
        </div>

        <div style="display:flex; gap:10px;">
          <button type="button" class="btn btn-primary btn-sm btn-full" id="sim-btn-new-token">
            <i data-lucide="plus-circle"></i> Dispense New Token
          </button>
          <button type="button" class="btn btn-secondary btn-sm btn-full" id="sim-btn-call-next">
            <i data-lucide="bell"></i> Call Next Patient
          </button>
        </div>
      </div>
    `;

    const tokenEl = document.getElementById('sim-opd-token');
    const waitEl = document.getElementById('sim-opd-waiting');
    const timeEl = document.getElementById('sim-opd-time');

    document.getElementById('sim-btn-new-token')?.addEventListener('click', () => {
      waiting++;
      if (waitEl) waitEl.textContent = `${waiting} Patients`;
      if (timeEl) timeEl.textContent = `Est: ~${waiting * 5} mins`;
    });

    document.getElementById('sim-btn-call-next')?.addEventListener('click', () => {
      if (waiting > 0) {
        currentToken++;
        waiting--;
        if (tokenEl) tokenEl.textContent = `A-${currentToken}`;
        if (waitEl) waitEl.textContent = `${waiting} Patients`;
        if (timeEl) timeEl.textContent = `Est: ~${waiting * 5} mins`;
      }
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function renderTruthScanner(container) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <label style="font-size:0.85rem; font-weight:700;">Enter News Headline or Statement to Test:</label>
        <div style="display:flex; gap:8px;">
          <input type="text" id="sim-truth-input" class="form-input" style="flex-grow:1; font-size:0.85rem;" value="Government announces ₹10,000 free bonus for all citizens">
          <button type="button" class="btn btn-primary btn-sm" id="sim-truth-btn">Analyze</button>
        </div>

        <div id="sim-truth-output" style="background:var(--bg-alt); border:1px solid var(--border-medium); border-radius:8px; padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Diagnostic Result</span>
              <h4 id="sim-truth-verdict" style="color:var(--accent-red); margin-top:2px;">High Risk / Phishing Pattern</h4>
              <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px;">Unverified financial link pattern detected.</p>
            </div>
            <div style="text-align:center; padding:10px 14px; background:var(--bg-card); border-radius:8px; border:1px solid var(--border-light);">
              <span style="font-size:1.4rem; font-weight:900; color:var(--accent-red); display:block;" id="sim-truth-score">18%</span>
              <span style="font-size:0.65rem; color:var(--text-muted);">Credibility</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const input = document.getElementById('sim-truth-input');
    const btn = document.getElementById('sim-truth-btn');
    const verdict = document.getElementById('sim-truth-verdict');
    const score = document.getElementById('sim-truth-score');

    btn?.addEventListener('click', () => {
      const val = (input?.value || '').toLowerCase();
      if (val.includes('free') || val.includes('bonus') || val.includes('cure')) {
        if (verdict) { verdict.textContent = "High Risk / Likely Misinformation"; verdict.style.color = "var(--accent-red)"; }
        if (score) { score.textContent = "22%"; score.style.color = "var(--accent-red)"; }
      } else {
        if (verdict) { verdict.textContent = "Verified Source Indicators"; verdict.style.color = "var(--accent-green)"; }
        if (score) { score.textContent = "91%"; score.style.color = "var(--accent-green)"; }
      }
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function renderDoshaQuiz(container) {
    let score = { vata: 0, pitta: 0, kapha: 0 };
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:14px; text-align:left;">
        <h4 style="font-size:1rem; color:var(--accent-blue);">AyurSanjeevani — 3-Question Dosha Assessment</h4>
        <div id="sim-quiz-q" style="font-size:0.9rem; font-weight:700;">Question 1: What describes your natural frame and energy?</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <button type="button" class="btn btn-secondary btn-sm sim-quiz-opt" data-type="vata" style="justify-content:flex-start;">Light & Slender (Quick, feels cold easily)</button>
          <button type="button" class="btn btn-secondary btn-sm sim-quiz-opt" data-type="pitta" style="justify-content:flex-start;">Medium & Athletic (Warm, focused, intense)</button>
          <button type="button" class="btn btn-secondary btn-sm sim-quiz-opt" data-type="kapha" style="justify-content:flex-start;">Solid & Steady (Calm stamina, slow digestion)</button>
        </div>
        <div id="sim-quiz-res" style="display:none; padding:14px; background:var(--bg-alt); border-radius:8px; border:1px solid var(--border-medium); text-align:center;">
          <strong style="color:var(--accent-green); display:block; margin-bottom:4px;">Dominant Profile Calculated!</strong>
          <span style="font-size:0.85rem; color:var(--text-secondary);">Your constitution leans toward <strong id="sim-dominant-type">Pitta</strong>.</span>
        </div>
      </div>
    `;

    const qEl = document.getElementById('sim-quiz-q');
    const resEl = document.getElementById('sim-quiz-res');
    const dominantEl = document.getElementById('sim-dominant-type');
    const opts = container.querySelectorAll('.sim-quiz-opt');

    let qIdx = 1;
    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        score[type]++;
        qIdx++;
        if (qIdx === 2) {
          if (qEl) qEl.textContent = "Question 2: How do you typically react under stressful situations?";
        } else if (qIdx === 3) {
          if (qEl) qEl.textContent = "Question 3: How is your natural sleep pattern?";
        } else {
          // Show Result
          opts.forEach(b => b.style.display = 'none');
          if (qEl) qEl.style.display = 'none';
          if (resEl) resEl.style.display = 'block';
          const dominant = Object.keys(score).reduce((a, b) => score[a] > score[b] ? a : b);
          if (dominantEl) dominantEl.textContent = dominant.toUpperCase() + " Constitution";
        }
      });
    });
  }

  /* ==========================================================================
     9. PROJECT REQUEST FORM WIZARD & SERVERLESS BACKEND
     ========================================================================== */
  function initFormWizard() {
    let currentStep = 1;
    const totalSteps = 4;

    const wizardPanels = document.querySelectorAll('.wizard-panel');
    const wizardStepItems = document.querySelectorAll('.wizard-step-item');
    const btnNext = document.getElementById('btn-next-step');
    const btnPrev = document.getElementById('btn-prev-step');
    const btnSubmit = document.getElementById('btn-submit-project');
    const form = document.getElementById('project-request-form');
    const summaryBox = document.getElementById('review-summary-box');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Category Selector in Step 2
    const categoryCards = document.querySelectorAll('.type-select-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        categoryCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const type = card.getAttribute('data-type');
        const hiddenTypeInput = document.getElementById('form-project-type');
        if (hiddenTypeInput) hiddenTypeInput.value = type;
      });
    });

    // Step Navigation Handlers
    btnNext?.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
          currentStep++;
          updateWizardUI();
          if (currentStep === 4) {
            populateReviewSummary();
          }
        }
      }
    });

    btnPrev?.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateWizardUI();
      }
    });

    function updateWizardUI() {
      wizardPanels.forEach(p => {
        const stepNum = parseInt(p.getAttribute('data-step') || '1', 10);
        if (stepNum === currentStep) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

      wizardStepItems.forEach(item => {
        const stepNum = parseInt(item.getAttribute('data-step') || '1', 10);
        if (stepNum <= currentStep) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      if (btnPrev) btnPrev.style.display = currentStep > 1 ? 'inline-flex' : 'none';
      if (btnNext) btnNext.style.display = currentStep < totalSteps ? 'inline-flex' : 'none';
      if (btnSubmit) btnSubmit.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';

      if (window.lucide) window.lucide.createIcons();
    }

    function validateStep(step) {
      clearErrors();
      let isValid = true;

      if (step === 1) {
        const name = (document.getElementById('form-client-name')?.value || '').trim();
        const phone = (document.getElementById('form-client-phone')?.value || '').trim();
        const email = (document.getElementById('form-client-email')?.value || '').trim();

        if (!name || name.length < 2) {
          showError('err-client-name', 'Please enter your full name (at least 2 characters).');
          isValid = false;
        }

        if (!phone || phone.length < 7) {
          showError('err-client-phone', 'Please enter a valid phone or WhatsApp number.');
          isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          showError('err-client-email', 'Please enter a valid email address.');
          isValid = false;
        }
      }

      if (step === 2) {
        const title = (document.getElementById('form-project-title')?.value || '').trim();
        const desc = (document.getElementById('form-project-desc')?.value || '').trim();

        if (!title || title.length < 3) {
          showError('err-project-title', 'Please provide a short project title or name.');
          isValid = false;
        }

        if (!desc || desc.length < 10) {
          showError('err-project-desc', 'Please briefly describe your project goals (at least 10 characters).');
          isValid = false;
        }
      }

      return isValid;
    }

    function showError(elementId, msg) {
      const errEl = document.getElementById(elementId);
      if (errEl) {
        errEl.textContent = msg;
        errEl.style.display = 'block';
      }
    }

    function clearErrors() {
      const errs = document.querySelectorAll('.field-error-msg');
      errs.forEach(e => {
        e.textContent = '';
        e.style.display = 'none';
      });
    }

    function populateReviewSummary() {
      if (!summaryBox) return;

      const data = {
        name: document.getElementById('form-client-name')?.value || '',
        phone: document.getElementById('form-client-phone')?.value || '',
        email: document.getElementById('form-client-email')?.value || '',
        company: document.getElementById('form-company')?.value || 'Personal / None',
        type: document.getElementById('form-project-type')?.value || 'Website Development',
        tier: document.getElementById('form-selected-tier')?.value || 'Standard',
        title: document.getElementById('form-project-title')?.value || '',
        desc: document.getElementById('form-project-desc')?.value || '',
        custom: document.getElementById('form-customisations')?.value || 'None specified',
        timeline: document.getElementById('form-timeline')?.value || 'Standard',
        budget: document.getElementById('form-budget')?.value || 'Standard'
      };

      summaryBox.innerHTML = `
        <div class="review-grid">
          <div class="review-item">
            <span class="review-item-label">Client Name</span>
            <span class="review-item-val">${escapeHtml(data.name)}</span>
          </div>
          <div class="review-item">
            <span class="review-item-label">Contact Email</span>
            <span class="review-item-val">${escapeHtml(data.email)}</span>
          </div>
          <div class="review-item">
            <span class="review-item-label">Phone / WhatsApp</span>
            <span class="review-item-val">${escapeHtml(data.phone)}</span>
          </div>
          <div class="review-item">
            <span class="review-item-label">Company / Brand</span>
            <span class="review-item-val">${escapeHtml(data.company)}</span>
          </div>
          <div class="review-item">
            <span class="review-item-label">Service & Base Tier</span>
            <span class="review-item-val" style="color:var(--accent-blue);">${escapeHtml(data.type)} (${escapeHtml(data.tier)})</span>
          </div>
          <div class="review-item">
            <span class="review-item-label">Budget Range</span>
            <span class="review-item-val" style="color:var(--accent-green);">${escapeHtml(data.budget)}</span>
          </div>
          <div class="review-item" style="grid-column: span 2;">
            <span class="review-item-label">Project Title & Scope</span>
            <span class="review-item-val" style="display:block; margin-bottom:4px;">${escapeHtml(data.title)}</span>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.5;">${escapeHtml(data.desc)}</p>
          </div>
        </div>
      `;
    }

    // Serverless Form Submission to /api/submit-project
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateStep(1) || !validateStep(2)) {
        currentStep = 1;
        updateWizardUI();
        return;
      }

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Dispatching Brief...`;
        if (window.lucide) window.lucide.createIcons();
      }

      const payload = {
        client_name: document.getElementById('form-client-name')?.value || '',
        contact_phone: document.getElementById('form-client-phone')?.value || '',
        client_email: document.getElementById('form-client-email')?.value || '',
        company_name: document.getElementById('form-company')?.value || '',
        project_type: document.getElementById('form-project-type')?.value || 'Website Development',
        selected_tier: document.getElementById('form-selected-tier')?.value || 'Standard',
        estimated_cost: document.getElementById('form-estimated-cost')?.value || '₹5,999',
        project_title: document.getElementById('form-project-title')?.value || '',
        project_description: document.getElementById('form-project-desc')?.value || '',
        existing_website: document.getElementById('form-existing-website')?.value || '',
        special_customisations: document.getElementById('form-customisations')?.value || '',
        reference_website: document.getElementById('form-reference-url')?.value || '',
        desired_timeline: document.getElementById('form-timeline')?.value || '',
        budget_expectation: document.getElementById('form-budget')?.value || '',
        website_hp: document.getElementById('form-website-hp')?.value || '' // Honeypot
      };

      try {
        const endpoint = window.APP_CONFIG?.BACKEND?.endpoint || '/api/submit-project';
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.success) {
          openModal(successModal);
          form.reset();
          currentStep = 1;
          updateWizardUI();
        } else if (result.isConfigError) {
          // Configuration notice when RESEND_API_KEY is not yet added in Netlify
          alert(`Configuration Notice: ${result.error}\n\nAtharva will configure RESEND_API_KEY in Netlify Site Configuration > Environment Variables. You can also connect directly via WhatsApp (+91 8626074035) or email (builtbyatharva27@gmail.com).`);
        } else if (result.validationErrors && result.validationErrors.length > 0) {
          alert(`Please check the following details:\n\n• ${result.validationErrors.join('\n• ')}`);
        } else {
          alert(`Submission Notice: ${result.error || 'Unable to submit at this time.'}\n\nPlease reach out directly to builtbyatharva27@gmail.com or WhatsApp +91 8626074035.`);
        }
      } catch (networkErr) {
        console.error("Submission Network Error:", networkErr);
        alert("Network error: Could not reach the serverless endpoint. Please connect with Atharva directly at builtbyatharva27@gmail.com or WhatsApp +91 8626074035.");
      } finally {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = `SUBMIT PROJECT REQUEST <i data-lucide="send"></i>`;
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });

    closeModalBtn?.addEventListener('click', () => closeModal(successModal));
  }

  /* ==========================================================================
     10. PRINT PROJECT BRIEF
     ========================================================================== */
  function initPrintBrief() {
    const printBtns = [
      document.getElementById('btn-print-brief'),
      document.getElementById('success-download-brief-btn')
    ];
    const printArea = document.getElementById('printable-brief-area');

    printBtns.forEach(btn => {
      btn?.addEventListener('click', () => {
        if (!printArea) return;

        const name = document.getElementById('form-client-name')?.value || 'Client';
        const phone = document.getElementById('form-client-phone')?.value || 'N/A';
        const email = document.getElementById('form-client-email')?.value || 'N/A';
        const company = document.getElementById('form-company')?.value || 'N/A';
        const type = document.getElementById('form-project-type')?.value || 'Website';
        const tier = document.getElementById('form-selected-tier')?.value || 'Standard';
        const title = document.getElementById('form-project-title')?.value || 'Project Brief';
        const desc = document.getElementById('form-project-desc')?.value || 'N/A';
        const budget = document.getElementById('form-budget')?.value || 'N/A';
        const timeline = document.getElementById('form-timeline')?.value || 'N/A';

        printArea.innerHTML = `
          <div class="print-header">
            <div class="print-brand">BuiltByAtharva • Project Brief</div>
            <p>Founder: Atharva Mirzapure | Email: builtbyatharva27@gmail.com | WhatsApp: +91 86260 74035</p>
          </div>
          <div class="print-grid">
            <div class="print-field"><label>Client Name</label><span>${escapeHtml(name)}</span></div>
            <div class="print-field"><label>Email Address</label><span>${escapeHtml(email)}</span></div>
            <div class="print-field"><label>Phone / WhatsApp</label><span>${escapeHtml(phone)}</span></div>
            <div class="print-field"><label>Company / Brand</label><span>${escapeHtml(company)}</span></div>
            <div class="print-field"><label>Service Category</label><span>${escapeHtml(type)}</span></div>
            <div class="print-field"><label>Package Tier</label><span>${escapeHtml(tier)}</span></div>
            <div class="print-field"><label>Budget Expectation</label><span>${escapeHtml(budget)}</span></div>
            <div class="print-field"><label>Timeline Target</label><span>${escapeHtml(timeline)}</span></div>
          </div>
          <div style="margin-top:20px;">
            <label style="font-weight:bold; font-size:11pt; display:block; margin-bottom:6px;">Project Title & Objectives:</label>
            <h3 style="margin-bottom:8px;">${escapeHtml(title)}</h3>
            <p style="font-size:10pt; line-height:1.6;">${escapeHtml(desc)}</p>
          </div>
          <div class="print-policy">
            <strong>Payment Terms:</strong> 50% advance payment is required before development begins once the scope and quotation are agreed upon. Payment details and UPI QR code will be shared personally by Atharva.
          </div>
        `;

        window.print();
      });
    });
  }

  /* ==========================================================================
     11. WHATSAPP CONSULTATION LINKS (VERIFIED NUMBER ONLY: 918626074035)
     ========================================================================== */
  function initWhatsAppLinks() {
    const verifiedNum = "918626074035";
    const waLinks = document.querySelectorAll('a[href*="wa.me"]');

    waLinks.forEach(link => {
      const currentHref = link.getAttribute('href') || '';
      // Replace any old or incorrect phone number with verified number
      const updatedHref = currentHref.replace(/wa\.me\/[0-9]+/, `wa.me/${verifiedNum}`);
      link.setAttribute('href', updatedHref);
    });
  }

  /* ==========================================================================
     12. NAVIGATION & ACTIVE HIGHLIGHTING
     ========================================================================== */
  function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scrolled class on navbar
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    }, { passive: true });

    // Mobile Drawer toggles
    mobileToggle?.addEventListener('click', () => {
      mobileDrawer?.classList.add('active');
      drawerBackdrop?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      mobileDrawer?.classList.remove('active');
      drawerBackdrop?.classList.remove('active');
      document.body.style.overflow = '';
    };

    drawerCloseBtn?.addEventListener('click', closeDrawer);
    drawerBackdrop?.addEventListener('click', closeDrawer);
    drawerLinks.forEach(l => l.addEventListener('click', closeDrawer));

    // Active Section ScrollSpy
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset + 120;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, { passive: true });
  }

  /* ==========================================================================
     13. CUSTOM CURSOR
     ========================================================================== */
  function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const dot = document.getElementById('custom-cursor-dot');
    if (!cursor || !dot) return;

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      cursor.style.display = 'none';
      dot.style.display = 'none';
      return;
    }

    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    function renderCursor() {
      cursorX += (mouseX - cursorX) * 0.16;
      cursorY += (mouseY - cursorY) * 0.16;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover effect on interactive elements
    const interactives = document.querySelectorAll('a, button, input, select, textarea, .service-card-compact, .capability-system-card, .portfolio-card');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ==========================================================================
     14. GSAP ENTRANCE ANIMATIONS
     ========================================================================== */
  function initGSAPAnimations() {
    if (isReducedMotion) return;

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
    heroTl
      .fromTo('.hero-status-pill', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
      .fromTo('.hero-title', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.25')
      .fromTo('.hero-intro', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
      .fromTo('.hero-actions .btn', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 }, '-=0.35')
      .fromTo('.hero-terminal-card', { scale: 0.94, y: 30, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.75 }, '-=0.6');
  }

  // --- Modal Helpers ---
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Global ESC key listener for modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) closeModal(activeModal);
    }
  });

  // Click outside to close modal
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
