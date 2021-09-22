type JSApplicationErrorContext = {
  userId: number;
  appName: string;
  // This is instrumented after a couple of steps in the SSR rendering process so it may not be available.
  route?: string;
  requestCountry: string;
  userAgent: string;
};

/**
 * Custom JSApplicationError class to allow propagation of information that is important
 * for debugging issues when Application errors arise.
 *
 * Normal application errors that would be thrown in ssr/lib/page should always be caught and
 * wrapped in JSApplicationError for proper handling.
 */
class JSApplicationError extends Error {
  name: string;

  message: string;

  context: JSApplicationErrorContext | null = null;

  detail: Record<string, unknown> | null;

  constructor(message: string) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JSApplicationError);
    }

    this.name = 'JSApplicationError';
    this.message = message;
    this.context = null;
    this.detail = null;
  }

  static fromError(err?: string | Error): JSApplicationError {
    let jsErr: JSApplicationError;
    if (typeof err === 'string') {
      // Handle cases where people throw strings instead of errors.
      // eg. throw 'Some reason as a string'
      jsErr = new JSApplicationError(err);
    } else if (err != null) {
      if (err.message != null) {
        jsErr = new JSApplicationError(err.message);
        jsErr.stack = err.stack;
        // Include any added context (enumerable own properties) for debugging purposes.
        jsErr.detail = Object.assign({} as Record<string, unknown>, err);
      } else {
        // err is an object (but not an Error object)
        try {
          const stringifiedObject = JSON.stringify(err);
          jsErr = new JSApplicationError(
            `Object thrown as error: ${stringifiedObject}. Please throw an actual Error instead.`
          );
        } catch (e) {
          if (e.name === 'TypeError') {
            jsErr = new JSApplicationError(
              'Cyclic object thrown/rejected as an error. Please throw an actual Error instead.'
            );
          } else {
            jsErr = new JSApplicationError(
              `Object thrown as error (${err}) that could not be stringified (${e}). Please throw an actual Error instead.`
            );
          }
        }
      }
    } else {
      jsErr = new JSApplicationError(
        '`undefined` or `null` thrown/rejected. Did you mean to throw/reject an Error object?'
      );
    }

    return jsErr;
  }
}

export default JSApplicationError;
