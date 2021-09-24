import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import TourHandler from './TourHandler';
import ProgressStore from '../stores/ProgressStore';
import emptyFunction from 'react-utils/emptyFunction';

var MultiTourHandler = /*#__PURE__*/function () {
  function MultiTourHandler() {
    _classCallCheck(this, MultiTourHandler);

    this.tours = {};
    this.activeTourKey = null;
  }

  _createClass(MultiTourHandler, [{
    key: "registerTour",
    value: function registerTour(key, config, progressStore) {
      if (typeof this.tours[key] === 'undefined') {
        var handler = new TourHandler({
          key: key,
          config: config,
          progressStore: progressStore || new ProgressStore()
        });
        this.tours[key] = handler;
      }

      return this.tours[key];
    }
  }, {
    key: "deregisterTour",
    value: function deregisterTour(key) {
      var _this = this;

      this.deactivateTour(key, function () {
        var tour = _this.tours[key]; // Reset store and subscriptions when tour is unmounted
        // For preventing updating on unmounted component

        if (tour && tour.progressStore.constructor === ProgressStore) {
          tour.progressStore = new ProgressStore();
        }
      });
    }
  }, {
    key: "activateTour",
    value: function activateTour(key) {
      var _this2 = this;

      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyFunction;
      var next = this.tours[key];

      var activateNext = function activateNext() {
        _this2.getInactiveTourKeys().forEach(function (inactiveTourKey) {
          var handler = _this2.tours[inactiveTourKey];

          handler._broadcastActiveTour(key);
        });

        _this2.activeTourKey = key;

        next._activate();

        callback();
      };

      if (this.activeTourKey) {
        var current = this.getActiveTour();

        current._deactivate(activateNext);
      } else {
        activateNext();
      }
    }
  }, {
    key: "deactivateTour",
    value: function deactivateTour(key, callback) {
      var handler = this.tours[key];

      if (this.activeTourKey === key) {
        handler.deactivate(callback);
        this.activeTourKey = null;
      }
    }
  }, {
    key: "deactivate",
    value: function deactivate(callback) {
      var currentTourKey = this.getActiveTourKey();

      if (currentTourKey) {
        this.deactivateTour(currentTourKey, callback);
      }
    }
  }, {
    key: "getTour",
    value: function getTour(key) {
      return this.tours[key];
    }
  }, {
    key: "getActiveTourKey",
    value: function getActiveTourKey() {
      if (!this.activeTourKey) {
        return null;
      }

      return this.activeTourKey;
    }
  }, {
    key: "getActiveTour",
    value: function getActiveTour() {
      var activeTourKey = this.getActiveTourKey();
      return this.tours[activeTourKey];
    }
  }, {
    key: "getInactiveTourKeys",
    value: function getInactiveTourKeys() {
      var activeTourKey = this.getActiveTourKey();
      var tourKeys = Object.keys(this.tours);
      return tourKeys.filter(function (key) {
        return key !== activeTourKey;
      });
    }
  }]);

  return MultiTourHandler;
}();

export { MultiTourHandler as default };