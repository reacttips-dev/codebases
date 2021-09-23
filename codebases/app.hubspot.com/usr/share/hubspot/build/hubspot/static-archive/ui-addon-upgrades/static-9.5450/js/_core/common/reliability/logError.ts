export default function logError(location, error, additionalProperties) {
  if (window.newrelic) {
    var errorCode = error.errorCode,
        errorMessage = error.errorMessage,
        message = error.message,
        responseJSON = error.responseJSON,
        status = error.status,
        _data = error.data;
    window.newrelic.addPageAction('ui-addon-upgrades-error', Object.assign({
      location: location,
      errorCode: errorCode,
      errorMessage: errorMessage,
      message: message,
      responseJSON: responseJSON,
      status: status,
      data: _data
    }, additionalProperties));
  }
}