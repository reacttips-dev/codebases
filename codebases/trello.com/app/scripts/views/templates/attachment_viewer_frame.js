// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'attachment_viewer_frame',
);
const { makePreviewCachable } = require('@trello/image-previews');

module.exports = () =>
  t.div(
    {
      class: `attachment-viewer-frame js-close-viewer ${t.mustacheVar(
        'directionClass',
      )}`,
      'data-idAttachment': t.mustacheVar('id'),
    },
    () =>
      t.div('.attachment-viewer-frame-preview-wrapper', () =>
        t.div(
          '.attachment-viewer-frame-preview',
          {
            class: t.classify({
              'attachment-viewer-frame-preview-image-wrapper': t.mustacheVar(
                'isImage',
              ),
              'attachment-viewer-center': t.mustacheVar('isAudio'),
            }),
          },
          function () {
            if (t.mustacheVar('isImage')) {
              t.img('.attachment-viewer-frame-preview-image.js-stop', {
                src: makePreviewCachable(t.mustacheVar('url')),
                alt: t.mustacheVar('name'),
              });
            }

            if (t.mustacheVar('isAudio')) {
              t.audio(
                '.attachment-viewer-frame-preview-audio.js-stop',
                { controls: true, name: t.mustacheVar('name') },
                () => t.source({ src: t.mustacheVar('url') }),
              );
            }

            if (t.mustacheVar('isVideo')) {
              t.video('.attachment-viewer-frame-preview-video.js-stop', {
                controls: true,
                name: t.mustacheVar('name'),
                src: t.mustacheVar('url'),
              });
            }

            if (t.mustacheVar('isIFrameable')) {
              t.iframe('.attachment-viewer-frame-preview-iframe.js-stop', {
                src: t.mustacheVar('url'),
              });
            }

            if (t.mustacheVar('isPlaceholder')) {
              return t.p('.attachment-viewer-frame-preview-placeholder', () =>
                t.format(
                  'there-is-no-preview-available-for-this-attachment-opentext',
                  {
                    url: t.mustacheVar('url'),
                    openText: t.mustacheVar('openText'),
                  },
                ),
              );
            }
          },
        ),
      ),
  );
