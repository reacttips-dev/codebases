import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'react-utils/invariant';
import emptyFunction from 'react-utils/emptyFunction';
import TourContext from '../contexts/TourContext';
import MultiTourHandlerSingleton from '../lib/MultiTourHandlerSingleton';
import MultiTourHandler from '../lib/MultiTourHandler';

var UITour = /*#__PURE__*/function (_Component) {
  _inherits(UITour, _Component);

  function UITour(props) {
    var _this;

    _classCallCheck(this, UITour);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UITour).call(this, props));
    _this.state = {};
    _this._mounted = false;
    _this.unsubscribes = [];
    _this.subscribeToTour = _this.subscribeToTour.bind(_assertThisInitialized(_this));
    _this.getTourHandler = _this.getTourHandler.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(UITour, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props = this.props,
          tours = _this$props.tours,
          tour = _this$props.tour,
          activateOnMount = _this$props.activateOnMount;

      if (tour) {
        this.registerTour(tour);
      } else if (tours) {
        tours.forEach(function (tourKey) {
          _this2.registerTour(tourKey);
        });
      }

      this._mounted = true;

      if (activateOnMount) {
        this.activateTour();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props2 = this.props,
          keepAlive = _this$props2.keepAlive,
          tour = _this$props2.tour;
      var prevTour = prevProps.tour;

      if (!keepAlive || !prevTour || !tour || prevTour === tour) {
        return;
      }

      var _this$props3 = this.props,
          autoStartOnUpdate = _this$props3.autoStartOnUpdate,
          config = _this$props3.config,
          multiTourHandler = _this$props3.multiTourHandler;

      var _multiTourHandler$get = multiTourHandler.getTour(prevTour),
          progressStore = _multiTourHandler$get.progressStore;

      multiTourHandler.deactivateTour(prevTour);
      multiTourHandler.registerTour(tour, config, progressStore);
      multiTourHandler.activateTour(tour);

      if (autoStartOnUpdate) {
        this.getTourHandler().startTour();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this3 = this;

      var _this$props4 = this.props,
          tour = _this$props4.tour,
          tours = _this$props4.tours;
      this._mounted = false;

      if (tour) {
        this.deregisterTour(tour);
      } else if (tours) {
        tours.forEach(function (tourKey) {
          _this3.deregisterTour(tourKey);
        });
      }

      this.unsubscribes.forEach(function (unsubscribe) {
        return unsubscribe();
      });
    }
  }, {
    key: "getContextValue",
    value: function getContextValue() {
      var _this4 = this;

      var _this$props5 = this.props,
          config = _this$props5.config,
          multiTourHandler = _this$props5.multiTourHandler;
      var getHandler = this.getTourHandler;
      return {
        tour: {
          getHandler: getHandler,
          getConfig: function getConfig() {
            return config || getHandler().getConfig();
          },
          getStep: function getStep() {
            return getHandler().getStepKey();
          },
          getTour: function getTour() {
            return multiTourHandler.getActiveTourKey();
          },
          deactivate: function deactivate(callback) {
            return multiTourHandler.deactivate(callback);
          },
          deactivateTour: function deactivateTour(tourKey) {
            if (tourKey) {
              multiTourHandler.deactivateTour(tourKey);
            }
          },
          activate: function activate() {
            var tourKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this4.getDefaultTour();
            return multiTourHandler.activateTour(tourKey);
          },
          canGoBack: function canGoBack() {
            return getHandler().canGoBack();
          },
          subscribe: this.subscribeToTour,
          start: function start(tourKey, chainable) {
            var startTour = function startTour() {
              return getHandler().startTour(chainable);
            };

            if (tourKey && tourKey !== multiTourHandler.getActiveTourKey()) {
              return multiTourHandler.activateTour(tourKey, startTour);
            }

            return startTour();
          },
          next: function next(stepKey) {
            return getHandler().nextStep(stepKey);
          },
          back: function back() {
            return getHandler().goBack();
          },
          finish: function finish(chainable) {
            return getHandler().finishTour(chainable);
          }
        }
      };
    }
  }, {
    key: "registerTour",
    value: function registerTour(tourKey) {
      var _this5 = this;

      var _this$props6 = this.props,
          config = _this$props6.config,
          multiTourHandler = _this$props6.multiTourHandler;
      var tourHandler = multiTourHandler.registerTour(tourKey, config);
      var unsubscribe = tourHandler.subscribeToUpdates(function (nextStep, nextTour) {
        if (_this5._mounted) {
          _this5.setState({
            tour: nextTour,
            step: nextStep
          });
        }
      });
      this.unsubscribes = this.unsubscribes ? this.unsubscribes.concat(unsubscribe) : [unsubscribe];
    }
  }, {
    key: "deregisterTour",
    value: function deregisterTour(tourKey) {
      var multiTourHandler = this.props.multiTourHandler;

      if (!tourKey) {
        return;
      }

      if (typeof multiTourHandler.deregisterTour === 'function') {
        multiTourHandler.deregisterTour(tourKey);
      } else {
        multiTourHandler.deactivateTour(tourKey);
      }
    }
  }, {
    key: "activateTour",
    value: function activateTour() {
      var _this6 = this;

      var _this$props7 = this.props,
          multiTourHandler = _this$props7.multiTourHandler,
          onActivate = _this$props7.onActivate;
      var defaultTour = this.getDefaultTour();

      var activateState = function activateState() {
        _this6.setState({
          hasActivated: true
        });

        onActivate();
      };

      multiTourHandler.activateTour(defaultTour, activateState);
    }
  }, {
    key: "subscribeToTour",
    value: function subscribeToTour(callback) {
      var _this$props8 = this.props,
          tours = _this$props8.tours,
          tour = _this$props8.tour,
          multiTourHandler = _this$props8.multiTourHandler;

      if (tour) {
        var handler = multiTourHandler.getTour(tour);
        return [handler.subscribeToUpdates(callback)];
      }

      return tours.map(function (tourKey) {
        var handler = multiTourHandler.getTour(tourKey);
        return handler.subscribeToUpdates(callback);
      });
    }
  }, {
    key: "getDefaultTour",
    value: function getDefaultTour() {
      var _this$props9 = this.props,
          tours = _this$props9.tours,
          tour = _this$props9.tour;
      invariant(tour || tours && tours.length > 0, 'You must supply at least a tour (tour key) or a tours (array of tour keys) to `UITour` props');
      return tour || tours[0];
    }
  }, {
    key: "getTourHandler",
    value: function getTourHandler() {
      var multiTourHandler = this.props.multiTourHandler;
      var activeTour = multiTourHandler.getActiveTour();

      if (activeTour) {
        return activeTour;
      }

      var defaultTour = this.getDefaultTour();
      return multiTourHandler.getTour(defaultTour);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props10 = this.props,
          children = _this$props10.children,
          activateOnMount = _this$props10.activateOnMount,
          className = _this$props10.className;
      var hasActivated = this.state.hasActivated;

      if (activateOnMount && !hasActivated) {
        return null;
      }

      return /*#__PURE__*/_jsx("div", {
        className: className,
        children: /*#__PURE__*/_jsx(TourContext.Provider, {
          value: this.getContextValue(),
          children: children
        })
      });
    }
  }]);

  return UITour;
}(Component);

UITour.propTypes = {
  tour: PropTypes.string,
  tours: PropTypes.array,
  config: PropTypes.object,
  children: PropTypes.node.isRequired,
  multiTourHandler: PropTypes.instanceOf(MultiTourHandler),
  onActivate: PropTypes.func.isRequired,
  activateOnMount: PropTypes.bool.isRequired,
  autoStartOnUpdate: PropTypes.bool,
  keepAlive: PropTypes.bool,
  className: PropTypes.string
};
UITour.defaultProps = {
  onActivate: emptyFunction,
  multiTourHandler: MultiTourHandlerSingleton.getInstance(),
  activateOnMount: true,
  keepAlive: false
};
export default UITour;