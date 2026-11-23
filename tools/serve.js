// Tiny static server for previewing rendered test pages: node tools/serve.js <dir> <port>
const http = require('http'), fs = require('fs'), path = require('path');
const dir = path.resolve(process.argv[2] || '.'), port = +process.argv[3] || 5173;
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
http.createServer((req, res) => {
  const f = path.join(dir, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/workbench.html'));
  if (!f.startsWith(dir)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end('not found'); } res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); res.end(d); });
}).listen(port, () => console.log('OZ workbench: http://localhost:' + port + '/   (all pages list: /index-of-pages.html)'));
