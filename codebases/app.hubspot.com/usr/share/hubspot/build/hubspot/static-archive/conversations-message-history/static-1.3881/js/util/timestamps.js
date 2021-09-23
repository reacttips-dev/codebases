'use es6';

export function generateUniqueClientTimestamp() {
  var namespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
  var now = Date.now();
  var previousTimestamps = generateUniqueClientTimestamp.previousTimestamps;

  if (previousTimestamps && previousTimestamps[namespace] >= now) {
    previousTimestamps[namespace]++;
    return previousTimestamps[namespace];
  }

  previousTimestamps[namespace] = now;
  return now;
}
generateUniqueClientTimestamp.previousTimestamps = {};

generateUniqueClientTimestamp.reset = function reset() {
  this.previousTimestamps = {};
};