export var capitalize = function capitalize(str) {
  if (typeof str !== 'string') return '';
  return "" + str.charAt(0).toUpperCase() + str.slice(1);
};