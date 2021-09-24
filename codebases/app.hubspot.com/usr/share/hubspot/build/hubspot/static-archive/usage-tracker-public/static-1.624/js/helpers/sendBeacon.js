'use es6';

export default (function (endpoint, data) {
  var onScheduleFailure = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  var scheduled;

  try {
    scheduled = navigator.sendBeacon(endpoint, new Blob([JSON.stringify(data)], {
      type: 'text/plain'
    }));
  } catch (err) {
    scheduled = false;
  }
  /*
   * From w3 beacon spec -
   *
   * The user agent imposes limits on the amount of data that can be sent via this API:
   * this helps ensure that such requests are delivered successfully and with minimal impact
   * on other user and browser activity. If the amount of data to be queued exceeds the user agent limit,
   * this method returns false; a return value of true implies the browser has queued the data for transfer.
   * However, since the actual data transfer happens asynchronously,
   * this method does not provide any information whether the data transfer has succeeded or not.
   */


  if (!scheduled && typeof onScheduleFailure === 'function') {
    onScheduleFailure();
  }

  return scheduled;
});