/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports.markRelatedNotificationsRead = function () {
  const isRelatedAndUnread = (notification) => {
    return (
      notification.get('unread') &&
      __guard__(notification.get('data'), (x) => x.card) == null &&
      __guard__(notification.get('data').board, (x1) => x1.id) ===
        this.model.get('id')
    );
  };
  for (const notification of Array.from(this.modelCache.all('Notification'))) {
    if (isRelatedAndUnread(notification)) {
      notification.markRead();
    }
  }
};
