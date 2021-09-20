// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
module.exports.ArchivableMixin = {
  // it is important to look for { closed: false } on
  // models that can be archived because sometimes, the
  // client receives partial data about a board, card,
  // or list that does not contain its { closed } state.
  // in those cases, our previous check -- !@get('closed')
  // -- would return undefined, which we wanted to interpret
  // as being closed but were not correctly doing so in all places.
  // explicitly checking for { closed: false } is therefore correct.

  isOpen() {
    return this.get('closed') === false;
  },
};
