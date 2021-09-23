'use es6';

var descriptionKeys = {};
export default (function (description) {
  if (descriptionKeys[description]) return descriptionKeys[description];
  var hash = 0;
  if (description.length === 0) return hash;
  description.split('').forEach(function (char) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash = hash & hash;
  });
  var key = "desc_" + hash.toString().replace('-', 'n');
  descriptionKeys[description] = key;
  return key;
});