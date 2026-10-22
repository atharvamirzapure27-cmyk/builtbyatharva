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

  // 5. Initialize Cinematic Launch Intro (if on index page)
  initCinematicIntro();

  // 6. Initialize Three.js 3D Futuristic Centerpiece
  const threeScene = initThreeJSHero();

  // 7. Initialize GSAP & ScrollTrigger Animations
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

  // 8. Initialize Studio Components
  initCustomCursor();
  initNavigation();
  initPortfolioFilters();
  initTerminalWorkstation();
  initKineticTypography();
  initCompactServices();
  initServiceDetailModal();
  initCompactCapabilities();
  initPricingAndEstimator();
  initRealPortfolioStudio();
  initFormWizard();
  initReceiptActions();
  initWhatsAppLinks();

  /* ==========================================================================
     CINEMATIC LAUNCH INTRO SEQUENCE
     ========================================================================== */
  function initCinematicIntro() {
    const introEl = document.getElementById('cinematic-intro');
    if (!introEl) return;

    const skipBtn = document.getElementById('intro-skip-btn');
    const progressBar = document.getElementById('intro-progress-bar');
    const canvas = document.getElementById('intro-particles-canvas');
    const brandChars = introEl.querySelectorAll('.intro-char');
    const taglineText = document.getElementById('intro-tagline-text');
    const statement = document.getElementById('intro-statement');
    const replayBtns = [
      document.getElementById('nav-replay-intro-btn'),
      document.getElementById('footer-replay-intro-btn')
    ];

    let particleAnimId = null;
    let introTimeline = null;

    // Check if user already saw intro in this session or prefers reduced motion
    const introAlreadySeen = sessionStorage.getItem('bba_intro_seen') === 'true';
    if (introAlreadySeen || isReducedMotion) {
      introEl.style.display = 'none';
      introEl.style.pointerEvents = 'none';
    } else {
      playIntro();
    }

    // Replay intro buttons
    replayBtns.forEach(btn => {
      btn?.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('bba_intro_seen');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        playIntro();
      });
    });

    function playIntro() {
      introEl.style.display = 'flex';
      introEl.style.opacity = '1';
      introEl.style.pointerEvents = 'all';
      document.body.style.overflow = 'hidden';

      // 1. Initialize canvas particle constellation
      initIntroParticles();

      // 2. Play GSAP sequence if GSAP loaded
      if (window.gsap && !isReducedMotion) {
        if (introTimeline) introTimeline.kill();
        introTimeline = gsap.timeline({
          onComplete: () => dismissIntro()
        });

        // Set initial states
        gsap.set(brandChars, { opacity: 0, y: 15 });
        gsap.set(taglineText, { opacity: 0, scale: 0.9 });
        gsap.set(statement, { opacity: 0, y: 10 });
        if (progressBar) gsap.set(progressBar, { width: '0%' });

        introTimeline
          .to(brandChars, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.035,
            ease: 'back.out(1.7)'
          })
          .to(taglineText, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out'
          }, '-=0.1')
          .to(statement, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          }, '-=0.2')
          .to(progressBar, {
            width: '100%',
            duration: 2.2,
            ease: 'power1.inOut'
          }, 0)
          .to(introEl, {
            opacity: 0,
            duration: 0.7,
            ease: 'power2.inOut',
            delay: 0.3
          });
      } else {
        // Fallback timer if GSAP not loaded
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          if (progressBar) progressBar.style.width = `${progress}%`;
          if (progress >= 100) {
            clearInterval(interval);
            dismissIntro();
          }
        }, 100);
      }
    }

    function dismissIntro() {
      sessionStorage.setItem('bba_intro_seen', 'true');
      document.body.style.overflow = '';
      if (particleAnimId) cancelAnimationFrame(particleAnimId);

      if (window.gsap) {
        gsap.to(introEl, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            introEl.style.display = 'none';
            introEl.style.pointerEvents = 'none';
          }
        });
      } else {
        introEl.style.opacity = '0';
        setTimeout(() => {
          introEl.style.display = 'none';
          introEl.style.pointerEvents = 'none';
        }, 400);
      }
    }

    // Skip Button Handler
    skipBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      if (introTimeline) introTimeline.kill();
      dismissIntro();
    });

    // ESC Key to Skip
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && introEl.style.display !== 'none') {
        if (introTimeline) introTimeline.kill();
        dismissIntro();
      }
    });

    // Lightweight 2D canvas constellation particles
    function initIntroParticles() {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resizeCanvas();

      const particles = [];
      const count = Math.min(50, Math.floor(window.innerWidth / 30));

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          radius: Math.random() * 2 + 0.8,
          alpha: Math.random() * 0.6 + 0.3,
          color: Math.random() > 0.5 ? '#00f2ff' : '#8b5cf6'
        });
      }

      function draw() {
        if (introEl.style.display === 'none') return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.strokeStyle = `rgba(0, 242, 255, ${0.16 * (1 - dist / 100)})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw particles
        for (let p of particles) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
        ctx.globalAlpha = 1.0;

        particleAnimId = requestAnimationFrame(draw);
      }
      draw();
    }
  }

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
     2. THREE.JS FUTURISTIC CYBER-CORE CENTERPIECE (3-RING SPATIAL DEPTH)
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

    if (isReducedMotion || !window.THREE || !isWebGLAvailable()) {
      if (fallbackGraphic) fallbackGraphic.style.display = 'block';
      canvas.style.display = 'none';
      return null;
    }

    let scene, camera, renderer, coreGroup, animFrameId;
    let isVisible = true;
    let targetX = 0, targetY = 0;
    let coreMesh, wireframeMesh, ringOuter, ringInner, ringViolet, particles;
    let dirLightBlue, dirLightOrange, ambientLight;
    let spinVelocityX = 0.004, spinVelocityY = 0.006;

    try {
      scene = new THREE.Scene();
      const isMobile = window.innerWidth <= 768;
      
      camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.z = isMobile ? 8.2 : 6.2;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));

      // Dual ambient & directional atmospheric lighting
      ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      dirLightBlue = new THREE.DirectionalLight(0x00f2ff, 2.0);
      dirLightBlue.position.set(5, 5, 5);
      scene.add(dirLightBlue);

      dirLightOrange = new THREE.DirectionalLight(0xff7843, 1.6);
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
        opacity: 0.90,
        flatShading: true
      });
      coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreGroup.add(coreMesh);

      // 2. Outer Wireframe Cage (Cyan Glow)
      const wireframeGeo = new THREE.IcosahedronGeometry(1.36, 1);
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: isDark ? 0x00f2ff : 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.5 : 0.3
      });
      wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
      coreGroup.add(wireframeMesh);

      // 3. Concentric Orbital Ring 1 (Neon Cyan)
      const ringOuterGeo = new THREE.TorusGeometry(1.9, 0.035, 16, 90);
      const ringOuterMat = new THREE.MeshBasicMaterial({
        color: 0x00f2ff,
        transparent: true,
        opacity: 0.75
      });
      ringOuter = new THREE.Mesh(ringOuterGeo, ringOuterMat);
      ringOuter.rotation.x = Math.PI / 3;
      coreGroup.add(ringOuter);

      // 4. Concentric Orbital Ring 2 (Electric Orange/Magenta)
      const ringInnerGeo = new THREE.TorusGeometry(2.25, 0.025, 16, 90);
      const ringInnerMat = new THREE.MeshBasicMaterial({
        color: 0xff7843,
        transparent: true,
        opacity: 0.65
      });
      ringInner = new THREE.Mesh(ringInnerGeo, ringInnerMat);
      ringInner.rotation.y = Math.PI / 4;
      coreGroup.add(ringInner);

      // 5. Concentric Orbital Ring 3 (Cyber Violet Accent)
      const ringVioletGeo = new THREE.TorusGeometry(2.55, 0.02, 16, 90);
      const ringVioletMat = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.6
      });
      ringViolet = new THREE.Mesh(ringVioletGeo, ringVioletMat);
      ringViolet.rotation.z = Math.PI / 2.5;
      ringViolet.rotation.x = -Math.PI / 6;
      coreGroup.add(ringViolet);

      // 6. Floating Ambient Cyber Particles (120 particles)
      const particleCount = isMobile ? 60 : 120;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 8.5;
        positions[i + 1] = (Math.random() - 0.5) * 8.5;
        positions[i + 2] = (Math.random() - 0.5) * 6;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.06,
        color: isDark ? 0x00f2ff : 0x2563eb,
        transparent: true,
        opacity: 0.8
      });
      particles = new THREE.Points(particleGeo, particleMat);
      coreGroup.add(particles);

      scene.add(coreGroup);

      // Pointer-Responsive Parallax
      const handleMouseMove = (e) => {
        const halfX = window.innerWidth / 2;
        const halfY = window.innerHeight / 2;
        targetX = (e.clientX - halfX) * 0.0006;
        targetY = (e.clientY - halfY) * 0.0006;
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      // Interactive Click/Touch Pulse
      canvas.addEventListener('click', () => {
        spinVelocityX = 0.025;
        spinVelocityY = 0.035;
      });

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

        // Smoothly decay spin velocity towards resting state
        spinVelocityX += (0.004 - spinVelocityX) * 0.05;
        spinVelocityY += (0.006 - spinVelocityY) * 0.05;

        coreMesh.rotation.x += spinVelocityX;
        coreMesh.rotation.y += spinVelocityY;
        wireframeMesh.rotation.x -= spinVelocityX * 0.5;
        wireframeMesh.rotation.y -= spinVelocityY * 0.5;
        ringOuter.rotation.z += 0.009;
        ringInner.rotation.x += 0.007;
        ringViolet.rotation.y += 0.005;
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
        const mobile = window.innerWidth <= 768;
        camera.position.z = mobile ? 8.2 : 6.2;
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
          wireframeMesh.material.color.setHex(dark ? 0x00f2ff : 0x06b6d4);
          particleMat.color.setHex(dark ? 0x00f2ff : 0x2563eb);
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
     SERVICE DETAIL MODAL (HIDDEN PRICE REVEAL ON INTERACTION)
     ========================================================================== */
  function initServiceDetailModal() {
    const modal = document.getElementById('service-detail-modal');
    if (!modal) return;

    const closeBtns = document.querySelectorAll('#service-modal-close-corner, #modal-close-btn, .bba-modal-close-btn');
    const modalTitle = document.getElementById('modal-service-title');
    const modalCategory = document.getElementById('modal-service-category');
    const modalDesc = document.getElementById('modal-service-description');
    const modalAudience = document.getElementById('modal-service-audience');
    const modalDeliverables = document.getElementById('modal-service-deliverables');
    const modalPrerequisites = document.getElementById('modal-service-prerequisites');
    const modalTimeline = document.getElementById('modal-service-timeline');
    const modalCaseStudy = document.getElementById('modal-service-case-study');
    const modalPrice = document.getElementById('modal-service-price');
    const modalCtaBrief = document.getElementById('modal-cta-brief');
    const modalCtaWhatsapp = document.getElementById('modal-cta-whatsapp');
    const modalIconWrap = document.getElementById('modal-service-icon');

    const SERVICES_DATA = {
      'web-apps': {
        title: "Web Applications & Dashboards",
        category: "Reactive Systems",
        icon: "layout-template",
        description: "Interactive tools, patient queue management systems, administrative dashboards, client portals, and reactive state systems with responsive feedback.",
        audience: "Clinics, logistics operators, startups, financial consultants, and operations teams requiring bespoke internal or client-facing web tools.",
        deliverables: [
          "Responsive multi-device interface with real-time UI state updates",
          "Interactive data calculators, token dispensers, or queue monitors",
          "Clean modular JavaScript with optional client-side offline storage",
          "Serverless API proxy architecture with rate-limiting & error handling",
          "Exportable data summaries, instant PDF receipts, or print-ready views",
          "Comprehensive cross-browser testing & accessibility verification"
        ],
        prerequisites: "Functional workflow description, required data fields, input/output specifications, and branding guidelines.",
        timeline: "7 - 14 Business Days",
        caseStudyUrl: "case-study.html?id=smart-opd",
        caseStudyTitle: "Smart OPD Queue Tracker →",
        priceRange: "₹9,999 - ₹19,999+",
        formCategory: "Web Application",
        defaultTier: "Business Pro"
      },
      'websites': {
        title: "Website Development",
        category: "Core Engineering",
        icon: "globe",
        description: "High-performance websites, personal brand showcases, and conversion landing pages engineered with clean semantic HTML5, modern CSS, and lightweight JavaScript.",
        audience: "Founders, creators, doctors, consultants, restaurants, and growing businesses needing a fast, credible digital identity.",
        deliverables: [
          "100% Mobile, Tablet & Desktop Responsive Layouts",
          "Futuristic Dimensional UI with Light/Dark Theme Support",
          "Direct Serverless Email & Lead Capture Integration",
          "On-Page SEO Meta Tags & Custom OpenGraph Social Cards",
          "Global Edge Deployment on Netlify/Vercel with Instant SSL",
          "Clean Modular Code Handover & Complete Ownership"
        ],
        prerequisites: "Brand logo, basic copy/content outline, reference URLs or preferred aesthetic inspiration.",
        timeline: "3 - 5 Business Days",
        caseStudyUrl: "case-study.html?id=ayur-sanjeevani",
        caseStudyTitle: "AyurSanjeevani Portal →",
        priceRange: "₹2,999 - ₹9,999",
        formCategory: "Business Website",
        defaultTier: "Standard"
      },
      'ai-solutions': {
        title: "AI & Machine Learning Solutions",
        category: "Applied Intelligence",
        icon: "cpu",
        description: "Functional AI prototypes, multimodal fake news detection, automated image classification pipelines, diagnostic heuristic tools, and conversational LLM integrations.",
        audience: "Researchers, modern enterprises, healthcare professionals, and innovative startups looking to integrate applied artificial intelligence into production-ready web interfaces.",
        deliverables: [
          "Interactive web UI integrating machine learning inference endpoints",
          "Credibility scoring heuristics, confidence visualizers & metric badges",
          "Multi-model analysis (Text, Image & Cross-modal semantic alignment)",
          "Interactive embedded simulator for instant browser-based client testing",
          "Clear positioning documentation, research disclaimers & evaluation metrics",
          "Edge serverless API middleware protecting private AI model keys"
        ],
        prerequisites: "Project objective, input dataset or API credentials (if custom), sample test scenarios, and expected output format.",
        timeline: "10 - 20 Business Days",
        caseStudyUrl: "case-study.html?id=truth-guard",
        caseStudyTitle: "Truth Guard Multimodal AI →",
        priceRange: "₹9,999 - ₹24,999+",
        formCategory: "AI & ML Solution",
        defaultTier: "Business Pro"
      },
      'redesign': {
        title: "Website Redesign & UI/UX Elevation",
        category: "Interface Evolution",
        icon: "refresh-cw",
        description: "Modernizing outdated, slow, or template-heavy websites into fast, responsive, and visually magnetic digital experiences that inspire trust and drive conversions.",
        audience: "Established businesses, clinics, independent consultants, and agencies whose current websites feel slow, dated, or fail to convert visitors.",
        deliverables: [
          "Comprehensive UX & performance audit of your existing website",
          "Modern design system overhaul (editorial typography, custom gradients, refined spacing)",
          "Complete code refactoring to eliminate render-blocking template bloat",
          "Mobile-first responsive optimization across phone, tablet, and desktop viewports",
          "Smooth micro-interactions and scroll-triggered visual rhythm",
          "Preservation of existing SEO rankings and URL redirect mapping"
        ],
        prerequisites: "URL of current website, brand assets, pain points with current design, and 2-3 reference sites you admire.",
        timeline: "5 - 10 Business Days",
        caseStudyUrl: "work.html",
        caseStudyTitle: "Explore Studio Portfolio →",
        priceRange: "₹5,999 - ₹14,999",
        formCategory: "Website Redesign",
        defaultTier: "Standard"
      },
      'ecommerce': {
        title: "E-Commerce & Digital Catalogs",
        category: "Digital Commerce",
        icon: "shopping-bag",
        description: "High-speed digital storefronts, curated product catalogs, and direct WhatsApp ordering workflows that turn casual browsers into paying customers without high platform fees.",
        audience: "Boutique brands, specialty food & beverage, artisans, local manufacturers, and creators launching direct-to-consumer catalogs.",
        deliverables: [
          "Fast, visual product catalog with category filtering and instant search",
          "Direct WhatsApp checkout order-builder generating pre-formatted carts",
          "Single-click customer inquiry with SKU reference tracking",
          "Lightweight client-side cart state with zero monthly marketplace subscriptions",
          "High-resolution image optimization and lazy-loading for lightning-fast catalog browsing",
          "Google Analytics and conversion event tracking setup"
        ],
        prerequisites: "Product list with titles, prices, descriptions, high-resolution photos, and business WhatsApp number.",
        timeline: "5 - 12 Business Days",
        caseStudyUrl: "work.html",
        caseStudyTitle: "Explore Showcase →",
        priceRange: "₹5,999 - ₹14,999",
        formCategory: "E-commerce Website",
        defaultTier: "Business"
      },
      'automation': {
        title: "Automation & Workflow Integration",
        category: "Operational Efficiency",
        icon: "workflow",
        description: "Automated single-page A4 PDF receipt generation, transactional email pipelines via Resend, webhook notification systems, and bespoke API bridges.",
        audience: "Service firms, consultants, clinics, and digital agencies looking to eliminate manual paperwork and automate client communication.",
        deliverables: [
          "Custom serverless functions (Netlify / Vercel Edge) handling form submissions",
          "Automated PDF receipt generator embedding client details and official brand assets",
          "Transactional notification dispatch via Resend API with domain DKIM setup",
          "Direct WhatsApp consultation message formatting and URL routing",
          "Anti-spam honeypot filtering and server-side input sanitization",
          "Comprehensive automated test suite verifying edge API contracts"
        ],
        prerequisites: "Workflow description, email sender requirements, required receipt template layout, and desired triggers.",
        timeline: "3 - 7 Business Days",
        caseStudyUrl: "case-study.html?id=smart-opd",
        caseStudyTitle: "View Architecture →",
        priceRange: "₹3,999 - ₹9,999+",
        formCategory: "Automation & Integration",
        defaultTier: "Standard"
      },
      'maintenance': {
        title: "Ongoing Studio Support & Maintenance",
        category: "Continuity Care",
        icon: "shield-check",
        description: "Dedicated developer availability for content updates, security patches, performance audits, minor feature expansions, and technical peace of mind.",
        audience: "Previous and current studio clients who want their web applications and sites to remain fast, secure, and updated without hiring a full-time engineer.",
        deliverables: [
          "Monthly code health, link validation, and security check",
          "Up to 3 hours of monthly content updates, text tweaks, or banner additions",
          "Lighthouse performance re-testing and cache optimization",
          "Priority WhatsApp assistance directly with Atharva Mirzapure",
          "Staging preview verification before deploying updates to production"
        ],
        prerequisites: "Access to existing codebase, hosting repository, and list of required updates.",
        timeline: "Ongoing Monthly Retainer",
        caseStudyUrl: "services.html",
        caseStudyTitle: "Studio Capabilities →",
        priceRange: "Starting from ₹999 / month",
        formCategory: "Website Redesign",
        defaultTier: "Starter"
      }
    };

    // Attach click listeners to all buttons and cards with data-service-id
    const triggers = document.querySelectorAll('.open-service-modal-btn, .service-discovery-card');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        // If the user clicked an explicit anchor link inside the card (like an external link), do not hijack
        if (e.target.tagName === 'A' && !e.target.classList.contains('open-service-modal-btn')) return;

        let serviceId = trigger.getAttribute('data-service-id');
        if (!serviceId) {
          const btn = trigger.querySelector('.open-service-modal-btn');
          if (btn) serviceId = btn.getAttribute('data-service-id');
        }
        if (!serviceId) {
          const parent = trigger.closest('[data-service-id]');
          if (parent) serviceId = parent.getAttribute('data-service-id');
        }

        if (!serviceId || !SERVICES_DATA[serviceId]) return;
        const s = SERVICES_DATA[serviceId];

        // Populate fields
        if (modalTitle) modalTitle.textContent = s.title;
        if (modalCategory) modalCategory.textContent = s.category;
        if (modalDesc) modalDesc.textContent = s.description;
        if (modalAudience) modalAudience.textContent = s.audience;
        if (modalPrerequisites) modalPrerequisites.textContent = s.prerequisites;
        if (modalTimeline) modalTimeline.textContent = s.timeline;
        if (modalPrice) modalPrice.textContent = s.priceRange;

        if (modalIconWrap) {
          modalIconWrap.innerHTML = `<i data-lucide="${s.icon}"></i>`;
        }

        if (modalDeliverables) {
          modalDeliverables.innerHTML = s.deliverables.map(d => `
            <li style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.9rem; color: var(--text-secondary);">
              <i data-lucide="check-circle" style="width: 16px; height: 16px; color: var(--accent-green); flex-shrink: 0; margin-top: 2px;"></i>
              <span>${escapeHtml(d)}</span>
            </li>
          `).join('');
        }

        if (modalCaseStudy) {
          modalCaseStudy.href = s.caseStudyUrl;
          modalCaseStudy.textContent = s.caseStudyTitle;
        }

        if (modalCtaBrief) {
          modalCtaBrief.href = `start-project.html?service=${encodeURIComponent(s.formCategory)}&tier=${encodeURIComponent(s.defaultTier)}`;
        }

        if (modalCtaWhatsapp) {
          const text = encodeURIComponent(`Hi Atharva, I'm interested in discussing your ${s.title} service.`);
          modalCtaWhatsapp.href = `https://wa.me/918626074035?text=${text}`;
        }

        if (window.lucide) window.lucide.createIcons();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
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
  // Shared Official PDF Receipt State across Form Wizard and Receipt Actions
  let currentReceiptPdfBlob = null;
  let currentReceiptFilename = 'BuiltByAtharva-Project-Enquiry-Receipt.pdf';
  let currentReferenceId = '';

  function base64ToBlob(base64, mimeType = 'application/pdf') {
    const byteCharacters = atob(base64);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([byteNumbers], { type: mimeType });
  }

  function initFormWizard() {
    let currentStep = 1;
    const totalSteps = 5;

    const wizardPanels = document.querySelectorAll('.wizard-panel');
    const wizardStepItems = document.querySelectorAll('.wizard-5step-item');
    const btnNext = document.getElementById('wizard-btn-next');
    const btnPrev = document.getElementById('wizard-btn-prev');
    const btnSubmit = document.getElementById('wizard-btn-submit');
    const form = document.getElementById('project-brief-form');
    const summaryBox = document.getElementById('wizard-review-summary');
    const successModal = document.getElementById('receipt-modal-backdrop');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const charCounter = document.getElementById('desc-char-counter');
    const descTextarea = document.getElementById('form-project-desc');
    const adaptiveTypeName = document.getElementById('adaptive-type-name');

    if (!form && !wizardPanels.length) return;

    // Character Counter for Brief
    descTextarea?.addEventListener('input', () => {
      const len = descTextarea.value.length;
      if (charCounter) charCounter.textContent = `${len} / 4000`;
    });

    // Step 1: Project Type Selection
    const typeCards = document.querySelectorAll('.project-type-card');
    typeCards.forEach(card => {
      card.addEventListener('click', () => {
        typeCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const selectedType = card.getAttribute('data-type') || 'Business Website';
        const hiddenTypeInput = document.getElementById('form-project-type');
        if (hiddenTypeInput) hiddenTypeInput.value = selectedType;
        if (adaptiveTypeName) adaptiveTypeName.textContent = selectedType;
      });
    });

    // Step 3: Scope Tier Selection
    const tierCards = document.querySelectorAll('.scope-tier-card');
    tierCards.forEach(card => {
      card.addEventListener('click', () => {
        tierCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const selectedTier = card.getAttribute('data-tier') || 'Standard';
        const selectedPrice = card.getAttribute('data-price') || '₹5,999';
        const hiddenTierInput = document.getElementById('form-selected-tier');
        const hiddenBudgetInput = document.getElementById('form-budget');
        if (hiddenTierInput) hiddenTierInput.value = selectedTier;
        if (hiddenBudgetInput) hiddenBudgetInput.value = selectedPrice;
      });
    });

    // Step 3: Timeline & Customisations
    const timelineSelect = document.getElementById('form-timeline-select');
    timelineSelect?.addEventListener('change', () => {
      const hiddenTimeline = document.getElementById('form-timeline');
      if (hiddenTimeline) hiddenTimeline.value = timelineSelect.value;
    });

    // Check URL parameters for preselection (?service=...&tier=...)
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service') || urlParams.get('type') || urlParams.get('category');
    const tierParam = urlParams.get('tier');

    if (serviceParam) {
      typeCards.forEach(card => {
        const type = (card.getAttribute('data-type') || '').toLowerCase();
        const cat = (card.getAttribute('data-category') || '').toLowerCase();
        const paramLower = serviceParam.toLowerCase();
        if (type.includes(paramLower) || cat.includes(paramLower) || paramLower.includes(type)) {
          typeCards.forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          const hiddenTypeInput = document.getElementById('form-project-type');
          if (hiddenTypeInput) hiddenTypeInput.value = card.getAttribute('data-type');
          if (adaptiveTypeName) adaptiveTypeName.textContent = card.getAttribute('data-type');
        }
      });
    }

    if (tierParam) {
      tierCards.forEach(card => {
        const tier = (card.getAttribute('data-tier') || '').toLowerCase();
        if (tier === tierParam.toLowerCase()) {
          tierCards.forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          const hiddenTierInput = document.getElementById('form-selected-tier');
          const hiddenBudgetInput = document.getElementById('form-budget');
          if (hiddenTierInput) hiddenTierInput.value = card.getAttribute('data-tier');
          if (hiddenBudgetInput) hiddenBudgetInput.value = card.getAttribute('data-price');
        }
      });
    }

    // Navigation Controls
    btnNext?.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
          currentStep++;
          updateWizardUI();
          if (currentStep === 5) {
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
          p.style.display = 'block';
        } else {
          p.classList.remove('active');
          p.style.display = 'none';
        }
      });

      wizardStepItems.forEach(item => {
        const stepNum = parseInt(item.getAttribute('data-step') || '1', 10);
        if (stepNum === currentStep) {
          item.classList.add('active');
        } else if (stepNum < currentStep) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      if (btnPrev) btnPrev.style.display = currentStep > 1 ? 'inline-flex' : 'none';
      if (btnNext) btnNext.style.display = currentStep < totalSteps ? 'inline-flex' : 'none';
      if (btnSubmit) btnSubmit.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';

      // Scroll smoothly to wizard top
      const wizardBox = document.querySelector('.project-wizard-container');
      if (wizardBox && currentStep > 1) {
        wizardBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (window.lucide) window.lucide.createIcons();
    }

    function validateStep(step) {
      clearErrors();
      let isValid = true;

      if (step === 1) {
        const selectedType = document.querySelector('.project-type-card.selected');
        if (!selectedType) {
          alert('Please select a project type to continue.');
          isValid = false;
        }
      }

      if (step === 2) {
        const title = (document.getElementById('form-project-title')?.value || '').trim();
        const desc = (document.getElementById('form-project-desc')?.value || '').trim();

        if (!title || title.length < 3) {
          showError('err-project-title', 'Please provide a working title for your project (at least 3 characters).');
          isValid = false;
        }

        if (!desc || desc.length < 10) {
          showError('err-project-desc', 'Please briefly describe your requirements and goals (at least 10 characters).');
          isValid = false;
        }
      }

      if (step === 3) {
        const selectedTier = document.querySelector('.scope-tier-card.selected');
        if (!selectedTier) {
          alert('Please select a package tier to align scope and budget.');
          isValid = false;
        }
      }

      if (step === 4) {
        const name = (document.getElementById('form-client-name')?.value || '').trim();
        const email = (document.getElementById('form-client-email')?.value || '').trim();
        const phone = (document.getElementById('form-client-phone')?.value || '').trim();

        if (!name || name.length < 2) {
          showError('err-client-name', 'Please enter your full name (at least 2 characters).');
          isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          showError('err-client-email', 'Please enter a valid email address to receive your receipt.');
          isValid = false;
        }

        if (!phone || phone.replace(/\D/g, '').length < 7) {
          showError('err-client-phone', 'Please enter a valid phone or WhatsApp number.');
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

      const checkedFeatures = Array.from(document.querySelectorAll('input[name="req_features"]:checked'))
        .map(cb => cb.value);

      const data = {
        type: document.getElementById('form-project-type')?.value || 'Business Website',
        tier: document.getElementById('form-selected-tier')?.value || 'Standard',
        budget: document.getElementById('form-budget')?.value || '₹5,999',
        timeline: document.getElementById('form-timeline')?.value || 'Standard (1 - 2 Weeks)',
        title: document.getElementById('form-project-title')?.value || '',
        goal: document.getElementById('form-primary-goal')?.value || 'Establish strong digital credibility',
        desc: document.getElementById('form-project-desc')?.value || '',
        existingUrl: document.getElementById('form-existing-url')?.value || '',
        refUrl: document.getElementById('form-reference-url')?.value || '',
        customisations: document.getElementById('form-customisations')?.value || '',
        name: document.getElementById('form-client-name')?.value || '',
        email: document.getElementById('form-client-email')?.value || '',
        phone: document.getElementById('form-client-phone')?.value || '',
        company: document.getElementById('form-company')?.value || 'Independent'
      };

      summaryBox.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <div style="background: var(--bg-alt); padding: 14px; border-radius: var(--radius-md);">
            <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800; display: block; margin-bottom: 4px;">Client Name</span>
            <strong style="color: var(--text-primary); font-size: 0.95rem;">${escapeHtml(data.name)}</strong>
          </div>
          <div style="background: var(--bg-alt); padding: 14px; border-radius: var(--radius-md);">
            <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800; display: block; margin-bottom: 4px;">Contact Email</span>
            <strong style="color: var(--text-primary); font-size: 0.95rem;">${escapeHtml(data.email)}</strong>
          </div>
          <div style="background: var(--bg-alt); padding: 14px; border-radius: var(--radius-md);">
            <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800; display: block; margin-bottom: 4px;">Phone / WhatsApp</span>
            <strong style="color: var(--text-primary); font-size: 0.95rem;">${escapeHtml(data.phone)}</strong>
          </div>
          <div style="background: var(--bg-alt); padding: 14px; border-radius: var(--radius-md);">
            <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800; display: block; margin-bottom: 4px;">Company / Brand</span>
            <strong style="color: var(--text-primary); font-size: 0.95rem;">${escapeHtml(data.company)}</strong>
          </div>
        </div>

        <div style="background: var(--bg-alt); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px; border-left: 3px solid var(--accent-blue);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 0.8rem; font-weight: 800; color: var(--accent-blue); text-transform: uppercase;">Selected Architecture & Package</span>
            <strong style="font-size: 1.1rem; color: var(--text-primary);">${escapeHtml(data.budget)}</strong>
          </div>
          <div style="font-size: 1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
            ${escapeHtml(data.type)} &mdash; <span style="color: var(--accent-blue);">${escapeHtml(data.tier)} Package</span>
          </div>
          <div style="font-size: 0.82rem; color: var(--text-secondary);">
            Turnaround: ${escapeHtml(data.timeline)} &bull; 50% Milestone Advance Policy
          </div>
        </div>

        <div style="background: var(--bg-alt); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
          <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800; display: block; margin-bottom: 4px;">Working Title & Scope</span>
          <strong style="display: block; font-size: 1rem; color: var(--text-primary); margin-bottom: 6px;">${escapeHtml(data.title)}</strong>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 8px;">${escapeHtml(data.desc)}</p>
          ${checkedFeatures.length > 0 ? `
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
              ${checkedFeatures.map(f => `<span style="font-size: 0.72rem; background: var(--bg-card); padding: 3px 8px; border-radius: var(--radius-full); border: 1px solid var(--border-light); color: var(--text-primary);"><i data-lucide="check" style="width: 10px; height: 10px; display: inline-block;"></i> ${escapeHtml(f)}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();
    }

    // Form Submission Handler
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
        currentStep = 1;
        updateWizardUI();
        return;
      }

      const termsCheck = document.getElementById('terms-agree');
      if (termsCheck && !termsCheck.checked) {
        alert('Please accept the fixed-scope estimation model and milestone advance terms to proceed.');
        return;
      }

      const submitBtn = document.getElementById('wizard-btn-submit');
      const submitText = document.getElementById('btn-submit-text');
      const submitIcon = document.getElementById('btn-submit-icon');
      const serverMsg = document.getElementById('wizard-server-msg');

      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitText) submitText.textContent = 'DISPATCHING BRIEF & PDF...';
        if (submitIcon) {
          submitIcon.setAttribute('data-lucide', 'loader-2');
          submitIcon.classList.add('spin');
          if (window.lucide) window.lucide.createIcons();
        }
      }

      if (serverMsg) {
        serverMsg.style.display = 'none';
        serverMsg.textContent = '';
      }

      const checkedFeatures = Array.from(document.querySelectorAll('input[name="req_features"]:checked'))
        .map(cb => cb.value)
        .join(', ');

      const payload = {
        client_name: document.getElementById('form-client-name')?.value || '',
        contact_phone: document.getElementById('form-client-phone')?.value || '',
        client_email: document.getElementById('form-client-email')?.value || '',
        company_name: document.getElementById('form-company')?.value || '',
        project_type: document.getElementById('form-project-type')?.value || 'Business Website',
        selected_tier: document.getElementById('form-selected-tier')?.value || 'Standard',
        estimated_cost: document.getElementById('form-budget')?.value || '₹5,999',
        project_title: document.getElementById('form-project-title')?.value || '',
        project_description: document.getElementById('form-project-desc')?.value || '',
        existing_website: document.getElementById('form-existing-url')?.value || '',
        special_customisations: [document.getElementById('form-customisations')?.value || '', checkedFeatures ? `Features: ${checkedFeatures}` : ''].filter(Boolean).join(' | '),
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
          currentReferenceId = result.referenceId || 'BBA-2026-CONFIRMED';
          currentReceiptFilename = result.pdfFilename || `BuiltByAtharva-Enquiry-${currentReferenceId}.pdf`;
          if (result.pdfBase64) {
            currentReceiptPdfBlob = base64ToBlob(result.pdfBase64, 'application/pdf');
          }

          // Populate success modal elements
          const refEl = document.getElementById('modal-ref-id');
          if (refEl) refEl.textContent = currentReferenceId;

          const timeEl = document.getElementById('modal-timestamp');
          if (timeEl) {
            const timeStr = result.submissionSummary?.submissionTime || new Date().toLocaleString();
            timeEl.textContent = `Recorded: ${timeStr}`;
          }

          const waLink = document.getElementById('modal-whatsapp-link');
          if (waLink) {
            const msg = encodeURIComponent(`Hi Atharva, I just submitted project brief ref: ${currentReferenceId}. Looking forward to discussing!`);
            waLink.href = `https://wa.me/918626074035?text=${msg}`;
          }

          if (successModal) {
            successModal.style.display = 'flex';
          }

          form.reset();
          currentStep = 1;
          updateWizardUI();

          if (window.lucide) window.lucide.createIcons();
        } else if (result.isConfigError) {
          if (serverMsg) {
            serverMsg.style.display = 'block';
            serverMsg.style.background = 'rgba(239, 68, 68, 0.1)';
            serverMsg.style.color = 'var(--accent-red)';
            serverMsg.textContent = `Configuration Notice: ${result.error}. Connect directly via WhatsApp: +91 8626074035.`;
          }
          alert(`Configuration Notice: ${result.error}\n\nAtharva will configure RESEND_API_KEY in Netlify Site Configuration. You can also connect directly via WhatsApp (+91 8626074035).`);
        } else if (result.validationErrors && result.validationErrors.length > 0) {
          if (serverMsg) {
            serverMsg.style.display = 'block';
            serverMsg.style.background = 'rgba(239, 68, 68, 0.1)';
            serverMsg.style.color = 'var(--accent-red)';
            serverMsg.innerHTML = `<strong>Please correct the following:</strong><br>&bull; ${result.validationErrors.join('<br>&bull; ')}`;
          }
          alert(`Please check the following details:\n\n• ${result.validationErrors.join('\n• ')}`);
        } else {
          alert(`Notice: ${result.error || 'Unable to submit at this time.'}\n\nPlease connect with Atharva directly at builtbyatharva27@gmail.com or WhatsApp +91 8626074035.`);
        }
      } catch (err) {
        console.error("Submission error:", err);
        alert("Network error: Could not reach the serverless endpoint. Please connect with Atharva directly at builtbyatharva27@gmail.com or WhatsApp +91 8626074035.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitText) submitText.textContent = 'SUBMIT PROJECT BRIEF';
          if (submitIcon) {
            submitIcon.setAttribute('data-lucide', 'send');
            submitIcon.classList.remove('spin');
            if (window.lucide) window.lucide.createIcons();
          }
        }
      }
    });

    closeModalBtn?.addEventListener('click', () => {
      if (successModal) successModal.style.display = 'none';
    });
  }

  /* ==========================================================================
     10. OFFICIAL A4 PDF ENQUIRY RECEIPT ACTIONS (DOWNLOAD & PRINT)
     ========================================================================== */
  function initReceiptActions() {
    const downloadBtns = [
      document.getElementById('btn-download-pdf-receipt'),
      document.getElementById('btn-download-receipt-pdf')
    ];
    const printBtns = [
      document.getElementById('btn-print-receipt'),
      document.getElementById('btn-print-receipt-pdf')
    ];

    downloadBtns.forEach(btn => {
      btn?.addEventListener('click', () => {
        if (!currentReceiptPdfBlob) {
          alert('Your official receipt is being generated. Please submit your project brief first.');
          return;
        }

        const url = URL.createObjectURL(currentReceiptPdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = currentReceiptFilename || `BuiltByAtharva-Enquiry-${currentReferenceId || 'Receipt'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      });
    });

    printBtns.forEach(btn => {
      btn?.addEventListener('click', () => {
        if (!currentReceiptPdfBlob) {
          alert('Your official receipt is being generated. Please submit your project brief first.');
          return;
        }

        const url = URL.createObjectURL(currentReceiptPdfBlob);
        const printWin = window.open(url, '_blank');
        if (!printWin) {
          const a = document.createElement('a');
          a.href = url;
          a.download = currentReceiptFilename || `BuiltByAtharva-Enquiry-${currentReferenceId || 'Receipt'}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        setTimeout(() => URL.revokeObjectURL(url), 30000);
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
    const mobileToggle = document.getElementById('mobile-toggle-btn') || document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-menu-drawer') || document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const drawerCloseBtn = document.getElementById('mobile-drawer-close') || document.getElementById('drawer-close-btn');
    const drawerLinks = document.querySelectorAll('.mobile-nav-link, .drawer-link');
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
      if (drawerBackdrop) drawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      mobileDrawer?.classList.remove('active');
      if (drawerBackdrop) drawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    drawerCloseBtn?.addEventListener('click', closeDrawer);
    drawerBackdrop?.addEventListener('click', closeDrawer);
    drawerLinks.forEach(l => l.addEventListener('click', closeDrawer));

    // Highlight current page in navigation
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

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
     13. PORTFOLIO CATEGORY FILTERS (WORK.HTML)
     ========================================================================== */
  function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('#work-filters .filter-btn');
    const cards = document.querySelectorAll('#portfolio-grid .portfolio-card');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        cards.forEach(card => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
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
