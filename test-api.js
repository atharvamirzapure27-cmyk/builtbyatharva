import handler from './api/submit-project.js';

// Test runner for api/submit-project.js
async function runTests() {
  console.log('--- Testing BuiltByAtharva Serverless API ---');

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

  // Test 1: Method rejection (GET)
  const req1 = { method: 'GET' };
  const res1 = createMockRes();
  await handler(req1, res1);
  console.log('Test 1 (GET method rejection):', res1.statusCode === 405 ? 'PASSED' : 'FAILED', res1.body);

  // Test 2: Validation rejection (empty body)
  const req2 = { method: 'POST', body: {} };
  const res2 = createMockRes();
  await handler(req2, res2);
  console.log('Test 2 (Empty body validation):', res2.statusCode === 400 ? 'PASSED' : 'FAILED', res2.body);

  // Test 3: Honeypot spam protection
  const req3 = {
    method: 'POST',
    body: {
      client_name: 'Spam Bot',
      contact_phone: '+919999999999',
      client_email: 'bot@spam.com',
      project_title: 'Spam Title',
      project_description: 'Spam message text content here...',
      website_hp: 'http://spam-link.com'
    }
  };
  const res3 = createMockRes();
  await handler(req3, res3);
  console.log('Test 3 (Honeypot spam blocked):', res3.statusCode === 400 ? 'PASSED' : 'FAILED', res3.body);

  // Test 4: Missing RESEND_API_KEY handling
  const req4 = {
    method: 'POST',
    body: {
      client_name: 'Atharva Mirzapure',
      contact_phone: '+91 8626074035',
      client_email: 'client@example.com',
      project_title: 'Full Stack Web App',
      project_description: 'Developing a modern web platform with Three.js and custom UI.'
    }
  };
  const res4 = createMockRes();
  await handler(req4, res4);
  console.log('Test 4 (Missing API key status):', (res4.statusCode === 503 && res4.body.isConfigError) ? 'PASSED (Proper configuration warning returned)' : 'FAILED', res4.body);

  console.log('--- All Serverless Function Unit Tests Completed ---');
}

runTests().catch(console.error);
