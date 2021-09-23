'use es6';

import unescapedText from 'I18n/utils/unescapedText';

var getMetricLabel = function getMetricLabel(propertyLabel, metricType) {
  var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  if (!propertyLabel) {
    return fallback;
  }

  return unescapedText("reporting-data.propertyLabel." + metricType.toUpperCase(), {
    propertyLabel: propertyLabel
  });
};

export default getMetricLabel;