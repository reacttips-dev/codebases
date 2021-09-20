/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Browser = require('@trello/browser');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_in_list',
);
const { Util } = require('app/scripts/lib/util');
const { makePreviewCachable } = require('@trello/image-previews');

module.exports = t.renderable(function ({
  cover,
  hasCover,
  hideCover,
  hasStickers,
  attachmentCoverUrl,
}) {
  let calculatedHeight;
  if (cover == null || hideCover || !hasCover) {
    return t.div('.list-card-cover.js-card-cover');
  }

  const {
    idAttachment,
    idUploadedBackground,
    color,
    scaled,
    edgeColor,
    size,
    idPlugin,
  } = cover;

  if (size === 'full') {
    return t.div('.list-card-cover.js-card-cover');
  }

  if (color) {
    calculatedHeight = hasStickers ? 64 : 32;

    return t.div(
      `.list-card-cover.js-card-cover.color-card-cover.color-card-cover-${color}.is-covered`,
      {
        style: t.stylify({
          height: `${calculatedHeight}px`,
        }),
      },
    );
  } else if (idAttachment || idUploadedBackground || idPlugin) {
    let left;
    const minWidth = Browser.isHighDPI() ? 600 : 300;
    let preview =
      (left = Util.smallestPreviewBiggerThan(scaled, minWidth)) != null
        ? left
        : Util.biggestPreview(scaled);

    // Not sure how this can happen but supporting it anyway just in case it's a legacy thing.
    if (preview == null && idAttachment) {
      preview = { url: attachmentCoverUrl };
    }

    const maxHeight = Math.min(preview.height, 260); // An arbitrarily chosen number
    calculatedHeight = (preview.height * 245) / preview.width;

    return t.div('.list-card-cover.js-card-cover.is-covered', {
      style: t.stylify({
        height: `${
          calculatedHeight < maxHeight ? calculatedHeight : maxHeight
        }px`,
        'background-color': edgeColor != null ? edgeColor : 'transparent',
        'background-image': `url("${makePreviewCachable(preview.url)}")`,
        'background-size': calculatedHeight <= maxHeight ? 'cover' : 'contain',
      }),
    });
  }
});
