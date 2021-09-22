export const getReadableConfidenceLevel = (confidenceLevel?: number): string =>
  confidenceLevel === undefined ? '0' : Math.floor(confidenceLevel * 100).toString();

export const DEFAULT_CONFIDENCE_LEVEL = 0.45;

export const READABLE_DEFAULT_CONFIDENCE_LEVEL = '45';

export const WAIT_FOR_DESCRIPTION_JOB_BEFORE_FETCH = 60000; // milliseconds to wait before fetching assets

/**
 * en-US and en-CA are not official coursera-supported language codes, but are included in this set
 * because they have somehow populated our data for approximately 200 courses.
 */
export const AVAILABLE_AZURE_API_LANGUAGE_CODES = new Set([
  'en',
  'en-US',
  'en-CA',
  'es',
  'pt-BR',
  'pt-PT',
  'zh-CN',
  'zh-TW',
]);

export const ACCESSIBILITY_SETTINGS_PRC_ARTICLE_ID = '360059711431';
