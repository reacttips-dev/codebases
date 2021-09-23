'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import UIFlex from 'UIComponents/layout/UIFlex';
import TopBarAddButton from '../../crm_ui/topbar/TopBarAddButton';
import LegacyActionsDropdown from './LegacyActionsDropdown';
import { withAlertErrorBoundary } from '../../errorBoundary/withAlertErrorBoundary';
import PropTypes from 'prop-types';
import PageType from 'customer-data-objects-ui-components/propTypes/PageType';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import ActionsDropdown from './ActionsDropdown';
import { PrimaryActionButton, SecondaryActionButton } from '../../extensions/constants/BehaviorTypes';
import BehaviorRenderer from '../../extensions/components/BehaviorRenderer';
import { useBehavior } from '../../extensions/hooks/useBehavior';
import { CONTACT, COMPANY } from 'customer-data-objects/constants/ObjectTypes';
export var HeaderActions = function HeaderActions(_ref) {
  var addButtonDisabled = _ref.addButtonDisabled,
      objectType = _ref.objectType,
      viewId = _ref.viewId,
      pageType = _ref.pageType,
      pipelineId = _ref.pipelineId,
      isCrmObject = _ref.isCrmObject,
      onOpenObjectBuilderPanel = _ref.onOpenObjectBuilderPanel,
      onLegacyCreateSuccess = _ref.onLegacyCreateSuccess;
  var PrimaryButton = useBehavior(PrimaryActionButton);
  var SecondaryButton = useBehavior(SecondaryActionButton);
  var shouldUseActionsBehavior = isCrmObject || [CONTACT, COMPANY].includes(objectType);
  return /*#__PURE__*/_jsxs(UIFlex, {
    justify: "end",
    children: [shouldUseActionsBehavior ? /*#__PURE__*/_jsx(ActionsDropdown, {}) : /*#__PURE__*/_jsx(LegacyActionsDropdown, {
      isBoard: false,
      objectType: objectType,
      viewId: viewId,
      pageType: pageType,
      isCrmObject: isCrmObject
    }), /*#__PURE__*/_jsx(BehaviorRenderer, {
      Component: SecondaryButton
    }), isCrmObject ? /*#__PURE__*/_jsx(BehaviorRenderer, {
      Component: PrimaryButton,
      onCreateObject: onOpenObjectBuilderPanel
    }) : /*#__PURE__*/_jsx(TopBarAddButton, {
      disabled: addButtonDisabled,
      objectType: objectType,
      viewId: viewId,
      pipelineId: pipelineId,
      onCreateSuccess: onLegacyCreateSuccess
    })]
  });
};
HeaderActions.propTypes = {
  addButtonDisabled: PropTypes.bool,
  isCrmObject: PropTypes.bool.isRequired,
  objectType: AnyCrmObjectTypePropType.isRequired,
  onOpenObjectBuilderPanel: PropTypes.func.isRequired,
  pageType: PageType.isRequired,
  pipelineId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  viewId: PropTypes.string.isRequired,
  onLegacyCreateSuccess: PropTypes.func
};
export default withAlertErrorBoundary(HeaderActions);