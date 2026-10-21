import { handler as netlifyHandler } from './netlify/functions/submit-project.js';
import vercelAdapterHandler from './api/submit-project.js';

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
  console.log('====================================================');
  console.log(' BuiltByAtharva — Netlify Function & Resend Test Suite');
  console.log('====================================================\n');

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

  // TEST 4: Reject invalid email address
  {
    const event = createNetlifyEvent({
      method: 'POST',
      body: {
        client_name: 'Jane Doe',
        contact_phone: '+91 9876543210',
        client_email: 'not-an-email',
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

  // TEST 5: Reject invalid phone number
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

  // TEST 8: Missing RESEND_API_KEY environment variable handling
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
      res.statusCode === 503 && body.isConfigError === true,
      'Test 8: Missing RESEND_API_KEY returns safe 503 configuration notice',
      body
    );

    // Restore original key if any
    if (originalKey) process.env.RESEND_API_KEY = originalKey;
  }

  // TEST 9: Rapid duplicate submission rate-limiting (429)
  {
    // Temporarily mock RESEND_API_KEY to test post-validation logic
    process.env.RESEND_API_KEY = 're_test_mock_key_12345';

    const testPayload = {
      client_name: 'Repeated Submitter',
      contact_phone: '+91 9123456780',
      client_email: 'repeat@example.com',
      project_title: 'Duplicate Project Brief',
      project_description: 'Detailed description of the upcoming corporate website.'
    };

    const event1 = createNetlifyEvent({ method: 'POST', body: testPayload });
    // First call (will attempt Resend or fail on mock key, but will record timestamp)
    await netlifyHandler(event1, {});

    // Second immediate call with identical details
    const event2 = createNetlifyEvent({ method: 'POST', body: testPayload });
    const res2 = await netlifyHandler(event2, {});
    const body2 = JSON.parse(res2.body);

    assert(
      res2.statusCode === 429 && body2.error?.includes('recently received'),
      'Test 9: Immediate duplicate submission rate-limited (429 Too Many Requests)',
      body2
    );

    delete process.env.RESEND_API_KEY;
  }

  // TEST 10: Backward-compatible Vercel adapter (api/submit-project.js)
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

    // Should return 503 because RESEND_API_KEY is not set, matching Netlify handler behavior
    assert(
      res.statusCode === 503 && res.body?.isConfigError === true,
      'Test 10: Backward compatible api/submit-project.js delegates correctly',
      res.body
    );
  }

  console.log('\n====================================================');
  console.log(` Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test runner encountered an error:', err);
  process.exit(1);
});
