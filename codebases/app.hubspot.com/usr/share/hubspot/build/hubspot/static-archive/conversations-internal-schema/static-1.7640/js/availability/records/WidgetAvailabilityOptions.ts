import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import TypicalResponseTime from '../../typical-response-time/records/TypicalResponseTime';

var WidgetAvailabilityOptions = /*#__PURE__*/function (_Record) {
  _inherits(WidgetAvailabilityOptions, _Record);

  function WidgetAvailabilityOptions() {
    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WidgetAvailabilityOptions);

    return _possibleConstructorReturn(this, _getPrototypeOf(WidgetAvailabilityOptions).call(this, Object.assign({}, properties, {
      typicalResponseTime: properties.typicalResponseTime ? TypicalResponseTime(properties.typicalResponseTime) : null
    })));
  }

  return WidgetAvailabilityOptions;
}(Record({
  awayMessage: null,
  typicalResponseTime: null,
  officeHoursStartTime: null
}));

export default WidgetAvailabilityOptions;