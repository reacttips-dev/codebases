'use es6';

var NA1 = 'na1';
export default function getHubletSuffix() {
  var hublet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (!hublet || hublet === NA1) {
    return '';
  }

  return "-" + hublet;
}