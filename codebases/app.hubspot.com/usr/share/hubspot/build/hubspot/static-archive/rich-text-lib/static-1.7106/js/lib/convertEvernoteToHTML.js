'use es6';

import parseHTML from '../utils/parseHTML';
import isValidPasteContent from '../utils/isValidPasteContent';
export default function convertEvernoteToHTML(clipboardContent) {
  isValidPasteContent(clipboardContent);
  return parseHTML(clipboardContent.replace(/(\r\n|\n|\r)/, '')).outerHTML;
}