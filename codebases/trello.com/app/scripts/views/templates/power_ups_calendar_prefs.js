// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'power_ups_calendar_prefs',
);

module.exports = t.renderable(function ({
  isEnabled,
  isGenerated,
  url,
  canChange,
}) {
  t.p(() =>
    t.format('sync-this-trello-boards-calendar-with-your-personal-calendar'),
  );

  if (isEnabled) {
    t.hr();

    t.strong(() => t.format('icalendar-feed'));

    t.div('.icalendar-url', function () {
      t.input('.full.js-calendar-feed-url', {
        type: 'text',
        value: isGenerated ? url : t.l('generating'),
      });
      return t.a(
        '.button.js-regen-calendar-url',
        { href: '#', class: t.classify({ disabled: !isGenerated }) },
        () => t.span('.icon-sm.icon-refresh.dark-hover'),
      );
    });

    return t.div('.u-text-align-center', () =>
      t.a(
        '.js-select.js-calendar-pref-feed',
        {
          href: '#',
          class: t.classify({ disabled: !canChange }),
          name: 'disabled',
        },
        () => t.span('.name', () => t.format('disable-sync')),
      ),
    );
  } else {
    return t.div('.u-text-align-center', () =>
      t.a(
        '.js-select.js-calendar-pref-feed',
        {
          href: '#',
          class: t.classify({ disabled: !canChange }),
          name: 'enabled',
        },
        () => t.span('.name', () => t.format('enable-sync')),
      ),
    );
  }
});
