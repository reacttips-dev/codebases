'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import pipe from 'transmute/pipe';
import applyEnrollmentSettings from 'sales-modal/redux/utils/applyEnrollmentSettings';
import preRenderSequenceSteps from './init/preRenderSequenceSteps';
import setEmailAddress from 'sales-modal/redux/utils/setEmailAddress';
import setInitialTimeOfDay from './init/setInitialTimeOfDay';
import setInitialTimezone from './init/setInitialTimezone';
import setInitialValues from './init/setInitialValues';
import validateDates from 'sales-modal/redux/utils/validateDates';
var SequenceEnrollmentBaseRecord = Record({
  id: null,
  userId: null,
  portalId: null,
  folderId: null,
  name: null,
  steps: null,
  timeOfInitialization: null,
  timezone: null,
  fromAddress: null,
  inboxAddress: null,
  loggedToCrm: null,
  startingStepOrder: null,
  stepEnrollments: null,
  enrolledAt: null,
  sequenceSettings: null,
  initialTouchDelay: null,
  firstSendType: null,
  userPlatform: null,
  updatedAt: null,
  createdAt: null,
  enrollmentState: null
}, 'SequenceEnrollmentBaseRecord');

var SequenceEnrollmentRecord = /*#__PURE__*/function (_SequenceEnrollmentBa) {
  _inherits(SequenceEnrollmentRecord, _SequenceEnrollmentBa);

  function SequenceEnrollmentRecord() {
    _classCallCheck(this, SequenceEnrollmentRecord);

    return _possibleConstructorReturn(this, _getPrototypeOf(SequenceEnrollmentRecord).apply(this, arguments));
  }

  _createClass(SequenceEnrollmentRecord, null, [{
    key: "init",
    value: function init(_ref) {
      var selectedSender = _ref.selectedSender,
          portalTimezone = _ref.portalTimezone,
          sequence = _ref.sequence,
          signature = _ref.signature,
          hasEnrolledSequence = _ref.hasEnrolledSequence,
          stepEnrollments = _ref.stepEnrollments,
          renderedTemplates = _ref.renderedTemplates,
          unsubscribeLink = _ref.unsubscribeLink,
          unsubscribeLinkType = _ref.unsubscribeLinkType,
          _ref$isBulkEnroll = _ref.isBulkEnroll,
          isBulkEnroll = _ref$isBulkEnroll === void 0 ? false : _ref$isBulkEnroll,
          enrollmentState = _ref.enrollmentState,
          gates = _ref.gates,
          scopes = _ref.scopes,
          _ref$isPrimarySequenc = _ref.isPrimarySequence,
          isPrimarySequence = _ref$isPrimarySequenc === void 0 ? false : _ref$isPrimarySequenc,
          enrollType = _ref.enrollType;
      // Order here matters. Do not change this order. Only append after setEmailAddress
      var sequenceEnrollmentRecord = new SequenceEnrollmentRecord(sequence);
      return pipe(function (sequenceEnrollment) {
        return setInitialValues({
          sequenceEnrollment: sequenceEnrollment,
          stepEnrollments: stepEnrollments,
          enrollType: enrollType,
          enrollmentState: enrollmentState
        });
      }, function (sequenceEnrollment) {
        return preRenderSequenceSteps({
          sequenceEnrollment: sequenceEnrollment,
          signature: signature,
          renderedTemplates: renderedTemplates,
          unsubscribeLink: unsubscribeLink,
          unsubscribeLinkType: unsubscribeLinkType,
          hasEnrolledSequence: hasEnrolledSequence,
          gates: gates,
          scopes: scopes,
          isPrimarySequence: isPrimarySequence,
          enrollType: enrollType
        });
      }, function (sequenceEnrollment) {
        return setInitialTimezone({
          sequenceEnrollment: sequenceEnrollment,
          portalTimezone: portalTimezone
        });
      }, function (sequenceEnrollment) {
        return setInitialTimeOfDay({
          sequenceEnrollment: sequenceEnrollment,
          enrollType: enrollType
        });
      }, function (sequenceEnrollment) {
        return applyEnrollmentSettings({
          sequenceEnrollment: sequenceEnrollment,
          isBulkEnroll: isBulkEnroll
        });
      }, function (sequenceEnrollment) {
        return setEmailAddress({
          sequenceEnrollment: sequenceEnrollment,
          fromAddress: selectedSender.fromAddress,
          inboxAddress: selectedSender.inboxAddress
        });
      }, function (sequenceEnrollment) {
        return validateDates({
          sequenceEnrollment: sequenceEnrollment,
          enrollType: enrollType
        });
      })(sequenceEnrollmentRecord);
    }
  }]);

  return SequenceEnrollmentRecord;
}(SequenceEnrollmentBaseRecord);

export { SequenceEnrollmentRecord as default };