'use es6';

var CALL_STATUS_ATTRIBUTE = 'callStatus';

function safeSetCustomAttribute(attribute, value) {
  if (window.newrelic && typeof window.newrelic.setCustomAttribute === 'function') {
    window.newrelic.setCustomAttribute(attribute, value);
  }
}

export var NEW_RELIC_CALL_STATUS = {
  READY: 'READY',
  RINGING: 'RINGING',
  CONNECTED: 'CONNECTED',
  ENDING: 'ENDING',
  ENDED: 'ENDED'
};
export var callingNewRelicHelper = {
  currentStatus: null,
  setCallStatusAttribute: function setCallStatusAttribute(callStatus) {
    if (callStatus !== callingNewRelicHelper.currentStatus) {
      safeSetCustomAttribute(CALL_STATUS_ATTRIBUTE, callStatus);
      callingNewRelicHelper.currentStatus = callStatus;
    }
  }
};