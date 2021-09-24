'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
import MultiTourHandlerSingleton from 'ui-shepherd-react/lib/MultiTourHandlerSingleton';
import UITour from 'ui-shepherd-react/tour/UITour';
import TourContext from 'ui-shepherd-react/contexts/TourContext';
import { SHEPHERD_TOURS, SHEPHERD_TOURS_STEPS } from '../../lib/constants';

var getTourNames = function getTourNames() {
  var names = []; // eslint-disable-next-line guard-for-in

  for (var tourName in SHEPHERD_TOURS) {
    names.push(tourName);
  }

  return names;
};

export var SingleTourStepContext = /*#__PURE__*/createContext({
  isSingleStep: false,
  setIsSingleStep: null
});

var getTourHandler = function getTourHandler() {
  var tourHandler = MultiTourHandlerSingleton.getInstance();

  for (var tourKey in SHEPHERD_TOURS) {
    if (SHEPHERD_TOURS_STEPS[tourKey]) {
      var tourSteps = SHEPHERD_TOURS_STEPS[tourKey].toArray();
      tourHandler.registerTour(tourKey, {
        steps: tourSteps
      });
    }
  }

  return tourHandler;
};

export var useTourContext = function useTourContext() {
  return useContext(TourContext);
};
export var useSingleStepContext = function useSingleStepContext() {
  return useContext(SingleTourStepContext);
};
export default function TourContextWrapper(_ref) {
  var children = _ref.children;
  var tours = getTourNames();
  var tourhandler = getTourHandler();

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isSingleStep = _useState2[0],
      setIsSingleStep = _useState2[1];

  return /*#__PURE__*/_jsx(SingleTourStepContext.Provider, {
    value: {
      isSingleStep: isSingleStep,
      setIsSingleStep: setIsSingleStep
    },
    children: /*#__PURE__*/_jsx(UITour, {
      activateOnMount: false,
      tours: tours,
      multiTourHandler: tourhandler,
      children: children
    })
  });
}