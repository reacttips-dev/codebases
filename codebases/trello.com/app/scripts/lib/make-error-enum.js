// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const customError = require('@atlassian/trello-error-ext');
const assert = require('app/scripts/lib/assert');

const reservedBaseName = 'Error';

module.exports.makeErrorEnum = function (namespace, names) {
  const baseClass = customError([namespace, reservedBaseName].join('::'));

  for (const name of Array.from(names)) {
    assert(name !== reservedBaseName, `${name} is the reserved base name!`);
    assert(
      !(name in baseClass),
      `You can't use ${name} as the name of a custom error`,
    );
    baseClass[name] = customError([namespace, name].join('::'), {}, baseClass);
  }

  return baseClass;
};
