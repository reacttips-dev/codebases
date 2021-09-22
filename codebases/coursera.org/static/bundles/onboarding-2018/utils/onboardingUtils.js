import Q from 'q';
import Uri from 'jsuri';

import redirect from 'js/lib/coursera.redirect';
import cookie from 'js/lib/cookie';
import API from 'js/lib/api';

import { encodeToUrlWithNumericKey } from 'bundles/onboarding-2018/utils/encodingUtils';
import { PROFILE_COMPLETER_FOR_EXISTING_USERS_COOKIE } from 'bundles/onboarding-2018/constants';

export const ALGOLIA_RECOMMENDATION_CARD_COUNT = 6;

export const redirectToProfileCompletionWithData = ({
  data,
  userId,
  userAgent,
  requestCountryCode,
  renderDefaultConfirmation,
}) => {
  const gotoCourseProps = Object.assign(data, { userAgent, requestCountryCode, renderDefaultConfirmation });
  const redirectData = encodeToUrlWithNumericKey(JSON.stringify([gotoCourseProps]), userId);
  const redirectURI = new Uri('/profile-completion');
  redirectURI.addQueryParam('redirectData', redirectData);
  redirect.setLocation(redirectURI.toString());
};

export const setProfileCompleterCookieForExistingUsers = () =>
  cookie.set(PROFILE_COMPLETER_FOR_EXISTING_USERS_COOKIE, 'yes-please', { minutes: 5 });

export function getProfileCompleterCookieForExistingUsers() {
  return cookie.get(PROFILE_COMPLETER_FOR_EXISTING_USERS_COOKIE);
}

export const getAndDeleteProfileCompleterCookieForExistingUsers = () => {
  const enrollmentCookie = cookie.get(PROFILE_COMPLETER_FOR_EXISTING_USERS_COOKIE);
  if (enrollmentCookie) cookie.remove(PROFILE_COMPLETER_FOR_EXISTING_USERS_COOKIE);
  return enrollmentCookie;
};

export const checkIfProfileCompleterForExistingUsersApplicable = () => {
  return !!getAndDeleteProfileCompleterCookieForExistingUsers();
};

export const createUserInterest = (data) => {
  const api = API('', { type: 'rest' });
  return Q(api.post('/api/userInterests.v1', { data }));
};

const getOccupationOrEmptyString = (profile) => {
  if (profile && profile.currentOccupation && profile.currentOccupation.definition) {
    const {
      currentOccupation: { definition },
    } = profile;
    return definition.id || definition.name;
  }

  return '';
};

// Used to extract the users occupation from either the hyphen-delininated ID,
// or user-entered name such that it is human-readable in anticipation of
// use as search terms in our algolia recommendations.
export const getReadableOccupationFromProfile = (profile) => {
  return getOccupationOrEmptyString(profile).replace(/-/g, ' ');
};

export const hasAddedInformationToOnboardingModal = (demographics) => {
  /*
    NOTE: Used specifically to help with the "Profile Completion for Existing Users"
          experiment. As such, we only care about specific parts of the onboarding
          modal: any boolean status is meaningless without it's conext, so we're ignoring
          those, along with a few other bits of not-present-on-the-modal demographic info.
          See below for the properties that are being ignored.

    employmentStatus, interestedCareers, isCurrentEmployer, isCurrentStudent,
    skillsPossessed, studentStatus
  */
  const { currentIndustry, currentOccupation, currentOccupationLevel, currentOrLatestSchool, employer } =
    demographics || {};
  const currentIndustryIsPopulated =
    currentIndustry?.definition && (!!currentIndustry.definition.name || !!currentIndustry.definition.id);
  const currentOccupationIsPopulated =
    currentOccupation?.definition && (!!currentOccupation.definition.name || !!currentOccupation.definition.id);
  const currentOccupationLevelIsNotDefault = currentOccupationLevel > 0;
  const schoolIsPopulated = currentOrLatestSchool && !!currentOrLatestSchool.name;
  const employerIsPopulated = !!employer;

  return (
    currentIndustryIsPopulated ||
    currentOccupationIsPopulated ||
    currentOccupationLevelIsNotDefault ||
    schoolIsPopulated ||
    employerIsPopulated
  );
};

export const shouldBranchForXdpLogic = ({ appName }) => appName && appName.includes('xdp');

export const shouldBranchForSdpOrCdpData = ({ isSpecialization }) => isSpecialization;
