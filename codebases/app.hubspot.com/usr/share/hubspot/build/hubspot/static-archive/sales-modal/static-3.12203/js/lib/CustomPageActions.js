'use es6';

export var trackSingleEnrollSuccess = function trackSingleEnrollSuccess(platform) {
  if (window.newrelic) {
    window.newrelic.addPageAction('salesModalEnroll', {
      enrollType: 'single',
      enrollOutcome: 'success',
      platform: platform
    });
  }
};
export var trackBulkEnrollSuccess = function trackBulkEnrollSuccess(platform) {
  if (window.newrelic) {
    window.newrelic.addPageAction('salesModalEnroll', {
      enrollType: 'bulk',
      enrollOutcome: 'success',
      platform: platform
    });
  }
};
export var trackSingleEnrollError = function trackSingleEnrollError(platform) {
  var err = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (window.newrelic) {
    window.newrelic.addPageAction('salesModalEnroll', {
      enrollType: 'single',
      enrollOutcome: 'error',
      platform: platform,
      status: err.status,
      enrollErrorType: err.responseJSON ? err.responseJSON.errorType : null
    });
  }
};
export var trackBulkEnrollError = function trackBulkEnrollError(platform) {
  var err = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (window.newrelic) {
    window.newrelic.addPageAction('salesModalEnroll', {
      enrollType: 'bulk',
      enrollOutcome: 'error',
      platform: platform,
      status: err.status,
      enrollErrorType: err.responseJSON ? err.responseJSON.errorType : null
    });
  }
};
export var trackBulkEnrollFailuresByKey = function trackBulkEnrollFailuresByKey(platform, failuresByKey) {
  if (window.newrelic) {
    var uniqueErrorTypes = failuresByKey.reduce(function (acc, errorForContact) {
      var errorType = errorForContact.get('errorType');

      if (acc.indexOf(errorType) === -1) {
        acc.push(errorType);
      }

      return acc;
    }, []);
    window.newrelic.addPageAction('salesModalEnroll', {
      enrollType: 'bulk',
      enrollOutcome: 'error',
      platform: platform,
      enrollErrorType: uniqueErrorTypes.sort().join(',')
    });
  }
};