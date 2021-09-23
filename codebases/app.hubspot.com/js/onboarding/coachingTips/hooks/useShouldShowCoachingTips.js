'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAreOnboardingConditionsMet } from 'growth-onboarding-shared-components/hooks/onboardingConditions';
import { NO_CRM_EXPERIENCE } from 'growth-onboarding-shared-components/constants/surveyConstants';
import { subscribeToTourCompletion } from 'onboarding-tours/util/tourEvents';
import { TOUR_ID, ONBOARDING_TOUR_ID } from 'onboarding-tours/constants/URL';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import withGateOverride from 'crm_data/gates/withGateOverride';
import * as LocalSettings from 'crm_data/settings/LocalSettings';
import { useIsMounted } from '../../../crm_ui/hooks/useIsMounted';
import { delayUntilIdle } from '../../../crm_ui/utils/delayUntilIdle';
import { useQueryParams } from '../../../router/useQueryParams';
var CONTACTS_COACHING_TIPS_GATE = 'CRM:crm-index-ui:coaching-tips';

var useTourHasEnded = function useTourHasEnded() {
  var _useHistory = useHistory(),
      replace = _useHistory.replace;

  var params = useQueryParams();
  useEffect(function () {
    return (// `subscribeToTourCompletion` returns a function that clears the event listener
      subscribeToTourCompletion(function () {
        delete params[TOUR_ID];
        delete params[ONBOARDING_TOUR_ID];
        replace(params);
      }, [params, replace])
    );
  });
};

export var useShouldShowCoachingTips = function useShouldShowCoachingTips(objectType) {
  // Listen to the event tour completion and remove the onboarding tour query param
  useTourHasEnded(); //  Next 2 lines were added into the hook so this can work in both legacy and rewrite IndexPage

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isIdle = _useState2[0],
      setIsIdle = _useState2[1];

  var _useQueryParams = useQueryParams(),
      onboardingTourId = _useQueryParams.onboardingTourId,
      tourId = _useQueryParams.tourId,
      showCoachingTips = _useQueryParams.showCoachingTips; // True if the parameter or sessionstorage key exists.
  // We are not concerned with the value of the parameter itself


  var tourInSessionStorage = LocalSettings.getFrom(sessionStorage, 'ONBOARDING_NEXT_TOUR', false);
  var isTour = !!tourId || !!onboardingTourId || !!tourInSessionStorage;
  var isMounted = useIsMounted();
  var areOnboardingConditionsMet = useAreOnboardingConditionsMet({
    crmExperience: NO_CRM_EXPERIENCE,
    paidHub: false
  });
  var isContactIndexPage = objectType === CONTACT;
  var isUngatedForCoachingTips = withGateOverride(CONTACTS_COACHING_TIPS_GATE, IsUngatedStore.get(CONTACTS_COACHING_TIPS_GATE));
  useEffect(function () {
    delayUntilIdle(function () {
      if (isMounted.current) {
        setIsIdle(true);
      }
    });
  }); // Basically if user is on the CONTACT page
  // and the query param `showCoachingTips` is present
  // it will render coaching tips regardless of no other condition being met

  return isContactIndexPage && (isUngatedForCoachingTips && !isTour && isIdle && areOnboardingConditionsMet || !!showCoachingTips);
};