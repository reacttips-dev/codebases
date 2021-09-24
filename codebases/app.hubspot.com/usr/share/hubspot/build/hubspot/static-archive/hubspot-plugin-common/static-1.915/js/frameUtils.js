'use es6';

export function isFramed() {
  return window.top !== window;
}