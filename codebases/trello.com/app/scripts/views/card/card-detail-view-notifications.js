// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Monitor } = require('app/scripts/lib/monitor');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports.markNotificationsReadOnActive = function () {
  if (Monitor.getStatus() === 'active' || !Monitor.getHidden()) {
    return this.markRelatedNotificationsRead();
  }
};

module.exports.markRelatedNotificationsRead = function () {
  const relatedNotifications = this.modelCache.all('Notification').filter(
    (notification) =>
      __guard__(
        __guard__(notification.get('data'), (x1) => x1.card),
        (x) => x.id,
      ) === this.model.id,
  );
  if (relatedNotifications.length > 0) {
    const unreadNotifications = relatedNotifications.filter((notification) =>
      notification.get('unread'),
    );
    if (unreadNotifications.length > 0) {
      // mark as read to update the UI
      // server update is handled via markAssociatedNotificationsRead
      unreadNotifications.forEach((notification) =>
        notification.set({ unread: false }),
      );
    } else {
      // Return early, we know all related notifications are already marked as read
      return;
    }
  }

  return this.model.markAssociatedNotificationsRead();
};
