'use es6';

import I18n from 'I18n';
import moment from 'moment';
import 'moment-timezone';
I18n.moment = moment;
var INTL_STRING_ZONE_ABBR_REGEX = /\s+(\S+)$/; // Match the last "word" in the Intl-formatted string

var DATE_STRING_ZONE_ABBR_REGEX = /[A-Z]{2}\S+/; // Match the first word starting with 2+ capital letters
// Compute user zone name

var userZoneAbbr = function userZoneAbbr() {
  var date = this.toDate(); // First try to get the time zone using Intl, which is standard across cutting-edge browsers

  if (Intl && Intl.DateTimeFormat) {
    I18n.intlTimeZoneFormatter = Intl.DateTimeFormat('en', {
      timeZoneName: 'short'
    });
  }

  var match;

  if (I18n.intlTimeZoneFormatter) {
    match = I18n.intlTimeZoneFormatter.format(date).match(INTL_STRING_ZONE_ABBR_REGEX);

    if (match && match[1]) {
      return match[1];
    }
  } // If that fails, try to get the time zone out of date.toString()


  match = date.toString().match(DATE_STRING_ZONE_ABBR_REGEX);

  if (match) {
    return match[0];
  } // Bad news: The user's browser has no way of giving us this information


  return '';
}; // Converts an existing moment instance to the portal's timezone. You'll typically
// use this (or the `tr_date` jade/handlebars helpers) when rendering a date
// from the server in the UI.
// For example:
//    I18n.moment.utc(dateFromAPI).portalTz()
// Note, you need to wait till I18n is "ready" for this to work correctly in a browser.


I18n.moment.fn.portalTz = function () {
  var portalTzMoment;

  if (arguments.length === 0) {
    portalTzMoment = I18n.moment.fn.tz.call(this, I18n.timezone);
  } else throw new Error('You cannot pass any parameters to portalTz when called on a moment instance. Did you mean to call `I18n.moment.portalTz(...)` instead?');

  return portalTzMoment;
}; // Creates a new moment instance, but interpreting a timestamp (string, number, array, etc)
// in the current portal timezone. You'll typically use this when taking in user's input.
//
// For example:
//
//     momentInstance = I18n.moment.portalTz(someDateFromUserInput)
//
// Also, if you want "now" in the portal's timezone, you can use:
//
//     I18n.moment.portalTz()
// Note, you need to wait till I18n is "ready" for this to work correctly in a browser.


I18n.moment.portalTz = function () {
  var portalTzMoment;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length > 0) {
    var _I18n$moment$tz;

    portalTzMoment = (_I18n$moment$tz = I18n.moment.tz).call.apply(_I18n$moment$tz, [this].concat(args, [I18n.timezone]));
  } else {
    // This is special-cased because of a bug in our version of moment timezone (v0.0.3).
    // There seems to be a fix in https://github.com/moment/moment-timezone/commit/21bad5316b1c695a60041f6bada81632a9ca5964
    // but for now just manually calling `utc()` before
    portalTzMoment = I18n.moment.utc().tz(I18n.timezone);
  }

  return portalTzMoment;
}; // Creates a new moment instance, but interpreting a timestamp (string, number, array, etc)
// in the current user's timezone.
//
// For example:
//
//     momentInstance = I18n.moment.userTz(someDateFromUserInput)
//
// Also, if you want "now" in the portal's timezone, you can use:
//
//     I18n.moment.userTz()
//
// Note, you need to wait till I18n is "ready" for this to work correctly in a browser.


I18n.moment.userTz = function () {
  var userTzMoment;

  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  if (args.length > 0) {
    var _I18n$moment;

    userTzMoment = (_I18n$moment = I18n.moment).call.apply(_I18n$moment, [this].concat(args));
  } else {
    // This is special-cased because of a bug in our version of moment timezone (v0.0.3).
    // There seems to be a fix in https://github.com/moment/moment-timezone/commit/21bad5316b1c695a60041f6bada81632a9ca5964
    // but for now just manually calling `utc()` before
    userTzMoment = I18n.moment();
  }

  userTzMoment.zoneAbbr = userZoneAbbr;
  return userTzMoment;
}; // Show warning if developers try to use zoneAbbr on a moment created with I18n.moment()


var origZoneAbbr = I18n.moment.fn.zoneAbbr;

I18n.moment.fn.zoneAbbr = function () {
  if (this._z === undefined) {
    console.warn('I18n: Time zone abbreviations are not available on moments created with I18n.moment(). Switch to I18n.moment.userTz(), I18n.moment.portalTz(), or I18n.moment.utc(), as appropriate: https://git.hubteam.com/HubSpot/I18n/blob/master/docs/dates.md');
  }

  return origZoneAbbr.call(this);
};