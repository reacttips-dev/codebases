// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { Tag } = require('app/scripts/models/tag');

class TagList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Tag;
  }

  comparator(tag1, tag2) {
    return tag1.get('name').localeCompare(tag2.get('name'));
  }
}
TagList.initClass();

module.exports.TagList = TagList;
