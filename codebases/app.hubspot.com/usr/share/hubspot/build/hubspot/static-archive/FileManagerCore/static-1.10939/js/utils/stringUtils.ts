export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
export function dimensionValueToString(value) {
  return value ? value.toString() : '0';
}
export function removeLeadingSlashFromPath(str) {
  if (str.indexOf('/') === 0) {
    return str !== '/' ? str.substr(1) : '';
  }

  return str;
}
export function addLeadingSlashToPath(str) {
  if (str.indexOf('/') !== 0) {
    return "/" + str;
  }

  return str;
}
export var capitalizeString = function capitalizeString(str) {
  if (typeof str !== 'string') {
    return undefined;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};
export function containsDoubleByteUnicode(str) {
  // eslint-disable-next-line no-control-regex
  return /[^\u0000-\u00ff]/.test(str);
}