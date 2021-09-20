// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { SavedSearch } = require('app/scripts/models/SavedSearch');
const { Util } = require('app/scripts/lib/util');

class SavedSearchList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = SavedSearch;
  }
  url() {
    return `/1/member/${this.member.id}/savedSearches`;
  }

  initialize(list, { member }) {
    this.member = member;
    return this.listenTo(this, 'change:pos', this.sort);
  }

  comparator(savedSearch) {
    return savedSearch.get('pos') || 0;
  }

  saveSearch(name, query) {
    let pos;
    if (this.length) {
      pos = this.at(this.length - 1).get('pos') + Util.spacing;
    } else {
      pos = Util.spacing;
    }

    return this.create(
      {
        name,
        query,
        pos,
      },
      { modelCache: this.modelCache },
    );
  }
}
SavedSearchList.initClass();

module.exports.SavedSearchList = SavedSearchList;
