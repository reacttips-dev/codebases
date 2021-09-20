/* eslint-disable
 */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')('action');
const appCreatorTemplate = require('./action_appCreator');

module.exports = t.renderable(function (data, context, options) {
  const { saved, dateLastEdited, date, url, appCreator } = data;
  const {
    board,
    organization,
    canReply,
    canReplyAll,
    canDelete,
    canEdit,
    canAttachLink,
    canLinkAppCreator,
  } = context;
  const { showOptions, needsDate } = options;

  return t.div('.phenom-meta.quiet', function () {
    if (needsDate) {
      if (saved) {
        if (url) {
          t.a('.date.js-hide-on-sending.js-highlight-link.past', {
            dt: date,
            href: url,
          });
        } else {
          t.span('.date.js-hide-on-sending.past', { dt: date, href: url });
        }
      }
      if (dateLastEdited) {
        t.span(
          '.js-date-title.js-hide-on-sending.past',
          { dt: dateLastEdited },
          function () {
            t.text(' ');
            return t.format('edited');
          },
        );
      }
      if (appCreator) {
        appCreatorTemplate({ appCreator, canLinkAppCreator });
      }
    }
    t.span(
      { class: t.classify({ 'js-spinner': true, hide: saved }) },
      function () {
        t.format('sending-ellipsis');
        return t.raw('&nbsp;');
      },
    );

    if (board) {
      const { boardPLevelAltText, boardPLevelIconClass } = context;
      t.text(' - ');
      t.format('on-board-name', {
        url: board.url,
        name: board.name,
        boardPLevelAltText,
        boardPLevelIconClass,
      });
    }

    if (organization) {
      const { orgPLevelAltText, orgPLevelIconClass } = context;
      t.text(' - ');
      t.format('on-organization-name', {
        url: organization.url,
        name: organization.name,
        orgPLevelAltText,
        orgPLevelIconClass,
      });
    }

    if (showOptions) {
      return t.span('.js-hide-on-sending.middle', function () {
        let needsDash = false;
        const renderDashWhenNeeded = function () {
          if (needsDash) {
            return t.text(' - ');
          } else {
            return (needsDash = true);
          }
        };

        if (canReply) {
          renderDashWhenNeeded();
          t.a(
            {
              href: '#',
              class: canReplyAll
                ? 'js-reply-to-all-action'
                : 'js-reply-to-action',
            },
            () => t.format('reply'),
          );
        }
        if (canEdit) {
          renderDashWhenNeeded();
          t.a('.js-edit-action', { href: '#' }, () => t.format('edit'));
        }
        if (canAttachLink) {
          renderDashWhenNeeded();
          t.a('.js-attach-link', { href: '#' }, () => t.format('attach link'));
        }
        if (canDelete) {
          renderDashWhenNeeded();
          t.a('.js-confirm-delete-action', { href: '#' }, () =>
            t.format('delete'),
          );
        }

        return t.span('.edits-warning.quiet', function () {
          renderDashWhenNeeded();
          return t.format('you-have-unsaved-edits-on-this-field');
        });
      });
    }
  });
});
