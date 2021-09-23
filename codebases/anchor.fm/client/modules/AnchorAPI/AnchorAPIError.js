class AnchorAPIError extends Error {
  constructor(response, message, fileName, lineNumber) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(`AnchorAPIError: ${message}`, fileName, lineNumber);
    this.name = 'AnchorAPIError';

    // a workaround to make `instanceof AnchorAPIError` work in ES5
    // reference:
    //   https://github.com/babel/babel/issues/4485
    this.constructor = AnchorAPIError;
    this.__proto__ = AnchorAPIError.prototype;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor.name);
    }

    // Custom debugging information
    this.response = response;
    this.date = new Date();
  }
}

export default AnchorAPIError;
