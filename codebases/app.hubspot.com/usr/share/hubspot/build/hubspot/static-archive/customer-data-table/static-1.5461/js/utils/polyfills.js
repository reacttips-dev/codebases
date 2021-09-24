'use es6';

export var NumberIsNaN = Number.isNaN || function (value) {
  // eslint-disable-next-line no-self-compare
  return value !== value;
};