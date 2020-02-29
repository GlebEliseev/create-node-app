const path = require('path')
const fs = require('fs')
const execa = require('execa')
const child = require('child_process').spawn
const Promise = require('promise')

var dir = '../Project'
var webpackConfig = fs.createReadStream('./files/webpack.config.js');
var server = fs.createReadStream('./files/server.js');
var client = fs.createReadStream('./files/index.js');
var page = fs.createReadStream('./files/index.html');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
  console.log(dir, 'directory has been created')
} else {
  console.log('Directory already exists')
}

console.log(`Starting directory: ${process.cwd()}`);
try {
  process.chdir(dir);
  console.log(`New directory: ${process.cwd()}`);

  webpackConfig.pipe(fs.createWriteStream('webpack.config.js'));
  server.pipe(fs.createWriteStream('server.js'));

  fs.mkdirSync('src')
  console.log('src directory has been created')
} catch (err) {
  console.error(`chdir: ${err}`);
}

try {
  process.chdir('src');
  console.log(`New directory: ${process.cwd()}`);

  client.pipe(fs.createWriteStream('index.js'));
  page.pipe(fs.createWriteStream('index.html'));
} catch (err) {
  console.error(`chdir: ${err}`);
}

try {
  var packages = ['webpack', 'webpack-cli', 'babel-loader', '@babel/core', 'express']
  var args = ['install', '--save', '--save-exact']

  let exec = args.concat(packages, ['--verbose'])
  console.log(exec)

  new Promise(function (resolve, reject) {
    process.chdir('../');
    execa('npm', exec)
      .then(function () {
        console.log(`Current directory: ${process.cwd()}`);
        console.log(`Execa instaled: `, exec);
        return execa('npm', ['install'])
      })
      .then(function () {
        console.log('Success. Installed packages in', dir);
        resolve()
      })
      .catch(function () {
        console.log('Error')
        return reject(new Error('npm installation failed'))
      })
  })
} catch (err) {
  console.error(`chdir: ${err}`);
}

// NOTE: THIS CODE IS NOT IN THE COURSE WORK
// try {
//   process.chdir('../')
//   console.log(`Current directory: ${process.cwd()}`);
//   child('npm init -y')
//   new Promise(function(resolve, reject) {
//     execa('npm init -y')
//     .then(function() {
//       console.log(`npm initialised`);
//       return execa('npm init -y')
//     })
//     .then(function() {
//       console.log('Success. Initialised in', dir);
//       resolve()
//     })
//     .catch(function(err) {
//       console.log('Error', err)
//       return reject(new Error('npm initialization failed'))
//     })
//   })
// } catch (err) {
//   console.error(`chdir: ${err}`);
// }
