/* eslint-disable
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { isPlainObject } = require('./is-plain-object');
const React = require('react');

//   _  _     ___   __   __          __   __   ___    _   _    ___     ___
//  | || |   | __|  \ \ / /    o O O \ \ / /  / _ \  | | | |  / __|   | __|
//  | __ |   | _|    \ V /    o       \ V /  | (_) | | |_| |  \__ \   | _|
//  |_||_|   |___|   _|_|_   TS__[O]  _|_|_   \___/   \___/   |___/   |___|
// _|"""""|_|"""""|_| """ | {======|_| """ |_|"""""|_|"""""|_|"""""|_|"""""|
// "`-0-0-'"`-0-0-'"`-0-0-'./o--000'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'
//
// Listen up. Listen good.
//
// This is an approximation of equality.
//
// As you'd expect, sometimes it's going to say things are different when
// they're really the same.
//
// As you would *not* expect, sometimes it's going to say that two things are
// the same when they're completely (well, slightly) different.
//
// This is important: this function doesn't know how to check equality on
// functions.
//
// If you start passing in different functions *anywhere* in the props, it's
// going to say "yeah that looks like it's the same," even when it isn't.
//
// To get around this, you can ensure that other properties will change when the
// function does.  For example, passing a function bound to `@`?  Make sure
// there's an `id: @id` property.
//
// Real talk: Don't use this if there's something smarter you could be doing.

const areAlike = function (oldObj, newObj) {
  if (isPlainObject(oldObj) && isPlainObject(newObj)) {
    if (_.keys(oldObj).length !== _.keys(newObj).length) {
      return false;
    }
    for (const k in oldObj) {
      if (!areAlike(oldObj[k], newObj[k])) {
        return false;
      }
    }
  } else if (React.isValidElement(oldObj) && React.isValidElement(newObj)) {
    if (!areAlike([oldObj.props, oldObj.state], [newObj.props, newObj.state])) {
      return false;
    }
  } else if (_.isArray(oldObj) && _.isArray(newObj)) {
    if (oldObj.length !== newObj.length) {
      return false;
    }
    for (let i = 0; i < oldObj.length; i++) {
      if (!areAlike(oldObj[i], newObj[i])) {
        return false;
      }
    }
  } else if (_.isFunction(oldObj) && _.isFunction(newObj)) {
    return true;
  } else {
    if (oldObj !== newObj) {
      return false;
    }
  }

  return true;
};

module.exports.naiveShouldComponentUpdate = function (newProps, newState) {
  return !(areAlike(newProps, this.props) && areAlike(newState, this.state));
};
