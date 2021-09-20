// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { TrelloStorage } = require('@trello/storage');

module.exports.Time = new ((function () {
  const Cls = class {
    static initClass() {
      this.prototype.delta = TrelloStorage.get('serverTimeDelta');
    }
    updateServerTime(time) {
      this.delta = new Date(time) - new Date();
      TrelloStorage.set('serverTimeDelta', this.delta);
    }

    serverToClient(time) {
      return new Date(new Date(time) - this.delta);
    }
  };
  Cls.initClass();
  return Cls;
})())();
