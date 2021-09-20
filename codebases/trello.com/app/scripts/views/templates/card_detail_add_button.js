// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_detail_add_button',
);

module.exports = t.renderable(function ({ klass }) {
  const classes = { 'card-detail-item-add-button': true };
  classes[klass] = true;
  return t.a({ class: t.classify(classes) }, () => t.icon('add'));
});
