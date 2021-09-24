import {observable, computed} from 'mobx';

class GlobalStore {
  @observable notifications = [];
  @observable stickyNotifications = [];
  @computed
  get localUnreadCount() {
    return (
      this.notifications.filter(n => !n.read).length +
      this.stickyNotifications.filter(n => !n.read).length
    );
  }

  constructor() {
    let current_user = {};

    if (typeof window !== 'undefined') {
      current_user = window.app_data.current_user;
    }

    if (!current_user.id) return;

    this.cacheKey = `notification-cache-${current_user.id}`;

    try {
      this.cache = JSON.parse(localStorage.getItem(this.cacheKey));
      if (!(this.cache.read instanceof Array) || !(this.cache.seen instanceof Array)) {
        this.clearCache();
      }
    } catch (err) {
      this.clearCache();
    }

    if (this.cache.seen.length + this.cache.read.length > 0) this.sync();

    for (let n of current_user.notifications) {
      if (this.cache.read.includes(n.key)) n.read = true;
      if (this.cache.seen.includes(n.key)) n.seen = true;
    }
    for (let n of current_user.sticky_notifications) {
      if (this.cache.read.includes(n.key)) n.read = true;
      if (this.cache.seen.includes(n.key)) n.seen = true;
    }

    this.notifications.replace(current_user.notifications);
    this.stickyNotifications.replace(current_user.sticky_notifications);
  }

  markAllRead = () => {
    for (let n of this.notifications) this.markRead(n, false);
    for (let n of this.stickyNotifications) this.markRead(n, false);
    post('/api/v1/notifications/set_read_all');
  };

  markRead(n, sync = true) {
    if (n.read) return false;
    let i = this.notifications.findIndex(nn => nn.key === n.key);

    if (i !== -1) {
      this.notifications[i].read = true;
      this.cache.read.push(n.key);
      if (sync) this.sync();
      return true;
    }

    i = this.stickyNotifications.findIndex(nn => nn.key === n.key);
    if (i === -1) return false;

    this.stickyNotifications[i].read = true;
    this.cache.read.push(n.key);

    if (sync) this.sync();
    return true;
  }

  seen() {
    for (let n of this.notifications) {
      if (n.seen === true) continue;

      trackEvent('user.notifications.seen', {n_type: n.n_type});
      n.seen = true;
      this.cache.seen.push(n.key);
    }

    this.sync();
  }

  clearCache = () => {
    this.cache = {read: [], seen: []};
    this.saveLocal();
  };

  saveLocal = () => {
    localStorage.setItem(this.cacheKey, JSON.stringify(this.cache));
  };

  sync() {
    this.saveLocal();
    if (this.cache.seen.length + this.cache.read.length === 0) return;

    post('/api/v1/notifications/set_read', {body: {notifications: this.cache}}).then(response => {
      if (response.status !== 200) return;
      this.clearCache();
    });
  }
}

const globalStore = new GlobalStore();
export default globalStore;
export {GlobalStore};
