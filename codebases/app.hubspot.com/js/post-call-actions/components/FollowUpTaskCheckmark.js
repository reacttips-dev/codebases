'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import merge from 'transmute/merge';
import set from 'transmute/set';
import getIn from 'transmute/getIn';
import { useCallback, useState, useEffect, useContext, Fragment } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import UICheckbox from 'UIComponents/input/UICheckbox';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILink from 'UIComponents/link/UILink';
import AsyncFollowUpTask from '../containers/AsyncFollowUpTask.js';
import { getIsQueueTaskFromState, getAppIdentifierFromState, getOwnerIdFromState, getNameFromSelectedCallableObject } from '../../active-call-settings/selectors/getActiveCallSettings';
import { hasFollowupTasksCapability as getHasFollowupTasksCapability } from '../../capabilities/selectors/getCapabilities';
import { getDefaultFollowUpDateCategory } from '../operators/getFollowUpDateCagetories';
import { AssociationsContext } from '../../associations/context/AssociationsContext';
import { getSelectedAssociations } from '../../associations/utils/getSelectedAssociations';
import { getDefaultTaskSettings } from '../../userSettings/selectors/getUserSettingsData';
var EIGHT_HOURS_IN_MINUTES = 8 * 60;
var ButtonWrapper = styled.div.withConfig({
  displayName: "FollowUpTaskCheckmark__ButtonWrapper",
  componentId: "sc-124is18-0"
})(["align-items:center;display:flex;padding:12px 0;justify-content:space-between;flex:0 1 ", ";"], function (props) {
  return props.isQueueTask && props.showLongButton ? '200px' : '250px';
});
var StyledUICheckbox = styled(UICheckbox).withConfig({
  displayName: "FollowUpTaskCheckmark__StyledUICheckbox",
  componentId: "sc-124is18-1"
})(["flex-wrap:", ";"], function (props) {
  return props.isQueueTask && props.showLongButton ? 'wrap' : 'nowrap';
});

var FollowUpTaskCheckmark = function FollowUpTaskCheckmark(_ref) {
  var showLongButton = _ref.showLongButton,
      disabled = _ref.disabled,
      shouldCreateFollowUpTask = _ref.shouldCreateFollowUpTask,
      handleCreateTaskToggle = _ref.handleCreateTaskToggle,
      setEngagementData = _ref.setEngagementData;
  var callableObjectName = useSelector(getNameFromSelectedCallableObject);
  var ownerId = useSelector(getOwnerIdFromState);
  var uasAssociations = useContext(AssociationsContext);
  var isQueueTask = useSelector(getIsQueueTaskFromState);
  var appIdentifier = useSelector(getAppIdentifierFromState);
  var hasFollowupTasksCapability = useSelector(getHasFollowupTasksCapability);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showFollowUpTaskModal = _useState2[0],
      setShowFollowupTaskModal = _useState2[1];

  var defaultTaskSettings = useSelector(getDefaultTaskSettings);

  var _useState3 = useState({
    title: I18n.text('follow-up-task.defaultInput.defaultTaskTitle', {
      subject: callableObjectName
    }),
    description: I18n.text('follow-up-task.defaultInput.defaultTaskDescription', {
      date: I18n.moment.userTz().format('LLLL')
    }),
    selectedDate: getDefaultFollowUpDateCategory(defaultTaskSettings),
    selectedTime: getIn(['defaultDueTime'], defaultTaskSettings) || EIGHT_HOURS_IN_MINUTES,
    reminder: getIn(['defaultReminderPreset'], defaultTaskSettings) || null,
    associations: getSelectedAssociations(uasAssociations.get('associations')),
    ownerId: ownerId
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      rawEngagementData = _useState4[0],
      setThisEngagementData = _useState4[1];

  useEffect(function () {
    setEngagementData(rawEngagementData);
  }, [rawEngagementData, setEngagementData]);
  useEffect(function () {
    var updatedAssociations = getSelectedAssociations(uasAssociations.get('associations'));

    if (updatedAssociations.equals(rawEngagementData.associations)) {
      return;
    }

    var updatedRawEngagementData = set('associations', updatedAssociations, rawEngagementData);
    setThisEngagementData(updatedRawEngagementData);
  }, [uasAssociations, setEngagementData, rawEngagementData]);
  var handleShowFollowUpTaskModal = useCallback(function () {
    setShowFollowupTaskModal(true);
    CommunicatorLogger.log('communicatorInteraction', {
      action: 'Click to create followup task',
      activity: 'CALL',
      channel: 'outbound call',
      source: appIdentifier
    });
  }, [appIdentifier]);
  var handleHideFollowUpTaskModal = useCallback(function () {
    setShowFollowupTaskModal(false);
  }, []);
  var handleSaveFollowUpTask = useCallback(function (taskData) {
    var mergedRawEngagementData = merge(taskData, rawEngagementData);
    setThisEngagementData(mergedRawEngagementData);
  }, [rawEngagementData]);
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [showFollowUpTaskModal && /*#__PURE__*/_jsx(AsyncFollowUpTask, {
      onClose: handleHideFollowUpTaskModal,
      disabled: disabled,
      rawEngagementData: rawEngagementData,
      saveFollowUpTaskData: handleSaveFollowUpTask
    }), /*#__PURE__*/_jsx(ButtonWrapper, {
      isQueueTask: isQueueTask,
      showLongButton: showLongButton,
      children: hasFollowupTasksCapability && /*#__PURE__*/_jsx(StyledUICheckbox, {
        isQueueTask: isQueueTask,
        showLongButton: showLongButton,
        className: "m-left-2",
        size: "small",
        checked: shouldCreateFollowUpTask,
        onChange: handleCreateTaskToggle,
        description: shouldCreateFollowUpTask && /*#__PURE__*/_jsx(UILink, {
          disabled: disabled,
          "data-selenium-test": "calling-widget-create-follow-up-task-button",
          onClick: handleShowFollowUpTaskModal,
          responsive: 'false',
          className: isQueueTask && showLongButton ? 'm-left-5' : 'm-left-1',
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "calling-communicator-ui.callingButtons.edit"
          })
        }),
        descriptionLayout: "horizontal",
        "data-selenium-test": "calling-widget-create-follow-up-task-checkmark",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "calling-communicator-ui.callingButtons.followUp"
        })
      })
    }, "task-checkmark-button")]
  });
};

FollowUpTaskCheckmark.displayName = 'FollowUpTaskCheckmark';
export default FollowUpTaskCheckmark;