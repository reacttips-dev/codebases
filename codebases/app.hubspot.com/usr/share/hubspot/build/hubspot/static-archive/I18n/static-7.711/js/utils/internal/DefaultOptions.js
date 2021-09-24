'use es6'; // Other default options

export var DEFAULT_OPTIONS = {
  // Set default locale. This locale will be used when fallback is enabled and
  // the translation doesn't exist in a particular locale.
  defaultLocale: 'en',
  // Set the current locale to `en`.
  locale: 'en',
  // Set the translation key separator.
  defaultSeparator: '.',
  // Set the placeholder format. Accepts `{placeholder}}` and `%{placeholder}`.}
  // HACK, HubSpot accepts whitespace: `{{ placeholder }}` or `{{placeholder}}` are equivalent
  // , placeholder: /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm
  placeholder: /(?:\{\{)\s?(\S*?)\s?(?:\}\})/gm,
  // Set if engine should fallback to the default locale when a translation
  // is missing.
  fallbacks: false,
  // Set the default translation object.
  translations: {},
  // Set missing translation behavior. 'message' will display a message
  // that the translation is missing, 'guess' will try to guess the string
  missingBehaviour: 'message',
  // if you use missingBehaviour with 'message', but want to know that the
  // string is actually missing for testing purposes, you can prefix the
  // guessed string by setting the value here. By default, no prefix!
  missingTranslationPrefix: ''
};