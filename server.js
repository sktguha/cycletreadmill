const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const WKEY_PATH = path.join(__dirname, 'wkey.exe');
const TIMEOUT_MS = 2000; // auto-release delay

let holding = false;
let releaseTimer = null;

function sendKey(cmd) {
  exec(`"${WKEY_PATH}" ${cmd}`);
  console.log(`→ wkey.exe ${cmd}`);
  holding = cmd === 'down';
}

function resetReleaseTimer() {
  if (releaseTimer) clearTimeout(releaseTimer);
  releaseTimer = setTimeout(() => {
    if (holding) {
      sendKey('up');
      console.log('🕒 Auto-released (no requests)');
    }
  }, TIMEOUT_MS);
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const level = parseFloat(url.searchParams.get('level'));
  const walk = parseFloat(url.searchParams.get('walk')) || 1.5;

  // Serve index.html if no ?level param
  if (!url.searchParams.has('level')) {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      res.writeHead(err ? 404 : 200, { 'Content-Type': 'text/html' });
      res.end(err ? 'index.html not found' : data);
    });
    return;
  }

  if (isNaN(level)) {
    res.end('Usage: ?level=NUMBER');
    return;
  }

  const cmd = level > walk ? 'down' : 'up';
  if (holding !== (cmd === 'down')) sendKey(cmd);

  resetReleaseTimer(); // restart inactivity timer
  res.end(`sent: ${cmd}`);
}).listen(3000, () => console.log('✅ Server on http://localhost:3000'));
