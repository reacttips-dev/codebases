'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { GYPSUM } from 'HubStyleTokens/colors';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIToolTip from 'UIComponents/tooltip/UITooltip';
import UIButtonGroup from 'UIComponents/button/UIButtonGroup';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';
import partial from 'transmute/partial';
import get from 'transmute/get';
import CallExtensionsContext from '../../WidgetBase/context/CallingExtensionsContext';
import { getSetting, setSetting } from 'calling-lifecycle-internal/local-settings/localSettings';
import TaskEngagement from '../records/TaskEngagement';
import { getReminderTimestamp } from '../../utils/getReminderTimestamp';
import { getFollowUpTimestamp } from '../../utils/getFollowUpTimestamp';
import { formatTaskAssociations } from '../operators/followupTaskAssociations';
var ButtonGroup = styled(UIButtonGroup).withConfig({
  displayName: "SaveCallButton__ButtonGroup",
  componentId: "et9re3-0"
})(["display:flex;flex:2 0 ", ";.uiDropdown__button{border-left:1px solid ", ";}"], function (props) {
  return props.isQueueTask === 'true' && props.shouldCompleteTask === 'true' ? '240px' : '150px';
}, GYPSUM); // flex: 2 0 240px; // or 150 if it sin the call queue

var SaveCallButton = /*#__PURE__*/function (_PureComponent) {
  _inherits(SaveCallButton, _PureComponent);

  function SaveCallButton() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, SaveCallButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(SaveCallButton)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      shouldCompleteTask: JSON.parse(getSetting('shouldCompleteTask', true))
    };

    _this.createEngagementData = function (rawEngagementData) {
      var title = rawEngagementData.title,
          description = rawEngagementData.description,
          ownerId = rawEngagementData.ownerId,
          associations = rawEngagementData.associations,
          selectedDate = rawEngagementData.selectedDate,
          selectedTime = rawEngagementData.selectedTime,
          reminder = rawEngagementData.reminder;
      var taskAssociationDefinitions = _this.props.taskAssociationDefinitions;
      var followUpTimestamp = getFollowUpTimestamp(selectedDate, selectedTime);
      var reminderTimestamp = getReminderTimestamp(reminder, followUpTimestamp);
      var formattedTaskAssociations = formatTaskAssociations(associations, taskAssociationDefinitions);
      var engagement = TaskEngagement.fromJS({
        ownerId: ownerId,
        timestamp: followUpTimestamp,
        subject: title,
        body: description,
        reminders: reminderTimestamp,
        associations: formattedTaskAssociations
      });
      return engagement;
    };

    _this.toggleShouldCompleteTask = function (shouldCompleteTask) {
      setSetting('shouldCompleteTask', shouldCompleteTask);

      _this.setState({
        shouldCompleteTask: shouldCompleteTask
      });

      _this.props.onCompleteTaskToggle(shouldCompleteTask);
    };

    _this.handleSaveFail = function () {
      _this.context.sendNotification({
        notificationType: 'danger',
        message: I18n.text('calling-communicator-ui.updateInitialLogEngagement.failedMsg')
      });
    };

    _this.handleAssociationsUpdateFail = function () {
      _this.context.sendNotification({
        notificationType: 'danger',
        message: I18n.text('calling-communicator-ui.rte.plugins.atMentions.error')
      });
    };

    _this.handleSaveSuccess = function () {
      var _this$props = _this.props,
          resetCallData = _this$props.resetCallData,
          engagementId = _this$props.engagementId;
      var shouldCompleteTask = _this.state.shouldCompleteTask;

      _this.context.callSaved({
        engagementId: engagementId,
        shouldCompleteTask: shouldCompleteTask
      });

      resetCallData();
    };

    _this.handleClick = function () {
      var _this$props2 = _this.props,
          callDisposition = _this$props2.callDisposition,
          updateEngagement = _this$props2.updateEngagement,
          isRecording = _this$props2.isRecording,
          trackSaveCall = _this$props2.trackSaveCall,
          submitCSaTFeedback = _this$props2.submitCSaTFeedback,
          csatFeedbackScore = _this$props2.csatFeedbackScore,
          callSid = _this$props2.callSid,
          appIdentifier = _this$props2.appIdentifier,
          shouldCreateFollowUpTask = _this$props2.shouldCreateFollowUpTask,
          rawEngagementData = _this$props2.rawEngagementData,
          createFollowUpTask = _this$props2.createFollowUpTask;
      var disposition = callDisposition && get('text', callDisposition);
      updateEngagement({
        onFail: _this.handleSaveFail,
        onSuccess: _this.handleSaveSuccess
      });

      if (csatFeedbackScore > 0) {
        submitCSaTFeedback({
          qualityScore: csatFeedbackScore,
          sId: callSid,
          appIdentifier: appIdentifier
        });
      }

      trackSaveCall({
        callDisposition: disposition,
        isRecording: isRecording
      });

      if (shouldCreateFollowUpTask) {
        var engagement = _this.createEngagementData(rawEngagementData);

        var data = {
          engagement: engagement,
          context: _this.context
        };
        createFollowUpTask(data);
      }
    };

    return _this;
  }

  _createClass(SaveCallButton, [{
    key: "canCall",
    value: function canCall() {
      var _this$props3 = this.props,
          disabled = _this$props3.disabled,
          betCallDetailsRequired = _this$props3.betCallDetailsRequired,
          validatedToNumberIsLoading = _this$props3.validatedToNumberIsLoading;
      return !(disabled || betCallDetailsRequired || validatedToNumberIsLoading);
    }
  }, {
    key: "renderButton",
    value: function renderButton() {
      var _this$props4 = this.props,
          betCallDetailsRequired = _this$props4.betCallDetailsRequired,
          isQueueTask = _this$props4.isQueueTask,
          engagementId = _this$props4.engagementId;
      var shouldCompleteTask = this.state.shouldCompleteTask;
      var saveCallMessage = 'calling-communicator-ui.callingButtons.save';

      if (isQueueTask) {
        saveCallMessage = shouldCompleteTask ? 'calling-communicator-ui.callingButtons.saveAndCompleteTask' : 'calling-communicator-ui.callingButtons.saveCallOnly';
      }

      return /*#__PURE__*/_jsx(UIToolTip, {
        disabled: !betCallDetailsRequired,
        title: I18n.text('bet.openISCActivityTypeLog.tooltips.selectCallDetails'),
        placement: "right",
        children: /*#__PURE__*/_jsx(UIButton, {
          "data-engagement-id": engagementId,
          "data-selenium-test": "calling-widget-save-call-button",
          responsive: false,
          disabled: !this.canCall(),
          onClick: this.handleClick,
          size: "small",
          use: "primary",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: saveCallMessage
          })
        })
      });
    }
  }, {
    key: "renderDropdown",
    value: function renderDropdown() {
      var _this$props5 = this.props,
          disabled = _this$props5.disabled,
          betCallDetailsRequired = _this$props5.betCallDetailsRequired;
      return /*#__PURE__*/_jsx(UIDropdown, {
        responsive: false,
        buttonSize: "small",
        buttonUse: "primary",
        iconName: null,
        disabled: disabled || betCallDetailsRequired,
        children: /*#__PURE__*/_jsxs(UIList, {
          children: [/*#__PURE__*/_jsx(UIButton, {
            use: "link",
            onClick: partial(this.toggleShouldCompleteTask, true),
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "calling-communicator-ui.callingButtons.saveAndCompleteTask"
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            use: "link",
            onClick: partial(this.toggleShouldCompleteTask, false),
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "calling-communicator-ui.callingButtons.saveCallOnly"
            })
          })]
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var isQueueTask = this.props.isQueueTask;
      return /*#__PURE__*/_jsxs(ButtonGroup, {
        isQueueTask: "" + isQueueTask,
        shouldCompleteTask: "" + this.state.shouldCompleteTask,
        children: [this.renderButton(), isQueueTask && this.renderDropdown()]
      });
    }
  }]);

  return SaveCallButton;
}(PureComponent);

SaveCallButton.propTypes = {
  callSid: PropTypes.string,
  csatFeedbackScore: PropTypes.number.isRequired,
  createFollowUpTask: PropTypes.func.isRequired,
  rawEngagementData: PropTypes.object,
  shouldCreateFollowUpTask: PropTypes.bool,
  updateEngagement: PropTypes.func.isRequired,
  engagementId: PropTypes.number,
  isRecording: PropTypes.bool.isRequired,
  callDisposition: ImmutablePropTypes.map,
  disabled: PropTypes.bool.isRequired,
  betCallDetailsRequired: PropTypes.bool.isRequired,
  resetCallData: PropTypes.func.isRequired,
  onCompleteTaskToggle: PropTypes.func.isRequired,
  isQueueTask: PropTypes.bool,
  trackSaveCall: PropTypes.func.isRequired,
  submitCSaTFeedback: PropTypes.func.isRequired,
  validatedToNumberIsLoading: PropTypes.bool.isRequired,
  appIdentifier: PropTypes.string.isRequired,
  taskAssociationDefinitions: ImmutablePropTypes.list.isRequired
};
SaveCallButton.contextType = CallExtensionsContext;
export { SaveCallButton as default };