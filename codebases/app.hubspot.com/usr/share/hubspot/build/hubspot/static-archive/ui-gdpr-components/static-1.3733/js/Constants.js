'use es6';

var keyMirror = function keyMirror(obj) {
  var ret = {};
  var key;

  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }

  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    ret[key] = key;
  }

  return ret;
};

export var LawfulBasis = keyMirror({
  LEGITIMATE_INTEREST_PQL: null,
  LEGITIMATE_INTEREST_CLIENT: null,
  PERFORMANCE_OF_CONTRACT: null,
  CONSENT_WITH_NOTICE: null,
  NON_GDPR: null
});
export var OptStatuses = keyMirror({
  OPT_IN: null,
  OPT_OUT: null,
  NOT_OPTED: null
});
export var HISTORY_COLUMNS = keyMirror({
  subscription: null,
  newStatus: null,
  email: null,
  lawfulBasis: null,
  explanation: null,
  requestedBy: null,
  source: null,
  created: null
});