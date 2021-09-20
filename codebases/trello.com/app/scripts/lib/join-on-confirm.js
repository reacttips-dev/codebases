/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ApiError } = require('app/scripts/network/api-error');
const { ApiPromise } = require('app/scripts/network/api-promise');
const { Auth } = require('app/scripts/db/auth');
const { ModelLoader } = require('app/scripts/db/model-loader');
const Promise = require('bluebird');
const { TrelloStorage } = require('@trello/storage');
const _ = require('underscore');

const AUTOJOIN_QUEUE_KEY = 'autoJoinQueue';
const ANY_MEMBER = 'any';

// Handle joining board/team invitation links after
// a user confirms their email address
class JoinOnConfirm {
  getQueue() {
    let left;
    return (left = TrelloStorage.get(AUTOJOIN_QUEUE_KEY)) != null ? left : [];
  }

  setQueue(queue) {
    return TrelloStorage.set(AUTOJOIN_QUEUE_KEY, queue);
  }

  clearQueue() {
    return TrelloStorage.unset(AUTOJOIN_QUEUE_KEY);
  }

  _idMember() {
    if (Auth.isLoggedIn()) {
      return Auth.myId();
    } else {
      return ANY_MEMBER;
    }
  }

  _entryForUrl(apiUrl) {
    return {
      url: apiUrl,
      idMember: this._idMember(),
    };
  }

  _matchesMember(id) {
    let needle;
    return (needle = id), [ANY_MEMBER, Auth.myId()].includes(needle);
  }

  add(apiUrl) {
    const queue = this.getQueue();
    if (
      _.any(
        queue,
        (entry) => entry.url === apiUrl && this._matchesMember(entry.id),
      )
    ) {
      return;
    }

    return this.setQueue([...Array.from(queue), this._entryForUrl(apiUrl)]);
  }

  inQueue(apiUrl) {
    return _.any(this.getQueue(), (entry) => {
      return entry.url === apiUrl && this._matchesMember(entry.idMember);
    });
  }

  autoJoin() {
    const queue = this.getQueue();
    if (queue.length === 0 || !Auth.isLoggedIn()) {
      return Promise.resolve(false);
    }

    return this._runOnce != null
      ? this._runOnce
      : (this._runOnce = ModelLoader.await('headerData').then(() => {
          if (!Auth.me().get('confirmed')) {
            return false;
          }

          return Promise.map(queue, (entry) => {
            const { url, idMember } = entry;
            if (this._matchesMember(idMember)) {
              return ApiPromise({
                method: 'post',
                url,
              })
                .then(() => null)
                .catch(ApiError, () => null);
            } else {
              return entry;
            }
          }).then((remainingEntries) => {
            remainingEntries = _.compact(remainingEntries);

            if (remainingEntries.length === 0) {
              this.clearQueue();
            } else {
              this.setQueue(remainingEntries);
            }

            // Return true if we joined anything
            return remainingEntries.length < queue.length;
          });
        }));
  }
}

module.exports.JoinOnConfirm = new JoinOnConfirm();
