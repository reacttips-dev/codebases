'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { getBuilderProps } from 'sales-modal/utils/stepEditorBuilderCardUtils';
import { stepHasEmailTemplateId } from 'sales-modal/utils/enrollModal/stepsWithEmailTemplates';
import UIBuilderCard from 'UIComponents/card/UIBuilderCard';
import UIIcon from 'UIComponents/icon/UIIcon';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
export default function SequenceStepCard(_ref) {
  var children = _ref.children,
      isReadyToLoad = _ref.isReadyToLoad,
      step = _ref.step;

  var _getBuilderProps = getBuilderProps({
    stepIndex: step.get('stepOrder'),
    stepType: step.get('action'),
    taskType: step.getIn(['actionMeta', 'taskMeta', 'taskType'])
  }),
      title = _getBuilderProps.title,
      titleIcon = _getBuilderProps.titleIcon,
      titleUse = _getBuilderProps.titleUse;

  return /*#__PURE__*/_jsx(UIBuilderCard, {
    "data-selenium-test": "sequence-step-card",
    title: title,
    titleIcon: /*#__PURE__*/_jsx(UIIcon, {
      name: titleIcon,
      size: "xxs"
    }),
    titleUse: titleUse,
    clickable: false,
    hovered: false,
    children: /*#__PURE__*/_jsx("div", {
      className: "step-editor",
      children: isReadyToLoad ? children : /*#__PURE__*/_jsx(UILoadingSpinner, {
        grow: true,
        minHeight: stepHasEmailTemplateId(step) ? 350 : 100
      })
    })
  });
}