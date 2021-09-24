'use es6';

import { sanitize } from './Sanitize';
import { config } from './SanitizeConfiguration';
import memoize from 'transmute/memoize';
export var getTextContentFromHtml = memoize(function (text) {
  return sanitize(text, config.TEXTONLY);
});