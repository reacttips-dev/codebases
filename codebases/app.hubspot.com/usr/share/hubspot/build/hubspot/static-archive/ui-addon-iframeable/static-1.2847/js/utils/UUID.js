'use es6';

var UUID = function UUID() {
  var uuid = '';
  var r;

  for (var i = 0; i < 32; i++) {
    r = Math.random() * 16 | 0;

    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }

    uuid += (i === 12 ? 4 : i === 16 ? r & 3 | 8 : r).toString(16);
  }

  return uuid;
};

export default UUID;