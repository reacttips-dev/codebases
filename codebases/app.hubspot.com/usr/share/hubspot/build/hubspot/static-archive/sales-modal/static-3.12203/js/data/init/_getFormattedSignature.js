'use es6';

export default function _getFormattedSignature(signature) {
  if (!signature) {
    return '';
  }

  return "<br />" + signature;
}