'use es6';

import Immutable from 'immutable';
var defaultState = Immutable.Map({
  withShutterstock: false,
  uploadedFileAccess: null
});
export default function Configuration() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  return state;
}