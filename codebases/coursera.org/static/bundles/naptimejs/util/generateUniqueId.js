/**
 * Generates a unique id to identify a request in NaptimeJS
 * @return {string} unique id
 */
export default function generateUniqueId() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line no-bitwise
}
