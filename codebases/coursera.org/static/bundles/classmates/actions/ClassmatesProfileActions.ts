//
import Q from 'q';
import API from 'bundles/phoenix/lib/apiWrapper';
import URI from 'jsuri';
import store from 'js/lib/coursera.store';
import ClassmatesProfileStore from 'bundles/classmates/stores/ClassmatesProfileStore';

const LOCALSTORAGE_KEY = 'learner_count_';

const classmatesApi = API('/api/onDemandSessionMemberships.v1', {
  type: 'rest',
});
const socialProfileApi = API('/api/onDemandSocialProfiles.v1', {
  type: 'rest',
});

export const getClassmatesProfile = function (actionContext: $TSFixMe, { externalId, courseId }: $TSFixMe) {
  const profilesApi = API('/api/onDemandClassmateProfiles.v1', {
    type: 'rest',
  });
  const profilesUri = new URI()
    .addQueryParam('courseId', courseId)
    .addQueryParam('q', 'byExternalIds')
    .addQueryParam('externalUserIds', externalId)
    .addQueryParam('fields', 'socialProfiles.v1(photoUrl)')
    .addQueryParam('includes', 'userId,_links');
  return Q(profilesApi.get(profilesUri.toString()))
    .then((response) => {
      return actionContext.dispatch('LOAD_CLASSMATES_PROFILES', response);
    })
    .then((response) => actionContext.dispatch('PROFILE_REQUESTED', externalId))
    .done();
};

export const getStaffSocialProfiles = function (actionContext: $TSFixMe, { courseId }: $TSFixMe) {
  const uri = new URI().addQueryParam('q', 'listStaff').addQueryParam('courseId', courseId);
  return Q(socialProfileApi.get(uri.toString()))
    .then((response) => actionContext.dispatch('LOAD_STAFF_SOCIAL_PROFILES', response))
    .done();
};

export const getRandomClassmates = function (actionContext: $TSFixMe, { countryCode, courseId }: $TSFixMe) {
  const SessionStore = actionContext.getStore('SessionStore');
  const CourseStore = actionContext.getStore('CourseStore');

  if (actionContext.getStore(ClassmatesProfileStore).get10Profiles(countryCode).length > 7) {
    return; // don't fetch if already loaded
  }

  // https://api.coursera.org/api/onDemandSessionMemberships.v1?
  // q=randomBySession&sessionId=dF0Z8wouEeWyEyIAC7PmUA&limit=10&fromRecentCount=100
  let start = 0;
  const learnerCount = store.get(LOCALSTORAGE_KEY + CourseStore.getCourseId() + countryCode);
  if (learnerCount) {
    start = Math.floor(Math.random() * learnerCount);
    if (start > learnerCount - 10) {
      start -= 10; // don't want to request learners past the end
    }
  }

  const uri = new URI()
    .addQueryParam('courseId', CourseStore.getCourseId())
    .addQueryParam('q', 'randomBySession')
    .addQueryParam('sessionId', SessionStore.getSessionId())
    .addQueryParam('limit', 9)
    .addQueryParam('fromRecentCount', 100)
    .addQueryParam('includes', 'userId,_links');

  Q(classmatesApi.get(uri.toString()))
    .then((res) => {
      const idsArr = res.linked['userExternalIds.v1'].map((user: $TSFixMe) => {
        return user.externalUserId;
      });

      const ids = idsArr.toString();
      store.set(LOCALSTORAGE_KEY + CourseStore.getCourseId() + countryCode, res.paging.total);
      actionContext.dispatch('LOAD_LEARNER_COUNT', res.paging.total);
      return getClassmatesProfile(actionContext, {
        // @ts-ignore ts-migrate(2345) FIXME: Argument of type '{ ids: any; countryCode: any; co... Remove this comment to see the full error message
        ids,
        countryCode,
        courseId: CourseStore.getCourseId(),
      });
    })
    .done();
};
