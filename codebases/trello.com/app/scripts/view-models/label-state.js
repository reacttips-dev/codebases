// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  LocalStorageModel,
} = require('app/scripts/view-models/internal/local-storage-model');

class LabelState extends LocalStorageModel {
  constructor() {
    super(...arguments);
    this.set({ id: 'labelState' });
    this.fetch();
    this.enableTabSync();
  }

  default() {
    return { showText: false };
  }

  getShowText() {
    return this.get('showText');
  }
  setShowText(showText) {
    return this.update('showText', showText);
  }
  toggleText() {
    return this.setShowText(!this.getShowText());
  }

  onStorage(ev) {
    return this.setShowText(this.getShowText());
  }
}

// Label state is global across the application
module.exports.LabelState = new LabelState();
