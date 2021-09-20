// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'attachment_viewer',
);

module.exports = function () {
  t.div('.attachment-viewer-header.js-close-viewer', () =>
    t.span('.icon-lg.icon-close.attachment-viewer-header-close-icon'),
  );

  t.div('.attachment-viewer-underlay.js-close-viewer');

  t.div('.attachment-viewer-frames.js-frames');

  t.div('.attachment-viewer-overlay', () =>
    t.div('.attachment-viewer-frame-details.js-display-frame-details'),
  );

  t.a('.attachment-viewer-next-frame-btn.js-show-next-frame', () =>
    t.span('.icon-lg.icon-forward.light.attachment-viewer-next-frame-btn-icon'),
  );

  return t.a('.attachment-viewer-prev-frame-btn.js-show-prev-frame', () =>
    t.span('.icon-lg.icon-back.light.attachment-viewer-prev-frame-btn-icon'),
  );
};
