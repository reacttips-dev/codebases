'use es6';

export default (function (_ref) {
  var trigger = _ref.trigger,
      maximumSearch = _ref.maximumSearch,
      _ref$matchOnlyTrigger = _ref.matchOnlyTrigger,
      matchOnlyTrigger = _ref$matchOnlyTrigger === void 0 ? false : _ref$matchOnlyTrigger;
  var startRange = matchOnlyTrigger ? 0 : 1;
  return new RegExp("(\\B" + trigger + "[\\S]{" + startRange + "," + maximumSearch + "}([\\s]?([\\S]{" + startRange + "," + maximumSearch + "})?)?)$");
});