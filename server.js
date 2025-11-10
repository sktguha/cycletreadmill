const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');

const PORT = 3000;
const WKEY_PATH = 'D:\\miscD\\cycletreadmill\\wkey.exe';

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  // If no "level" param → serve index.html
  if (!url.searchParams.has('level')) {
    fs.readFile('index.html', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('index.html not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
    return;
  }

  // Otherwise → handle level param
  const level = parseFloat(url.searchParams.get('level'));
  if (isNaN(level)) {
    res.end('Usage: ?level=NUMBER');
    return;
  }

  const cmd = level > 1.5 ? 'down' : 'up';
  exec(`"${WKEY_PATH}" ${cmd}`);
  console.log(`→ wkey.exe ${cmd}`);
  res.end(`Sent: ${cmd}`);
});

server.listen(PORT, () =>
  console.log(`✅ Server running → http://localhost:${PORT}`)
);
