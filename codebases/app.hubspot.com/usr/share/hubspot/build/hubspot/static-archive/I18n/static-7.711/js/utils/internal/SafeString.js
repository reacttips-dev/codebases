'use es6'; // SafeString type to be used to mark I18n params as _not_ needing escaping.
// (concept borrowed from http://handlebarsjs.com/#html-escaping)

export function SafeString(string) {
  // Work even if called without `new`
  if (!(this instanceof SafeString)) {
    return new SafeString(string);
  } else {
    this.string = string;
  }
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
  return '' + this.string;
};

export function initializeSafeString(I18n) {
  I18n.SafeString = SafeString;
}