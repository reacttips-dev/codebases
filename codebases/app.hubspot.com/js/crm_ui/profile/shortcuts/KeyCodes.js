'use es6';

var keyCodes = {
  CMD_KEY: 91,
  CMD_KEY_RIGHT: 93,
  // cmd maps to this on firefox
  OS_KEY: 224,
  CTRL_KEY: 17,
  ESC_KEY: 27,
  SLASH_KEY: 191,
  K_KEY: 75,
  Q_KEY: 81,
  R_KEY: 82,
  F5_KEY: 116
};
export var MODIFIER_KEYS = [keyCodes.CMD_KEY, keyCodes.CMD_KEY_RIGHT, keyCodes.CTRL_KEY, keyCodes.OS_KEY];
export default keyCodes;