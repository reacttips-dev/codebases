/* eslint-disable
    eqeqeq,
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
const t = require('app/scripts/views/internal/teacup-with-helpers')('label');

module.exports = t.renderable(function ({ color, name, extraClasses }) {
  const classes = { 'card-label': true };

  if (color) {
    classes[`card-label-${color}`] = true;
  }

  if (extraClasses) {
    for (const c of Array.from(extraClasses)) {
      classes[c] = true;
    }
  }

  return t.span(
    {
      class: t.classify(classes),
      title: name != null ? name : `${color} label (default)`,
    },
    () =>
      t.span({ class: 'label-text' }, function () {
        if (name) {
          return t.text(name);
        } else {
          return t.raw('&nbsp;');
        }
      }),
  );
});
