/* eslint-disable
    @trello/ban-identifiers,
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let left, Monitor;
const $ = require('jquery');
const Backbone = require('@trello/backbone');
const { TrelloStorage, TrelloSessionStorage } = require('@trello/storage');
const _ = require('underscore');

let lastActivity = 0;
let status =
  (left = TrelloSessionStorage.get('status')) != null ? left : 'active';
let hiddenProperty = null;
let visibilityChange = null;

// From https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hiddenProperty = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.mozHidden !== 'undefined') {
  hiddenProperty = 'mozHidden';
  visibilityChange = 'mozvisibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hiddenProperty = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hiddenProperty = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

module.exports.Monitor = Monitor = {
  init() {
    setInterval(Monitor.check, 10 * 1000);

    // Mark the user active if...
    // the window gets the focus
    // Note: since we can also detect when the window
    // loses the focus, we can make it so a window that
    // has no interaction but has the focus stays active
    // e.g. if someone is just staring at the board, but not
    // doing anything
    $(window).on('focus', () => Monitor.addActivity());

    // the user presses a key or clicks something
    $(document).on('keydown mousedown', function () {
      Monitor.addActivity();
    });

    Monitor.getHidden =
      hiddenProperty != null ? () => document[hiddenProperty] : () => false;

    if (visibilityChange != null) {
      $(document).on(visibilityChange, () => {
        return Monitor.trigger('visibilitychange');
      });
    }
  },

  addActivity() {
    const now = new Date().getTime();
    lastActivity = now;

    TrelloStorage.set('lastActivity', lastActivity);

    Monitor.setStatus('active');
  },

  check() {
    const delta =
      new Date().getTime() -
      Math.max(
        lastActivity,
        TrelloStorage.isEnabled()
          ? parseInt(TrelloStorage.get('lastActivity'), 10)
          : 0,
      );

    if (delta > 5 * 60 * 1000) {
      Monitor.setStatus('idle');
    } // 5 minutes
  },

  setStatus(newStatus) {
    if (newStatus !== status) {
      status = newStatus;
      TrelloSessionStorage.set('status', status);
      Monitor.trigger('setStatus', status);
    }
  },

  getStatus() {
    return status;
  },
};

_.extend(Monitor, Backbone.Events);
