// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'select_member',
);
const memberTemplate = require('./member');

module.exports = () =>
  t.li(
    {
      class: `item${t.mustacheBlock(
        'isActive',
        () => ' active',
      )}${t.mustacheBlock(
        'unconfirmed',
        () => ' unconfirmed',
      )}${t.mustacheBlock('inactive', () => ' inactive')}${t.mustacheBlock(
        'isKnownMember',
        () => ' js-autoselect',
      )} js-member-item${t.mustacheBlock('disabled', () => ' disabled')}`,
    },
    () =>
      t.a(
        {
          href:
            t.mustacheBlock('url', () => t.mustacheVar('url')) +
            t.mustacheBlockInverted('url', () => '#'),
          class: `name js-select-member ${t.mustacheBlock(
            'extraText',
            () => 'multi-line',
          )}`,
          idMember: t.mustacheVar('id'),
          title: t.mustacheVar('viewTitle'),
          autocompleteText: t.mustacheVar('username'),
        },
        function () {
          t.span(
            {
              class: `member js-member${t.mustacheBlock(
                'isVirtual',
                () => ' virtual',
              )}${t.mustacheBlock(
                'activityBlocked',
                () => ' member-deactivated',
              )}${t.mustacheBlock(
                'isDeactivated',
                () => ' member-deactivated',
              )}`,
            },
            () => memberTemplate(t.mustacheVar('.')),
          );

          t.span(
            '.full-name',
            {
              name:
                t.mustacheVar('fullName') +
                t.mustacheBlock(
                  'username',
                  () => ` (${t.mustacheVar('username')})`,
                ),
              'aria-hidden': true,
            },
            function () {
              t.text(t.mustacheVar('fullName'));
              t.text(' ');
              return t.mustacheBlock('username', () =>
                t.span('.username', () =>
                  t.text(`(${t.mustacheVar('username')})`),
                ),
              );
            },
          );

          t.mustacheBlock('extraText', () =>
            t.div('.extra-text.quiet', () =>
              t.format('extratext', { extraText: t.mustacheVar('extraText') }),
            ),
          );

          t.icon('check', {
            class: 'checked-icon',
            'aria-label': t.l('added-to-card'),
          });

          t.icon('forward', { class: 'light option js-open-option' });

          t.mustacheBlock('inactive', () =>
            t.span('.quiet.sub-name', () => t.format('inactive-account')),
          );

          return t.mustacheBlock('unconfirmed', () =>
            t.span('.quiet.sub-name', () => t.format('unconfirmed-user')),
          );
        },
      ),
  );
