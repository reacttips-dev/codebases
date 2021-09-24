'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { SHEPHERD_TOURS } from '../../lib/constants';
import { useSelector } from 'react-redux';
import { getManageDashboardStartTourModalStepsSeen } from '../../redux/selectors/users';
import { isAnySidePanelOpen } from '../../lib/utils';
import TourStep from '../tour/TourStep';

function ManageDashboardShepherdPopoverWrapper(_ref) {
  var children = _ref.children,
      stepId = _ref.stepId,
      _ref$forceHidden = _ref.forceHidden,
      forceHidden = _ref$forceHidden === void 0 ? false : _ref$forceHidden,
      _ref$attachTo = _ref.attachTo,
      attachTo = _ref$attachTo === void 0 ? null : _ref$attachTo,
      popoverPlacement = _ref.popoverPlacement;
  var manageDashboardStartTourModalStepsSeen = useSelector(getManageDashboardStartTourModalStepsSeen);
  var startModal = manageDashboardStartTourModalStepsSeen.startModal,
      tourSkipped = manageDashboardStartTourModalStepsSeen.tourSkipped;
  var startModalNotOpenedOrTourSkipped = !startModal || tourSkipped;
  var hidePopover = isAnySidePanelOpen() || startModalNotOpenedOrTourSkipped || forceHidden;
  return /*#__PURE__*/_jsx(TourStep, {
    attachTo: attachTo,
    forceHide: hidePopover,
    placement: popoverPlacement,
    stepKey: stepId,
    tourKey: SHEPHERD_TOURS.manageDashboard,
    children: children
  });
}

ManageDashboardShepherdPopoverWrapper.propTypes = {
  children: PropTypes.any,
  forceHidden: PropTypes.bool,
  stepId: PropTypes.string,
  popoverPlacement: PropTypes.string,
  attachTo: PropTypes.string
};
export default ManageDashboardShepherdPopoverWrapper;