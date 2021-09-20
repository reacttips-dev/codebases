// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let CheckItemListView;
const CheckItemView = require('app/scripts/views/checklist/check-item-view');
const CollectionView = require('app/scripts/views/internal/collection-view');

module.exports = CheckItemListView = (function () {
  CheckItemListView = class CheckItemListView extends CollectionView {
    static initClass() {
      this.prototype.viewType = CheckItemView;
    }
  };
  CheckItemListView.initClass();
  return CheckItemListView;
})();
