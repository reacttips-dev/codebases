// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'attachment_thumb_processing',
);

module.exports = t.renderable((options) =>
  t.div(
    '.attachment-thumbnail.attachment-thumbnail-processing.js-attachment-thumb-processing',
    () => {
      t.span('.spinner.small');
      t.raw('&nbsp;');
      return t.format(
        options?.isLoadingVersion ? 'loading-ellipsis' : 'processing-ellipsis',
      );
    },
  ),
);
