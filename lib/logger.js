const fs = require('fs');

class Logger {
  constructor(filename) {
    this.filename = filename;
    this.stream = fs.createWriteStream(this.filename, {flags:'a'});
  }

  log(message) {
    this.stream.write(new Date().toISOString() + ' - ' + message + '\n');
  }

}

module.exports = Logger;