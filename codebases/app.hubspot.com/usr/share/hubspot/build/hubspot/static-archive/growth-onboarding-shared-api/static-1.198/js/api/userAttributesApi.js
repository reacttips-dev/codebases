'use es6';

import http from 'hub-http/clients/apiClient';
export function getUserDemographics() {
  return http.get('users/v1/app/attributes?key=customer%3Ademographics').then(function (_ref) {
    var attributes = _ref.attributes;
    var demographics = {};

    if (!attributes || !attributes[0] || !attributes[0].value) {
      return null;
    }

    try {
      demographics = JSON.parse(attributes[0].value);
    } catch (error) {
      return null;
    }

    return demographics || {};
  });
}
export var getCrmExperience = function getCrmExperience() {
  return getUserDemographics().then(function (demographics) {
    var _ref2 = demographics || {},
        crm_experience = _ref2.crm_experience;

    return crm_experience;
  });
};