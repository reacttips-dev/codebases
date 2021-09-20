// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Attachment } = require('app/scripts/models/attachment');
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { Dates } = require('app/scripts/lib/dates');

class AttachmentList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Attachment;
  }

  initialize(models, options) {
    return this.listenTo(this, 'change:pos', this.sort);
  }

  comparator(attachment) {
    return attachment.get('pos') || Dates.parse(attachment.get('date'));
  }
}
AttachmentList.initClass();

module.exports.AttachmentList = AttachmentList;
