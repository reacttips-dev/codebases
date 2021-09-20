/* eslint-disable
    eqeqeq,
    no-prototype-builtins,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const f = require('effing');
const assert = require('app/scripts/lib/assert');
const pattern = require('matchbook');
const { lookupRebrandedString } = require('@trello/i18n');

const lookupString = function (strings, keyPath) {
  const rebrandedValue = lookupRebrandedString(strings, keyPath);
  const val = rebrandedValue || strings[keyPath.join('.')];
  if (val == null) {
    return undefined;
  }

  assert(
    typeof val === 'string',
    `key ${keyPath.join('.')} did not resolve to a string`,
  );
  return val;
};

class Hole {
  constructor(key) {
    this.key = key;
  }
}

class Literal {
  constructor(value) {
    this.value = value;
  }
}

// Does not currently allow literal curly braces to appear in templates.
// Doing that requires escaping which requires lookbehind *or* reversing +
// lookahead and I'm not gonna do that right now so screw it.
const parseFormatString = (formatString) =>
  // capturing matches in split tested in
  // FF 34, Chrome 39, Safari 8, IE 10
  formatString
    .split(/(\{[^{}]+\})/)
    .map(function (group) {
      if (group.length === 0) {
        return null;
      }
      if (group[0] === '{') {
        return new Hole(group.substr(1, group.length - 2));
      } else {
        return new Literal(group);
      }
    })
    .filter(f.id);
const normalizeKeyPath = pattern(function (match) {
  match([String], f.method('split', '.'));
  return match([Array], f.id);
});

const lookup = function (strings, keyPath, visitor) {
  keyPath = normalizeKeyPath(keyPath);
  const formatString = lookupString(strings, keyPath);

  if (formatString == null) {
    return undefined;
  }

  return parseFormatString(formatString);
};

const map = (coll, fn) => coll.map(f.choke(1, fn));

module.exports.normalizeKeyPath = normalizeKeyPath;
module.exports.lookup = lookup;
module.exports.makeVisitor = (onLiteral, onHole) => (
  holesAndLiterals,
  ...args
) =>
  map(
    holesAndLiterals,
    pattern(function (match) {
      match([Hole], ({ key }) => onHole(key, ...Array.from(args)));
      return match([Literal], ({ value }) =>
        onLiteral(value, ...Array.from(args)),
      );
    }),
  );
module.exports.visit = function (strings, keyPath, visitor, ...args) {
  const holesAndLiterals = lookup(strings, keyPath);
  if (holesAndLiterals == null) {
    return undefined;
  }
  return visitor(holesAndLiterals, ...Array.from(args));
};
