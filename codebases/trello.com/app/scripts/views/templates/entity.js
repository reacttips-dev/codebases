// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { makePreviewCachable } = require('@trello/image-previews');
const t = require('app/scripts/views/internal/teacup-with-helpers')('entity');
const commentEditControls = require('app/scripts/views/templates/comment_edit_controls');
const commentOptions = require('app/scripts/views/templates/comment_options');
const AttachmentHelpers = require('app/scripts/views/attachment/helpers');

module.exports = t.renderable(function (entity, context, options) {
  let avatarUrl,
    id,
    isFriendly,
    isTrello,
    link,
    originalUrl,
    previewUrlForRes,
    username,
    url,
    nameHtml,
    textHtml,
    canEdit,
    canRecordVideo,
    canViewVideo,
    truncateComment,
    extremeTruncation,
    color,
    classes,
    title,
    showCompactAttachmentPreview,
    date,
    current;
  const { type, text } = entity;

  switch (type) {
    case 'text':
    case 'list':
    case 'checklist':
    case 'plugin':
    case 'date':
      return t.text(text);

    case 'card':
      ({ url, nameHtml } = entity);
      if (nameHtml) {
        return t.span('.js-friendly-links-for-link-card', () =>
          t.raw(nameHtml),
        );
      }
      return t.a('.action-card', { href: url }, () => t.text(text));

    case 'board':
      ({ url } = entity);
      return t.a({ href: url }, () => t.text(text));

    case 'organization':
      ({ url } = entity);
      return t.a({ href: url }, text || t.l('an-organization'));

    case 'checkItem':
      ({ nameHtml } = entity);
      if (nameHtml) {
        return t.span('.js-friendly-links', () => t.raw(nameHtml));
      } else {
        return t.text(text);
      }

    case 'comment':
      ({ textHtml } = entity);
      ({ canEdit, canRecordVideo, canViewVideo } = context);
      ({ truncateComment, extremeTruncation } = options);
      return t.div('.comment-container', function () {
        const classes = {
          'action-comment': true,
          'can-edit': canEdit,
          'can-view-video': canViewVideo,
          markeddown: true,
          'js-comment': true,
          'is-truncated': truncateComment,
          'extreme-truncation': extremeTruncation,
        };
        return t.div({ class: t.classify(classes), dir: 'auto' }, function () {
          if (truncateComment) {
            t.div('.action-comment-fade-button.js-expand-comment');
          }
          t.div('.current-comment.js-friendly-links.js-open-card', () =>
            t.raw(textHtml),
          );
          if (canEdit) {
            return t.div('.comment-box.mod-editing-comment', function () {
              t.textarea(
                '.comment-box-input.js-text',
                { 'aria-label': t.l('comment-box-label') },
                () => t.text(text),
              );
              commentEditControls();
              return commentOptions(true, canRecordVideo);
            });
          }
        });
      });

    case 'customField':
      return t.text(text);

    case 'customFieldItem':
      return t.text(text);

    case 'label':
      ({ color } = entity);
      classes = { 'card-label': true };
      classes[color + '-label'] = true;
      title = text || `${color} label (default)`;

      return t.span({ class: t.classify(classes), title }, function () {
        if (text) {
          return t.text(text);
        } else {
          return t.raw('&nbsp;');
        }
      });

    case 'attachment':
      ({ link, url, isTrello, id, isFriendly } = entity);
      if (link || isFriendly) {
        if (AttachmentHelpers.isViewerable(url)) {
          return t.a(
            '.js-open-attachment-viewer',
            { href: url, 'data-idattachment': id },
            () => t.text(text),
          );
        } else if (isTrello) {
          return t.a('.js-friendly-links', { href: url }, () => t.text(text));
        } else {
          return t.a(
            '.js-friendly-links',
            { href: url, target: '_blank', rel: 'noopener noreferrer' },
            () => t.text(text),
          );
        }
      } else {
        return t.span('.attachment-deleted', () => t.text(text));
      }

    case 'attachmentPreview':
      ({ previewUrlForRes, originalUrl, id } = entity);
      ({ showCompactAttachmentPreview } = options);

      if (previewUrlForRes) {
        classes = {
          'js-open-attachment-viewer': !showCompactAttachmentPreview,
          'js-open-card': showCompactAttachmentPreview,
          'js-friendly-links': true,
        };

        const previewClasses = {
          'attachment-image-preview': true,
          'mod-compact-image-preview': showCompactAttachmentPreview,
        };

        return t.a(
          {
            class: t.classify(classes),
            href: originalUrl,
            target: '_blank',
            'data-idattachment': id,
          },
          () =>
            t.img({
              class: t.classify(previewClasses),
              src: makePreviewCachable(previewUrlForRes),
            }),
        );
      } else {
        return t.raw('&nbsp;');
      }

    case 'member':
      ({ id, avatarUrl, username } = entity);
      return t.span(
        '.inline-member.js-show-mem-menu',
        { idMember: id },
        function () {
          if (avatarUrl) {
            title = `${text} (${username})`;
            t.img('.inline-member-av', {
              src: [avatarUrl, '30.png'].join('/'),
              alt: title,
              title,
            });
          }
          return t.span('.u-font-weight-bold', () => t.text(text));
        },
      );

    case 'relDate':
      ({ date, current } = entity);
      return t.span('.rel-date', { dt: date, text }, () => t.text(current));

    default:
      break;
  }
});
