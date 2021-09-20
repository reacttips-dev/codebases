// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const TrelloModel = require('app/scripts/models/internal/trello-model');
const _ = require('underscore');

class Login extends TrelloModel {
  static initClass() {
    this.prototype.typeName = 'Login';
  }
  // Test if removing this credential will lock the member out of his or her
  // account.
  hasConflict() {
    const types = this.collection.types();

    // If any of these tests pass, there is no conflict
    return !_.any(
      [
        // If this is has no login methods, then it is just an email association
        // for lookups.
        () => _.isEmpty(this.get('types')),

        // If we have a password there is never a conflict
        () => 'password' in types,

        // If none of the above are true, we need at least one other google
        // credential, or this is an important credential.
        () => types.google >= 2,
      ],
      (test) => test(),
    );
  }
}
Login.initClass();

module.exports.Login = Login;
