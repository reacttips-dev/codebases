// Error tracker used in main app scripts
// For jade files use js/app/errorTrackerJade.js

const factory = () => {
  var lastError = {};

  function errorEquals(left, right) {
    return ['message', 'url', 'line', 'column'].every(function (field) {
      return left[field] == right[field];
    });
  }

  return function (tracker, options) {
    options = options || {};

    var logger = options.logger || (window && window.console) || { error: function () {} };
    var version = options.version || '';
    var versionTimestamp = options.versionTimestamp || '';

    var stringifyError = function (error) {
      var plainObject = {};
      if (error && typeof error == 'object') {
        Object.getOwnPropertyNames(error).forEach(function (key) {
          plainObject[key] = error[key];
        });
      }
      return JSON.stringify(plainObject);
    };

    var logClientSideError = function (message, url, line, column, error) {
      // errors without line numbers, urls or columns aren't helpful, chuck them
      if (!url || !column || !line) return;

      if (message.target && message.type) {
        message = message.type;
      }

      if (error && error.stack) {
        var findStackUrlRegExp = /\(([^)\s]+?):\d+:\d+\)/gm;
        var findLastStackUrlRegExp = /\s*(https?:\/\/[^:\s]+?):\d+:\d+\s*$/gm;
        var match;
        var local = true;

        // test for parens enclosed URLs in stack trace
        while ((match = findStackUrlRegExp.exec(error.stack))) {
          if (match && !options.scriptFilter.test(match[1])) {
            local = false;
            break;
          }
        }

        // test for last URL in stack trace
        if (local) {
          while ((match = findLastStackUrlRegExp.exec(error.stack))) {
            if (match && !options.scriptFilter.test(match[1])) {
              local = false;
              break;
            }
          }
        }

        // if stack trace shows us external scripts are buggy, don't log
        if (!local) return;
      }

      var errorStr = stringifyError(error);
      var errorDescrip = {
        message: message,
        script: url,
        line: line,
        url: window && window.document ? window.document.URL : url,
        column: column,
        error: errorStr,
        version: version,
        versionTimestamp: versionTimestamp,
        appName: window.appName || 'unknown',
      };

      logger.error(errorStr);

      var trackableUrl = url && (!options.scriptFilter || options.scriptFilter.test(url));

      if (trackableUrl) {
        var isNewError = !errorEquals(errorDescrip, lastError);

        // don't track the same error over and over again
        if (isNewError) {
          lastError = errorDescrip;
          tracker(errorDescrip);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.onerror = logClientSideError;
      if (window.errorTracker) {
        delete window.errorTracker;
      }
    } else {
      return logClientSideError;
    }
  };
};

let defaultExportFactory = factory();

// is this amd export still necessary?
if (typeof define === 'function' && define.amd) {
  defaultExportFactory = define(factory);
}

export default defaultExportFactory;
