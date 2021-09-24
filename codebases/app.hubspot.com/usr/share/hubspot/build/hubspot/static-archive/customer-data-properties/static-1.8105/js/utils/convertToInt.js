'use es6';

var isInteger = function isInteger(value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

export default function convertToInt(unknown) {
  if (unknown === undefined || unknown === null) return unknown;
  if (isInteger(unknown)) return unknown; // floats, bools, objects

  if (typeof unknown !== 'string') return null;
  var parsed = Number(unknown);
  if (!isInteger(parsed)) return null;
  return parsed;
}