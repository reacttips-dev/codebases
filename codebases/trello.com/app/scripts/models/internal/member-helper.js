// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
module.exports.getUnreadNotifications = function (
  model,
  notificationsSeenState,
) {
  const notificationsCount = model.get('notificationsCount');
  const countsByGroup = notificationsSeenState.getNewNotifications(
    notificationsCount,
  );

  const count = Object.keys(countsByGroup).length;

  return count;
};
