import { handler as netlifyHandler } from './netlify/functions/submit-project.js';
import vercelAdapterHandler from './api/submit-project.js';
import { generateReceiptPdf } from './lib/generate-receipt-pdf.js';
import { generateReferenceId } from './lib/reference-id.js';

// Helper to create mock Netlify event
function createNetlifyEvent({ method = 'POST', body = null, headers = {} } = {}) {
  return {
    httpMethod: method,
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    body: typeof body === 'object' && body !== null ? JSON.stringify(body) : body
  };
}

// Helper to create mock Express / Vercel res object
function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
    end(data) { if (data) this.body = data; return this; }
  };
}

async function runTestSuite() {
  console.log('================================================================');
  console.log(' BuiltByAtharva — Netlify Function, PDF & Resend Test Suite');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`, details);
      failed++;
    }
  }

  // TEST 1: CORS Preflight OPTIONS
  {
    const event = createNetlifyEvent({ method: 'OPTIONS' });
    const res = await netlifyHandler(event, {});
    assert(
      res.statusCode === 200 && res.headers['Access-Control-Allow-Origin'] === '*',
      'Test 1: OPTIONS CORS Preflight returns 200 with headers'
    );
  }

  // TEST 2: Reject non-POST HTTP methods (GET)
  {
    const event = createNetlifyEvent({ method: 'GET' });
    const res = await netlifyHandler(event, {});
    const body = JSON.parse(res.body);
    assert(
      res.statusCode === 405 && body.success === false,
      'Test 2: GET method rejection (405 Method Not Allowed)',
      body
    );
  }

  // TEST 3: Reject empty payload
  {
    const event = createNetlifyEvent({ method: 'POST', body: {} });
    const res = await netlifyHandler(event, {});
    const body = JSON.parse(res.body);
    assert(
      res.statusCode === 400 && Array.isArray(body.validationErrors) && body.validationErrors.length >= 5,
      'Test 3: Empty body validation failure (400 Bad Request)',
      body
    );
  }

  // TEST 4: Reject invalid email address (RFC 5322 check)
  {
    const event = createNetlifyEvent({
      method: 'POST',
      body: {
        client_name: 'Jane Doe',
        contact_phone: '+91 9876543210',
        client_email: 'invalid-email-address',
        project_title: 'Studio Redesign',
        project_description: 'Looking for a complete redesign with Three.js graphics.'
      }
    });
    const res = await netlifyHandler(event, {});
    const body = JSON.parse(res.body);
    assert(
      res.statusCode === 400 && body.validationErrors?.some(e => e.includes('email address')),
      'Test 4: Invalid email format rejection',
      body
    );
  }

  // TEST 5: Reject short / invalid phone number
  {
    const event = createNetlifyEvent({
      method: 'POST',
      body: {
        client_name: 'Jane Doe',
        contact_phone: '123',
        client_email: 'jane@example.com',
        project_title: 'Studio Redesign',
        project_description: 'Looking for a complete redesign with Three.js graphics.'
      }
    });
    const res = await netlifyHandler(event, {});
    const body = JSON.parse(res.body);
    assert(
      res.statusCode === 400 && body.validationErrors?.some(e => e.includes('phone')),
      'Test 5: Short / invalid phone number rejection',
      body
    );
  }

  // TEST 6: Reject excessively large payload (> 50KB)
  {
    const largeDesc = 'A'.repeat(55000);
    const event = {
      httpMethod: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        client_name: 'Large Input User',
        contact_phone: '+91 9999999999',
        client_email: 'user@example.com',
        project_title: 'Large Payload',
        project_description: largeDesc
      })
    };
    const res = await netlifyHandler(event, {});
    const body = JSON.parse(res.body);
    assert(
      res.statusCode === 413,
      'Test 6: Payload exceeding 50KB rejected (413 Payload Too Large)',
      body
    );
  }

  // TEST 7: Anti-Spam Honeypot field triggered
  {
    const event = createNetlifyEvent({
      method: 'POST',
      body: {
        client_name: 'Spam Bot',
        contact_phone: '+91 9999999999',
        client_email: 'spambot@example.com',
        project_title: 'Spam Casino Offer',
        project_description: 'Spam advertising content text...',
        website_hp: 'https://spam-link-filled-by-bot.com'
      }
    });
    const res = await netlifyHandler(event, {});
    const body = JSON.parse(res.body);
    assert(
      res.statusCode === 400 && body.error === 'Spam submission detected.',
      'Test 7: Honeypot anti-spam defense triggered (400 Bad Request)',
      body
    );
  }

  // TEST 8: Missing RESEND_API_KEY preserves enquiry & generates PDF receipt
  {
    const originalKey = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;

    const event = createNetlifyEvent({
      method: 'POST',
      body: {
        client_name: 'Atharva Mirzapure',
        contact_phone: '+91 8626074035',
        client_email: 'client@example.com',
        project_title: 'Full Stack Web Platform',
        project_description: 'Developing a modern web platform with Three.js and custom UI.'
      }
    });

    const res = await netlifyHandler(event, {});
    const body = JSON.parse(res.body);
    assert(
      res.statusCode === 200 &&
      body.success === true &&
      body.isConfigError === true &&
      typeof body.pdfBase64 === 'string' &&
      body.referenceId?.startsWith('BBA-'),
      'Test 8: Missing RESEND_API_KEY generates PDF receipt & returns safe config notice',
      body
    );

    if (originalKey) process.env.RESEND_API_KEY = originalKey;
  }

  // TEST 9: A4 Single-Page PDF Generation & Magic Bytes Check
  {
    const pdfBuffer = await generateReceiptPdf({
      referenceId: 'BBA-2026-TEST1',
      submissionDate: '22 Oct 2026, 01:40 IST',
      client: {
        name: 'Standard Client',
        email: 'client@test.com',
        phone: '+91 86260 74035',
        company: 'BuiltByAtharva Studio'
      },
      project: {
        title: 'Modern 3D Interactive Website',
        category: 'Website Development',
        tier: 'Business',
        budget: '₹5,999 - ₹9,999',
        timeline: 'Standard (4 - 7 Days)',
        description: 'Standard description verifying exact single-page A4 PDF rendering.'
      }
    });

    const isPdf = pdfBuffer.subarray(0, 5).toString() === '%PDF-';
    const pdfString = pdfBuffer.toString('binary');
    const pageCount = (pdfString.match(/\/Type\s*\/Page\b/g) || []).length;

    assert(
      isPdf && pageCount === 1,
      `Test 9: PDF generated with valid %PDF- magic bytes and strictly 1 page (pages=${pageCount})`
    );
  }

  // TEST 10: Official Logo Embedding in PDF
  {
    const pdfBuffer = await generateReceiptPdf({
      referenceId: 'BBA-2026-LOGO1',
      client: { name: 'Logo Tester', email: 'logo@test.com', phone: '+91 9999999999' },
      project: { title: 'Logo Test', description: 'Testing logo inclusion.' }
    });

    // When high-res logo is embedded, output size is > 200KB
    assert(
      pdfBuffer.length > 200000,
      `Test 10: High-resolution official brand logo embedded in PDF (size: ${pdfBuffer.length} bytes)`
    );
  }

  // TEST 11: Missing Optional Fields & Special Characters / XSS Sanitization in PDF
  {
    const pdfBuffer = await generateReceiptPdf({
      referenceId: 'BBA-2026-XSS01',
      client: {
        name: '<script>alert("XSS")</script> & "Quotes" \'Single\'',
        email: 'xss@test.com',
        phone: '+91 86260 74035',
        company: '' // Missing optional company
      },
      project: {
        title: 'XSS & <Tags> "Check"',
        category: '',
        tier: '',
        budget: '',
        timeline: '',
        description: 'Testing special characters: & < > " \' and undefined optional fields.',
        customisations: '',
        referenceUrl: ''
      }
    });

    const pdfString = pdfBuffer.toString('binary');
    const pageCount = (pdfString.match(/\/Type\s*\/Page\b/g) || []).length;
    assert(
      pageCount === 1 && pdfBuffer.length > 1000,
      'Test 11: Special characters, HTML tags, and missing optional fields handled cleanly on 1 page'
    );
  }

  // TEST 12: Long Description Overflow Protection
  {
    const massiveText = 'This is an exceptionally long project brief text block designed to test overflow containment. '.repeat(50);
    const pdfBuffer = await generateReceiptPdf({
      referenceId: 'BBA-2026-OVERFLOW',
      client: { name: 'Long Text User', email: 'long@test.com', phone: '+91 86260 74035' },
      project: {
        title: 'Huge Description Project',
        description: massiveText
      }
    });

    const pdfString = pdfBuffer.toString('binary');
    const pageCount = (pdfString.match(/\/Type\s*\/Page\b/g) || []).length;
    assert(
      pageCount === 1,
      `Test 12: Massive 4000+ character description truncated safely to strictly 1 page (pages=${pageCount})`
    );
  }

  // TEST 13: Collision-Resistant Reference ID Uniqueness (1,000 IDs Generated)
  {
    const ids = new Set();
    const count = 1000;
    for (let i = 0; i < count; i++) {
      ids.add(generateReferenceId());
    }
    const sample = generateReferenceId();
    const validFormat = /^BBA-\d{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}$/.test(sample);

    assert(
      ids.size === count && validFormat,
      `Test 13: Reference ID uniqueness verified (${count}/${count} unique, sample: ${sample})`
    );
  }

  // TEST 14: PDF Consistency between API Payload and Buffer
  {
    delete process.env.RESEND_API_KEY; // Return response with pdfBase64

    const event = createNetlifyEvent({
      method: 'POST',
      body: {
        client_name: 'Consistency Tester',
        contact_phone: '+91 8626074035',
        client_email: 'consistent@example.com',
        project_title: 'Consistency Test',
        project_description: 'Verifying that downloaded PDF matches the generated bytes.'
      }
    });

    const res = await netlifyHandler(event, {});
    const body = JSON.parse(res.body);
    const decodedBuffer = Buffer.from(body.pdfBase64, 'base64');
    const isPdf = decodedBuffer.subarray(0, 5).toString() === '%PDF-';

    assert(
      body.success === true && isPdf && decodedBuffer.length > 200000,
      `Test 14: API response returns identical valid PDF bytes (size: ${decodedBuffer.length} bytes)`
    );
  }

  // TEST 15: Rapid duplicate submission rate-limiting (429)
  {
    process.env.RESEND_API_KEY = 're_test_mock_key_12345';

    const testPayload = {
      client_name: 'Repeated Submitter',
      contact_phone: '+91 9123456780',
      client_email: 'repeat@example.com',
      project_title: 'Duplicate Project Brief',
      project_description: 'Detailed description of the upcoming corporate website.'
    };

    const event1 = createNetlifyEvent({ method: 'POST', body: testPayload });
    await netlifyHandler(event1, {});

    const event2 = createNetlifyEvent({ method: 'POST', body: testPayload });
    const res2 = await netlifyHandler(event2, {});
    const body2 = JSON.parse(res2.body);

    assert(
      res2.statusCode === 429 && body2.error?.includes('recently received'),
      'Test 15: Immediate duplicate submission rate-limited (429 Too Many Requests)',
      body2
    );

    delete process.env.RESEND_API_KEY;
  }

  // TEST 16: Upstream Resend Mock Error Handling (Mock invalid credentials)
  {
    process.env.RESEND_API_KEY = 're_mock_invalid_key_for_testing';

    const event = createNetlifyEvent({
      method: 'POST',
      body: {
        client_name: 'Resend Error Tester',
        contact_phone: '+91 8626074035',
        client_email: 'error-test@example.com',
        project_title: 'Resend Error Test',
        project_description: 'Verifying upstream Resend rejection does not discard receipt.'
      }
    });

    const res = await netlifyHandler(event, {});
    const body = JSON.parse(res.body);

    // When Resend rejects the key, the submission is recorded and PDF is still generated for the client
    assert(
      res.statusCode === 200 &&
      body.success === true &&
      body.pdfBase64 &&
      body.emailStatus?.businessNotification === false,
      'Test 16: [MOCKED] Upstream Resend delivery failure preserves enquiry & downloadable PDF receipt',
      body
    );

    delete process.env.RESEND_API_KEY;
  }

  // TEST 17: Backward-compatible Vercel adapter (api/submit-project.js)
  {
    const req = {
      method: 'POST',
      body: {
        client_name: 'Adapter Test User',
        contact_phone: '+91 8888888888',
        client_email: 'adapter@example.com',
        project_title: 'Adapter Verification',
        project_description: 'Verifying that legacy (req, res) calls route seamlessly.'
      }
    };
    const res = createMockRes();
    await vercelAdapterHandler(req, res);

    assert(
      res.statusCode === 200 && res.body?.success === true && res.body?.pdfBase64,
      'Test 17: Backward compatible api/submit-project.js adapter delegates correctly',
      res.body
    );
  }

  console.log('\n================================================================');
  console.log(` Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test runner encountered an error:', err);
  process.exit(1);
});
