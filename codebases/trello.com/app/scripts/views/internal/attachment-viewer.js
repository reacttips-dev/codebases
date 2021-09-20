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
const $ = require('jquery');
const AttachmentViewerView = require('app/scripts/views/attachment/attachment-viewer-view');

module.exports = {
  clear() {
    if (this.isActive()) {
      this.viewer.$el.off('remove.attachment-viewer', this._handleViewRemove);
      this.viewer.close();
      this.viewer = null;
    }
  },

  isActive() {
    return this.viewer != null;
  },

  _handleViewRemove() {
    return (this.viewer = null);
  },

  show(options) {
    this.clear();

    this.viewer = new AttachmentViewerView(options);
    // The attachment viewer may remove itself from the DOM
    this.viewer.$el.on(
      'remove.attachment-viewer',
      this._handleViewRemove.bind(this),
    );

    // The attachment viewer view will .remove() itself when it's done
    $('#chrome-container').append(this.viewer.render().el);
  },
};
