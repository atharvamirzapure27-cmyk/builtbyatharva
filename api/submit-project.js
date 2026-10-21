import { Resend } from 'resend';

/**
 * BuiltByAtharva V6 — Vercel Serverless Function: Project Request Submission & Email Dispatch
 * Recipient: builtbyatharva27@gmail.com
 * Environment Variables required:
 *   - RESEND_API_KEY: Resend API Key (starts with re_)
 *   - RESEND_FROM_EMAIL (Optional): Custom verified sender, defaults to "BuiltByAtharva Studio <onboarding@resend.dev>"
 */

// Helper to escape HTML characters to prevent XSS / HTML injection in email templates
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only POST requests are supported.'
    });
  }

  try {
    // Parse JSON body safely
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Invalid JSON request payload.'
        });
      }
    }
    body = body || {};

    // 1. Anti-Spam Check: Honeypot field
    if (body.website_hp && body.website_hp.trim() !== '') {
      console.warn('[SPAM_BLOCKED] Honeypot triggered.');
      return res.status(400).json({
        success: false,
        error: 'Spam submission detected.'
      });
    }

    // 2. Validate Required Fields
    const clientName = (body.client_name || '').trim();
    const contactPhone = (body.contact_phone || '').trim();
    const clientEmail = (body.client_email || '').trim();
    const projectTitle = (body.project_title || '').trim();
    const projectDesc = (body.project_description || '').trim();

    const errors = [];
    if (!clientName || clientName.length < 2) {
      errors.push('Full name is required (minimum 2 characters).');
    }
    if (!contactPhone || contactPhone.length < 7) {
      errors.push('A valid contact phone or WhatsApp number is required.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clientEmail || !emailRegex.test(clientEmail)) {
      errors.push('A valid email address is required.');
    }
    if (!projectTitle || projectTitle.length < 3) {
      errors.push('Project title is required.');
    }
    if (!projectDesc || projectDesc.length < 10) {
      errors.push('Project description is required (minimum 10 characters).');
    }

    // Size limits
    if (clientName.length > 100) errors.push('Name exceeds maximum allowed length.');
    if (projectTitle.length > 200) errors.push('Title exceeds maximum allowed length.');
    if (projectDesc.length > 4000) errors.push('Description exceeds maximum allowed length.');

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        validationErrors: errors
      });
    }

    // 3. Extract Optional Metadata
    const company = (body.company_name || '').trim();
    const projectType = (body.project_type || 'Website Development').trim();
    const selectedTier = (body.selected_tier || 'Standard').trim();
    const estimatedCost = (body.estimated_cost || '₹5,999').trim();
    const customisations = (body.special_customisations || 'None specified').trim();
    const referenceUrl = (body.reference_website || '').trim();
    const timeline = (body.desired_timeline || 'Standard (4 - 7 Days)').trim();
    const budget = (body.budget_expectation || estimatedCost).trim();

    // Sanitized values for HTML email
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
    const submissionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 4. Verify Resend API Key
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 'YOUR_RESEND_API_KEY') {
      console.warn('[CONFIG_WARNING] RESEND_API_KEY is not configured in Vercel environment variables.');
      return res.status(503).json({
        success: false,
        isConfigError: true,
        error: 'Email delivery service is pending configuration. Please set RESEND_API_KEY in your Vercel Project Settings > Environment Variables.',
        details: {
          recipient: 'builtbyatharva27@gmail.com',
          setupGuide: 'Sign up at resend.com, generate an API key, and add RESEND_API_KEY in Vercel settings.'
        }
      });
    }

    // 5. Initialize Resend & Send Notification to Atharva
    const resend = new Resend(apiKey);
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'BuiltByAtharva Studio <onboarding@resend.dev>';
    const recipientEmail = 'builtbyatharva27@gmail.com';

    // WhatsApp clean number for one-click chat link
    const cleanPhone = contactPhone.replace(/[^0-9]/g, '');

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Project Request — BuiltByAtharva</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 620px; margin: 0 auto; background: #121827; border-radius: 14px; border: 1px solid #1f293d; overflow: hidden; }
    .header { background: linear-gradient(135deg, #2563eb, #8b5cf6); padding: 28px 24px; text-align: left; }
    .header h1 { margin: 0 0 6px 0; font-size: 24px; color: #ffffff; letter-spacing: -0.02em; }
    .header p { margin: 0; font-size: 13px; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
    .content { padding: 28px 24px; }
    .alert-banner { background: rgba(37,99,235,0.12); border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px; font-size: 13px; color: #93c5fd; }
    .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 700; margin: 20px 0 10px 0; border-bottom: 1px solid #1e293b; padding-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 14px; }
    td { padding: 8px 0; vertical-align: top; }
    td.label { width: 34%; color: #94a3b8; font-weight: 500; }
    td.value { width: 66%; color: #f8fafc; font-weight: 600; }
    .desc-box { background: #0b0f19; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #e2e8f0; margin-top: 6px; }
    .actions { margin-top: 28px; padding-top: 20px; border-top: 1px solid #1e293b; display: flex; gap: 12px; }
    .btn { display: inline-block; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; margin-right: 10px; }
    .btn-primary { background: #2563eb; color: #ffffff; }
    .btn-wa { background: #25d366; color: #ffffff; }
    .footer { padding: 20px 24px; background: #07090e; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #182032; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p>BuiltByAtharva V6 • Studio Engine</p>
      <h1>New Project Brief Received 🚀</h1>
    </div>

    <div class="content">
      <div class="alert-banner">
        <strong>Direct Client Submission:</strong> Atharva, review the brief below and connect within 24 hours. Remember that 50% advance payment is required before development begins.
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

      <div class="section-title">Project Scope & Scope</div>
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
          <td class="label">Estimated Budget:</td>
          <td class="value" style="color:#34d399;">${safeBudget}</td>
        </tr>
        <tr>
          <td class="label">Timeline Target:</td>
          <td class="value">${safeTimeline}</td>
        </tr>
        ${safeRef ? `<tr><td class="label">Reference URL:</td><td class="value"><a href="${safeRef}" target="_blank" style="color:#60a5fa;">${safeRef}</a></td></tr>` : ''}
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

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [recipientEmail],
      reply_to: clientEmail,
      subject: `[New Project] ${projectTitle} — ${clientName}`,
      html: emailHtml
    });

    if (error) {
      console.error('[RESEND_ERROR]', error);
      return res.status(502).json({
        success: false,
        error: 'Failed to deliver email through Resend: ' + (error.message || JSON.stringify(error))
      });
    }

    // Optional: Send Client Confirmation if enabled and sender is a verified domain
    let clientConfirmationSent = false;
    if (process.env.RESEND_CLIENT_CONFIRMATION === 'true') {
      try {
        await resend.emails.send({
          from: fromAddress,
          to: [clientEmail],
          subject: `Project Brief Received — BuiltByAtharva (Atharva Mirzapure)`,
          html: `
            <div style="font-family:sans-serif; max-width:540px; margin:0 auto; padding:20px; color:#1e293b;">
              <h2 style="color:#2563eb; margin-bottom:8px;">Thank You, ${safeName}!</h2>
              <p>Your project brief for <strong>${safeTitle}</strong> has been received by Atharva Mirzapure.</p>
              <p>I will personally review your requirements and reach out via email or WhatsApp within 24 hours with a scope breakdown and confirmed quotation.</p>
              <div style="background:#f1f5f9; padding:14px; border-radius:8px; margin:20px 0; font-size:14px;">
                <strong>Payment Terms Notice:</strong> 50% advance payment is required before development begins once scope is agreed upon. Payment details and UPI QR code will be shared personally.
              </div>
              <p style="font-size:13px; color:#64748b;">BuiltByAtharva — IDEAS. BUILT.<br>Founder: Atharva Mirzapure</p>
            </div>
          `
        });
        clientConfirmationSent = true;
      } catch (clientErr) {
        // Not fatal (sandbox domains can only send to account owner)
        console.warn('[CLIENT_CONFIRMATION_NOTE]', clientErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Project brief submitted successfully! Atharva has received your email notification.',
      emailId: data?.id,
      clientConfirmationSent
    });

  } catch (err) {
    console.error('[SERVER_ERROR]', err);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your request.',
      details: err.message
    });
  }
}
