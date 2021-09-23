'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import HublabsExperiment from 'hublabs-core/Experiment'; // makeExperiment
// ---
// The fact that hublabs uses classical inheritance to construct namespaces & experiments is an implementation detail.
// The goal of makeExperiment is to:
//  1. Abstract away classes as an implementation detail of hublabs.
//  2. Abstract away boilerplate to creating an experiment.
//  3. Add sane defaults to experiment options.

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$name = _ref.name,
      name = _ref$name === void 0 ? 'GenericExperiment' : _ref$name,
      _ref$identifier = _ref.identifier,
      identifier = _ref$identifier === void 0 ? null : _ref$identifier,
      _ref$setupParams = _ref.setupParams,
      setupParams = _ref$setupParams === void 0 ? function () {} : _ref$setupParams,
      _ref$allowAutoExposur = _ref.allowAutoExposureLogging,
      allowAutoExposureLogging = _ref$allowAutoExposur === void 0 ? true : _ref$allowAutoExposur,
      _ref$version = _ref.version,
      version = _ref$version === void 0 ? 'v1' : _ref$version,
      _ref$useInNamespace = _ref.useInNamespace,
      useInNamespace = _ref$useInNamespace === void 0 ? true : _ref$useInNamespace,
      _ref$extraOpts = _ref.extraOpts,
      extraOpts = _ref$extraOpts === void 0 ? {} : _ref$extraOpts;

  var Experiment = /*#__PURE__*/function (_HublabsExperiment) {
    _inherits(Experiment, _HublabsExperiment);

    function Experiment() {
      _classCallCheck(this, Experiment);

      return _possibleConstructorReturn(this, _getPrototypeOf(Experiment).apply(this, arguments));
    }

    _createClass(Experiment, [{
      key: "setup",
      value: function setup() {
        if (name) {
          this.setName(name);
        }

        this.version = version;
        this.setAutoExposureLogging(allowAutoExposureLogging);
      }
    }, {
      key: "assign",
      value: function assign(params) {
        var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (setupParams && typeof setupParams === 'function') {
          var choose = this.choose.bind(this);
          var flipCoin = this.flipCoin.bind(this);
          setupParams(params, {
            choose: choose,
            flipCoin: flipCoin
          }, args);

          this.assign.toString = function () {
            return setupParams.toString();
          };
        }
      }
    }]);

    return Experiment;
  }(HublabsExperiment);

  if (useInNamespace) {
    return Experiment;
  }

  if (identifier) {
    extraOpts.user_id = identifier;
  }

  return new Experiment(extraOpts);
});