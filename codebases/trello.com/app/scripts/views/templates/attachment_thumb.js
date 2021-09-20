/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { makePreviewCachable } = require('@trello/image-previews');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'attachment_thumb',
);

module.exports = t.renderable(function ({
  canReply,
  canUseViewer,
  date,
  edgeColor,
  editable,
  ext,
  imgSrc,
  isCover,
  isHidden,
  name,
  openIconClass,
  openText,
  plugin,
  previewClass,
  removeText,
  url: href,
  upsellEnabled,
}) {
  const thumbnailPreviewClasses = {
    'attachment-thumbnail-preview': true,
    'js-open-viewer': canUseViewer,
    'attachment-thumbnail-preview-is-cover': isCover,
  };

  if (isHidden) {
    return t.div;
  }

  const styles = {};
  if (imgSrc) {
    styles['background-image'] = t.urlify(makePreviewCachable(imgSrc));
  }
  if (edgeColor) {
    styles['background-color'] = edgeColor;
  }

  t.a(
    {
      href,
      class: t.classify(thumbnailPreviewClasses),
      target: '_blank',
      title: name,
      style: t.stylify(styles),
      rel: 'noreferrer nofollow noopener',
    },
    function () {
      if (plugin) {
        let pluginPreviewStyle = '';
        if (imgSrc == null) {
          pluginPreviewStyle = `background-image: url(${
            plugin.get('icon').url
          });`;
        }
        return t.span(
          '.attachment-thumbnail-preview-plugin',
          { style: pluginPreviewStyle },
          function () {
            if (editable && upsellEnabled) {
              return t.span(
                '.attachment-thumbnail-plugin-enable-link.js-show-power-up-suggestions-info',
                {
                  title: t.l('see-more-with-power-up', {
                    powerUpName: plugin.get('listing').name,
                  }),
                },
                function () {
                  t.icon('power-up');
                  return t.format('get-power-up');
                },
              );
            }
          },
        );
      } else if (previewClass) {
        return t.span({
          class: [
            'attachment-thumbnail-preview-service-logo',
            previewClass,
          ].join(' '),
        });
      } else {
        if (!imgSrc) {
          if (ext) {
            return t.span('.attachment-thumbnail-preview-ext', () =>
              t.text(ext),
            );
          } else {
            return t.span(
              '.icon-lg.icon-attachment.attachment-thumbnail-preview-attachment-icon',
            );
          }
        }
      }
    },
  );

  const titleOptions = function () {
    if (date) {
      t.span(() => t.format('added', { date }));
    }

    if (canReply) {
      t.span(() =>
        t.a(
          '.attachment-thumbnail-details-title-options-item.js-reply',
          { href: '#' },
          () =>
            t.span('.attachment-thumbnail-details-options-item-text', () =>
              t.format('comment'),
            ),
        ),
      );
    }

    if (editable) {
      t.span(() =>
        t.a(
          '.attachment-thumbnail-details-title-options-item.dark-hover.js-confirm-delete',
          { href: '#' },
          () =>
            t.span('.attachment-thumbnail-details-options-item-text', () =>
              t.text(removeText),
            ),
        ),
      );

      return t.span(() =>
        t.a(
          '.attachment-thumbnail-details-title-options-item.dark-hover.js-edit',
          { href: '#' },
          () =>
            t.span('.attachment-thumbnail-details-options-item-text', () =>
              t.format('edit'),
            ),
        ),
      );
    }
  };

  t.p(
    '.attachment-thumbnail-details',
    {
      class: t.classify({
        'js-open-viewer': canUseViewer,
        'js-open-in-new-window': !canUseViewer,
      }),
    },
    function () {
      t.span('.attachment-thumbnail-name', () => t.text(name));

      t.a(
        '.attachment-thumbnail-details-title-action.dark-hover.js-attachment-action.js-direct-link',
        { href, target: '_blank', rel: 'noreferrer nofollow noopener' },
        () => t.icon(openIconClass),
      );

      t.span('.u-block.quiet.attachment-thumbnail-details-title-options', () =>
        titleOptions(),
      );

      t.span('.quiet.attachment-thumbnail-details-options', function () {
        if (editable) {
          t.a(
            '.attachment-thumbnail-details-options-item.dark-hover.hide.js-make-cover',
            { href: '#' },
            function () {
              t.icon('card-cover');
              t.text(' ');
              return t.span(
                '.attachment-thumbnail-details-options-item-text',
                () => t.format('make-cover'),
              );
            },
          );

          t.a(
            '.attachment-thumbnail-details-options-item.dark-hover.hide.js-remove-cover',
            { href: '#' },
            function () {
              t.icon('card-cover');
              t.text(' ');
              return t.span(
                '.attachment-thumbnail-details-options-item-text',
                () => t.format('remove-cover'),
              );
            },
          );
        }
      });
    },
  );
});
