const path = require('path');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');
const http = require('http');

// Serve up public/ftp folder
const clientServe = serveStatic(path.join(__dirname, '/../packages/client'), { index: ['index.html', 'index.htm'] });
const adminServe = serveStatic(path.join(__dirname, '/../packages/admin'), { index: ['index.html', 'index.htm'] });

function start () {
  // Start server
  require('../packages/server/app');

  // Create client and admin
  http.createServer((req, res) => clientServe(req, res, finalhandler(req, res))).listen(8001);
  http.createServer((req, res) => adminServe(req, res, finalhandler(req, res))).listen(8000);
}

module.exports = start;
