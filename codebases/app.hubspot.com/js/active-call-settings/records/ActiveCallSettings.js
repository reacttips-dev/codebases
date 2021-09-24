'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import { CALL_FROM_BROWSER } from 'calling-lifecycle-internal/constants/CallMethods';
import { LOADING } from 'calling-internal-common/widget-status/constants/CallWidgetStates';
import { PhoneNumberIdentifier } from 'calling-lifecycle-internal/callees/records/PhoneNumberIdentifier';
export var Subject = Record({
  subjectId: null,
  objectTypeId: null
}, 'Subject');
var DEFAULTS = {
  callEndStatus: null,
  clientStatus: LOADING,
  selectedCallMethod: CALL_FROM_BROWSER,
  selectedFromNumber: null,
  selectedConnectFromNumber: null,
  toNumberIdentifier: null,
  ownerId: null,
  subject: Subject(),
  shouldAutoStartCall: false,
  isCallActive: false,
  isQueueTask: false,
  appIdentifier: null,
  threadId: null
};

var ActiveCallSettings = /*#__PURE__*/function (_Record) {
  _inherits(ActiveCallSettings, _Record);

  function ActiveCallSettings() {
    _classCallCheck(this, ActiveCallSettings);

    return _possibleConstructorReturn(this, _getPrototypeOf(ActiveCallSettings).apply(this, arguments));
  }

  _createClass(ActiveCallSettings, null, [{
    key: "fromJS",
    value: function fromJS() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var subject = data.subject,
          toNumberIdentifier = data.toNumberIdentifier,
          rest = _objectWithoutProperties(data, ["subject", "toNumberIdentifier"]);

      return new ActiveCallSettings(Object.assign({}, rest, {
        subject: Subject(subject || {}),
        toNumberIdentifier: toNumberIdentifier ? new PhoneNumberIdentifier(toNumberIdentifier) : null
      }));
    }
  }]);

  return ActiveCallSettings;
}(Record(DEFAULTS, 'ActiveCallSettings'));

export { ActiveCallSettings as default };