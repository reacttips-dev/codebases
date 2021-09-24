/* eslint no-console: 0, no-throw-literal: 0 */
'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _get from "@babel/runtime/helpers/esm/get";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import Raven from 'Raven';
import planout from 'planout';
import { getUserId, getArbitraryProps } from './setup/LabSetup';

var Namespace = /*#__PURE__*/function (_planout$Namespace$Si) {
  _inherits(Namespace, _planout$Namespace$Si);

  function Namespace() {
    var _this;

    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Namespace);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Namespace).call(this, args));

    if (!_this.inputs.app) {
      throw new Error('Please specify an app name');
    }

    return _this;
  }

  _createClass(Namespace, [{
    key: "get",
    value: function get(param) {
      var labsUserId = getUserId();

      if (labsUserId) {
        this.inputs.user_id = labsUserId;
      } else {
        var errorMessage = '[hublabs-core] Please specify a user id';
        console.error(errorMessage);
        Raven.captureException(new Error(errorMessage));
        return null;
      }

      var arbitraryProps = getArbitraryProps();
      var keys = Object.keys(arbitraryProps);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        this.inputs[key] = arbitraryProps[key];
      }

      return _get(_getPrototypeOf(Namespace.prototype), "get", this).call(this, param);
    }
  }, {
    key: "setupExperiments",
    value: function setupExperiments() {
      throw 'IMPLEMENT setupExperiments';
    }
  }, {
    key: "setup",
    value: function setup() {
      throw 'IMPLEMENT setup';
    }
  }, {
    key: "setupDefaults",
    value: function setupDefaults() {
      this.setPrimaryUnit('user_id');
      this.numSegments = 100;
      this.inputs.user_id = getUserId();
    }
  }]);

  return Namespace;
}(planout.Namespace.SimpleNamespace);

export default Namespace;