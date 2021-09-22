import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { storeKey } from 'bundles/ondemand/utils/onDemandTutorialViewsApi';

const SessionsV2EnrollmentEligibilityCheckResource = API('/api/sessionsV2EnrollmentEligibilityCheck.v1', {
  type: 'rest',
});

// This method is in place to handle which users enter the sessionsV2 experience.
// Epic is handled via the blacklist API

/* eslint-disable import/prefer-default-export */
export const checkSessionsV2Epic = (courseId: string) => {
  const uri = new URI(courseId).addQueryParam('fields', 'eligibleForSessionsV2');
  return Q(SessionsV2EnrollmentEligibilityCheckResource.get(uri.toString())).then((response) => {
    const isInExperiment = response && response.elements && response.elements[0].eligibleForSessionsV2;

    if (isInExperiment) {
      const key = `sessionsV2Experiment.${courseId}`;
      return storeKey(key);
    }

    return Q();
  });
};
