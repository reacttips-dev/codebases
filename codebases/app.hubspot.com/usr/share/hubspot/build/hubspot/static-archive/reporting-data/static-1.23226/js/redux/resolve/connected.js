'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { getConfigId } from './get';
import { enterPhase, exitPhase, debug as debugAction } from './actions';
import connectActions from '../connectActions';
/**
 * A connected phase updates the redux store with enter and exit
 * actions.
 *
 * @param {string} name The name of the phase
 * @param {function} fn The phase implementation
 */

export var connectedPhase = function connectedPhase(name, fn) {
  return function (store) {
    return function (config) {
      var runtimeOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return function () {
        var id = getConfigId(store.getState(), config);

        if (id == null) {
          throw new Error('Config not assigned id');
        }

        var _connectActions = connectActions(store, [debugAction]),
            _connectActions2 = _slicedToArray(_connectActions, 1),
            debug = _connectActions2[0];

        var debugFn = function debugFn(key, value) {
          return debug({
            config: config,
            key: key,
            value: value
          });
        };

        for (var _len = arguments.length, input = new Array(_len), _key = 0; _key < _len; _key++) {
          input[_key] = arguments[_key];
        }

        store.dispatch(enterPhase({
          config: config,
          name: name,
          input: input
        }));
        return fn.apply(void 0, input.concat([debugFn, runtimeOptions])).then(function (output) {
          store.dispatch(exitPhase({
            config: config,
            name: name,
            output: output
          }));
          return output;
        });
      };
    };
  };
};