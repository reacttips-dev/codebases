import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import UITourFinishButton from 'ui-shepherd-react/button/UITourFinishButton';
import { openTaskCompletionModal } from '../util/banner';

var OnboardingTourFinishButton = function OnboardingTourFinishButton(props) {
  var _beforeFinish = props.beforeFinish,
      taskKey = props.taskKey,
      buttonProps = _objectWithoutProperties(props, ["beforeFinish", "taskKey"]);

  return /*#__PURE__*/_jsx(UITourFinishButton, Object.assign({
    beforeFinish: function beforeFinish(_ref) {
      var tourKey = _ref.tourKey,
          stepKey = _ref.stepKey;

      if (taskKey) {
        openTaskCompletionModal(taskKey);
      }

      if (typeof _beforeFinish === 'function') {
        return _beforeFinish(tourKey, stepKey);
      }

      return undefined;
    }
  }, buttonProps));
};

export default OnboardingTourFinishButton;