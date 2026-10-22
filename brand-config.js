/**
 * BuiltByAtharva — Centralized Brand Configuration
 * Single source of truth for brand assets, logo resolution, and official identity.
 */

const BRAND_CONFIG = {
  name: "BuiltByAtharva",
  tagline: "IDEAS. BUILT.",
  subTagline: "Futuristic Creative Technology & Software Studio",
  founder: "Atharva Mirzapure",
  role: "Independent Software Developer & Creative Technologist",
  // Primary centralized logo asset location as specified in prompt
  logoPath: "assets/brand/builtbyatharva-logo.jpg",
  // Secondary fallback path if served from public directory or root
  fallbackLogoPath: "public/assets/brand/logo.png",
  logoAlt: "BuiltByAtharva — IDEAS. BUILT. Official Studio Logo",
  logoFallbackText: "BuiltByAtharva",
  email: "builtbyatharva27@gmail.com",
  whatsappNumber: "918626074035",
  whatsappDisplay: "+91 86260 74035",
  whatsappLink: "https://wa.me/918626074035",
  instagram: "@built_by_atharva",
  instagramUrl: "https://www.instagram.com/built_by_atharva/",
  siteUrl: "https://builtbyatharva.netlify.app",
  paymentPolicy: "50% milestone advance payment upon agreed quotation. Remaining 50% upon final preview approval prior to code handover."
};

/**
 * Universal helper to render or mount the official logo with graceful fallback
 * @param {HTMLElement|string} target Container element or selector
 * @param {Object} options Custom display options { size: 'small'|'medium'|'large', showWordmark: boolean }
 */
function renderBrandLogo(target, options = {}) {
  const container = typeof target === 'string' ? document.querySelector(target) : target;
  if (!container) return;

  const { size = 'medium', showWordmark = true, className = '' } = options;
  const wrapper = document.createElement('div');
  wrapper.className = `bba-brand-badge bba-brand-${size} ${className}`;

  // Image element with automatic error fallback to styled typographic badge
  const img = document.createElement('img');
  img.src = BRAND_CONFIG.logoPath;
  img.alt = BRAND_CONFIG.logoAlt;
  img.className = 'bba-logo-img';
  img.loading = 'eager';

  const fallbackBadge = document.createElement('div');
  fallbackBadge.className = 'bba-logo-fallback';
  fallbackBadge.innerHTML = `<span class="bba-logo-mark">BA</span>`;
  fallbackBadge.style.display = 'none';

  img.onerror = () => {
    // If primary path fails, attempt fallback path
    if (img.src.indexOf(BRAND_CONFIG.fallbackLogoPath) === -1) {
      img.src = BRAND_CONFIG.fallbackLogoPath;
    } else {
      // If image genuinely does not exist, display graceful typographic fallback
      img.style.display = 'none';
      fallbackBadge.style.display = 'flex';
    }
  };

  img.onload = () => {
    img.style.display = 'block';
    fallbackBadge.style.display = 'none';
  };

  wrapper.appendChild(img);
  wrapper.appendChild(fallbackBadge);

  if (showWordmark) {
    const textGroup = document.createElement('div');
    textGroup.className = 'bba-wordmark-group';
    textGroup.innerHTML = `
      <span class="bba-wordmark-title">${BRAND_CONFIG.name}</span>
      <span class="bba-wordmark-tagline">${BRAND_CONFIG.tagline}</span>
    `;
    wrapper.appendChild(textGroup);
  }

  container.innerHTML = '';
  container.appendChild(wrapper);
}

if (typeof window !== 'undefined') {
  window.BRAND_CONFIG = BRAND_CONFIG;
  window.renderBrandLogo = renderBrandLogo;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BRAND_CONFIG, renderBrandLogo };
}
