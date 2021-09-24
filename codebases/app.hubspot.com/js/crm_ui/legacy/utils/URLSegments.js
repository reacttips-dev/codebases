'use es6';

export var getFragmentBy = function getFragmentBy(root, href) {
  if (href === root) {
    return '/';
  }

  return href.split(root)[1];
};