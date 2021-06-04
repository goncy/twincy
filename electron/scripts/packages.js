const path = require('path');
const fs = require('fs-extra');

const packages = {
  server: path.join(__dirname, '/../../packages/server/dist'),
  client: path.join(__dirname, '/../../packages/client/dist'),
  admin: path.join(__dirname, '/../../packages/admin/dist')
};
const dest = path.join(__dirname, '/../packages');

fs.emptyDirSync(dest);

Object.entries(packages).forEach(([pkg, path]) => fs.copySync(path, `${dest}/${pkg}/dist`));
