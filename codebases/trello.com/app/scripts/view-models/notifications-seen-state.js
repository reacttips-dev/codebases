/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  LocalStorageModel,
} = require('app/scripts/view-models/internal/local-storage-model');
const _ = require('underscore');

module.exports.NotificationsSeenState = class NotificationsSeenState extends (
  LocalStorageModel
) {
  // Model will be on instance of Member
  constructor(model) {
    super();
    this.model = model;
    this.set({ id: `NotificationsSeenState-${this.model.id}` });
    this.fetch();
    this.enableTabSync();
    this.setLastSeen = this.setLastSeen.bind(this);
    this.getNewNotifications = this.getNewNotifications.bind(this);
  }

  default() {
    return { lastSeenNotificationGroup: {} };
  }

  setLastSeen() {
    return this.update({
      lastSeenNotificationGroup: this.model.get('notificationsCount'),
    });
  }

  getNewNotifications(currentNotificationGroup) {
    const lastSeenNotificationGroup = this.get('lastSeenNotificationGroup');
    return _.pick(
      currentNotificationGroup,
      (count, key) =>
        count >
        (lastSeenNotificationGroup[key] != null
          ? lastSeenNotificationGroup[key]
          : 0),
    );
  }
};
