/* eslint no-console: 0, no-throw-literal: 0 */
'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import Raven from 'Raven';
import planout from 'planout';
import ExposureLogger from './ExposureLogger';
import { getUserId as _getUserId } from './setup/LabSetup';

var Experiment = /*#__PURE__*/function (_planout$Experiment) {
  _inherits(Experiment, _planout$Experiment);

  function Experiment() {
    _classCallCheck(this, Experiment);

    return _possibleConstructorReturn(this, _getPrototypeOf(Experiment).apply(this, arguments));
  }

  _createClass(Experiment, [{
    key: "setup",
    value: function setup() {
      throw 'IMPLEMENT setup';
    }
  }, {
    key: "assign",
    value: function assign() {
      throw 'IMPLEMENT assign';
    }
  }, {
    key: "getParamNames",
    value: function getParamNames() {
      return this.getDefaultParamNames();
    }
  }, {
    key: "getUserId",
    value: function getUserId() {
      if (this.inputs && this.inputs.user_id) {
        return this.inputs.user_id;
      }

      var labsUserId = _getUserId();

      if (labsUserId) {
        return labsUserId;
      }

      var errorMessage = '[hublabs-core] Please specify a user id';
      console.error(errorMessage);
      Raven.captureException(new Error(errorMessage));
      return null;
    }
  }, {
    key: "logExposure",
    value: function logExposure(extras) {
      this.exposureLogger.logExposure(extras);
    }
  }, {
    key: "configureLogger",
    value: function configureLogger() {
      this.exposureLogger = new ExposureLogger(this);
    }
  }, {
    key: "previouslyLogged",
    value: function previouslyLogged() {
      return this.exposureLogger.previouslyLogged();
    }
  }, {
    key: "flipCoin",
    value: function flipCoin() {
      var p = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
      return new planout.Ops.Random.BernoulliTrial({
        p: p,
        unit: this.getUserId()
      });
    }
  }, {
    key: "choose",
    value: function choose() {
      var choices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var weights = arguments.length > 1 ? arguments[1] : undefined;
      var options = {
        choices: choices,
        unit: this.getUserId()
      };

      if (weights) {
        options.weights = weights;
        return new planout.Ops.Random.WeightedChoice(options);
      }

      return new planout.Ops.Random.UniformChoice(options);
    }
  }]);

  return Experiment;
}(planout.Experiment);

export default Experiment;