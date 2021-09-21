const executeScript = require('./execute')
const parser = require('./parser')

function checkScript(script) {
  try {
    parser.parse(script)
    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  checkScript,
  executeScript,
  parseScript: parser.parse,
}
