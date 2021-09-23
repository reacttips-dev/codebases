'use es6';

import get from 'transmute/get';
export var threadFromProps = function threadFromProps(state) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return get('thread', props);
};