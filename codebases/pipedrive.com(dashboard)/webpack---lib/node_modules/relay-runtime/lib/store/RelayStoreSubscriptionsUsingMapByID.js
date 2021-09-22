/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
// flowlint ambiguous-object-type:error
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));

var RelayFeatureFlags = require('../util/RelayFeatureFlags');

var RelayReader = require('./RelayReader');

var deepFreeze = require('../util/deepFreeze');

var recycleNodesInto = require('../util/recycleNodesInto');

var RelayStoreSubscriptionsUsingMapByID = /*#__PURE__*/function () {
  function RelayStoreSubscriptionsUsingMapByID(log) {
    this._notifiedRevision = 0;
    this._snapshotRevision = 0;
    this._subscriptionsByDataId = new Map();
    this._staleSubscriptions = new Set();
    this.__log = log;
  }

  var _proto = RelayStoreSubscriptionsUsingMapByID.prototype;

  _proto.subscribe = function subscribe(snapshot, callback) {
    var _this = this;

    var subscription = {
      backup: null,
      callback: callback,
      notifiedRevision: this._notifiedRevision,
      snapshotRevision: this._snapshotRevision,
      snapshot: snapshot
    };

    var dispose = function dispose() {
      var _iterator = (0, _createForOfIteratorHelper2["default"])(snapshot.seenRecords),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var dataId = _step.value;

          var subscriptionsForDataId = _this._subscriptionsByDataId.get(dataId);

          if (subscriptionsForDataId != null) {
            subscriptionsForDataId["delete"](subscription);

            if (subscriptionsForDataId.size === 0) {
              _this._subscriptionsByDataId["delete"](dataId);
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };

    var _iterator2 = (0, _createForOfIteratorHelper2["default"])(snapshot.seenRecords),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var dataId = _step2.value;

        var subscriptionsForDataId = this._subscriptionsByDataId.get(dataId);

        if (subscriptionsForDataId != null) {
          subscriptionsForDataId.add(subscription);
        } else {
          this._subscriptionsByDataId.set(dataId, new Set([subscription]));
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return {
      dispose: dispose
    };
  };

  _proto.snapshotSubscriptions = function snapshotSubscriptions(source) {
    var _this2 = this;

    this._snapshotRevision++;

    this._subscriptionsByDataId.forEach(function (subscriptions) {
      subscriptions.forEach(function (subscription) {
        if (subscription.snapshotRevision === _this2._snapshotRevision) {
          return;
        }

        subscription.snapshotRevision = _this2._snapshotRevision; // Backup occurs after writing a new "final" payload(s) and before (re)applying
        // optimistic changes. Each subscription's `snapshot` represents what was *last
        // published to the subscriber*, which notably may include previous optimistic
        // updates. Therefore a subscription can be in any of the following states:
        // - stale=true: This subscription was restored to a different value than
        //   `snapshot`. That means this subscription has changes relative to its base,
        //   but its base has changed (we just applied a final payload): recompute
        //   a backup so that we can later restore to the state the subscription
        //   should be in.
        // - stale=false: This subscription was restored to the same value than
        //   `snapshot`. That means this subscription does *not* have changes relative
        //   to its base, so the current `snapshot` is valid to use as a backup.

        if (!_this2._staleSubscriptions.has(subscription)) {
          subscription.backup = subscription.snapshot;
          return;
        }

        var snapshot = subscription.snapshot;
        var backup = RelayReader.read(source, snapshot.selector);
        var nextData = recycleNodesInto(snapshot.data, backup.data);
        backup.data = nextData; // backup owns the snapshot and can safely mutate

        subscription.backup = backup;
      });
    });
  };

  _proto.restoreSubscriptions = function restoreSubscriptions() {
    var _this3 = this;

    this._snapshotRevision++;

    this._subscriptionsByDataId.forEach(function (subscriptions) {
      subscriptions.forEach(function (subscription) {
        if (subscription.snapshotRevision === _this3._snapshotRevision) {
          return;
        }

        subscription.snapshotRevision = _this3._snapshotRevision;
        var backup = subscription.backup;
        subscription.backup = null;

        if (backup) {
          if (backup.data !== subscription.snapshot.data) {
            _this3._staleSubscriptions.add(subscription);
          }

          var prevSeenRecords = subscription.snapshot.seenRecords;
          subscription.snapshot = {
            data: subscription.snapshot.data,
            isMissingData: backup.isMissingData,
            seenRecords: backup.seenRecords,
            selector: backup.selector,
            missingRequiredFields: backup.missingRequiredFields
          };

          _this3._updateSubscriptionsMap(subscription, prevSeenRecords);
        } else {
          _this3._staleSubscriptions.add(subscription);
        }
      });
    });
  };

  _proto.updateSubscriptions = function updateSubscriptions(source, updatedRecordIDs, updatedOwners, sourceOperation) {
    var _this4 = this;

    this._notifiedRevision++;
    updatedRecordIDs.forEach(function (updatedRecordId) {
      var subcriptionsForDataId = _this4._subscriptionsByDataId.get(updatedRecordId);

      if (subcriptionsForDataId == null) {
        return;
      }

      subcriptionsForDataId.forEach(function (subscription) {
        if (subscription.notifiedRevision === _this4._notifiedRevision) {
          return;
        }

        var owner = _this4._updateSubscription(source, subscription, false, sourceOperation);

        if (owner != null) {
          updatedOwners.push(owner);
        }
      });
    });

    this._staleSubscriptions.forEach(function (subscription) {
      if (subscription.notifiedRevision === _this4._notifiedRevision) {
        return;
      }

      var owner = _this4._updateSubscription(source, subscription, true, sourceOperation);

      if (owner != null) {
        updatedOwners.push(owner);
      }
    });

    this._staleSubscriptions.clear();
  }
  /**
   * Notifies the callback for the subscription if the data for the associated
   * snapshot has changed.
   * Additionally, updates the subscription snapshot with the latest snapshot,
   * amarks it as not stale, and updates the subscription tracking for any
   * any new ids observed in the latest data snapshot.
   * Returns the owner (RequestDescriptor) if the subscription was affected by the
   * latest update, or null if it was not affected.
   */
  ;

  _proto._updateSubscription = function _updateSubscription(source, subscription, stale, sourceOperation) {
    var backup = subscription.backup,
        callback = subscription.callback,
        snapshot = subscription.snapshot;
    var nextSnapshot = stale && backup != null ? backup : RelayReader.read(source, snapshot.selector);
    var nextData = recycleNodesInto(snapshot.data, nextSnapshot.data);
    nextSnapshot = {
      data: nextData,
      isMissingData: nextSnapshot.isMissingData,
      seenRecords: nextSnapshot.seenRecords,
      selector: nextSnapshot.selector,
      missingRequiredFields: nextSnapshot.missingRequiredFields
    };

    if (process.env.NODE_ENV !== "production") {
      deepFreeze(nextSnapshot);
    }

    var prevSeenRecords = subscription.snapshot.seenRecords;
    subscription.snapshot = nextSnapshot;
    subscription.notifiedRevision = this._notifiedRevision;

    this._updateSubscriptionsMap(subscription, prevSeenRecords);

    if (nextSnapshot.data !== snapshot.data) {
      if (this.__log && RelayFeatureFlags.ENABLE_NOTIFY_SUBSCRIPTION) {
        this.__log({
          name: 'store.notify.subscription',
          sourceOperation: sourceOperation,
          snapshot: snapshot,
          nextSnapshot: nextSnapshot
        });
      }

      callback(nextSnapshot);
      return snapshot.selector.owner;
    }
  }
  /**
   * Updates the Map that tracks subscriptions by id.
   * Given an updated subscription and the records that where seen
   * on the previous subscription snapshot, updates our tracking
   * to track the subscription for the newly and no longer seen ids.
   */
  ;

  _proto._updateSubscriptionsMap = function _updateSubscriptionsMap(subscription, prevSeenRecords) {
    var _iterator3 = (0, _createForOfIteratorHelper2["default"])(prevSeenRecords),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var dataId = _step3.value;

        var subscriptionsForDataId = this._subscriptionsByDataId.get(dataId);

        if (subscriptionsForDataId != null) {
          subscriptionsForDataId["delete"](subscription);

          if (subscriptionsForDataId.size === 0) {
            this._subscriptionsByDataId["delete"](dataId);
          }
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    var _iterator4 = (0, _createForOfIteratorHelper2["default"])(subscription.snapshot.seenRecords),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var _dataId = _step4.value;

        var _subscriptionsForDataId = this._subscriptionsByDataId.get(_dataId);

        if (_subscriptionsForDataId != null) {
          _subscriptionsForDataId.add(subscription);
        } else {
          this._subscriptionsByDataId.set(_dataId, new Set([subscription]));
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  };

  return RelayStoreSubscriptionsUsingMapByID;
}();

module.exports = RelayStoreSubscriptionsUsingMapByID;