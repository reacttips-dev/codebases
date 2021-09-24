'use es6';

export default function (_ref) {
  var start = _ref.start,
      end = _ref.end;
  var diff = end - start;
  var randomDiff = Math.floor(Math.random() * diff);
  return start + randomDiff;
}