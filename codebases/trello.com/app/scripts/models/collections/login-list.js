// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { Login } = require('app/scripts/models/login');
const _ = require('underscore');

class LoginList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Login;
  }

  initialize() {
    return this.listenTo(this, 'change:primary', this.resetPrimary);
  }

  resetPrimary(login) {
    // If this isn't an event from a login declaring itself the primary, we
    // ignore it.
    if (!login.get('primary')) {
      return;
    }

    // Otherwise unset all other models.
    for (login of Array.from(this.without(login))) {
      login.set('primary', false);
    }
    return this.sort();
  }

  comparator(login) {
    // We want to show primary first, so a value of true would be 0 and would
    // always come before a value of 1. This is concatenated to the id to sort
    // the rest by creation date.
    return Number(!login.get('primary')) + login.id;
  }

  types() {
    return _.countBy(_.flatten(this.pluck('types')));
  }
}
LoginList.initClass();

module.exports.LoginList = LoginList;
