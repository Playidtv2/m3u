Proxy + HLS Player (Node + Express)
===================================
Contents
- server.js        : Node Express proxy server
- package.json     : npm metadata
- public/          : static files (index.html, player.js, style.css)

Quick start
1. Install dependencies:
   npm install
2. Start server:
   npm start
3. Open in browser (default):
   http://localhost:3000/

How it works
- The frontend (public/index.html) lets you paste an .m3u8 URL or fetch from a JSON endpoint.
- It sends the media request to the Node proxy at /proxy?url=ENCODED_URL
- The proxy forwards the request and streams the response back while adding CORS headers.

Notes & security
- This proxy forwards arbitrary URLs. For public deployments you should:
  * Add an origin whitelist (allowed domains).
  * Rate-limit requests.
  * Add authentication if needed.
  * Ensure you comply with copyright and terms of service.
- The proxy sets common headers (User-Agent, Referer) when forwarding; adjust if needed.

Example usage
- To play a URL directly in the player paste:
  https://slave01.appball.vip/hls/DERmuVknBi1JBJ1DVtSxDQ/1763297244/truesport7.m3u8
- Or host a JSON file:
  { "data": "https://.../truesport7.m3u8" }
  Then click "Load from JSON" and enter the JSON URL.
