var expect = require('chai').expect;
var should = require('chai').should();
var index = require('../index');
const execa = require('execa')
const fs = require('fs');
const Promise = require('promise');
const process = require('child_process')


//If the script runs, node_modules folder,webpack and babel config should be created
describe('After script checkup', function() {
  before(function(done) {
    return new Promise((resolve, reject) => {
      execa('npm start')
        .then(function() {
          process.chdir('../Project')
          console.log(process.cwd());
          resolve()
        })
        .catch(function(err) {
          console.log('Error')
          return reject(new Error(err))
        })
    });
  })

  it('should install packages', function() {
    //Expect folder to exist
    expect(fs.existsSync('node_modules')).to.be.true;
  })

  it('should create configuration files', function() {
    //Expect files to exist
    expect(fs.existsSync('.babelrc')).to.be.true;
    expect(fs.existsSync('webpack.config.js')).to.be.true;

  })

  it('should be able to start up without further configuration', function(done) {
    //Try to run program
    let exitCode;
    console.log(process.cwd());
    let start = process.spawn('npm start');
    process.on('exit', function(code) {
      exitCode = code;
      done()
    })
    expect(exitCode).to.equal(0)
  })
})
