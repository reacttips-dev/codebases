var v8StyleErrors = require('./lib/v8-style')()
var reformat = require('./lib/reformat')

function ErrorMaker(name, ParentError) {
  function NewError(message) {
    if (!(this instanceof NewError))
      return new NewError(message)

    // Use a try/catch block to capture the stack trace. Capturing the stack trace here is
    // necessary, otherwise we will get the stack trace at the time the new error class was created,
    // rather than when it is instantiated.  We add `message` and `name` so that the stack trace
    // string will match our current error class.
    try {
      throw new Error(message)
    }
    catch (err) {
      err.name = name
      this.stack = err.stack
    }

    // if we have v8-styled stack messages, then reformat
    if (v8StyleErrors) {
      if (this.stack) this.stack = reformat(this.stack, name, message)
    }

    this.message = message || ''
    this.name = name
  }

  NewError.prototype = new (ParentError || Error)()
  NewError.prototype.constructor = NewError
  NewError.prototype.inspect = function() {
    return this.message
      ? '[' + name + ': ' + this.message + ']'
      : '[' + name + ']'
  }
  NewError.prototype.name = name

  return NewError
}

module.exports = ErrorMaker
