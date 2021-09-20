// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const t = require('app/scripts/views/internal/teacup-with-helpers')('action');
const entityTemplate = require('./entity');
const memberAvatarTemplate = require('./member_avatar');
const actionFooterTemplate = require('./action_footer');
const appCreatorTemplate = require('./action_appCreator');

const contentEntityTypes = ['attachmentPreview', 'comment', 'checkList'];

module.exports = t.renderable(function (data, context, options) {
  const { entities, saved, dateLastEdited, date, url, appCreator } = data;
  const {
    member,
    showReactions,
    showInlineReactionButton,
    canLinkAppCreator,
  } = context;
  const { useEmbedly, useCommentUnfurl, usePreviews } = options;
  let needsDate = true;

  t.div('.phenom-creator', function () {
    if (member) {
      return t.div(
        '.member.js-show-mem-menu',
        {
          class: t.classify({
            'member-deactivated':
              member.isDeactivated || member.activityBlocked,
          }),
          idmember: member.id,
        },
        () => memberAvatarTemplate(member),
      );
    } else {
      return t.span('.icon-lg.icon-member');
    }
  });

  t.div('.phenom-desc', function () {
    for (const entity of Array.from(entities)) {
      if (Array.from(contentEntityTypes).includes(entity.type)) {
        // we only want to render the date before the entity that contains content
        needsDate = false;
        t.span('.inline-spacer', () => t.text(' '));
        t.span('.phenom-date.quiet', function () {
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
            return t.span(
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
        });
      }
      entityTemplate(entity, context, options);
    }

    if (useEmbedly) {
      t.div('.hide.embedly.js-embedly');
    }

    if (useCommentUnfurl) {
      t.div('.hide.unfurled-comment.comment-preview');
    }

    if (usePreviews) {
      return t.div('.hide.previews.js-previews');
    }
  });

  if (showReactions) {
    return t.div('.phenom-reactions', function () {
      t.div('.js-reaction-piles.reaction-piles-container', {
        class: t.classify({
          last: showInlineReactionButton,
          'reaction-piles-container-full': !showInlineReactionButton,
        }),
      });
      return actionFooterTemplate(
        data,
        context,
        _.extend(options, { needsDate }),
      );
    });
  } else {
    return actionFooterTemplate(
      data,
      context,
      _.extend(options, { needsDate }),
    );
  }
});
