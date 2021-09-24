const addUnhandledRejectionEventListeners = () => {
  // Bluebird currently swallows errors. If you put a `throw err` in a `catch` block that
  //  error doesn't turn into an exception in the browser, instead it just gets swallowed.
  //  We want the ability to send errors to the browser exceptions because this is what sentry
  //  is watching and will only alert us for them.
  //  We've confirmed that normal Promises do in-fact throw an exception, so if we switch we wouldn't need this code
  //  See: http://bluebirdjs.com/docs/api/error-management-configuration.html#global-rejection-events
  // TODO: There is a chance that a promise will be rejected but then later handled... Currently and exeption
  //       will be throw even in this case. We probably want to do somesort of timeout and only throw an exception
  //       for errors that are rejected and never handled. We'd do this by using the window.addEventListener('rejectionhandled')
  //       See: http://bluebirdjs.com/docs/api/promise.onunhandledrejectionhandled.html
  window.addEventListener('unhandledrejection', e => {
    // NOTE: e.preventDefault() must be manually called to prevent the default
    // action which is currently to log the stack trace to console.warn
    e.preventDefault();
    // NOTE: parameters are properties of the event detail property

    // bluebird puts reason on e.detail instead of e.reason
    if (e.detail) {
      if (e.detail.reason) {
        const { reason } = e.detail;
        throw reason;
      } else if (e.detail.promise) {
        // e.detail.reason is not defined if we call `reject` on a promise and
        //  DON'T pass it an error (i.e. reject()). So to make the stack more
        //  helpful we add the stack fo the promise to a new error we create.
        const promise = e.detail.promise;
        const promiseStackTrace = promise._trace && promise._trace.stack;
        const reason = new Error(`Unhandled rejection without Error`);
        if (promiseStackTrace) {
          reason.stack = `${reason.stack}\nCaused By:\n${promiseStackTrace}`;
        }
        throw reason;
      } else {
        const reason = new Error(`Unhandled rejection without Error`);
        throw reason;
      }
    } else if (e.reason) {
      throw e.reason;
    } else {
      const reason = new Error(`Unhandled rejection without Error`);
      throw reason;
    }
  });
};

export { addUnhandledRejectionEventListeners };
