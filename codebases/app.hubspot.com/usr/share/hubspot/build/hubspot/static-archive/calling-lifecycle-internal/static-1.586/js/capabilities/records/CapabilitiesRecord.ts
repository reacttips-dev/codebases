import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';

var CapabilitiesRecord = /*#__PURE__*/function (_Record) {
  _inherits(CapabilitiesRecord, _Record);

  function CapabilitiesRecord() {
    _classCallCheck(this, CapabilitiesRecord);

    return _possibleConstructorReturn(this, _getPrototypeOf(CapabilitiesRecord).apply(this, arguments));
  }

  return CapabilitiesRecord;
}(Record({
  customAssociations: true,
  callOutcomes: true,
  callTypes: true,
  callingProviders: true,
  fontStyles: true,
  followupTasks: true
}, 'CapabilitiesRecord'));

export { CapabilitiesRecord as default };