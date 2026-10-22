import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standard Brand Colors matching BuiltByAtharva identity
const COLORS = {
  primary: '#0F172A',         // Deep navy / near-black
  secondary: '#334155',       // Charcoal body text
  muted: '#64748B',           // Muted slate gray
  accentGold: '#B8860B',      // Dark goldenrod matching brand logo
  accentGoldLight: '#C5A059', // Warm gold
  accentBlue: '#2563EB',      // Complementary studio blue
  accentGreen: '#059669',     // Emerald green for status
  statusBg: '#ECFDF5',        // Soft emerald pill background
  statusBorder: '#A7F3D0',    // Emerald border
  cardBg: '#FFFFFF',
  cardAltBg: '#F8FAFC',
  cardBorder: '#E2E8F0',
  noticeBg: '#FFFBEB',        // Soft amber notice
  noticeBorder: '#FDE68A',
  noticeText: '#78350F'
};

/**
 * Sanitize text for PDFKit standard Helvetica (replace Rupee sign with INR, normalize whitespace)
 */
function cleanPdfText(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/₹/g, 'INR ').trim();
}

/**
 * Truncate long strings safely with ellipsis and notation
 */
function truncateText(str, maxLength, note = '... [Full brief in project archive]') {
  if (!str || typeof str !== 'string') return '';
  const cleaned = cleanPdfText(str);
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength).trim() + ' ' + note;
}

/**
 * Resolve the brand logo path across environments (local dev, Netlify Functions, tests)
 */
function resolveLogoPath() {
  const possiblePaths = [
    path.resolve(process.cwd(), 'public', 'assets', 'brand', 'logo.png'),
    path.resolve(process.cwd(), 'assets', 'brand', 'logo.png'),
    path.resolve(process.cwd(), 'assets', 'brand', 'builtbyatharva-logo.jpg'),
    path.resolve(__dirname, '..', 'public', 'assets', 'brand', 'logo.png'),
    path.resolve(__dirname, '..', 'assets', 'brand', 'logo.png'),
    path.resolve(__dirname, '..', 'assets', 'brand', 'builtbyatharva-logo.jpg'),
    path.resolve(__dirname, '..', '..', 'public', 'assets', 'brand', 'logo.png'),
    path.resolve(__dirname, '..', '..', 'assets', 'brand', 'builtbyatharva-logo.jpg'),
    path.resolve('/var/task/public/assets/brand/logo.png'),
    path.resolve('/var/task/assets/brand/logo.png'),
    path.resolve('/var/task/assets/brand/builtbyatharva-logo.jpg')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Generates a genuine, single-page A4 Project Enquiry Receipt PDF buffer
 * @param {Object} data Submission data
 * @returns {Promise<Buffer>}
 */
export async function generateReceiptPdf(data) {
  const {
    referenceId = 'BBA-2026-00000',
    submissionDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' (IST)',
    client = {},
    project = {},
    branding = {}
  } = data;

  const clientName = cleanPdfText(client.name || 'Valued Client');
  const clientEmail = cleanPdfText(client.email || 'Not provided');
  const clientPhone = cleanPdfText(client.phone || 'Not provided');
  const clientCompany = cleanPdfText(client.company || 'Not provided');

  const projectTitle = cleanPdfText(project.title || 'Untitled Project Brief');
  const projectCategory = cleanPdfText(project.category || 'Website Development');
  const selectedTier = cleanPdfText(project.tier || 'Standard');
  const budgetRange = cleanPdfText(project.budget || 'Standard (INR 5,999 - INR 9,999)');
  const timelineTarget = cleanPdfText(project.timeline || 'Standard (4 - 7 Days)');
  const rawDescription = project.description || 'No detailed description provided.';
  const projectDesc = truncateText(rawDescription, 450);
  const customisations = truncateText(project.customisations || 'None specified', 120);
  const referenceUrl = cleanPdfText(project.referenceUrl || project.existingUrl || 'None specified');

  const websiteUrl = cleanPdfText(branding.websiteUrl || 'https://builtbyatharva.netlify.app/');
  const contactEmail = cleanPdfText(branding.contactEmail || 'builtbyatharva27@gmail.com');

  return new Promise((resolve, reject) => {
    try {
      // Standard A4 dimensions: 595.28 x 841.89 pt
      // Margins tailored to strictly prevent automatic pagination
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 28, bottom: 16, left: 36, right: 36 },
        bufferPages: true,
        info: {
          Title: `BuiltByAtharva Project Enquiry Receipt - ${referenceId}`,
          Author: 'BuiltByAtharva Studio (Atharva Mirzapure)',
          Subject: `Project Enquiry Receipt for ${projectTitle}`,
          Keywords: 'BuiltByAtharva, Project Enquiry, Receipt, Studio Brief'
        }
      });

      // Strict single-page guard: prevent any secondary page creation
      let pageCount = 0;
      const originalAddPage = doc.addPage;
      doc.addPage = function (...args) {
        if (pageCount >= 1) {
          return this;
        }
        pageCount++;
        return originalAddPage.apply(this, args);
      };

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const resultBuffer = Buffer.concat(chunks);
        resolve(resultBuffer);
      });
      doc.on('error', reject);

      const pageWidth = 595.28;
      const margin = 36;
      const contentWidth = pageWidth - (margin * 2); // 523.28 pt

      // =========================================================================
      // 1. FAINT WATERMARK (Rendered in background behind all content)
      // =========================================================================
      const logoPath = resolveLogoPath();
      if (logoPath) {
        doc.save();
        doc.opacity(0.04);
        const watermarkSize = 250;
        const watermarkX = (pageWidth - watermarkSize) / 2;
        const watermarkY = 270;
        doc.image(logoPath, watermarkX, watermarkY, { width: watermarkSize, height: watermarkSize });
        doc.restore();
      } else {
        // Fallback vector watermark if image file is not found
        doc.save();
        doc.opacity(0.03);
        doc.font('Helvetica-Bold').fontSize(130).fillColor(COLORS.accentGold);
        doc.text('BA', (pageWidth - 200) / 2, 330, { width: 200, align: 'center' });
        doc.restore();
      }

      // =========================================================================
      // 2. HEADER: BRAND LOGO + WORDMARK + RECEIPT LABEL + STATUS PILL
      // =========================================================================
      const headerY = 32;

      // Brand Logo (Left)
      if (logoPath) {
        doc.image(logoPath, margin, headerY, { width: 50, height: 50 });
      } else {
        doc.roundedRect(margin, headerY, 50, 50, 10).fillAndStroke(COLORS.primary, COLORS.accentGold);
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(20).text('BA', margin, headerY + 14, { width: 50, align: 'center' });
      }

      // Brand Wordmark & Tagline
      doc.fillColor(COLORS.primary)
        .font('Helvetica-Bold')
        .fontSize(16)
        .text('BuiltByAtharva', margin + 58, headerY + 5);

      doc.fillColor(COLORS.accentGold)
        .font('Helvetica-Bold')
        .fontSize(8)
        .text('IDEAS. BUILT.', margin + 58, headerY + 24);

      doc.fillColor(COLORS.muted)
        .font('Helvetica')
        .fontSize(7.5)
        .text('Futuristic Creative Technology & Software Studio', margin + 58, headerY + 36);

      // Document Label & Status Badge (Right)
      doc.fillColor(COLORS.primary)
        .font('Helvetica-Bold')
        .fontSize(11.5)
        .text('PROJECT ENQUIRY RECEIPT', margin, headerY + 4, { width: contentWidth, align: 'right' });

      // Status Pill: [ SUBMITTED ]
      const pillWidth = 70;
      const pillHeight = 15;
      const pillX = margin + contentWidth - pillWidth;
      const pillY = headerY + 20;

      doc.roundedRect(pillX, pillY, pillWidth, pillHeight, 7)
        .fillAndStroke(COLORS.statusBg, COLORS.statusBorder);

      doc.fillColor(COLORS.accentGreen)
        .font('Helvetica-Bold')
        .fontSize(7)
        .text('SUBMITTED', pillX, pillY + 3.5, { width: pillWidth, align: 'center' });

      // Reference ID and Timestamp
      doc.fillColor(COLORS.primary)
        .font('Helvetica-Bold')
        .fontSize(8.5)
        .text(`Ref: ${referenceId}`, margin, headerY + 39, { width: contentWidth, align: 'right' });

      doc.fillColor(COLORS.muted)
        .font('Helvetica')
        .fontSize(7.2)
        .text(`Submitted: ${submissionDate}`, margin, headerY + 51, { width: contentWidth, align: 'right' });

      // Elegant Accent Divider Line
      doc.strokeColor(COLORS.cardBorder).lineWidth(0.8).moveTo(margin, 92).lineTo(margin + contentWidth, 92).stroke();
      doc.strokeColor(COLORS.accentGold).lineWidth(2).moveTo(margin, 92).lineTo(margin + 75, 92).stroke();

      // =========================================================================
      // 3. MAIN HEADING & ACKNOWLEDGMENT BANNER
      // =========================================================================
      const bannerY = 100;
      doc.fillColor(COLORS.primary)
        .font('Helvetica-Bold')
        .fontSize(12.5)
        .text('Project Enquiry Received', margin, bannerY);

      doc.fillColor(COLORS.muted)
        .font('Helvetica')
        .fontSize(8)
        .text('Thank you for choosing BuiltByAtharva. Your project enquiry has been recorded successfully in our studio engine.', margin, bannerY + 15);

      // =========================================================================
      // 4. CLIENT INFORMATION CARD
      // =========================================================================
      const clientCardY = 128;
      const clientCardHeight = 66;

      doc.roundedRect(margin, clientCardY, contentWidth, clientCardHeight, 6)
        .fillAndStroke(COLORS.cardAltBg, COLORS.cardBorder);

      doc.fillColor(COLORS.accentGold)
        .font('Helvetica-Bold')
        .fontSize(7)
        .text('CLIENT DETAILS', margin + 12, clientCardY + 7);

      const col1X = margin + 12;
      const col2X = margin + 260;

      // Full Name
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text('Full Name', col1X, clientCardY + 20);
      doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(8.5).text(clientName, col1X, clientCardY + 29, { width: 235, ellipsis: true });

      // Phone
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text('Phone / WhatsApp', col1X, clientCardY + 42);
      doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(8.5).text(clientPhone, col1X, clientCardY + 51, { width: 235, ellipsis: true });

      // Email Address
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text('Email Address', col2X, clientCardY + 20);
      doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(8.5).text(clientEmail, col2X, clientCardY + 29, { width: 245, ellipsis: true });

      // Company
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text('Company / Organization', col2X, clientCardY + 42);
      doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(8.5).text(clientCompany, col2X, clientCardY + 51, { width: 245, ellipsis: true });

      // =========================================================================
      // 5. PROJECT SCOPE & DETAILS CARD
      // =========================================================================
      const projectCardY = 202;
      const projectCardHeight = 264;

      doc.roundedRect(margin, projectCardY, contentWidth, projectCardHeight, 6)
        .fillAndStroke(COLORS.cardBg, COLORS.cardBorder);

      doc.fillColor(COLORS.accentGold)
        .font('Helvetica-Bold')
        .fontSize(7)
        .text('PROJECT SCOPE & REQUIREMENTS', margin + 12, projectCardY + 7);

      // 4-Column Attribute Grid
      const gridY = projectCardY + 20;
      const cellWidth = (contentWidth - 24) / 4;

      // 1. Service Category
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text('Service Category', margin + 12, gridY);
      doc.fillColor(COLORS.accentBlue).font('Helvetica-Bold').fontSize(8).text(projectCategory, margin + 12, gridY + 9, { width: cellWidth - 8, ellipsis: true });

      // 2. Package Tier
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text('Package Tier', margin + 12 + cellWidth, gridY);
      doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(8).text(selectedTier, margin + 12 + cellWidth, gridY + 9, { width: cellWidth - 8, ellipsis: true });

      // 3. Estimated Budget
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text('Budget Range', margin + 12 + (cellWidth * 2), gridY);
      doc.fillColor(COLORS.accentGreen).font('Helvetica-Bold').fontSize(8).text(budgetRange, margin + 12 + (cellWidth * 2), gridY + 9, { width: cellWidth - 8, ellipsis: true });

      // 4. Target Timeline
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text('Desired Timeline', margin + 12 + (cellWidth * 3), gridY);
      doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(8).text(timelineTarget, margin + 12 + (cellWidth * 3), gridY + 9, { width: cellWidth - 8, ellipsis: true });

      // Divider inside card
      const innerDividerY = gridY + 26;
      doc.strokeColor(COLORS.cardBorder).lineWidth(0.5).moveTo(margin + 12, innerDividerY).lineTo(margin + contentWidth - 12, innerDividerY).stroke();

      // Project Title
      const titleY = innerDividerY + 5;
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text('Project Title / Objective', margin + 12, titleY);
      doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(9.5).text(projectTitle, margin + 12, titleY + 9, { width: contentWidth - 24, ellipsis: true });

      // Project Overview & Description Box
      const descY = titleY + 27;
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text('Project Overview & Goals', margin + 12, descY);

      const descBoxY = descY + 9;
      const descBoxHeight = 108;
      doc.roundedRect(margin + 12, descBoxY, contentWidth - 24, descBoxHeight, 4)
        .fillAndStroke(COLORS.cardAltBg, COLORS.cardBorder);

      doc.fillColor(COLORS.secondary)
        .font('Helvetica')
        .fontSize(8)
        .text(projectDesc, margin + 20, descBoxY + 7, {
          width: contentWidth - 40,
          lineGap: 2.2
        });

      // Optional Details (Customizations & Reference Links)
      const optY = descBoxY + descBoxHeight + 7;
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text('Requested Customizations / Features', margin + 12, optY);
      doc.fillColor(COLORS.secondary).font('Helvetica-Bold').fontSize(7.5).text(customisations, margin + 12, optY + 8, { width: 235, ellipsis: true });

      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text('Reference / Existing Website', col2X, optY);
      doc.fillColor(COLORS.accentBlue).font('Helvetica-Bold').fontSize(7.5).text(referenceUrl, col2X, optY + 8, { width: 245, ellipsis: true });

      // =========================================================================
      // 6. NEXT STEPS SECTION (Structured 3-Step Process)
      // =========================================================================
      const nextStepsY = 474;
      const nextStepsHeight = 78;

      doc.roundedRect(margin, nextStepsY, contentWidth, nextStepsHeight, 6)
        .fillAndStroke(COLORS.cardAltBg, COLORS.cardBorder);

      doc.fillColor(COLORS.accentGold)
        .font('Helvetica-Bold')
        .fontSize(7)
        .text('WHAT HAPPENS NEXT — 3-STEP CONSULTATION PROCESS', margin + 12, nextStepsY + 7);

      const stepWidth = (contentWidth - 36) / 3;

      // Step 1
      const s1X = margin + 12;
      doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(8).text('01 / Technical Review', s1X, nextStepsY + 20);
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text(
        'Atharva personally analyzes your brief, goals, architecture, and references.',
        s1X, nextStepsY + 31, { width: stepWidth, lineGap: 1.2 }
      );

      // Step 2
      const s2X = s1X + stepWidth + 12;
      doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(8).text('02 / Scope & Confirmed Quote', s2X, nextStepsY + 20);
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text(
        'We connect via WhatsApp or email within 24 hours with exact milestone pricing.',
        s2X, nextStepsY + 31, { width: stepWidth, lineGap: 1.2 }
      );

      // Step 3
      const s3X = s2X + stepWidth + 12;
      doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(8).text('03 / Development Kickoff', s3X, nextStepsY + 20);
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(7).text(
        'Work begins immediately upon scope agreement and 50% milestone advance payment.',
        s3X, nextStepsY + 31, { width: stepWidth, lineGap: 1.2 }
      );

      // =========================================================================
      // 7. IMPORTANT LEGAL NOTICE & DISCLAIMER
      // =========================================================================
      const noticeY = 560;
      const noticeHeight = 40;

      doc.roundedRect(margin, noticeY, contentWidth, noticeHeight, 6)
        .fillAndStroke(COLORS.noticeBg, COLORS.noticeBorder);

      doc.fillColor(COLORS.noticeText)
        .font('Helvetica-Bold')
        .fontSize(7)
        .text('IMPORTANT NOTICE', margin + 12, noticeY + 5);

      doc.fillColor(COLORS.noticeText)
        .font('Helvetica')
        .fontSize(6.8)
        .text(
          'This document confirms receipt of your project enquiry only. It is not an invoice, contract, payment receipt, or guarantee of project acceptance. Final scope, pricing, and timelines will be confirmed after discussion.',
          margin + 12, noticeY + 15, { width: contentWidth - 24, lineGap: 1.3 }
        );

      // =========================================================================
      // 8. FOOTER: OFFICIAL WEBSITE + CONTACT + PAGE NUMBER (Strictly Page 1 of 1)
      // =========================================================================
      const footerY = 796;

      doc.strokeColor(COLORS.cardBorder).lineWidth(0.5).moveTo(margin, footerY - 7).lineTo(margin + contentWidth, footerY - 7).stroke();

      // Left Column: Website URL
      doc.fillColor(COLORS.muted)
        .font('Helvetica')
        .fontSize(7)
        .text(`BuiltByAtharva Studio • ${websiteUrl}`, margin, footerY, { width: 190, align: 'left' });

      // Center Column: Contact Information
      doc.fillColor(COLORS.muted)
        .font('Helvetica')
        .fontSize(7)
        .text(`Email: ${contactEmail}  |  WhatsApp: +91 86260 74035`, margin + 190, footerY, { width: 250, align: 'center' });

      // Right Column: Page Count
      doc.fillColor(COLORS.primary)
        .font('Helvetica-Bold')
        .fontSize(7)
        .text('Page 1 of 1', margin + contentWidth - 75, footerY, { width: 75, align: 'right' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

export default generateReceiptPdf;
