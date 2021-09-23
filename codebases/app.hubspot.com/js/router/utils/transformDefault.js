'use es6'; // Adapted from babel-plugin-transform-modules-commonjs
// https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs#nointerop

export var transformDefault = function transformDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
};