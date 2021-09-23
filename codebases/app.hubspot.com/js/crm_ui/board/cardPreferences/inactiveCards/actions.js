'use es6';

export var setIsTurnedOn = function setIsTurnedOn(dispatch) {
  return function (newValue) {
    dispatch({
      type: 'INACTIVE_CARDS_SET_IS_TURNED_ON',
      payload: newValue
    });
  };
};
export var setUnit = function setUnit(dispatch) {
  return function (newValue) {
    dispatch({
      type: 'INACTIVE_CARDS_SET_UNIT',
      payload: newValue
    });
  };
};
export var setValue = function setValue(dispatch) {
  return function (newValue) {
    dispatch({
      type: 'INACTIVE_CARDS_SET_VALUE',
      payload: newValue
    });
  };
};
export var reset = function reset(dispatch) {
  return function (newValue) {
    dispatch({
      type: 'INACTIVE_CARDS_RESET',
      payload: newValue
    });
  };
};
export var actions = {
  setIsTurnedOn: setIsTurnedOn,
  setUnit: setUnit,
  setValue: setValue,
  reset: reset
};