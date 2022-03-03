const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');

const dest = path.join(__dirname, '/../packages');
const packages = {
  server: path.join(__dirname, '/../../packages/server'),
  client: path.join(__dirname, '/../../packages/client')
};

fs.emptyDirSync(dest);

fs.copySync(packages.server, `${dest}/server`);
fs.copySync(packages.client, `${dest}/client`);

exec(`cd ${dest}/server && npm install && npm run build`);
exec(`cd ${dest}/client && npm install && npm run build`);
