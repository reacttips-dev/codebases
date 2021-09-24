'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import UIFloatingAlertList from 'UIComponents/alert/UIFloatingAlertList';
import OnboardingTour from 'onboarding-tours/components/OnboardingTour';
import { useQueryParams } from '../router/useQueryParams';
import { getFrom } from 'crm_data/settings/LocalSettings';
export function IndexPageAlerts() {
  var query = useQueryParams();
  var onboardingTour = useMemo(function () {
    var isOnboardingTourActive = query.tourId || query.onboardingTourId;
    var hasSessionStorageNextTour = !!getFrom(sessionStorage, 'ONBOARDING_NEXT_TOUR', '');

    if (isOnboardingTourActive || !!hasSessionStorageNextTour) {
      return /*#__PURE__*/_jsx(OnboardingTour, {});
    }

    return null;
  }, [query.tourId, query.onboardingTourId]);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(UIFloatingAlertList, {}), onboardingTour]
  });
}
export default IndexPageAlerts;