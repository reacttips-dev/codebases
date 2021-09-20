// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { CustomSticker } = require('app/scripts/models/CustomSticker');

class CustomStickerList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = CustomSticker;
  }
  url() {
    return `/1/member/${Auth.me().id}/customStickers`;
  }

  initialize(list, { member }) {
    this.member = member;
  }
}
CustomStickerList.initClass();

module.exports.CustomStickerList = CustomStickerList;
