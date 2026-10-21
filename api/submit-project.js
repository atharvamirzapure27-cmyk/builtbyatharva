import { handler as netlifyHandler } from '../netlify/functions/submit-project.js';

/**
 * BuiltByAtharva — Backward Compatible API Adapter for Vercel / Node dev-server
 * Bridges incoming (req, res) to the canonical Netlify serverless function in netlify/functions/submit-project.js.
 */
export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      return res.status(200).end();
    }
    res.statusCode = 200;
    return res.end();
  }

  // Convert (req, res) into a Netlify Function event
  const rawBody = typeof req.body === 'object' && req.body !== null
    ? JSON.stringify(req.body)
    : (req.body || '');

  const event = {
    httpMethod: req.method || 'POST',
    headers: req.headers || {},
    body: rawBody,
    path: req.url || '/api/submit-project'
  };

  try {
    const result = await netlifyHandler(event, {});

    if (typeof res.status === 'function') {
      res.status(result.statusCode);
    } else {
      res.statusCode = result.statusCode;
    }

    for (const [key, value] of Object.entries(result.headers || {})) {
      res.setHeader(key, value);
    }

    if (typeof res.json === 'function' && typeof result.body === 'string') {
      try {
        return res.json(JSON.parse(result.body));
      } catch {
        return res.end(result.body);
      }
    }

    return res.end(result.body);
  } catch (err) {
    console.error('[API_ADAPTER_ERROR]', err);
    if (!res.headersSent) {
      if (typeof res.status === 'function') {
        res.status(500);
      } else {
        res.statusCode = 500;
      }
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({
        success: false,
        error: 'An internal server error occurred while processing your request.'
      }));
    }
  }
}
