/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { l } = require('app/scripts/lib/localize');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'reactions',
);
const View = require('app/scripts/views/internal/view');
const joinn = require('joinn');

const formattedName = (name) =>
  t.render(() => t.span('.reaction-fullname', () => t.text(name)));
const formattedReaction = (reaction) =>
  t.render(() => t.strong(() => t.text(reaction)));
const template = t.renderable(function ({ names, reaction }) {
  const justYou = names?.[0] === l('You') && names.length === 1;
  names = names.map(formattedName);
  return t.div('.reaction-tooltip', function () {
    if (names !== '' && reaction == null) {
      return t.raw(joinn(names, ', ', ` ${t.l('and')} `));
    } else if (justYou) {
      return t.raw(
        t.l(
          'reaction-tooltip-you',
          {
            reaction: formattedReaction(reaction),
          },
          { raw: true },
        ),
      );
    } else if (names.length === 1) {
      return t.raw(
        t.l(
          'reaction-tooltip',
          {
            name: names[0],
            reaction: formattedReaction(reaction),
          },
          { raw: true },
        ),
      );
    } else if (names.length > 1) {
      return t.raw(
        t.l(
          'reaction-tooltip-plural',
          {
            names: joinn(names, ', ', ` ${t.l('and')} `),
            reaction: formattedReaction(reaction),
          },
          { raw: true },
        ),
      );
    } else {
      return t.raw(formattedReaction(reaction));
    }
  });
});

module.exports = class ReactionTooltip extends View {
  renderOnce() {
    let { names } = this.options;
    const { reaction } = this.options;
    if (names == null) {
      names = [];
    }

    this.$el.append(template({ names, reaction }));
    return this;
  }
};
