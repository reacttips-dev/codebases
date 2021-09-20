// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'date_picker',
);

module.exports = t.renderable(function ({
  upsellEnabled,
  canChangePowerUps,
  canEnableAdditionalPowerUps,
  customReminderSettings,
  selectedReminderSetting,
}) {
  t.div('.datepicker-select.u-clearfix', function () {
    t.div('.datepicker-select-date', () =>
      t.label('.datepicker-select-label', function () {
        t.format('date');
        return t.input(
          '.datepicker-select-input.js-dpicker-date-input.js-autofocus',
          { type: 'text', placeholder: t.l('enter-date'), tabindex: 101 },
        );
      }),
    );

    return t.div('.datepicker-select-time', () =>
      t.label('.datepicker-select-label', function () {
        t.format('time');
        return t.input('.datepicker-select-input.js-dpicker-time-input', {
          type: 'text',
          placeholder: t.l('enter-time'),
          tabindex: 102,
        });
      }),
    );
  });

  t.div('.pickers.js-dpicker-cal');

  if (customReminderSettings) {
    t.label(() => t.format('set-reminder'));
    t.select('.js-custom-reminder', () =>
      (() => {
        const result = [];
        for (const reminderSetting of Array.from(customReminderSettings)) {
          const isSelected = reminderSetting.value === selectedReminderSetting;
          result.push(
            t.optionSelected(isSelected, { value: reminderSetting.value }, () =>
              t.text(reminderSetting.text),
            ),
          );
        }
        return result;
      })(),
    );
    t.div('.reminder-clarification', () => t.format('reminder-clarification'));
  }

  t.div('.datepicker-confirm-btns', function () {
    t.input('.nch-button.nch-button--primary.wide.confirm', {
      type: 'submit',
      value: t.l('save'),
      tabindex: 103,
    });

    return t.button(
      '.nch-button.nch-button--danger.remove-date.js-remove-date',
      { type: 'button', tabindex: 104 },
      () => t.format('remove'),
    );
  });

  t.div('.js-enable-cal.hide', function () {
    t.hr();

    if (canEnableAdditionalPowerUps) {
      t.p(() =>
        t.a(
          '.quiet-button.mod-with-image.js-enable-calendar-powerup',
          { href: '#' },
          () =>
            t.icon('power-up', 'enable-the-calendar-power-up', {
              class: 'quiet-button-icon',
            }),
        ),
      );

      return t.p('.u-bottom.quiet', () =>
        t.format(
          'you-ll-get-a-calendar-view-of-your-cards-and-an-ical-feed-woo',
        ),
      );
    } else {
      if (upsellEnabled) {
        return t.p('.u-bottom.quiet', function () {
          t.format('upgrade-to-business-class-to-enable-the-calendar-power-up');
          t.text(' ');
          return t.format(
            'you-ll-get-a-calendar-view-of-your-cards-and-an-ical-feed-woo',
          );
        });
      }
    }
  });

  return t.div('.js-cal-enabled.hide', function () {
    t.hr();

    return t.p('.helper', function () {
      if (canChangePowerUps) {
        return t.format(
          'click-the-calendar-button-in-the-board-header-to-open-the-calendar-to-change-calendar-settings-click-power-ups-in-the-board-menu',
        );
      } else {
        return t.format(
          'click-the-calendar-button-in-the-board-header-to-open-the-calendar',
        );
      }
    });
  });
});
