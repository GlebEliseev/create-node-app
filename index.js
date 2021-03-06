const fs = require('fs')
const execa = require('execa')

let dir = './'
let projectName = 'project'
if (process.argv.length > 2) {
  projectName = process.argv[process.argv.length - 1]
}
dir = dir + projectName

let webpackConfig = fs.createReadStream('./files/webpack.config.js');
let server = fs.createReadStream('./files/server.js');
let client = fs.createReadStream('./files/index.js');
let page = fs.createReadStream('./files/index.html');
let style = fs.createReadStream('./files/style.css');
let readme = fs.createReadStream('./files/README.md');

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
  readme.pipe(fs.createWriteStream('README.md'));

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
  style.pipe(fs.createWriteStream('style.css'));
} catch (err) {
  console.error(`chdir: ${err}`);
}

try {
  let packages = ['webpack', 'webpack-cli', 'babel-loader', '@babel/core', 'style-loader', 'css-loader']
  let args = ['install', '--save', '--save-exact']

  let exec = args.concat(packages, ['--verbose'])

  process.chdir('../');
  execa('npm', exec)
    .then(function () {
      console.log(`Current directory: ${process.cwd()}`);
      console.log(`Execa did: npm `, ...exec);
      return execa('npm', ['install'])
    })
    .then(function () {
      console.log('Success. Installed packages in', dir);
    })
    .catch(function () {
      console.log('npm installation failed')
    })
} catch (err) {
  console.error(`chdir: ${err}`);
}