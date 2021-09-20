// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')('list');

module.exports = t.renderable(
  ({ name, subscribed, loggedIn, editable, isTemplate, canRecordVideo }) =>
    t.div('.list.js-list-content', function () {
      const headerClasses = {
        'list-header': true,
        'js-list-header': true,
        'u-clearfix': true,
        'is-menu-shown': loggedIn,
        'is-subscribe-shown': subscribed,
      };

      t.div({ class: t.classify(headerClasses) }, function () {
        const inputClasses = {
          'list-header-name': true,
          'mod-list-name': true,
          'js-list-name-input': true,
        };

        t.div('.list-header-target.js-editing-target');

        t.h2(
          '.list-header-name-assist.js-list-name-assist',
          { dir: 'auto' },
          name,
        );

        t.textarea(
          {
            class: t.classify(inputClasses),
            'aria-label': name,
            spellcheck: 'false',
            dir: 'auto',
            maxLength: 512,
          },
          name,
        );

        t.div('.list-header-extras', function () {
          const subscribeClasses = {
            'list-header-extras-subscribe': true,
            'js-list-subscribed': true,
          };

          if (!subscribed) {
            subscribeClasses['hide'] = true;
          }

          t.span({ class: t.classify(subscribeClasses) }, () =>
            t.span('.icon-sm.icon-subscribe.mod-quiet'),
          );

          t.span('.list-header-extras-limit-badge.js-list-limit-badge.hide');

          if (
            (loggedIn && !isTemplate) ||
            (loggedIn && isTemplate && editable)
          ) {
            return t.a(
              '.list-header-extras-menu.dark-hover.js-open-list-menu.icon-sm.icon-overflow-menu-horizontal',
              {
                href: '#',
                'aria-label': t.l('list-actions-ellipsis'),
              },
              () => t.div(),
            );
          }
        });

        return t.p('.list-header-num-cards.hide.js-num-cards');
      });

      return t.div(
        '.card-composer-container.js-card-composer-container',
        function () {
          t.a(
            '.open-card-composer.js-open-card-composer',
            { href: '#' },
            function () {
              t.icon('add');
              t.span('.js-add-a-card', () => t.format('add-a-card'));
              if (!canRecordVideo) {
                return t.span('.js-add-another-card.hide', () =>
                  t.format('add-another-card'),
                );
              }
            },
          );

          if (canRecordVideo) {
            t.div('.js-card-record-button.dark-background-hover');
          }

          return t.div(
            '.js-card-templates-button.card-templates-button-container.dark-background-hover',
          );
        },
      );
    }),
);
