'use es6';

import invariant from 'react-utils/invariant';
export default function isValidPaste(clipboardContent) {
  invariant(typeof clipboardContent === 'string', "Expected 'clipboardContent' to be a string of HTML, received " + typeof clipboardContent);
  invariant(clipboardContent.length > 0, 'Expected clipboardContent to have content, received empty string');
}