'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useState, useEffect } from 'react';
import Raven from 'Raven';
import { getCrmExperience } from 'growth-onboarding-shared-api/api/userAttributesApi';
import { isPaidHub } from 'growth-onboarding-shared-api/api/customerInventory';
import { getSignupType } from 'growth-onboarding-shared-api/api/portalSettingApi';
/**
 *
 * @param {Object} onboardingValues - Onboarding values to be checked agaisnt the portal onboarding values
 * @param {string} onboardingValues.crmExperience - CRM experience from the signup survey. Not required
 * @param {string|string[]} onboardingValues.signupType - Origin of signup. Not required
 * @param {boolean} onboardingValues.paidHub - If the hub is paid or not. Not required
 * @returns {boolean}
 */

export var useAreOnboardingConditionsMet = function useAreOnboardingConditionsMet(_ref) {
  var crmExperience = _ref.crmExperience,
      signupType = _ref.signupType,
      paidHub = _ref.paidHub;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      areOnboardingConditionsMet = _useState2[0],
      setAreOnboardingConditionsMet = _useState2[1];

  useEffect(function () {
    Promise.all([getCrmExperience(), getSignupType(), isPaidHub()]).then(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 3),
          storedCrmExperience = _ref3[0],
          storedSignupType = _ref3[1],
          storedPaidHub = _ref3[2];

      // signupType needs to be either an array, a valid string or undefined
      if (Array.isArray(signupType) || typeof signupType === 'string' || signupType === undefined) {
        var matchesCrmExperience = crmExperience === undefined || storedCrmExperience === crmExperience;
        var matchesSignupType = signupType === undefined || (typeof signupType === 'string' ? signupType === storedSignupType : signupType.includes(storedSignupType));
        var matchesPaidHub = paidHub === undefined || paidHub === storedPaidHub;
        setAreOnboardingConditionsMet(matchesCrmExperience && matchesSignupType && matchesPaidHub);
      }
    }).catch(function (error) {
      Raven.captureException(error, {
        tags: {
          onboardingConditionsMet: error
        }
      });
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return areOnboardingConditionsMet;
};