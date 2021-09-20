'use strict';

/**
 * Refomat the stack message to show the proper name rather than just 'Error'. This is
 * necessary because the internal class property of Error is what determines the beginning of
 * the stack message, and it is not accessible in JavaScript.
 */
module.exports = function reformatV8Error(stack, name, msg) {
  var errorMessage = name
  if (msg) errorMessage += ': ' + msg
  stack = errorMessage + stack.slice(stack.indexOf('\n'))
  return stack
}
