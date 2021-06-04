const { exec } = require('child_process');

function start () {
  console.log('env', process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'production') {
    require('../../packages/server/dist/app');
  } else {
    exec('cd .. && npm run dev');
  }
}

module.exports = start;
