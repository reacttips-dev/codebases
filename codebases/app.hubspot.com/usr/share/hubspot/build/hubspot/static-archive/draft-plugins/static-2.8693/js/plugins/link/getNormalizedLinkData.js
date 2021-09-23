'use es6';

var getNormalizedLinkData = function getNormalizedLinkData(data) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$showNoFollow = _ref.showNoFollow,
      showNoFollow = _ref$showNoFollow === void 0 ? false : _ref$showNoFollow,
      _ref$showTarget = _ref.showTarget,
      showTarget = _ref$showTarget === void 0 ? false : _ref$showTarget;

  // if data.target === "_self" (or other self referencing values) this will be false even with a true showTarget value
  var targetFallbackValue = typeof data.target !== 'undefined' && data.target !== null ? data.target === '_blank' : showTarget;
  return Object.assign({}, data, {
    isTargetBlank: typeof data.isTargetBlank !== 'undefined' ? data.isTargetBlank : targetFallbackValue,
    isNoFollow: typeof data.isNoFollow !== 'undefined' ? data.isNoFollow : data.rel === 'nofollow' || showNoFollow
  });
};

export default getNormalizedLinkData;