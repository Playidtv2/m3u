// server.js
// Simple proxy to forward media requests and add CORS headers.
// For production, add validation, whitelisting, auth, and rate limiting.
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Basic proxy endpoint: /proxy?url=<encoded_url>
app.get('/proxy', async (req, res) => {
  const target = req.query.url;
  if(!target) {
    return res.status(400).send('Missing url param');
  }

  // OPTIONAL: whitelist check (uncomment and set allowed domains)
  // const allowed = ['slave01.appball.vip', 'another-trusted-host.com'];
  // try {
  //   const host = new URL(target).hostname;
  //   if(!allowed.includes(host)) return res.status(403).send('Host not allowed');
  // } catch(e) {
  //   return res.status(400).send('Invalid url');
  // }

  try {
    // Forward some headers to mimic a browser
    const forwardedHeaders = {
      'User-Agent': req.get('user-agent') || 'Mozilla/5.0',
      'Accept': req.get('accept') || '*/*',
      'Referer': req.query.referer || '',
    };

    const upstream = await fetch(target, { headers: forwardedHeaders });

    // Copy status and headers
    res.status(upstream.status);
    upstream.headers.forEach((value, name) => {
      // Expose essential headers and keep content-type/range support
      if (['content-type','content-length','accept-ranges','content-range','cache-control'].includes(name)) {
        res.set(name, value);
      }
    });

    // Add CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Range,Accept,Content-Type');
    // Stream body
    upstream.body.pipe(res);
  } catch (err) {
    console.error('Proxy error', err.message);
    res.status(500).send('Proxy error: ' + err.message);
  }
});

// Health endpoint
app.get('/health', (req,res) => res.send('ok'));

app.listen(PORT, () => console.log('Server running on port', PORT));
