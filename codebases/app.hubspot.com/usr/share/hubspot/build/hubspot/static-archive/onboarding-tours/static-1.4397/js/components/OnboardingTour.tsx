import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { memo, useState, useEffect } from 'react';
import UITour from 'ui-shepherd-react/tour/UITour';
import MultiTourHandler from 'ui-shepherd-react/lib/MultiTourHandler';
import OnboardingTourSteps from './OnboardingTourSteps';
import getTour from '../util/getTour';
import { buildTourConfig } from '../util/tourConfig';
import { getTourIdFromQueryParams, getQueryParam } from '../util/queryParams';
import { getNextTourFromStorage } from '../util/tourStorage';
import { transformTour } from '../util/tourTransformer';
import { getStorageItem, setStorageItem } from '../util/storageUtil';
import { parseReturnUrl } from '../util/urlUtils';
import SentryManager from '../manager/SentryManager';
var SELENIUM_DISABLE_ONBOARDING_TOURS_KEY = 'selenium.disable.onboarding_tours';

var shouldDisableOnboardingTour = function shouldDisableOnboardingTour() {
  return (// TODO: add link to selenium doc
    // Use the convention selenium.disable.<feature>.
    // selenium.disable.onboarding_tours = 'true' should prevent the tour from loading.
    getStorageItem(SELENIUM_DISABLE_ONBOARDING_TOURS_KEY) === 'true'
  );
};

var SELENIUM_ONBOARDING_TOUR_FLAG = 'selenium_onboarding_tour_enabled';
var SELENIUM_ONBOARDING_TOUR_CONFIG = 'selenium_onboarding_tour_config';

var setOnboardingTourConfigForSelenium = function setOnboardingTourConfigForSelenium(tourData) {
  if (getStorageItem(SELENIUM_ONBOARDING_TOUR_FLAG) === 'true') {
    setStorageItem(SELENIUM_ONBOARDING_TOUR_CONFIG, JSON.stringify(tourData));
  }
};

var multiTourHandler = new MultiTourHandler();

function OnboardingTour(props) {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      activeTourId = _useState2[0],
      setActiveTourId = _useState2[1];

  var _useState3 = useState({
    tourData: null,
    tourConfig: null
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      tourState = _useState4[0],
      setTourState = _useState4[1];

  useEffect(function () {
    if (shouldDisableOnboardingTour()) {
      return;
    }

    var tourId = props.tourId || getTourIdFromQueryParams();
    var prevTourId;
    var prevTourLength = 0;
    var linkedToursTotalStepCountFromStorage;
    var returnUrl = parseReturnUrl(getQueryParam('returnUrl'));

    if (!tourId) {
      // Tours from storage are set through the nextTourAlias tour config property.
      var tourDataFromStorage = getNextTourFromStorage();
      tourId = tourDataFromStorage.tourId;
      prevTourId = tourDataFromStorage.prevTourId;
      prevTourLength = tourDataFromStorage.prevTourLength || 0;
      linkedToursTotalStepCountFromStorage = tourDataFromStorage.linkedToursTotalStepCount;
      returnUrl = tourDataFromStorage.returnUrl;
    }

    if (!tourId) {
      return;
    }

    setActiveTourId(tourId);
    getTour(tourId).then(function (tourData) {
      tourData.steps = transformTour(tourData.steps);
      tourData.prevTourLength = prevTourLength;
      tourData.linkedToursTotalStepCount = tourData.linkedToursTotalStepCount || linkedToursTotalStepCountFromStorage;
      tourData.returnUrl = returnUrl;
      var newTourConfig = buildTourConfig(tourId, tourData, prevTourId);
      setTourState({
        tourConfig: newTourConfig,
        tourData: tourData
      });
      setOnboardingTourConfigForSelenium(tourData);
    }, function (error) {
      SentryManager.reportLoadTourError(error, tourId);
    });
  }, [props.tourId]);
  var tourConfig = tourState.tourConfig,
      tourData = tourState.tourData;

  if (!tourData || !tourConfig || !activeTourId) {
    return null;
  }

  return /*#__PURE__*/_jsx(UITour, {
    className: "onboarding-tour-container",
    config: tourConfig,
    multiTourHandler: multiTourHandler,
    tour: activeTourId,
    children: /*#__PURE__*/_jsx(OnboardingTourSteps, {
      tourData: tourData,
      tourId: activeTourId
    })
  });
}

OnboardingTour.propTypes = {
  tourId: PropTypes.string
};
export default /*#__PURE__*/memo(OnboardingTour);
export var WEBPACK_3_FORCE_MODULE_IMPORT = 1;