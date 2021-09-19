import ExecutionEnvironment from 'exenv';

function nodeAtob(str) {
  return Buffer.from(str, 'base64').toString('binary');
}

function nodeBtoa(str) {
  const buffer
    = str instanceof Buffer
      ? str
      : Buffer.from(str.toString(), 'binary');

  return buffer.toString('base64');
}

const atob = ExecutionEnvironment.canUseDOM ? window.atob : nodeAtob;
const btoa = ExecutionEnvironment.canUseDOM ? window.btoa : nodeBtoa;

/**
 * Base64 encode a string, which may contain unicode chars
 * @param {string} str - string to base64 encode
 * @return {string} base 64 encoded string
 */
export function utoa(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

/**
 * Decode a base64 encoded ascii which may contain unicode chars
 * @param {string} str - base64 encoded string
 * @return {string} original string
 */
export function atou(str) {
  return decodeURIComponent(escape(atob(str)));
}

/**
 * Serialize a javascript object, which may contain unicode, to a base64
 * encoded string
 * @param {object} obj - object to encode
 * @return {string} base 64 encoded string
 */
export function serializeObj(obj) {
  return utoa(JSON.stringify(obj));
}

/**
 * Deserialize a base64 encoded string to a javascript object.
 * @param {string} str - base 64 encoded string which represents a object
 * @return {object} deserialized object
 */
export function deserializeObj(str) {
  return JSON.parse(atou(str));
}

/**
 * Gets the HTML element's offset values in relation to the document.
 * @param {HTMLElement} element - the HTML element in question.
 * @return {object} an object with the top and left offset values.
 */
export function getOffset(element) {
  const offset = { top: element.offsetTop, left: element.offsetLeft };
  let parent = element.offsetParent;
  while (parent !== null && parent !== window) {
    offset.top += parent.offsetTop;
    offset.left += parent.offsetLeft;
    parent = parent.offsetParent;
  }
  return offset;
}
