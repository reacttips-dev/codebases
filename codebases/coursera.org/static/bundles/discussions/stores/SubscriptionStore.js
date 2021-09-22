import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

class SubscriptionStore extends BaseStore {
  static storeName = 'SubscriptionStore';

  static handlers = {
    UPDATE_SUBSCRIPTION(subscription) {
      const { id } = subscription;
      this.subscriptions[id] = subscription;

      this.emitChange();
    },

    UPDATE_SUBSCRIPTION_FAILED(errorMessage) {
      this.errorMessage = errorMessage;
      this.emitChange();
    },
  };

  subscriptions = {};

  errorMessage = null;

  hasLoaded() {
    return true;
  }

  hasError() {
    return !!this.errorMessage;
  }

  getSubscription(forumSubscriptionId) {
    return this.subscriptions[forumSubscriptionId];
  }

  getIsSubscribed(forumSubscriptionId) {
    const subscription = this.subscriptions[forumSubscriptionId];
    return !!subscription && subscription.isSubscribed;
  }

  getIsSubscriptionInProgress(forumSubscriptionId) {
    const subscription = this.subscriptions[forumSubscriptionId];
    return !!subscription && subscription.isInProgress;
  }
}

export default SubscriptionStore;
