/* eslint no-console: 0 */
'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import HublabsNamespace from 'hublabs-core/Namespace';
import { isFunction } from './utils'; // makeNamespace
// ---
// The fact that hublabs uses classical inheritance to construct namespaces & experiments is an implementation detail.
// The goal of makeNamespace is to:
//  1. Abstract away classes as an implementation detail of hublabs.
//  2. Abstract away boilerplate to creating a namespace.
//  3. Add sane defaults to namespace options.

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$name = _ref.name,
      name = _ref$name === void 0 ? 'GenericNamespace' : _ref$name,
      _ref$segments = _ref.segments,
      segments = _ref$segments === void 0 ? 100 : _ref$segments,
      _ref$identifier = _ref.identifier,
      identifier = _ref$identifier === void 0 ? null : _ref$identifier,
      _ref$setupExperiments = _ref.setupExperiments,
      _setupExperiments = _ref$setupExperiments === void 0 ? function () {} : _ref$setupExperiments,
      _ref$allowAutoExposur = _ref.allowAutoExposureLogging,
      allowAutoExposureLogging = _ref$allowAutoExposur === void 0 ? true : _ref$allowAutoExposur,
      _ref$allowedOverride = _ref.allowedOverride,
      allowedOverride = _ref$allowedOverride === void 0 ? null : _ref$allowedOverride,
      _ref$getOverrides = _ref.getOverrides,
      getOverrides = _ref$getOverrides === void 0 ? null : _ref$getOverrides,
      _ref$extraOpts = _ref.extraOpts,
      extraOpts = _ref$extraOpts === void 0 ? {} : _ref$extraOpts;

  var Namespace = /*#__PURE__*/function (_HublabsNamespace) {
    _inherits(Namespace, _HublabsNamespace);

    function Namespace() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Namespace);

      args.app = 'hubspot';
      return _possibleConstructorReturn(this, _getPrototypeOf(Namespace).call(this, args));
    }

    _createClass(Namespace, [{
      key: "setup",
      value: function setup() {
        if (name) {
          this.setName(name);
        }

        if (identifier) {
          this.setIdentifier();
        }

        if (segments && typeof segments === 'number') {
          this.setSegments();
        }

        if (isFunction(allowedOverride) && isFunction(getOverrides)) {
          this.allowedOverride = allowedOverride.bind(this);
          this.getOverrides = getOverrides.bind(this);
        } else if (allowedOverride || getOverrides) {
          console.warn('Hublabs warning - to set global overrides, both the "allowedOverride" & "getOverrides" functions must be defined.');
        }

        this.setAutoExposureLogging(allowAutoExposureLogging);
      }
    }, {
      key: "setIdentifier",
      value: function setIdentifier() {
        // hublabs normally defaults this to (unit = user_id), aka the ID set
        // in registerUser().
        // If you add `identifier: SOME_ID` to your namespace, it will be the
        // source of truth instead.
        // Example - see `NewUserActivationNamespace`
        this.setPrimaryUnit('namespace_identifier');
        this.inputs.namespace_identifier = identifier;
      }
    }, {
      key: "setSegments",
      value: function setSegments() {
        // hublabs defaults this to 100
        this.numSegments = segments;
      }
    }, {
      key: "setupExperiments",
      value: function setupExperiments() {
        if (_setupExperiments && typeof _setupExperiments === 'function') {
          _setupExperiments(this.addExperiment.bind(this), this.removeExperiment.bind(this));
        }
      }
    }]);

    return Namespace;
  }(HublabsNamespace);

  return new Namespace(extraOpts);
});