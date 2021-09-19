import { useEffect, useReducer } from 'react';

import { isValidTestTreatment } from 'helpers/SymphonyHydraTestValidator.js';

const SYNC_NAV_TO_TREATMENT = 'SYNC_NAV_TO_TREATMENT';
const initialTestNavState = [];

function testNavReducer(state, action) {
  switch (action.type) {
    case SYNC_NAV_TO_TREATMENT:
      return [
        ...state,
        {
          treatment: action.payload.treatment
        }
      ];
    default:
      return state;
  }
}

export function useTestNavigation(topLevelNavs, isRecognized, triggerAssignment) {

  const [state, dispatch] = useReducer(testNavReducer, initialTestNavState);

  useEffect(() => {
    Array.isArray(topLevelNavs) && topLevelNavs.forEach(item => {

      const { testName, testTrigger, testTreatment } = item;

      const validTest = isValidTestTreatment({ testName, testTrigger, testTreatment, isRecognized });

      let dispatchTreatment = null;

      if (validTest) {
        const { index = 0 } = triggerAssignment(testName) || {};
        dispatchTreatment = testTreatment[index];
      }

      return dispatch({
        type: SYNC_NAV_TO_TREATMENT,
        payload: {
          treatment: dispatchTreatment
        }
      });
    });

  }, [isRecognized, topLevelNavs, triggerAssignment]);

  return state;
}
