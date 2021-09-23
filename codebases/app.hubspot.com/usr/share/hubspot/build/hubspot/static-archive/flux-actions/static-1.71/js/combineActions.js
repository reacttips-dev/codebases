'use es6';

export var ACTION_TYPE_DELIMITER = '||';
export default function combineActions() {
  for (var _len = arguments.length, actionTypes = new Array(_len), _key = 0; _key < _len; _key++) {
    actionTypes[_key] = arguments[_key];
  }

  return actionTypes.join(ACTION_TYPE_DELIMITER);
}