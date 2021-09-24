export var getStorageItem = function getStorageItem(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
};
export var setStorageItem = function setStorageItem(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {// ignore error
  }
};