'use strict';

var spaces = /\s+/g;
var dashes = /[-_]+/g;
var dashesLeadTrail = /^-|-$/g;
var invalid = /[^\x20\x2D0-9A-Z\x5Fa-z\xC0-\xD6\xD8-\xF6\xF8-\xFF]/g;
var accentCodePoints = /[\xC0-\xFF]/g;
var accents = [
  [/[\xC0-\xC5]/g, 'A'],
  [/[\xC6]/g, 'AE'],
  [/[\xC7]/g, 'C'],
  [/[\xC8-\xCB]/g, 'E'],
  [/[\xCC-\xCF]/g, 'I'],
  [/[\xD0]/g, 'D'],
  [/[\xD1]/g, 'N'],
  [/[\xD2-\xD6\xD8]/g, 'O'],
  [/[\xD9-\xDC]/g, 'U'],
  [/[\xDD]/g, 'Y'],
  [/[\xDE]/g, 'P'],
  [/[\xE0-\xE5]/g, 'a'],
  [/[\xE6]/g, 'ae'],
  [/[\xE7]/g, 'c'],
  [/[\xE8-\xEB]/g, 'e'],
  [/[\xEC-\xEF]/g, 'i'],
  [/[\xF1]/g, 'n'],
  [/[\xF2-\xF6\xF8]/g, 'o'],
  [/[\xF9-\xFC]/g, 'u'],
  [/[\xFE]/g, 'p'],
  [/[\xFD\xFF]/g, 'y']
];
var replacements = [[
  /&/g, ' and '
], [
  /\./g, ''
]];

function slugify (text) {
  var partial = translate(text, replacements);
  if (partial.search(accentCodePoints) === -1) {
    return partial;
  }
  return translate(partial, accents);
}

function translate (text, translations) {
  return translations.reduce(function (text, pair) {
    return text.replace(pair[0], pair[1]);
  }, text);
}

function parse (input) {
  return input === null || input === void 0 ? '' : input.toString();
}

function slug (text) {
  return slugify(parse(text))
    .replace(invalid, '-') // remove invalid chars
    .replace(spaces, '-') // collapse whitespace and replace by '-'
    .replace(dashes, '-') // collapse dashes
    .replace(dashesLeadTrail, '') // remove leading or trailing dashes
    .trim()
    .toLowerCase();
}

module.exports = slug;
