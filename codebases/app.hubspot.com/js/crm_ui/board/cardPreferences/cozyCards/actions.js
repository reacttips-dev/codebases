'use es6';

export var setStyle = function setStyle(dispatch) {
  return function (newValue) {
    dispatch({
      type: 'COZY_CARDS_SET_STYLE',
      payload: newValue
    });
  };
};
export var setBottomPanel = function setBottomPanel(dispatch) {
  return function (newValue) {
    dispatch({
      type: 'COZY_CARDS_SET_BOTTOM_PANEL',
      payload: newValue
    });
  };
};
export var reset = function reset(dispatch) {
  return function (newValue) {
    dispatch({
      type: 'COZY_CARDS_RESET',
      payload: newValue
    });
  };
};
export var actions = {
  setStyle: setStyle,
  setBottomPanel: setBottomPanel,
  reset: reset
};