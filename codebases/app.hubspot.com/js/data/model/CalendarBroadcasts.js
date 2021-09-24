'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Map as ImmutableMap, OrderedMap, Record, Set as ImmutableSet } from 'immutable';
import { FORMAT_MONTH_CODE } from '../../lib/constants';
import { logError } from '../../lib/utils';
var DEFAULTS = {
  months: ImmutableMap(),
  lastFetched: null
}; // stores broadcasts in months buckets to support the composer's view of occupied days and times
// merges broadcasts from new channels into existing months to prevent need to refetch as much as possible

var CalendarBroadcasts = /*#__PURE__*/function (_Record) {
  _inherits(CalendarBroadcasts, _Record);

  function CalendarBroadcasts() {
    _classCallCheck(this, CalendarBroadcasts);

    return _possibleConstructorReturn(this, _getPrototypeOf(CalendarBroadcasts).apply(this, arguments));
  }

  _createClass(CalendarBroadcasts, [{
    key: "getBroadcastsForDate",
    value: function getBroadcastsForDate(date, channelKeys) {
      var broadcasts = this._getMonth(date) && this._getMonth(date).get('broadcasts');

      if (!broadcasts) {
        return undefined;
      }

      if (channelKeys && !channelKeys.isEmpty()) {
        return broadcasts.filter(function (b) {
          return channelKeys.includes(b.channelKey);
        });
      }

      return broadcasts;
    }
  }, {
    key: "getBroadcast",
    value: function getBroadcast(date, broadcastGuid) {
      var broadcasts = this._getMonth(date) && this._getMonth(date).get('broadcasts');

      if (!broadcasts) {
        return undefined;
      }

      return broadcasts.get(broadcastGuid);
    }
  }, {
    key: "getChannelKeysForDate",
    value: function getChannelKeysForDate(date) {
      return this._getMonth(date) && this._getMonth(date).get('channelKeys');
    }
  }, {
    key: "_getMonth",
    value: function _getMonth(date) {
      return this.months.get(date.format(FORMAT_MONTH_CODE));
    }
  }, {
    key: "clearMonth",
    value: function clearMonth(monthKey) {
      return this.setIn(['months', monthKey], ImmutableMap({
        broadcasts: OrderedMap(),
        channelKeys: ImmutableSet()
      }));
    }
  }, {
    key: "addBroadcasts",
    value: function addBroadcasts(date, channelKeys, broadcasts) {
      var monthKey = date.format(FORMAT_MONTH_CODE);
      var broadcastsMap = broadcasts instanceof ImmutableMap ? broadcasts : CalendarBroadcasts._createBroadcastMap(broadcasts);
      var monthMap = this.months.get(monthKey) || ImmutableMap({
        channelKeys: ImmutableSet(),
        broadcasts: OrderedMap()
      });
      var existingChannelKeys = monthMap.get('channelKeys') || ImmutableSet();
      monthMap = monthMap.mergeIn(['channelKeys'], existingChannelKeys.concat(channelKeys));
      monthMap = monthMap.mergeIn(['broadcasts'], monthMap.get('broadcasts').merge(broadcastsMap));
      return this.setIn(['months', monthKey], monthMap).set('lastFetched', new Date().valueOf());
    }
  }, {
    key: "updateBroadcast",
    value: function updateBroadcast(date, broadcastGuid, attrs) {
      var monthKey = date.format(FORMAT_MONTH_CODE);
      var selectPath = ['months', monthKey, 'broadcasts', broadcastGuid];
      var broadcast = this.getIn(selectPath);

      if (!broadcast) {
        logError('Trying up update a nonexistent broadcast', {
          monthKey: monthKey,
          broadcastGuid: broadcastGuid,
          attrs: attrs
        });
      }

      return this.mergeIn(selectPath, attrs);
    }
  }, {
    key: "setBroadcast",
    value: function setBroadcast(date, broadcastGuid, broadcast) {
      var monthKey = date.format(FORMAT_MONTH_CODE);
      var monthMap = this.months.get(monthKey) || ImmutableMap({
        channelKeys: ImmutableSet(),
        broadcasts: OrderedMap()
      });
      return this.setIn(['months', monthKey], monthMap.setIn(['broadcasts', broadcastGuid], broadcast));
    }
  }, {
    key: "removeBroadcast",
    value: function removeBroadcast(date, broadcastGuid) {
      var monthKey = date.format(FORMAT_MONTH_CODE);
      return this.deleteIn(['months', monthKey, 'broadcasts', broadcastGuid]);
    }
  }], [{
    key: "_createBroadcastMap",
    value: function _createBroadcastMap(broadcasts) {
      // store broadcasts in a map by guid, so we can refetch them without storing duplicates
      return OrderedMap(broadcasts.map(function (b) {
        return [b.broadcastGuid, b];
      }));
    }
  }]);

  return CalendarBroadcasts;
}(Record(DEFAULTS));

export { CalendarBroadcasts as default };