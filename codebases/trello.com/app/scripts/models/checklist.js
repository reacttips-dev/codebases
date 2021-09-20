/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ApiAjax } = require('app/scripts/network/api-ajax');
const { LimitMixin } = require('app/scripts/lib/limit-mixin');
const TrelloModel = require('app/scripts/models/internal/trello-model');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class Checklist extends TrelloModel {
  static initClass() {
    this.prototype.typeName = 'Checklist';

    this.lazy({
      checkItemList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          CheckItemList,
        } = require('app/scripts/models/collections/check-item-list');
        return new CheckItemList().syncSubModels(this, 'checkItems');
      },
    });

    this.prototype._debouncedRequestNewState = _.debounce(function (newState) {
      return ApiAjax({
        url: `/1/checklist/${this.id}/checkItems/all`,
        type: 'put',
        retry: false,
        data: {
          state: newState,
        },
        success: () => {
          return (this._originalCheckListState = null);
        },
        error: () => {
          // Reset the state if it goes wrong.
          this.checkItemList.each((checkItem) => {
            return checkItem.set(
              'state',
              this._originalCheckListState[checkItem.id],
            );
          });
          return (this._originalCheckListState = null);
        },
      });
    }, 500);
  }
  urlRoot() {
    return '/1/checklists';
  }

  sync(method, model, options) {
    if (
      method === 'create' &&
      !(this.get('idBoard') != null && this.get('idCard') != null)
    ) {
      this.waitForAttrs(this, ['idBoard', 'idCard'], (attrs) => {
        this.set(attrs);
        Checklist.prototype.__proto__.sync.call(this, method, model, options);
      });

      this.waitForId(this.getBoard(), (id) => this.set('idBoard', id));
      return this.waitForId(this.getCard(), (id) => this.set('idCard', id));
    } else {
      return super.sync(...arguments);
    }
  }

  getCard() {
    let left;
    return (left = this.modelCache.get('Card', this.get('idCard'))) != null
      ? left
      : this.collection.sourceModel;
  }

  getBoard() {
    return __guard__(this.getCard(), (x) => x.getBoard());
  }

  getCheckItemCount() {
    return this.checkItemList.length;
  }

  getCompletedCount(card) {
    let count = 0;

    this.checkItemList.each(function (checkItem) {
      if (checkItem.get('state') != null) {
        if (checkItem.get('state') === 'complete') {
          return count++;
        }
      }
    });

    return count;
  }

  getCheckItem(idCheckItem) {
    return this.checkItemList.get(idCheckItem);
  }

  editable() {
    return this.getBoard().editable();
  }

  calcPos(index, checkItem) {
    return Util.calcPos(index, this.checkItemList, checkItem);
  }

  toggleCheckItemsState(newState) {
    // As the request is debounced if we got the 'original' state every function
    // call, by the time the request we actually made the original is lost, this
    // would mean the server state wouldn't reflect the local one if the request
    // fails, this is not a good user experience, so let's cache it on the first
    // request and clear it when debounced function has done it's thing
    if (this._originalCheckListState == null) {
      this._originalCheckListState = {};
    }
    this.checkItemList.each((checkItem) => {
      if (this._originalCheckListState[checkItem.id] == null) {
        this._originalCheckListState[checkItem.id] = checkItem.get('state');
      }
      return checkItem.set('state', newState);
    });

    return this._debouncedRequestNewState(newState);
  }
}
Checklist.initClass();

_.extend(Checklist.prototype, LimitMixin);

module.exports.Checklist = Checklist;
