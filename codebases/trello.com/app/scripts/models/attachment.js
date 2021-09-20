/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const TrelloModel = require('app/scripts/models/internal/trello-model');
const { Util } = require('app/scripts/lib/util');
const parseURL = require('url-parse');

class Attachment extends TrelloModel {
  static initClass() {
    this.prototype.typeName = 'Attachment';
  }
  urlRoot() {
    return `${this.getCard().url()}/attachments`;
  }

  getCard() {
    return this.collection.sourceModel;
  }
  editable() {
    return this.getCard().editable();
  }

  smallestPreviewBiggerThan(width, height) {
    return Util.smallestPreviewBiggerThan(this.get('previews'), width, height);
  }

  previewBetween(minWidth, minHeight, maxWidth, maxHeight) {
    return Util.previewBetween(this.get('previews'), ...arguments);
  }

  biggestPreview() {
    return Util.biggestPreview(this.get('previews'));
  }

  smallestPreview() {
    return Util.smallestPreview(this.get('previews'));
  }

  getType() {
    let left;
    return (left = Util.fileExt(this.get('name'))) != null
      ? left
      : this.get('mimeType');
  }

  getServiceKey() {
    if (this.get('isUpload')) {
      return 'trello';
    }

    const { host } = parseURL(this.get('url'));

    const services = {
      'docs.google.com': 'gdrive',
      'drive.google.com': 'gdrive',
      'www.dropbox.com': 'dropbox',
      'onedrive.live.com': 'onedrive',
      '1drv.ms': 'onedrive',
      'app.box.com': 'box',
    };

    return services[host] != null ? services[host] : 'other';
  }
}
Attachment.initClass();

module.exports.Attachment = Attachment;
