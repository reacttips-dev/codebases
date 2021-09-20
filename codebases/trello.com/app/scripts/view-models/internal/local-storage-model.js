/* eslint-disable
    default-case,
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
const $ = require('jquery');
const { TrelloStorage } = require('@trello/storage');
const TrelloModel = require('app/scripts/models/internal/trello-model');
const _ = require('underscore');

module.exports.LocalStorageModel = class LocalStorageModel extends TrelloModel {
  constructor() {
    super(...arguments);
    this._onStorageLocalBound = this._onStorage.bind(this);
    TrelloStorage.listen(this._onStorageLocalBound);
  }

  destructor() {
    this.disableTabSync();
    return TrelloStorage.unlisten(this._onStorageLocalBound);
  }

  // call enableTabSync to update one tab when local storage is updated in another
  enableTabSync() {
    this._onRemoteStorageBound = (e) => this._onStorage(e.originalEvent);
    return $(window).on('storage', this._onRemoteStorageBound);
  }

  disableTabSync() {
    if (this._onRemoteStorageBound != null) {
      return $(window).off('storage', this._onRemoteStorageBound);
    }
  }

  default() {
    return {};
  }

  _onStorage(storageData) {
    if (
      (storageData != null ? storageData.key : undefined) === this.id &&
      storageData.oldValue !== storageData.newValue
    ) {
      // We don't want to do a full fetch, because that will reset the keys
      // that aren't synced to localStorage
      this.set(this.syncedKeysFromLocalStorage());
      return typeof this.onStorage === 'function'
        ? this.onStorage(storageData)
        : undefined;
    }
  }

  sync(method, model, options) {
    let json, defaultValues;
    const { success } = options;
    switch (method) {
      case 'create':
        /* jshint -W027 */
        throw Error('not implemented');
      case 'read':
        json = model.syncedKeysFromLocalStorage();
        _.defaults(json, this.default());
        return typeof success === 'function'
          ? success(model, json, options)
          : undefined;
      case 'update':
        json = model.toJSON();
        defaultValues = this.default();

        delete json.id;
        for (const key in json) {
          const value = json[key];
          if (_.isEqual(value, defaultValues[key])) {
            delete json[key];
          }
        }

        if (_.isEmpty(json)) {
          TrelloStorage.unset(model.id);
        } else {
          TrelloStorage.set(model.id, json);
        }
        return typeof success === 'function'
          ? success(model, model.toJSON(), options)
          : undefined;
      case 'delete':
        TrelloStorage.unset(model.id);
        return typeof success === 'function'
          ? success(model, null, options)
          : undefined;
    }
  }

  syncedKeysFromLocalStorage() {
    let left;
    const json = _.extend(
      {},
      this.default(),
      (left = TrelloStorage.get(this.id)) != null ? left : {},
    );
    return _.pick(json, this.syncedKeys);
  }

  syncedKeys() {
    return true;
  }

  toJSON() {
    return _.pick(this.attributes, this.syncedKeys);
  }

  _persistUpdate(params, next) {
    let left;
    TrelloStorage.set(
      this.id,
      _.extend(
        (left = TrelloStorage.get(this.id)) != null ? left : this.default(),
        params,
      ),
    );
    return typeof next === 'function' ? next(null, this.toJSON()) : undefined;
  }

  toggle(attr, value) {
    if (this.inSet(attr, value)) {
      this.pull(attr, value);
      return false;
    } else {
      this.addToSet(attr, value);
      return true;
    }
  }

  inSet(attr, value) {
    let left, needle;
    return (
      (needle = value),
      Array.from((left = this.get(attr)) != null ? left : []).includes(needle)
    );
  }

  addToSet(attr, value) {
    let left;
    return this.save(
      attr,
      ((left = this.get(attr)) != null ? left : []).concat(value),
    );
  }

  pull(attr, value) {
    let left;
    return this.save(
      attr,
      _.without((left = this.get(attr)) != null ? left : [], value),
    );
  }
};
