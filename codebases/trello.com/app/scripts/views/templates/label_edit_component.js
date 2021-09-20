// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'label_edit_component',
);

module.exports = function () {
  t.label({ for: 'labelName' }, () => t.format('name'));
  t.input('.js-autofocus.js-label-name', {
    id: 'labelName',
    type: 'text',
    name: 'name',
    value: t.mustacheVar('label.name'),
  });

  t.label(() => t.format('select-a-color'));

  t.div('.u-clearfix', () =>
    t.mustacheBlock('colors', () =>
      t.span(
        {
          class: `card-label mod-edit-label mod-clickable card-label-${t.mustacheVar(
            'color',
          )} palette-color js-palette-color`,
          'data-color': t.mustacheVar('color'),
        },
        () =>
          t.span({
            class: `card-label-color-select-icon icon-sm icon-check light ${t.mustacheBlockInverted(
              'selected',
              () => 'hide',
            )} js-palette-select`,
          }),
      ),
    ),
  );

  t.div('.edit-labels-no-color-section.u-clearfix', function () {
    t.div('.edit-labels-no-color-section-color', () =>
      t.span(
        {
          class:
            'card-label mod-edit-label mod-clickable card-label-null palette-color js-palette-color',
          'data-color': null,
        },
        () =>
          t.span({
            class: `card-label-color-select-icon icon-sm icon-check light ${t.mustacheBlockInverted(
              'noColor',
              () => 'hide',
            )} js-palette-select`,
          }),
      ),
    );

    return t.div('.edit-labels-no-color-section-text', function () {
      t.p('.u-bottom', () => t.format('no-color'));
      return t.p('.u-bottom.quiet', () =>
        t.format('this-wont-show-up-on-the-front-of-cards'),
      );
    });
  });

  return t.div('.u-clearfix', function () {
    t.input('.nch-button.nch-button--primary.wide.js-submit', {
      type: 'submit',
      value: t.mustacheVar('submitText'),
    });

    return t.div('.u-float-right.js-accessory-view-holder');
  });
};
