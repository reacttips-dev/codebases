// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const View = require('app/scripts/views/internal/view');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'select_member',
);

const template = t.renderable(({ text, extraText, mentionCount }) =>
  t.li({ class: 'item js-member-item' }, () =>
    t.a(
      {
        href: '#',
        class: 'js-select-member ',
        title: text,
        autocompleteText: text,
      },
      () =>
        t.span('.text', { title: 'card' }, () =>
          t.text(`${extraText} (${mentionCount})`),
        ),
    ),
  ),
);

module.exports = class SelectFilterableView extends View {
  render() {
    this.$el.html(template(this.options));

    return this;
  }
};
