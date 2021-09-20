import { TEXT_EDITOR_LANGUAGE_MAP } from './constants';
import { unescape } from './unescape';

/**
 * Get the monaco language name
 * @param {string} language
 * @returns {string}
 */
export function getMonacoLanguageName (language) {
  return TEXT_EDITOR_LANGUAGE_MAP[language] || language;
}

export const transformResponseForLanguage = {
  json: function (value) {
    // This unescape step handles escape sequences like -
    // 1. Unicode code points - hexadecimal - fixed length - \uD834
    // 2. Special escape characters - \/
    return unescape(value);
  }
};
