import * as ServerRenderingUtils from './../../../helpers/serverRenderingUtils.js';
import { localStorage } from './localStorage';

// copy text to clipboard
/**
 *
 * @deprecated use `copyTextToClipboard` in `client/utils`
 */
const copyTextToClipboard = (text: string) => {
  const textArea = document.createElement('textarea');
  const range = document.createRange();
  let s: Selection | null = null;
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.fontSize = '16px'; // prevent iOS zooming
  textArea.style.padding = '0';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.contentEditable = 'true';
  textArea.readOnly = false;
  textArea.value = text;
  document.body.appendChild(textArea);
  if (ServerRenderingUtils.isIOS()) {
    range.selectNodeContents(textArea);
    s = window.getSelection();
  }
  if (s) {
    s.removeAllRanges();
    s.addRange(range);
    textArea.setSelectionRange(0, 999999);
  } else {
    textArea.select();
  }
  document.execCommand('copy');
  document.body.removeChild(textArea);
};

// get the full qualified url for a url path -- for the current host
// getFullUrlForUrlPath('/profile')
//   => 'https://anchor.fm/profile'
const getFullUrlForUrlPath = (urlPath: string): string => {
  const url = `${ServerRenderingUtils.getBaseUrl()}${urlPath}`;
  return url;
};

const Browser = { copyTextToClipboard, getFullUrlForUrlPath, localStorage };
export { Browser };
