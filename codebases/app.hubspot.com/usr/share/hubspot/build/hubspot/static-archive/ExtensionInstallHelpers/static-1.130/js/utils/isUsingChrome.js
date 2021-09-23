'use es6'; // Modified from https://stackoverflow.com/a/13348618
// HeadJS provides a way to store the browser and OS on the document element, but we want
// to access browser type directly without modifying the page

export var _isUsingChrome = function _isUsingChrome() {
  var isChromium = window.chrome;
  var isOpera = typeof window.opr !== 'undefined';
  var isIEedge = window.navigator.userAgent.indexOf('Edge') > -1;
  var isIOSChrome = window.navigator.userAgent.match('CriOS');
  return !isIOSChrome && isChromium !== null && typeof isChromium !== 'undefined' && isOpera === false && isIEedge === false;
};