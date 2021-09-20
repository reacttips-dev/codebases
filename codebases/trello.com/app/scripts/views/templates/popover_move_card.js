// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_move_card',
);

module.exports = function () {
  const suggestions = t.mustacheVar('suggestions');
  if (suggestions.length > 0) {
    t.div('.pop-over-section.js-suggestions', function () {
      t.h4(function () {
        t.icon('sparkle');
        return t.format('suggested');
      });

      for (const list of Array.from(suggestions)) {
        t.a(
          '.button-link.js-suggested-move',
          {
            class: t.classify({
              'flip-icon': list.direction === 'left',
            }),
            'data-id': list.id,
            'data-position': list.position,
            href: '#',
          },
          function () {
            t.icon('move');
            return t.text(list.name);
          },
        );
      }
    });
  }

  return t.div('.pop-over-section', function () {
    t.h4(() => t.format('select-destination'));

    t.mustachePartial(
      require('app/scripts/views/templates/move_card_controls'),
    );

    return t.input('.nch-button.nch-button--primary.wide.js-submit', {
      type: 'submit',
      value: t.l('move'),
    });
  });
};
