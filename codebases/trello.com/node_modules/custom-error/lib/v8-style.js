'use strict';

// returns true if the Error object returns a stack string
// with the signature of 'ErrorType: message'
module.exports = function v8StyleStackMessage() {
  var e = new Error('yep')
  if (!e.stack) return false
  if (e.stack.substr(0, 11) === 'Error: yep\n') return true
  return false
}
