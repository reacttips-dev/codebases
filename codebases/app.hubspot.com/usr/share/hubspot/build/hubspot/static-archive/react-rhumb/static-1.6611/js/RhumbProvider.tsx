import _toArray from "@babel/runtime/helpers/esm/toArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useMemo, useReducer, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import invariant from 'react-utils/invariant';
import memoizeOne from 'react-utils/memoizeOne';
import usePrevious from 'react-utils/hooks/usePrevious';
import memoizeStringOnly from './vendor/memoizeStringOnly';
import RhumbContext from './internal/RhumbContext';
import * as Constants from './internal/Constants';
import matchRoute from './internal/matchRoute';
import { runWithLowPriority } from './internal/Scheduler';
import performanceNow from './vendor/performanceNow';
import { bender } from 'legacy-hubspot-bender-context';
import ReaganCompatReporter from './internal/reporters/ReaganCompatReporter';
import InAppReporter from './internal/reporters/InAppReporter';
import UnexpectedRouteReporter from './internal/reporters/UnexpectedRouteReporter';
import GlobalErrorReporter from './internal/reporters/GlobalErrorReporter';
import VitalsReporter from './internal/reporters/VitalsReporter';
import emptyFunction from 'react-utils/emptyFunction';
import RhumbGlobalErrorBoundary from './internal/RhumbGlobalErrorBoundary';

function useInitial(initialValue) {
  var ref = useRef();

  if (!ref.current) {
    ref.current = {
      value: initialValue()
    };
  }

  return ref.current.value;
}

var formatVersion = function formatVersion(version) {
  return version.startsWith('static-') ? version.substr(7) : 'dev';
};

var buildRouteSpecs = function buildRouteSpecs(partialRouteSpecs, defaultTimeout) {
  if (process.env.NODE_ENV !== 'production') {
    invariant(partialRouteSpecs, 'routeSpecs cannot be null');
  } // TODO devLogger warn deprecation


  var normalizeSuccess = function normalizeSuccess(success) {
    return Array.isArray(success) ? {
      default: success
    } : success;
  };

  return Object.keys(partialRouteSpecs).reduce(function (acc, route) {
    var routeSpec = partialRouteSpecs[route];
    var _routeSpec$success = routeSpec.success,
        success = _routeSpec$success === void 0 ? [] : _routeSpec$success,
        _routeSpec$error = routeSpec.error,
        error = _routeSpec$error === void 0 ? [] : _routeSpec$error,
        _routeSpec$timeout = routeSpec.timeout,
        timeout = _routeSpec$timeout === void 0 ? defaultTimeout : _routeSpec$timeout;
    acc[route] = {
      route: route,
      success: normalizeSuccess(success),
      error: [].concat(_toConsumableArray(error), _toConsumableArray(Constants.INTERNAL_ERROR_MARKERS)),
      timeout: timeout
    };
    return acc;
  }, {});
};

var buildGetRouteSpec = function buildGetRouteSpec(routeSpecs) {
  var routeKeys = Object.keys(routeSpecs);
  var routeMatcher = matchRoute(routeKeys);
  return memoizeStringOnly(function (pathname) {
    var route = routeKeys.find(function (key) {
      return routeMatcher(key, pathname);
    });
    return routeSpecs[route];
  });
};

var buildCheckStatus = function buildCheckStatus(getRouteSpec) {
  var checkStatusImpl = function checkStatusImpl(_ref) {
    var pathname = _ref.pathname,
        checks = _ref.checks,
        expiredTimestamp = _ref.expiredTimestamp;
    var routeSpec = getRouteSpec(pathname); // TODO DOCUMENT success wins all ties

    if (expiredTimestamp) {
      return {
        type: 'TIMEOUT'
      };
    } else {
      var isMounted = function isMounted(marker) {
        return checks[marker];
      };

      var scenarios = Object.keys(routeSpec.success).filter(function (scenario) {
        return routeSpec.success[scenario].length && routeSpec.success[scenario].every(isMounted);
      });

      if (scenarios.length) {
        // TODO warn if multiple
        return {
          type: 'SUCCESS',
          scenario: scenarios[0]
        };
      } else if (routeSpec.error.some(isMounted)) {
        return {
          type: 'FAILURE'
        };
      }
    }

    return {
      type: 'PENDING'
    };
  };

  return memoizeOne(checkStatusImpl);
};

var buildReporter = function buildReporter(getRouteSpec, report) {
  return function (type, entry, extra) {
    var pathname = entry.pathname;
    var routeSpec = getRouteSpec(pathname);
    var payload = {
      entry: entry,
      routeSpec: routeSpec
    };

    if (extra) {
      Object.assign(payload, {
        extra: extra
      });
    }

    report({
      type: type,
      payload: payload
    });
  };
}; // eslint-disable-next-line consistent-return


var reducer = function reducer(prevState, action) {
  var prevEntry = prevState.entry,
      _prevState$entry = prevState.entry,
      prevPathname = _prevState$entry.pathname,
      prevId = _prevState$entry.id,
      prevChecks = _prevState$entry.checks,
      prevEntries = prevState.entries;

  switch (action.type) {
    case 'HISTORY_CHANGED':
      {
        var _action$payload = action.payload,
            pathname = _action$payload.pathname,
            timestamp = _action$payload.timestamp;
        return pathname !== prevPathname ? Object.assign({}, prevState, {
          entry: {
            id: prevId + 1,
            pathname: pathname,
            referrer: prevPathname,
            timestamp: timestamp,
            checks: {},
            expiredTimestamp: null,
            dirty: false
          },
          entries: [].concat(_toConsumableArray(prevEntries), [prevEntry])
        }) : prevState;
      }

    case 'MARKER_MOUNTED':
      {
        var _action$payload2 = action.payload,
            _action$payload2$mark = _action$payload2.marker,
            marker = _action$payload2$mark.name,
            id = _action$payload2$mark.id,
            _timestamp = _action$payload2.timestamp;

        if (process.env.NODE_ENV !== 'production') {
          if (prevChecks[marker]) {
            console.error('[react-rhumb] marker already rendered: "%s". Rendering duplicate markers is deprecated and route failure in the next version', marker);
          }
        }

        return prevId === id ? Object.assign({}, prevState, {
          entry: Object.assign({}, prevEntry, {
            dirty: true,
            checks: Object.assign({}, prevChecks, _defineProperty({}, marker, {
              timestamp: _timestamp
            }))
          })
        }) : prevState;
      }

    case 'MARKER_UNMOUNTED':
      {
        var _action$payload$marke = action.payload.marker,
            _marker = _action$payload$marke.name,
            _id = _action$payload$marke.id;

        if (prevId === _id && prevChecks[_marker]) {
          var checks = Object.assign({}, prevChecks);
          delete checks[_marker];
          return Object.assign({}, prevState, {
            entry: Object.assign({}, prevEntry, {
              checks: checks
            })
          });
        }

        return prevState;
      }

    case 'TIMEDOUT':
      {
        var _timestamp2 = action.payload.timestamp;
        return Object.assign({}, prevState, {
          entry: Object.assign({}, prevEntry, {
            expiredTimestamp: _timestamp2
          })
        });
      }

    default:
      {
        return prevState;
      }
  }
};

var usePreventPropChange = process.env.NODE_ENV !== 'production' ? function (props) {
  var config = props.config,
      history = props.history,
      timingOffset = props.timingOffset,
      staticAppInfo = props.staticAppInfo;
  var configRef = useRef(config);
  var historyRef = useRef(history);
  var timingOffsetRef = useRef(timingOffset);
  var staticAppInfoRef = useRef(staticAppInfo);
  useEffect(function () {
    invariant(configRef.current === config, '`config` should not change');
    invariant(historyRef.current === history, '`history` should not change');
    invariant(timingOffsetRef.current === timingOffset, '`timingOffset` should not change');
    invariant(staticAppInfoRef.current === staticAppInfo, '`staticAppInfo` should not change');
    configRef.current = config;
    historyRef.current = history;
    timingOffsetRef.current = timingOffset;
    staticAppInfoRef.current = staticAppInfo;
  }, [config, history, timingOffset, staticAppInfo]);
} : function () {};

var useHistoryEffect = function useHistoryEffect(history, callback) {
  var queue = useRef([]);
  var flush = useRef(emptyFunction);
  var savedCallback = useRef(emptyFunction);
  useEffect(function () {
    savedCallback.current = callback;
  });

  if (flush.current === emptyFunction) {
    var unlisten = history.listen(function (_ref2) {
      var pathname = _ref2.pathname;
      var timestamp = performanceNow();
      queue.current.push({
        pathname: pathname,
        timestamp: timestamp
      });
    });

    flush.current = function () {
      unlisten();
      queue.current.forEach(function (entry) {
        return savedCallback.current(entry);
      });
      queue.current = [];

      flush.current = function () {};
    };
  }

  useEffect(function () {
    flush.current();
    return history.listen(savedCallback.current);
  }, [history]);
};

var useNewRelicRouteTracking = function useNewRelicRouteTracking(history, getRouteSpec) {
  var pathname = history.pathname;
  var initialRouteSpec = useInitial(function () {
    return getRouteSpec(pathname);
  });

  var updateNewRelicRouteData = function updateNewRelicRouteData(routeSpec) {
    var route = routeSpec ? routeSpec.route : 'unknown-route';

    if (window.newrelic) {
      window.newrelic.setCurrentRouteName(route);
      window.newrelic.setCustomAttribute('route', route);
    }
  };

  useEffect(function () {
    if (window.newrelic) {
      window.newrelic.setCustomAttribute('reactRhumbVersion', formatVersion(bender.depVersions['react-rhumb']));
      window.newrelic.setCustomAttribute('reaganVersion', 'react-rhumb');
    }
  }, []);
  useEffect(function () {
    updateNewRelicRouteData(initialRouteSpec);
  }, [initialRouteSpec]);

  var handleHistoryChange = function handleHistoryChange(_ref3) {
    var nextPathname = _ref3.pathname;
    updateNewRelicRouteData(getRouteSpec(nextPathname));
  };

  useHistoryEffect(history, handleHistoryChange);
};

var RhumbProvider = function RhumbProvider(props) {
  usePreventPropChange(props);
  var history = props.history,
      historyPathname = props.history.pathname,
      config = props.config,
      defaultTimeout = props.defaultTimeout,
      children = props.children,
      timingOffset = props.timingOffset,
      staticAppInfo = props.staticAppInfo;
  var routeSpecs = useMemo(function () {
    return buildRouteSpecs(config, defaultTimeout || Constants.DEFAULT_TIMEOUT);
  }, [config, defaultTimeout]);
  var initialState = useMemo(function () {
    return {
      entry: {
        id: 0,
        pathname: historyPathname,
        referrer: undefined,
        timestamp: 0,
        checks: {},
        expiredTimestamp: null,
        dirty: false
      },
      entries: []
    };
  }, [historyPathname]);

  var _useReducer = useReducer(reducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var getRouteSpec = useMemo(function () {
    return buildGetRouteSpec(routeSpecs);
  }, [routeSpecs]);
  useNewRelicRouteTracking(history, getRouteSpec);

  var handleHistoryChange = function handleHistoryChange(_ref4) {
    var timestamp = _ref4.timestamp,
        nextPathname = _ref4.pathname;
    runWithLowPriority(function () {
      dispatch({
        type: 'HISTORY_CHANGED',
        payload: {
          pathname: nextPathname,
          timestamp: timestamp
        }
      });
    });
  };

  useHistoryEffect(history, handleHistoryChange);
  var reportAction = useInitial(function () {
    var consoleReporterModule = process.env.NODE_ENV === 'production' ? require('./internal/reporters/ProdConsoleReporter') : require('./internal/reporters/DevConsoleReporter');
    var ConsoleReporter = consoleReporterModule.default ? consoleReporterModule.default : consoleReporterModule;
    var reporters = [new ConsoleReporter({
      timingOffset: timingOffset
    }), new ReaganCompatReporter({
      timingOffset: timingOffset,
      staticAppInfo: staticAppInfo
    }), new InAppReporter({
      staticAppInfo: staticAppInfo
    }), new UnexpectedRouteReporter(), new GlobalErrorReporter(), new VitalsReporter({
      staticAppInfo: staticAppInfo
    })];
    return function (action) {
      return reporters.forEach(function (r) {
        return r.report(action);
      });
    };
  });
  var report = useMemo(function () {
    return buildReporter(getRouteSpec, reportAction);
  }, [getRouteSpec, reportAction]);

  var reportError = function reportError(error, attributes) {
    report('GLOBAL_ERROR', state.entry, Object.assign({
      error: error
    }, attributes));
  };

  var checkStatus = useMemo(function () {
    return buildCheckStatus(getRouteSpec);
  }, [getRouteSpec]);
  var timeoutRef = useRef(undefined);
  var prevState = usePrevious(state);
  useEffect(function () {
    var handleTimeout = function handleTimeout() {
      var timestamp = performanceNow();
      runWithLowPriority(function () {
        dispatch({
          type: 'TIMEDOUT',
          payload: {
            timestamp: timestamp
          }
        });
      });
    };

    var reportForStatus = function reportForStatus(status, entry) {
      switch (status.type) {
        case 'SUCCESS':
          {
            var scenario = status.scenario;
            report('ROUTE_SUCCEEDED', entry, {
              scenario: scenario
            });
            break;
          }

        case 'TIMEOUT':
          report('ROUTE_TIMEOUT_EXPIRED', entry);
          break;

        case 'FAILURE':
          report('ROUTE_FAILED', entry);
          break;

        default:
          throw new Error("unexpected status type " + status.type);
      }
    }; // there are new history entries


    if (prevState && state.entries !== prevState.entries) {
      var prevEntry = prevState.entry,
          prevChecks = prevState.entry.checks,
          prevEntries = prevState.entries;
      var currentEntries = state.entries; // clear the timeout

      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined; //run through special cases

      var _currentEntries$slice = currentEntries.slice(prevEntries.length - currentEntries.length),
          _currentEntries$slice2 = _toArray(_currentEntries$slice),
          trailingEntry = _currentEntries$slice2[0],
          skippedEntries = _currentEntries$slice2.slice(1);

      var trailingPathname = trailingEntry.pathname,
          trailingChecks = trailingEntry.checks;
      var trailingRouteSpec = getRouteSpec(trailingPathname);

      if (trailingRouteSpec) {
        if (trailingChecks !== prevChecks) {
          report('CHECKS_CHANGED', trailingEntry);
        }

        var status = checkStatus(trailingEntry);

        if (trailingEntry !== prevEntry) {
          // the previous entry changed during the last batch of updates and should be checked
          if (status.type !== 'PENDING') {
            reportForStatus(status, trailingEntry);
          } else {
            report('ROUTE_ABANDONED', trailingEntry);
          }
        } else {
          if (status.type === 'PENDING') {
            report('ROUTE_ABANDONED', trailingEntry);
          }
        }
      } // entries that were added between updates
      // nothing should ever have been mounted in these entries


      skippedEntries.forEach(function (skippedEntry) {
        var skippedPathname = skippedEntry.pathname;
        var skippedRouteSpec = getRouteSpec(skippedPathname);

        if (skippedRouteSpec) {
          report('ROUTE_STARTED', skippedEntry);
          report('ROUTE_ABANDONED', skippedEntry);
        } else {
          report('ROUTE_UNEXPECTED', skippedEntry);
        }
      });
    } // check the new entry


    if (!prevState || prevState.entries !== state.entries) {
      var currentEntry = state.entry,
          _state$entry = state.entry,
          currentPathname = _state$entry.pathname,
          currentDirty = _state$entry.dirty;
      var routeSpec = getRouteSpec(currentPathname);

      if (routeSpec) {
        report('ROUTE_STARTED', currentEntry);

        if (currentDirty) {
          // TODO can this ever be hit?
          report('CHECKS_CHANGED', currentEntry);
        }

        var _status = checkStatus(currentEntry);

        if (_status.type !== 'PENDING') {
          // TODO can this ever be hit?
          reportForStatus(_status, currentEntry);
        } else {
          var timeout = routeSpec.timeout;
          timeoutRef.current = setTimeout(handleTimeout, timeout);
        }
      } else {
        report('ROUTE_UNEXPECTED', currentEntry);
      }
    } // there are no new history entries but existing entry has some changes and needs to be checked


    if (prevState && prevState.entries === state.entries && prevState.entry !== state.entry) {
      var _prevChecks = prevState.entry.checks;
      var _currentEntry = state.entry,
          _state$entry2 = state.entry,
          _currentChecks = _state$entry2.checks,
          _currentPathname = _state$entry2.pathname;

      var _routeSpec = getRouteSpec(_currentPathname);

      if (_routeSpec) {
        if (_currentChecks !== _prevChecks) {
          report('CHECKS_CHANGED', _currentEntry);
        }

        var _status2 = checkStatus(_currentEntry);

        if (_status2.type !== 'PENDING') {
          reportForStatus(_status2, _currentEntry);
          clearTimeout(timeoutRef.current);
          timeoutRef.current = undefined;
        }
      }
    }
  }, [prevState, state, getRouteSpec, checkStatus, report]);
  useEffect(function () {
    return function () {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    };
  }, []);
  var _state$entry3 = state.entry,
      currentChecks = _state$entry3.checks,
      currentId = _state$entry3.id;
  var visibleMarkers = useMemo(function () {
    return Object.keys(currentChecks).filter(function (marker) {
      return currentChecks[marker];
    });
  }, [currentChecks]);
  var contextValue = useMemo(function () {
    return {
      id: currentId,
      dispatch: dispatch,
      reportAction: reportAction
    };
  }, [currentId, reportAction]);
  var visibleMarkersData = useMemo(function () {
    return visibleMarkers.map(encodeURIComponent).join(',');
  }, [visibleMarkers]);
  return /*#__PURE__*/_jsxs(RhumbContext.Provider, {
    value: contextValue,
    children: [props.captureExceptions ? /*#__PURE__*/_jsx(RhumbGlobalErrorBoundary, {
      onError: reportError,
      children: children || null
    }) : children || null, /*#__PURE__*/_jsx("div", {
      hidden: true,
      "aria-hidden": "true",
      "data-id-markers": visibleMarkersData,
      children: visibleMarkers.map(function (marker) {
        return /*#__PURE__*/_jsx("mark", {
          "data-id-marker": marker
        }, marker);
      })
    })]
  });
};

if (process.env.NODE_ENV !== 'production') {
  RhumbProvider.propTypes = {
    config: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({
      listen: PropTypes.func.isRequired,
      pathname: PropTypes.string.isRequired
    }).isRequired,
    children: PropTypes.node,
    defaultTimeout: PropTypes.number,
    captureExceptions: PropTypes.bool
  };
}

export default /*#__PURE__*/memo(RhumbProvider);