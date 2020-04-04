const path = require('path')
const fs = require('fs')
const execa = require('execa')
const child = require('child_process').spawn
const Promise = require('promise')

var dir = '../'
var projectName = 'project'
if (process.argv.length > 2) {
  projectName = process.argv[process.argv.length - 1]
}
dir = dir + projectName

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

  let appPackage = {
    name: projectName,
    version: '0.0.1',
    description: 'Simple Javascript boilerplate created by create-node-app',
    main: 'index.js',
    scripts: {
      start: 'npx webpack && node server.js'
    }
  }

  fs.writeFileSync(
    'package.json',
    JSON.stringify(appPackage, null, 2)
  );

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
  var packages = ['webpack', 'webpack-cli', 'babel-loader', '@babel/core', 'style-loader', 'css-loader']
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