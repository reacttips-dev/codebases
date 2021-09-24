'use es6';

var IFRAMEABLE = 'HS:iframeable';
export var getLocalSetting = function getLocalSetting(name, setting) {
  var item = IFRAMEABLE + ":" + setting;

  try {
    var value = localStorage.getItem(item + ":" + name);
    return value != null ? value : localStorage.getItem("" + item);
  } catch (err) {
    return undefined;
  }
};