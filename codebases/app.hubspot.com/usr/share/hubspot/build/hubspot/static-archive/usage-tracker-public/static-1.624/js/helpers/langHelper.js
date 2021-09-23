'use es6';

var preferredLanguage = navigator.languages ? navigator.languages[0] : navigator.language;
export var defaultLanguage = preferredLanguage ? preferredLanguage.toLowerCase() : 'en-us';