'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import partial from 'transmute/partial';
import { canWrite } from 'SequencesUI/lib/permissions';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import * as SequenceStepDependencyTypes from 'SequencesUI/constants/SequenceStepDependencyTypes';
import EditSequenceTooltip from 'SequencesUI/components/edit/EditSequenceTooltip';

var ContinueWithoutCompletionToggle = function ContinueWithoutCompletionToggle(_ref) {
  var dependencies = _ref.dependencies,
      fromCreatePage = _ref.fromCreatePage,
      isLast = _ref.isLast,
      onToggleDependency = _ref.onToggleDependency,
      payload = _ref.payload;
  var reliesOnUniqueId = payload.get('uniqueId');
  var hasDependency = dependencies.has(reliesOnUniqueId);
  var checked = !(fromCreatePage || hasDependency);
  var disabled = !canWrite() || Boolean(fromCreatePage);
  return /*#__PURE__*/_jsx(EditSequenceTooltip, {
    children: /*#__PURE__*/_jsxs(UICheckbox, {
      checked: checked,
      disabled: disabled,
      onChange: partial(onToggleDependency, {
        reliesOnUniqueId: reliesOnUniqueId,
        dependencyType: SequenceStepDependencyTypes.TASK_COMPLETION
      }),
      size: "small",
      style: {
        whiteSpace: 'nowrap'
      },
      children: [/*#__PURE__*/_jsx(FormattedMessage, {
        message: isLast ? 'edit.taskNode.continueWithoutCompletion.lastStepLabel' : 'edit.taskNode.continueWithoutCompletion.label'
      }), /*#__PURE__*/_jsx(UIHelpIcon, {
        className: "m-left-1",
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: isLast ? 'edit.taskNode.continueWithoutCompletion.lastStepTooltip' : 'edit.taskNode.continueWithoutCompletion.tooltip'
        })
      })]
    })
  });
};

ContinueWithoutCompletionToggle.propTypes = {
  dependencies: PropTypes.instanceOf(ImmutableMap).isRequired,
  fromCreatePage: PropTypes.bool,
  isLast: PropTypes.bool,
  onToggleDependency: PropTypes.func.isRequired,
  payload: PropTypes.instanceOf(ImmutableMap).isRequired
};
export default ContinueWithoutCompletionToggle;