import { Resend } from 'resend';

/**
 * BuiltByAtharva — Netlify Serverless Function
 * Handles client project enquiry submissions and delivers notifications via Resend.
 *
 * Environment Variables (configured in Netlify Site Configuration > Environment Variables):
 *   - RESEND_API_KEY (Required): Resend API key (starts with 're_')
 *   - CONTACT_EMAIL (Optional): Business recipient email (defaults to builtbyatharva27@gmail.com)
 *   - RESEND_FROM_EMAIL (Optional): Verified sender email (defaults to 'BuiltByAtharva Studio <onboarding@resend.dev>')
 *   - RESEND_CLIENT_CONFIRMATION (Optional): Set to 'true' to send auto-reply to client (requires verified domain)
 */

// In-memory rate limiting / duplicate submission prevention
// (Tracks recent submissions by contact hash for 45 seconds)
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

// HTML escape helper to prevent XSS and HTML injection in emails
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
    // Hidden in frontend; if filled out, it's an automated bot
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

    // Name validation
    if (!clientName || clientName.length < 2) {
      errors.push('Full name is required (minimum 2 characters).');
    } else if (clientName.length > 100) {
      errors.push('Full name exceeds maximum allowed length (100 characters).');
    }

    // Contact phone validation
    if (!contactPhone || contactPhone.length < 7) {
      errors.push('A valid contact phone or WhatsApp number is required (minimum 7 characters).');
    } else if (contactPhone.length > 30) {
      errors.push('Phone number exceeds maximum allowed length (30 characters).');
    } else if (!/^[+0-9\s\-().]{7,30}$/.test(contactPhone)) {
      errors.push('Phone number contains invalid characters.');
    }

    // Email validation
    if (!clientEmail || !EMAIL_REGEX.test(clientEmail)) {
      errors.push('A valid email address is required.');
    } else if (clientEmail.length > 100) {
      errors.push('Email address exceeds maximum allowed length (100 characters).');
    }

    // Project title validation
    if (!projectTitle || projectTitle.length < 3) {
      errors.push('Project title is required (minimum 3 characters).');
    } else if (projectTitle.length > 200) {
      errors.push('Project title exceeds maximum allowed length (200 characters).');
    }

    // Project description validation
    if (!projectDesc || projectDesc.length < 10) {
      errors.push('Project description is required (minimum 10 characters).');
    } else if (projectDesc.length > 4000) {
      errors.push('Project description exceeds maximum allowed length (4000 characters).');
    }

    // Optional field size checks
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

    // 7. Duplicate submission rate limiting (In-Memory per function container)
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

    // 8. Verify Resend API Key Configuration
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 'YOUR_RESEND_API_KEY' || !apiKey.startsWith('re_')) {
      console.warn('[CONFIG_WARNING] RESEND_API_KEY is not configured or invalid in Netlify environment variables.');
      return jsonResponse(503, {
        success: false,
        isConfigError: true,
        error: 'Email delivery service is pending configuration. Please set RESEND_API_KEY in your Netlify Site Configuration > Environment Variables.',
        details: {
          recipientNotice: 'Enquiry notification is ready for dispatch once RESEND_API_KEY is saved in Netlify.',
          setupGuide: 'Sign up at resend.com, create an API key (re_...), and add RESEND_API_KEY in Netlify settings.'
        }
      }, isWebRequest);
    }

    // 9. Configure Sender and Recipient
    // Recipient defaults to Atharva's business email, configurable via CONTACT_EMAIL
    const recipientEmail = sanitizeSingleLine(process.env.CONTACT_EMAIL || 'builtbyatharva27@gmail.com');

    // Sender address: defaults to Resend testing sender; production should use a verified custom domain
    const fromAddress = sanitizeSingleLine(process.env.RESEND_FROM_EMAIL || 'BuiltByAtharva Studio <onboarding@resend.dev>');

    // 10. Prepare Sanitized Content for HTML Email
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
    const safeExisting = escapeHtml(existingUrl);
    const safeTimeline = escapeHtml(timeline);
    const safeBudget = escapeHtml(budget);
    const submissionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Build the responsive, styled email notification for Atharva
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project Request — BuiltByAtharva</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 620px; margin: 0 auto; background: #121827; border-radius: 14px; border: 1px solid #1f293d; overflow: hidden; }
    .header { background: linear-gradient(135deg, #2563eb, #8b5cf6); padding: 28px 24px; text-align: left; }
    .header h1 { margin: 0 0 6px 0; font-size: 22px; color: #ffffff; letter-spacing: -0.02em; }
    .header p { margin: 0; font-size: 12px; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
    .content { padding: 28px 24px; }
    .alert-banner { background: rgba(37,99,235,0.12); border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px; font-size: 13px; color: #93c5fd; line-height: 1.5; }
    .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 700; margin: 20px 0 10px 0; border-bottom: 1px solid #1e293b; padding-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 14px; }
    td { padding: 8px 0; vertical-align: top; }
    td.label { width: 36%; color: #94a3b8; font-weight: 500; }
    td.value { width: 64%; color: #f8fafc; font-weight: 600; }
    .desc-box { background: #0b0f19; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #e2e8f0; margin-top: 6px; }
    .actions { margin-top: 28px; padding-top: 20px; border-top: 1px solid #1e293b; display: flex; flex-wrap: wrap; gap: 12px; }
    .btn { display: inline-block; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; margin-right: 10px; margin-bottom: 8px; }
    .btn-primary { background: #2563eb; color: #ffffff; }
    .btn-wa { background: #25d366; color: #ffffff; }
    .footer { padding: 20px 24px; background: #07090e; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #182032; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p>BuiltByAtharva Studio Engine • Netlify + Resend</p>
      <h1>New Project Brief Received 🚀</h1>
    </div>

    <div class="content">
      <div class="alert-banner">
        <strong>Direct Client Submission:</strong> Atharva, review the brief below and connect within 24 hours. (Note: 50% advance payment is required before development begins once scope is agreed).
      </div>

      <div class="section-title">Client Information</div>
      <table>
        <tr>
          <td class="label">Full Name:</td>
          <td class="value">${safeName}</td>
        </tr>
        <tr>
          <td class="label">Email Address:</td>
          <td class="value"><a href="mailto:${safeEmail}" style="color:#60a5fa; text-decoration:none;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td class="label">Phone / WhatsApp:</td>
          <td class="value">${safePhone}</td>
        </tr>
        ${safeCompany ? `<tr><td class="label">Company / Brand:</td><td class="value">${safeCompany}</td></tr>` : ''}
      </table>

      <div class="section-title">Project Scope & Terms</div>
      <table>
        <tr>
          <td class="label">Service Category:</td>
          <td class="value" style="color:#60a5fa;">${safeType}</td>
        </tr>
        <tr>
          <td class="label">Package / Base Tier:</td>
          <td class="value">${safeTier}</td>
        </tr>
        <tr>
          <td class="label">Budget Expectation:</td>
          <td class="value" style="color:#34d399;">${safeBudget}</td>
        </tr>
        <tr>
          <td class="label">Desired Timeline:</td>
          <td class="value">${safeTimeline}</td>
        </tr>
        ${safeExisting ? `<tr><td class="label">Existing Website:</td><td class="value"><a href="${safeExisting}" target="_blank" style="color:#60a5fa;">${safeExisting}</a></td></tr>` : ''}
        ${safeRef ? `<tr><td class="label">Reference Website:</td><td class="value"><a href="${safeRef}" target="_blank" style="color:#60a5fa;">${safeRef}</a></td></tr>` : ''}
      </table>

      <div class="section-title">Project Title</div>
      <div style="font-size:16px; font-weight:700; color:#f8fafc; margin-bottom:12px;">${safeTitle}</div>

      <div class="section-title">Project Overview & Goals</div>
      <div class="desc-box">${safeDesc}</div>

      ${safeCustom && safeCustom !== 'None specified' ? `
        <div class="section-title">Requested Customizations / Features</div>
        <div class="desc-box">${safeCustom}</div>
      ` : ''}

      <div class="actions">
        <a href="mailto:${safeEmail}?subject=Re:%20BuiltByAtharva%20Project%20Inquiry%20-%20${encodeURIComponent(projectTitle)}" class="btn btn-primary">Reply via Email</a>
        ${cleanPhone ? `<a href="https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(clientName)},%20Atharva%20here%20from%20BuiltByAtharva%20regarding%20your%20project:%20${encodeURIComponent(projectTitle)}" class="btn btn-wa" target="_blank">Chat on WhatsApp</a>` : ''}
      </div>
    </div>

    <div class="footer">
      Received: ${submissionTime} • BuiltByAtharva Studio Engine • IDEAS. BUILT.
    </div>
  </div>
</body>
</html>
    `;

    // 11. Send Email Notification via Resend SDK
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [recipientEmail],
      reply_to: clientEmail,
      subject: `[New Project] ${projectTitle} — ${clientName}`,
      html: emailHtml
    });

    if (error) {
      console.error('[RESEND_ERROR]', error);
      // Return safe error response without exposing internal secrets or raw stack trace
      return jsonResponse(502, {
        success: false,
        error: 'Failed to deliver enquiry notification email through Resend: ' + (error.message || 'Upstream provider error.')
      }, isWebRequest);
    }

    // 12. Optional Client Confirmation Auto-Reply (Only if verified domain is configured)
    let clientConfirmationSent = false;
    const isTestingSender = fromAddress.includes('onboarding@resend.dev');

    if (process.env.RESEND_CLIENT_CONFIRMATION === 'true') {
      if (isTestingSender) {
        // Resend sandbox (onboarding@resend.dev) can only deliver to the account owner email
        console.info('[CONFIRMATION_NOTE] Skipped client auto-reply because sender is onboarding@resend.dev (requires verified domain in Resend).');
      } else {
        try {
          await resend.emails.send({
            from: fromAddress,
            to: [clientEmail],
            subject: `Project Brief Received — BuiltByAtharva (Atharva Mirzapure)`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width:540px; margin:0 auto; padding:24px; color:#1e293b; background:#ffffff; border-radius:12px; border:1px solid #e2e8f0;">
                <h2 style="color:#2563eb; margin:0 0 12px 0;">Thank You, ${safeName}!</h2>
                <p style="font-size:15px; line-height:1.6; color:#334155;">
                  Your project brief for <strong>${safeTitle}</strong> has been received by <strong>Atharva Mirzapure</strong> at BuiltByAtharva Studio.
                </p>
                <p style="font-size:14px; line-height:1.6; color:#475569;">
                  I will review your requirements and reach out via email (<a href="mailto:${safeEmail}" style="color:#2563eb;">${safeEmail}</a>) or WhatsApp (<a href="tel:${safePhone}" style="color:#2563eb;">${safePhone}</a>) within 24 hours with an initial scope breakdown and confirmed quotation.
                </p>
                <div style="background:#f8fafc; border-left:4px solid #2563eb; padding:12px 16px; border-radius:6px; margin:20px 0; font-size:13px; color:#475569;">
                  <strong>Payment Terms:</strong> 50% advance payment is required before development begins once the project scope and timeline are agreed upon. Payment details and UPI QR code will be shared personally.
                </div>
                <hr style="border:none; border-top:1px solid #e2e8f0; margin:24px 0 16px 0;">
                <p style="font-size:12px; color:#94a3b8; margin:0;">
                  BuiltByAtharva Studio • IDEAS. BUILT.<br>
                  Founder & Creative Technologist: Atharva Mirzapure<br>
                  WhatsApp: +91 8626074035 • Email: builtbyatharva27@gmail.com
                </p>
              </div>
            `
          });
          clientConfirmationSent = true;
        } catch (clientErr) {
          console.warn('[CLIENT_CONFIRMATION_WARNING]', clientErr.message);
        }
      }
    }

    // 13. Successful Response
    return jsonResponse(200, {
      success: true,
      message: 'Project brief submitted successfully! Notification has been dispatched.',
      emailId: data?.id,
      clientConfirmationSent
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
