import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log(' BuiltByAtharva — Complete Project Audit & Link Verification');
console.log('================================================================\n');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const brokenLinks = [];
const allInternalLinks = new Set();
const scriptSrcs = new Set();
const cssHrefs = new Set();
const imgSources = [];

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');

  // Check href links
  const hrefRegex = /href=["']([^"']+)["']/g;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('javascript:')) {
      continue;
    }
    const cleanHref = href.split('?')[0].split('#')[0];
    if (cleanHref) {
      if (cleanHref.endsWith('.css')) {
        cssHrefs.add(cleanHref);
      } else {
        allInternalLinks.add(cleanHref);
      }
      if (!fs.existsSync(cleanHref)) {
        brokenLinks.push({ file, href, cleanHref, type: 'href' });
      }
    }
  }

  // Check script tags
  const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["']/g;
  while ((match = scriptRegex.exec(content)) !== null) {
    const src = match[1];
    if (src.startsWith('http://') || src.startsWith('https://')) continue;
    scriptSrcs.add(src);
    if (!fs.existsSync(src)) {
      brokenLinks.push({ file, href: src, cleanHref: src, type: 'script' });
    }
  }

  // Check img tags
  const imgRegex = /<img\s+[^>]*src=["']([^"']+)["']/g;
  while ((match = imgRegex.exec(content)) !== null) {
    const src = match[1];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) continue;
    imgSources.push({ file, src });
    if (!fs.existsSync(src)) {
      brokenLinks.push({ file, href: src, cleanHref: src, type: 'img' });
    }
  }
}

console.log(`Audited ${htmlFiles.length} HTML pages: ${htmlFiles.join(', ')}`);
console.log(`Internal page routes referenced: ${Array.from(allInternalLinks).join(', ')}`);
console.log(`CSS files referenced: ${Array.from(cssHrefs).join(', ')}`);
console.log(`JS files referenced: ${Array.from(scriptSrcs).join(', ')}`);
console.log(`Image sources verified: ${imgSources.length}`);

// SEO & Accessibility Audits
const seoErrors = [];
const a11yErrors = [];

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');

  // Title check
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    seoErrors.push({ file, issue: 'Missing or empty <title>' });
  }

  // Meta description check
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (!descMatch || !descMatch[1].trim()) {
    seoErrors.push({ file, issue: 'Missing or empty <meta name="description">' });
  }

  // H1 tag check
  const h1Matches = content.match(/<h1[^>]*>/gi);
  if (!h1Matches) {
    seoErrors.push({ file, issue: 'Missing <h1> tag' });
  } else if (h1Matches.length > 1) {
    seoErrors.push({ file, issue: `Multiple <h1> tags found (${h1Matches.length})` });
  }

  // Image alt attribute check
  const imgTagRegex = /<img\s+([^>]+)>/gi;
  let imgMatch;
  while ((imgMatch = imgTagRegex.exec(content)) !== null) {
    const attrs = imgMatch[1];
    if (!/alt=["'][^"']*["']/i.test(attrs)) {
      a11yErrors.push({ file, tag: imgMatch[0], issue: 'Missing alt attribute' });
    }
  }

  // Viewport meta check
  if (!/<meta\s+name=["']viewport["']/i.test(content)) {
    seoErrors.push({ file, issue: 'Missing mobile viewport meta tag' });
  }
}

if (seoErrors.length === 0) {
  console.log('✅ SEO & Metadata: All pages have title, meta description, viewport, and proper <h1> hierarchy.');
} else {
  console.warn('⚠️ SEO Warnings:', seoErrors);
}

if (a11yErrors.length === 0) {
  console.log('✅ Accessibility: All <img> tags have alt attributes.');
} else {
  console.warn('⚠️ Accessibility Warnings:', a11yErrors);
}

if (brokenLinks.length === 0 && seoErrors.length === 0 && a11yErrors.length === 0) {
  console.log('\n================================================================');
  console.log(' ✅ ALL AUDIT CHECKS PASSED: ZERO BROKEN LINKS OR SEO DEFECTS');
  console.log('================================================================');
} else if (brokenLinks.length > 0) {
  console.error('\n❌ Found broken references:', brokenLinks);
  process.exit(1);
}
