'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
var recordDefaults = {
  portalId: null,
  surveyId: null,
  contactVid: null
};

var SendSurveyTaskRequest = /*#__PURE__*/function (_Record) {
  _inherits(SendSurveyTaskRequest, _Record);

  function SendSurveyTaskRequest() {
    _classCallCheck(this, SendSurveyTaskRequest);

    return _possibleConstructorReturn(this, _getPrototypeOf(SendSurveyTaskRequest).apply(this, arguments));
  }

  _createClass(SendSurveyTaskRequest, null, [{
    key: "from",
    value: function from(data) {
      return new SendSurveyTaskRequest(Object.assign({}, data));
    }
  }]);

  return SendSurveyTaskRequest;
}(Record(recordDefaults));

export { SendSurveyTaskRequest as default };