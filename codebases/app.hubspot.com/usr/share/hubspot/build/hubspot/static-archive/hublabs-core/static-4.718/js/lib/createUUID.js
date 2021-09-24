'use es6';

var chars = '0123456789abcdef'.split('');
export default (function () {
  var id = [];

  for (var i = 0; i < 32; i++) {
    id.push(chars[Math.floor(Math.random() * chars.length)]);
  }

  return id.join('');
});