/* eslint-disable
 */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const View = require('app/scripts/views/internal/view');
const attachmentThumbProcessingTemplate = require('app/scripts/views/templates/attachment_thumb_processing');

module.exports = class InProgressAttachmentView extends View {
  render() {
    this.$el.html(attachmentThumbProcessingTemplate(this.options));
    return this;
  }
};
