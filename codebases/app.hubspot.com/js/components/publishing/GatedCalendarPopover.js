'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SHEPHERD_TOURS } from '../../lib/constants';
import { getIsUngatedForManageBeta } from '../../redux/selectors/gates';
import ManageDashboardShepherdPopoverWrapper from '../onboarding/ManageDashboardShepherdPopoverWrapper';
import TourStep from '../tour/TourStep';
import { useTourActions } from '../tour/useTourActions';
export default function GatedCalendarPopover(_ref) {
  var children = _ref.children,
      shouldHidePublishingTableTourShepherd = _ref.shouldHidePublishingTableTourShepherd;
  var isUngatedForManageBeta = useSelector(getIsUngatedForManageBeta);

  var _useTourActions = useTourActions(),
      startTour = _useTourActions.startTour;

  useEffect(function () {
    if (isUngatedForManageBeta || shouldHidePublishingTableTourShepherd) return;
    startTour(SHEPHERD_TOURS.publishingTable);
  }, [isUngatedForManageBeta, startTour, shouldHidePublishingTableTourShepherd]);

  if (isUngatedForManageBeta) {
    return /*#__PURE__*/_jsx(ManageDashboardShepherdPopoverWrapper, {
      popoverPlacement: "bottom right",
      stepId: "calendarView",
      children: children
    });
  }

  return /*#__PURE__*/_jsx(TourStep, {
    stepKey: 'stepCalendar',
    tourKey: SHEPHERD_TOURS.publishingTable,
    placement: 'bottom right',
    children: children
  });
}