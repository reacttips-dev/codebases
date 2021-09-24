import getIn from 'transmute/getIn';
export var getErrorInPayload = getIn(['payload', 'error']);
export var getErrorMeta = getIn(['meta', 'error']);
export var getErrorTitle = getIn(['meta', 'error', 'titleText']);
export var getErrorMessage = getIn(['meta', 'error', 'message']);
export var getDisplayEventId = function getDisplayEventId(action) {
  return getIn(['meta', 'error', 'displayEventId'], action) !== false;
};
export var ignoreError = getIn(['meta', 'error', 'ignore']);
export var isSilent = getIn(['meta', 'error', 'silent']);
export var isVisibleErrorAction = getIn(['meta', 'error', 'isVisibleToUser']);
export var getError = function getError(action) {
  if (action.payload instanceof Error) {
    return action.payload;
  }

  var errorInPayload = getErrorInPayload(action);

  if (errorInPayload instanceof Error) {
    return errorInPayload;
  }

  return null;
};
export var getActionType = function getActionType(action) {
  return getIn(['type'], action);
};