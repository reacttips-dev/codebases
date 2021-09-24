'use es6';

import { initializeNewLoaderSettings } from '../../utils/internal/newLoaderSettings';
import { initializeTranslateHelpers } from '../../utils/internal/translateHelpers';
import { initializeParamFormatters } from '../../utils/internal/paramFormatters';
import { initializeWarnings } from '../../utils/internal/warnings';
import { initializeText } from '../../utils/internal/text';
import { initializeListFormatters } from '../../utils/internal/listFormatters';
import { initializeNumberMethods } from '../../utils/internal/numberFormatters';
import { initializeSizeFormatters } from '../../utils/internal/sizeFormatters';
import { initializeHTMLFormatters } from '../../utils/internal/htmlFormatters';
import { initializeLocaleSettings } from '../../utils/internal/localeSettings';
import { initializeSafeString } from '../../utils/internal/SafeString';
import { initializeDebuggers } from '../../utils/internal/debugHelpers';
export function initializeI18nMethods(I18n) {
  // Global settings for I18n
  // Or methods intended as internal API for I18n
  // Should be removed as methods when I18n library moves to reference functions directly
  initializeLocaleSettings(I18n);
  initializeNewLoaderSettings(I18n);
  initializeTranslateHelpers(I18n);
  initializeWarnings(I18n);
  initializeParamFormatters(I18n);
  initializeDebuggers(I18n); // Mostly functions we intend for people to use

  initializeText(I18n);
  initializeListFormatters(I18n);
  initializeNumberMethods(I18n);
  initializeSizeFormatters(I18n);
  initializeHTMLFormatters(I18n);
  initializeSafeString(I18n);
}