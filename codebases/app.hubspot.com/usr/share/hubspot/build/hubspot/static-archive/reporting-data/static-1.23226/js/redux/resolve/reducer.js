'use es6';

import { fromJS, List, Map as ImmutableMap } from 'immutable';
import isDevelopment from '../../lib/development';
import State from './records/State';
import ResolveState from './records/ResolveState';
import { ADD_CONFIG, SET_CONFIGURED, SET_PROMISE, SET_STATUS, SET_DATA, DEBUG, baseEnter, baseExit, BUST_ALL_RESOLVES, BUST_ONE_RESOLVE } from './actions';
import { splitConfig, isComparisonConfig } from '../../compare';
import { Config } from '../../config';
var WRITE_DEBUG = isDevelopment();

var isEnterAction = function isEnterAction(actionType) {
  return actionType.startsWith(baseEnter);
};

var isExitAction = function isExitAction(actionType) {
  return actionType.startsWith(baseExit);
};

var normalizeConfig = function normalizeConfig(config) {
  var normalizeDeep = function normalizeDeep(m) {
    return m.map(function (v) {
      return ImmutableMap.isMap(v) ? normalizeDeep(v) : v;
    }).filter(function (v) {
      return v != null;
    }) // remove empty lists
    .filterNot(function (v) {
      return List.isList(v) && v.isEmpty();
    }) // remove empty maps
    .filterNot(function (v) {
      return ImmutableMap.isMap(v) && v.isEmpty();
    });
  };

  return normalizeDeep(fromJS(Config(config).toJS())).update('offset', function (offset) {
    return offset || 0;
  }).delete('v2');
};

var findConfigKey = function findConfigKey(state, config) {
  return state.get('configs').findKey(function (_, configKey) {
    return normalizeConfig(configKey).equals(normalizeConfig(config));
  });
};

var reindexConfigs = function reindexConfigs(state) {
  var ids = state.get('configs').toList();

  var reindex = function reindex(id) {
    return ids.indexOf(id);
  };

  return state.update('configs', function (configs) {
    return configs.map(reindex);
  }).update('resolving', function (resolving) {
    return resolving.mapKeys(reindex);
  });
};

export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new State();
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      _action$data = action.data,
      data = _action$data === void 0 ? {} : _action$data;
  var config = data.config;

  if (type === 'SET_RUN_ID') {
    return state.set('runId', data);
  }

  if (type === BUST_ALL_RESOLVES) {
    return new State();
  }

  if (!config) {
    return state;
  }

  if (type === BUST_ONE_RESOLVE) {
    var configKey = findConfigKey(state, config);

    if (!configKey) {
      return state;
    }

    var _configId = state.getIn(['configs', configKey], null);

    if (isComparisonConfig(config)) {
      var _splitConfig = splitConfig(config),
          baseConfig = _splitConfig.config,
          compareConfig = _splitConfig.compareConfig;

      var baseConfigKey = findConfigKey(state, baseConfig);
      var compareConfigKey = findConfigKey(state, compareConfig);
      var baseConfigId = state.getIn(['configs', baseConfigKey], null);
      var compareConfigId = state.getIn(['configs', compareConfigKey], null);
      return reindexConfigs(state.deleteIn(['configs', configKey]).deleteIn(['configs', baseConfigKey]).deleteIn(['configs', compareConfigKey]).deleteIn(['resolving', _configId]).deleteIn(['resolving', baseConfigId]).deleteIn(['resolving', compareConfigId]));
    }

    return reindexConfigs( // delete the main config
    state.deleteIn(['configs', configKey]).deleteIn(['resolving', _configId]));
  }

  var configId = state.getIn(['configs', config], null);

  if (type === ADD_CONFIG) {
    if (!configId) {
      var newConfigId = state.get('configs').count();
      return state.setIn(['configs', config], newConfigId).setIn(['resolving', newConfigId], new ResolveState({
        config: config
      }));
    }

    return state;
  }

  var update = function update(updater) {
    return state.updateIn(['resolving', configId], updater);
  };

  switch (type) {
    case SET_CONFIGURED:
      {
        var configured = data.configured;
        return update(function (resolveState) {
          return resolveState.set('configured', configured);
        });
      }

    case SET_PROMISE:
      {
        var promise = data.promise;
        return update(function (resolveState) {
          return resolveState.set('promise', promise);
        });
      }

    case SET_STATUS:
      {
        var status = data.status,
            _data$error = data.error,
            error = _data$error === void 0 ? null : _data$error;
        return update(function (resolveState) {
          return resolveState.set('status', status).updateIn(['debug', 'exceptions'], function (exceptions) {
            return error != null ? exceptions.push(error) : exceptions;
          });
        });
      }

    case SET_DATA:
      {
        var datasets = data.data;
        return update(function (resolveState) {
          return resolveState.set('data', datasets);
        });
      }

    case DEBUG:
      {
        var key = data.key,
            value = data.value;
        return update(function (resolveState) {
          return resolveState.updateIn(['debug', key], function (prevValue) {
            return typeof value === 'function' ? value(prevValue) : value;
          });
        });
      }

    default:
  }

  if (isEnterAction(type)) {
    var name = data.name,
        input = data.input;
    return update(function (resolveState) {
      return resolveState.set('currentPhase', name.toUpperCase()).updateIn(['debug', 'phases'], function (debugState) {
        return WRITE_DEBUG ? debugState.setIn([name, 'input'], input) : debugState;
      });
    });
  } else if (isExitAction(type)) {
    var _name = data.name,
        output = data.output;
    return update(function (resolveState) {
      return resolveState.set('currentPhase', '').updateIn(['debug', 'phases'], function (debugState) {
        return WRITE_DEBUG ? debugState.setIn([_name, 'output'], output) : debugState;
      });
    });
  }

  return state;
});