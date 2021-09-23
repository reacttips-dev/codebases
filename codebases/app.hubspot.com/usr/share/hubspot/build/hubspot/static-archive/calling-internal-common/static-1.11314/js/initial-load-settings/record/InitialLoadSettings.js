'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { Record, OrderedMap, List } from 'immutable';
import Token from '../../records/token/Token';
import TwilioConnectUsageSummary from '../../records/twilio-connect-usage-summary/TwilioConnectUsageSummary';
import UsageSummary from '../../records/usage-summary/UsageSummary';
import CallDisposition from '../../records/call-disposition/CallDisposition';
import { buildPhoneNumbers } from '../utils/buildPhoneNumbers';
var DEFAULTS = {
  recordingEnabled: false,
  hasTwilioConnect: false,
  connectStatus: null,
  capabilityToken: null,
  fromNumbers: OrderedMap(),
  connectNumbers: OrderedMap(),
  callDispositions: List(),
  token: new Token(),
  connectToken: new Token(),
  twilioConnectUsageSummary: new TwilioConnectUsageSummary(),
  usageSummary: new UsageSummary()
};

function parseDispositions(dispositions) {
  if (!dispositions) {
    return List();
  }

  return dispositions.reduce(function (list, disposition) {
    return list.push(new CallDisposition(disposition));
  }, List());
}

function parseLoadSettings() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var time = _ref.time,
      data = _objectWithoutProperties(_ref, ["time"]);

  var fromNumbers = data.fromNumbers || [];
  var connectNumbers = data.connectNumbers || [];
  var token = data.token || {};
  var connectToken = data.connectToken || {};
  var twilioUsage = data.twilioConnectUsageSummary || {
    calls: {}
  };
  var usageSummary = data.usageSummary || {};
  var dispositions = data.callDispositions || [];
  return Object.assign({}, data, {
    callDispositions: parseDispositions(dispositions),
    fromNumbers: buildPhoneNumbers(fromNumbers),
    connectNumbers: buildPhoneNumbers(connectNumbers),
    token: new Token(Object.assign({}, token, {
      timestamp: time || token.timestamp || null
    })),
    connectToken: new Token(Object.assign({}, connectToken, {
      timestamp: time || connectToken.timestamp || null
    })),
    twilioConnectUsageSummary: new TwilioConnectUsageSummary(twilioUsage),
    usageSummary: new UsageSummary(usageSummary)
  });
}

var InitialLoadSettings = /*#__PURE__*/function (_Record) {
  _inherits(InitialLoadSettings, _Record);

  function InitialLoadSettings() {
    _classCallCheck(this, InitialLoadSettings);

    return _possibleConstructorReturn(this, _getPrototypeOf(InitialLoadSettings).apply(this, arguments));
  }

  _createClass(InitialLoadSettings, null, [{
    key: "fromJS",
    value: function fromJS(data) {
      return new InitialLoadSettings(parseLoadSettings(data));
    }
  }]);

  return InitialLoadSettings;
}(Record(DEFAULTS, 'InitialLoadSettings'));

export { InitialLoadSettings as default };