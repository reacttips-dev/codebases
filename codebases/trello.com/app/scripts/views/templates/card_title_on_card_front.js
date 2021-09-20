// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_title_on_card_front',
);

module.exports = t.renderable(function ({ idShort, name, separatorClassName }) {
  // guide/hacks/id-short
  if (idShort) {
    t.span('.card-short-id.hide', () => t.format('idshort', { idShort }));
  }
  if (separatorClassName) {
    return t.div(`.${separatorClassName}`);
  } else {
    return t.text(name);
  }
});
