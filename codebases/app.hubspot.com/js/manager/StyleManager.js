'use es6';

import StyleSheet from '../view/StyleSheet';
export function addCss(fileName) {
  var link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = fileName;
  document.head.appendChild(link);
}
export function addStylesToPage() {
  var headElement = window.top.document.head;

  if (headElement) {
    var styleElement = StyleSheet.getStyleElement();
    headElement.appendChild(styleElement);
  }
}