import { Resend } from 'resend';
import { generateReceiptPdf } from '../../lib/generate-receipt-pdf.js';
import { generateReferenceId } from '../../lib/reference-id.js';

/**
 * BuiltByAtharva — Netlify Serverless Function: Project Enquiry & PDF Receipt Dispatch
 *
 * Responsibilities:
 *  - Server-side validation, anti-spam honeypot, duplicate rate limiting.
 *  - Collision-resistant reference ID generation (BBA-YYYY-XXXXX).
 *  - Server-side single-page A4 PDF Enquiry Receipt generation with official brand logo & watermark.
 *  - Dispatch business notification email with PDF attachment to Atharva.
 *  - Dispatch client confirmation receipt email with the same PDF attachment via Resend.
 *  - Return PDF binary base64 directly to the client browser for instant zero-storage download.
 *
 * Environment Variables (Netlify Site Configuration > Environment variables):
 *  - RESEND_API_KEY (Required for live email delivery, starts with 're_')
 *  - CONTACT_EMAIL (Optional: defaults to builtbyatharva27@gmail.com)
 *  - RESEND_FROM_EMAIL (Optional: defaults to 'BuiltByAtharva Studio <onboarding@resend.dev>')
 *  - RESEND_CLIENT_CONFIRMATION (Optional: defaults to 'true' if verified domain, or attempts with fallback)
 */

// In-memory sliding window cache for rate limiting duplicate submissions (45 seconds)
const recentSubmissions = new Map();
const DUPLICATE_WINDOW_MS = 45 * 1000;

function cleanupOldSubmissions() {
  const now = Date.now();
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > DUPLICATE_WINDOW_MS * 2) {
      recentSubmissions.delete(key);
    }
  }
}

// HTML escape helper to prevent XSS / HTML injection in emails
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Sanitize single-line strings to prevent header injection in email subjects or recipients
function sanitizeSingleLine(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\r\n\t]+/g, ' ').trim();
}

// RFC 5322 compliant email regex check
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Standard CORS and Security Response Headers
const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With',
  'X-Content-Type-Options': 'nosniff'
};

function jsonResponse(statusCode, data, isWebRequest = false) {
  const bodyString = JSON.stringify(data);
  if (isWebRequest) {
    return new Response(bodyString, {
      status: statusCode,
      headers: CORS_HEADERS
    });
  }
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: bodyString
  };
}

/**
 * Netlify Function Handler
 * Supports both Netlify Functions v1 (event, context) and Web API Request (req, context)
 */
export async function handler(event, context) {
  // Detect if invoked as standard Web API Request (Netlify Functions v2)
  const isWebRequest = event && typeof event.text === 'function';

  let httpMethod = 'GET';
  let rawBody = '';

  if (isWebRequest) {
    httpMethod = (event.method || 'GET').toUpperCase();
    try {
      rawBody = await event.text();
    } catch {
      rawBody = '';
    }
  } else if (event) {
    httpMethod = (event.httpMethod || event.method || 'GET').toUpperCase();
    rawBody = event.body || '';
    if (event.isBase64Encoded && typeof rawBody === 'string') {
      try {
        rawBody = Buffer.from(rawBody, 'base64').toString('utf8');
      } catch {
        // Fall back to raw string if base64 decoding fails
      }
    }
  }

  // 1. Handle CORS Preflight OPTIONS
  if (httpMethod === 'OPTIONS') {
    if (isWebRequest) {
      return new Response(null, { status: 200, headers: CORS_HEADERS });
    }
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  // 2. Reject non-POST HTTP methods
  if (httpMethod !== 'POST') {
    return jsonResponse(405, {
      success: false,
      error: 'Method Not Allowed. Only POST requests are supported.'
    }, isWebRequest);
  }

  // 3. Payload size check (limit to 50KB to protect against large payloads)
  if (typeof rawBody === 'string' && rawBody.length > 50000) {
    return jsonResponse(413, {
      success: false,
      error: 'Payload Too Large. Submissions must not exceed 50KB.'
    }, isWebRequest);
  }

  // 4. Parse JSON safely
  let body = {};
  if (typeof rawBody === 'object' && rawBody !== null) {
    body = rawBody;
  } else if (typeof rawBody === 'string' && rawBody.trim().length > 0) {
    try {
      body = JSON.parse(rawBody);
    } catch {
      return jsonResponse(400, {
        success: false,
        error: 'Invalid JSON request payload.'
      }, isWebRequest);
    }
  }

  try {
    // 5. Anti-Spam Check: Honeypot field (website_hp)
    const honeypot = body.website_hp;
    if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
      console.warn('[SPAM_BLOCKED] Honeypot triggered.');
      return jsonResponse(400, {
        success: false,
        error: 'Spam submission detected.'
      }, isWebRequest);
    }

    // 6. Extract and Validate Required Fields
    const clientName = sanitizeSingleLine(body.client_name || '');
    const contactPhone = sanitizeSingleLine(body.contact_phone || '');
    const clientEmail = sanitizeSingleLine(body.client_email || '').toLowerCase();
    const projectTitle = sanitizeSingleLine(body.project_title || '');
    const projectDesc = (typeof body.project_description === 'string' ? body.project_description : '').trim();

    const errors = [];

    // Full Name
    if (!clientName || clientName.length < 2) {
      errors.push('Full name is required (minimum 2 characters).');
    } else if (clientName.length > 100) {
      errors.push('Full name exceeds maximum allowed length (100 characters).');
    }

    // Contact Phone
    if (!contactPhone || contactPhone.length < 7) {
      errors.push('A valid contact phone or WhatsApp number is required (minimum 7 characters).');
    } else if (contactPhone.length > 30) {
      errors.push('Phone number exceeds maximum allowed length (30 characters).');
    } else if (!/^[+0-9\s\-().]{7,30}$/.test(contactPhone)) {
      errors.push('Phone number contains invalid characters.');
    }

    // Email Address
    if (!clientEmail || !EMAIL_REGEX.test(clientEmail)) {
      errors.push('A valid email address is required.');
    } else if (clientEmail.length > 100) {
      errors.push('Email address exceeds maximum allowed length (100 characters).');
    }

    // Project Title
    if (!projectTitle || projectTitle.length < 3) {
      errors.push('Project title is required (minimum 3 characters).');
    } else if (projectTitle.length > 200) {
      errors.push('Project title exceeds maximum allowed length (200 characters).');
    }

    // Project Description
    if (!projectDesc || projectDesc.length < 10) {
      errors.push('Project description is required (minimum 10 characters).');
    } else if (projectDesc.length > 4000) {
      errors.push('Project description exceeds maximum allowed length (4000 characters).');
    }

    // Optional Fields
    const company = sanitizeSingleLine(body.company_name || '').slice(0, 100);
    const projectType = sanitizeSingleLine(body.project_type || 'Website Development').slice(0, 100);
    const selectedTier = sanitizeSingleLine(body.selected_tier || 'Standard').slice(0, 100);
    const estimatedCost = sanitizeSingleLine(body.estimated_cost || '₹5,999').slice(0, 50);
    const customisations = sanitizeSingleLine(body.special_customisations || 'None specified').slice(0, 1000);
    const referenceUrl = sanitizeSingleLine(body.reference_website || '').slice(0, 200);
    const existingUrl = sanitizeSingleLine(body.existing_website || '').slice(0, 200);
    const timeline = sanitizeSingleLine(body.desired_timeline || 'Standard (4 - 7 Days)').slice(0, 100);
    const budget = sanitizeSingleLine(body.budget_expectation || estimatedCost).slice(0, 100);

    if (errors.length > 0) {
      return jsonResponse(400, {
        success: false,
        error: 'Validation failed',
        validationErrors: errors
      }, isWebRequest);
    }

    // 7. Duplicate Submission Rate Limiting (In-Memory sliding window per function container)
    cleanupOldSubmissions();
    const cleanPhone = contactPhone.replace(/[^0-9]/g, '');
    const submissionKey = `${clientEmail}_${cleanPhone}_${projectTitle.toLowerCase()}`;
    const now = Date.now();
    const lastSubmission = recentSubmissions.get(submissionKey);

    if (lastSubmission && (now - lastSubmission) < DUPLICATE_WINDOW_MS) {
      const waitSeconds = Math.ceil((DUPLICATE_WINDOW_MS - (now - lastSubmission)) / 1000);
      return jsonResponse(429, {
        success: false,
        error: `A submission with these details was recently received. Please wait ${waitSeconds}s before submitting again.`
      }, isWebRequest);
    }
    recentSubmissions.set(submissionKey, now);

    // 8. Generate Collision-Resistant Reference ID (BBA-YYYY-XXXXX) & Timestamp
    const referenceId = generateReferenceId();
    const submissionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' (IST)';

    // Recipient & Sender Addresses
    const recipientEmail = sanitizeSingleLine(process.env.CONTACT_EMAIL || 'builtbyatharva27@gmail.com');
    const fromAddress = sanitizeSingleLine(process.env.RESEND_FROM_EMAIL || 'BuiltByAtharva Studio <onboarding@resend.dev>');

    // 9. Generate Single-Page A4 Project Enquiry Receipt PDF
    let pdfBuffer;
    try {
      pdfBuffer = await generateReceiptPdf({
        referenceId,
        submissionDate: submissionTime,
        client: {
          name: clientName,
          email: clientEmail,
          phone: contactPhone,
          company: company
        },
        project: {
          title: projectTitle,
          category: projectType,
          tier: selectedTier,
          budget: budget,
          timeline: timeline,
          description: projectDesc,
          customisations: customisations,
          referenceUrl: referenceUrl,
          existingUrl: existingUrl
        },
        branding: {
          websiteUrl: 'https://builtbyatharva.netlify.app/',
          contactEmail: recipientEmail
        }
      });
    } catch (pdfErr) {
      console.error('[PDF_GENERATION_ERROR]', pdfErr);
      return jsonResponse(500, {
        success: false,
        error: 'Failed to generate project enquiry receipt PDF.'
      }, isWebRequest);
    }

    const pdfBase64 = pdfBuffer.toString('base64');
    const pdfFilename = `BuiltByAtharva-Enquiry-${referenceId}.pdf`;

    const emailAttachments = [
      {
        filename: pdfFilename,
        content: pdfBase64
      }
    ];

    // 10. Check Resend Configuration & Send Notifications
    const apiKey = process.env.RESEND_API_KEY;
    const isApiKeyConfigured = apiKey && apiKey !== 'YOUR_RESEND_API_KEY' && apiKey.startsWith('re_');

    let businessEmailSent = false;
    let clientConfirmationSent = false;
    let deliveryNote = '';

    if (!isApiKeyConfigured) {
      console.warn('[CONFIG_WARNING] RESEND_API_KEY is not configured in Netlify environment variables.');
      // Enquiry and PDF receipt are generated and preserved for client download
      return jsonResponse(200, {
        success: true,
        referenceId,
        isConfigError: true,
        message: 'Enquiry recorded and PDF receipt generated! (Email delivery is pending RESEND_API_KEY configuration in Netlify).',
        pdfBase64,
        pdfFilename,
        emailStatus: {
          businessNotification: false,
          clientConfirmation: false
        },
        submissionSummary: {
          referenceId,
          clientName,
          clientEmail,
          projectTitle,
          submissionTime
        }
      }, isWebRequest);
    }

    // 11. Dispatch Business Notification Email to Atharva via Resend
    const resend = new Resend(apiKey);

    const safeName = escapeHtml(clientName);
    const safePhone = escapeHtml(contactPhone);
    const safeEmail = escapeHtml(clientEmail);
    const safeCompany = escapeHtml(company);
    const safeType = escapeHtml(projectType);
    const safeTier = escapeHtml(selectedTier);
    const safeTitle = escapeHtml(projectTitle);
    const safeDesc = escapeHtml(projectDesc).replace(/\n/g, '<br>');
    const safeCustom = escapeHtml(customisations);
    const safeRef = escapeHtml(referenceUrl);
    const safeTimeline = escapeHtml(timeline);
    const safeBudget = escapeHtml(budget);

    const businessEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Project Enquiry — BuiltByAtharva</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 620px; margin: 0 auto; background: #121827; border-radius: 14px; border: 1px solid #1f293d; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1e293b, #0f172a); border-bottom: 2px solid #b8860b; padding: 28px 24px; text-align: left; }
    .header h1 { margin: 0 0 6px 0; font-size: 20px; color: #ffffff; }
    .header p { margin: 0; font-size: 11px; color: #b8860b; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; }
    .content { padding: 26px 24px; }
    .ref-box { background: rgba(184,134,11,0.12); border-left: 4px solid #b8860b; padding: 12px 16px; border-radius: 6px; margin-bottom: 22px; font-size: 13px; color: #fde68a; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 700; margin: 20px 0 8px 0; border-bottom: 1px solid #1e293b; padding-bottom: 5px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 13.5px; }
    td { padding: 7px 0; vertical-align: top; }
    td.label { width: 36%; color: #94a3b8; }
    td.value { width: 64%; color: #f8fafc; font-weight: 600; }
    .desc-box { background: #0b0f19; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; font-size: 13.5px; line-height: 1.6; color: #e2e8f0; margin-top: 4px; }
    .actions { margin-top: 26px; padding-top: 18px; border-top: 1px solid #1e293b; display: flex; flex-wrap: wrap; gap: 10px; }
    .btn { display: inline-block; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; margin-right: 8px; }
    .btn-primary { background: #2563eb; color: #ffffff; }
    .btn-wa { background: #25d366; color: #ffffff; }
    .footer { padding: 18px 24px; background: #07090e; font-size: 11.5px; color: #64748b; text-align: center; border-top: 1px solid #182032; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p>BuiltByAtharva Studio • Reference ${referenceId}</p>
      <h1>New Project Brief Received 🚀</h1>
    </div>

    <div class="content">
      <div class="ref-box">
        <strong>Enquiry Reference:</strong> ${referenceId}<br>
        <strong>Official Receipt PDF:</strong> Attached to this email (${pdfFilename})
      </div>

      <div class="section-title">Client Information</div>
      <table>
        <tr><td class="label">Full Name:</td><td class="value">${safeName}</td></tr>
        <tr><td class="label">Email Address:</td><td class="value"><a href="mailto:${safeEmail}" style="color:#60a5fa; text-decoration:none;">${safeEmail}</a></td></tr>
        <tr><td class="label">Phone / WhatsApp:</td><td class="value">${safePhone}</td></tr>
        ${safeCompany ? `<tr><td class="label">Company / Brand:</td><td class="value">${safeCompany}</td></tr>` : ''}
      </table>

      <div class="section-title">Project Scope</div>
      <table>
        <tr><td class="label">Service Category:</td><td class="value" style="color:#60a5fa;">${safeType}</td></tr>
        <tr><td class="label">Package Tier:</td><td class="value">${safeTier}</td></tr>
        <tr><td class="label">Estimated Budget:</td><td class="value" style="color:#34d399;">${safeBudget}</td></tr>
        <tr><td class="label">Target Timeline:</td><td class="value">${safeTimeline}</td></tr>
        ${safeRef ? `<tr><td class="label">Reference Website:</td><td class="value"><a href="${safeRef}" target="_blank" style="color:#60a5fa;">${safeRef}</a></td></tr>` : ''}
      </table>

      <div class="section-title">Project Title</div>
      <div style="font-size:15px; font-weight:700; color:#f8fafc; margin-bottom:10px;">${safeTitle}</div>

      <div class="section-title">Project Overview & Goals</div>
      <div class="desc-box">${safeDesc}</div>

      ${safeCustom && safeCustom !== 'None specified' ? `
        <div class="section-title">Requested Customizations</div>
        <div class="desc-box">${safeCustom}</div>
      ` : ''}

      <div class="actions">
        <a href="mailto:${safeEmail}?subject=Re:%20BuiltByAtharva%20Project%20Enquiry%20[${referenceId}]%20-%20${encodeURIComponent(projectTitle)}" class="btn btn-primary">Reply via Email</a>
        ${cleanPhone ? `<a href="https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(clientName)},%20Atharva%20here%20from%20BuiltByAtharva%20regarding%20your%20project%20[${referenceId}]:%20${encodeURIComponent(projectTitle)}" class="btn btn-wa" target="_blank">Chat on WhatsApp</a>` : ''}
      </div>
    </div>

    <div class="footer">
      Received: ${submissionTime} • BuiltByAtharva Studio • IDEAS. BUILT.
    </div>
  </div>
</body>
</html>
    `;

    try {
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: [recipientEmail],
        reply_to: clientEmail,
        subject: `[New Project: ${referenceId}] ${projectTitle} — ${clientName}`,
        html: businessEmailHtml,
        attachments: emailAttachments
      });

      if (error) {
        console.error('[RESEND_BUSINESS_EMAIL_ERROR]', error);
        deliveryNote = 'Business email dispatch failed: ' + (error.message || 'Resend API error');
      } else {
        businessEmailSent = true;
      }
    } catch (sendErr) {
      console.error('[RESEND_SEND_EXCEPTION]', sendErr);
      deliveryNote = 'Email service exception: ' + sendErr.message;
    }

    // 12. Dispatch Client Confirmation Email with PDF Attachment
    const isSandboxSender = fromAddress.includes('onboarding@resend.dev');

    if (isSandboxSender) {
      console.info(`[RESEND_NOTE] From address is ${fromAddress} (Resend testing domain). Client receipt email skipped to prevent sandbox bounce. Verified domain in Resend will enable arbitrary recipient delivery.`);
    } else {
      try {
        const clientEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your BuiltByAtharva Project Enquiry Receipt</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="background: #0f172a; padding: 24px 28px; border-bottom: 3px solid #b8860b;">
      <p style="margin: 0; color: #b8860b; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.1em;">BuiltByAtharva Studio • Receipt</p>
      <h1 style="margin: 6px 0 0 0; color: #ffffff; font-size: 20px;">Project Enquiry Received</h1>
    </div>

    <div style="padding: 28px;">
      <p style="font-size: 15px; line-height: 1.6; color: #334155;">
        Dear <strong>${safeName}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #475569;">
        Thank you for submitting your project brief for <strong>${safeTitle}</strong>. Your enquiry has been received and assigned official reference ID:
      </p>

      <div style="background: #f1f5f9; border-left: 4px solid #b8860b; padding: 14px 18px; border-radius: 6px; margin: 20px 0;">
        <span style="font-size: 12px; text-transform: uppercase; color: #64748b; display: block; font-weight: 600;">Enquiry Reference ID</span>
        <strong style="font-size: 18px; color: #0f172a; letter-spacing: 0.05em;">${referenceId}</strong>
      </div>

      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px; font-size: 13.5px; color: #065f46;">
        📎 <strong>Official PDF Receipt Attached:</strong><br>
        Your official 1-page A4 Project Enquiry Receipt (<code>${pdfFilename}</code>) is attached to this email for your records.
      </div>

      <h3 style="font-size: 14px; color: #0f172a; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Next Steps</h3>
      <ol style="font-size: 13.5px; color: #475569; line-height: 1.7; padding-left: 20px; margin: 0 0 20px 0;">
        <li>Atharva will personally review your requirements, scope, and technical objectives.</li>
        <li>We will connect via email (<a href="mailto:${safeEmail}" style="color: #2563eb;">${safeEmail}</a>) or WhatsApp (<a href="tel:${safePhone}" style="color: #2563eb;">${safePhone}</a>) within 24 hours with an itemized scope breakdown.</li>
        <li>Work begins once milestones are agreed upon and initial 50% advance payment is completed.</li>
      </ol>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 24px;">
        If you have questions or want to fast-track your consultation, feel free to reply directly to this email or connect on WhatsApp at <a href="https://wa.me/918626074035" style="color: #2563eb;">+91 86260 74035</a>.
      </p>
    </div>

    <div style="background: #f8fafc; padding: 16px 28px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
      BuiltByAtharva Studio • <a href="https://builtbyatharva.netlify.app/" style="color: #64748b; text-decoration: none;">builtbyatharva.netlify.app</a><br>
      Founder: Atharva Mirzapure • IDEAS. BUILT.
    </div>
  </div>
</body>
</html>
        `;

        const { error: clientErr } = await resend.emails.send({
          from: fromAddress,
          to: [clientEmail],
          reply_to: recipientEmail,
          subject: `Your BuiltByAtharva Project Enquiry Receipt [${referenceId}]`,
          html: clientEmailHtml,
          attachments: emailAttachments
        });

        if (!clientErr) {
          clientConfirmationSent = true;
        } else {
          console.warn('[CLIENT_CONFIRMATION_NOTE]', clientErr.message);
        }
      } catch (clientEx) {
        console.warn('[CLIENT_CONFIRMATION_EX]', clientEx.message);
      }
    }

    // 13. Return Success Response with Generated PDF and Reference ID
    return jsonResponse(200, {
      success: true,
      referenceId,
      message: 'Project enquiry received successfully! Your official receipt is ready.',
      pdfBase64,
      pdfFilename,
      emailStatus: {
        businessNotification: businessEmailSent,
        clientConfirmation: clientConfirmationSent,
        note: deliveryNote || undefined
      },
      submissionSummary: {
        referenceId,
        clientName,
        clientEmail,
        projectTitle,
        submissionTime
      }
    }, isWebRequest);

  } catch (err) {
    console.error('[UNHANDLED_SERVER_ERROR]', err);
    return jsonResponse(500, {
      success: false,
      error: 'An internal server error occurred while processing your request.'
    }, isWebRequest);
  }
}

export default handler;
