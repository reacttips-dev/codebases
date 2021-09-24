'use es6';

export function setItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {// ignore
  }
}