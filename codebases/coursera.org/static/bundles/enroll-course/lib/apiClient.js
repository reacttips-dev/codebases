import Q from 'q';
import Uri from 'jsuri';
import EnrollmentProductTypes from 'bundles/enroll-course/common/EnrollmentProductTypes';
import CourseRoles from 'bundles/common/constants/CourseRoles';
import API from 'bundles/phoenix/lib/apiWrapper';
import userIdentity from 'bundles/phoenix/template/models/userIdentity';
import Group from 'bundles/groups/models/Group';
import uniq from 'lodash/uniq';

import logger from 'js/app/loggerSingleton';
import memoize from 'js/lib/memoize';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';

/**
 * @param  {String} phoenixCourseId
 * @return {Promise} String. Null on error
 */
export const getCourseStatusPromise = memoize((phoenixCourseId) => {
  const coursesApi = API('/api/courses.v1', { type: 'rest' });
  return Q(coursesApi.get(phoenixCourseId + '?fields=courseStatus&showHidden=true'))
    .then((res) => res.elements[0].courseStatus)
    .fail((err) => {
      logger.error(`Unable to get course status for course ${phoenixCourseId}`);
      return null;
    });
});

/**
 * Enroll in a phoenix course using program
 * @param  {String} phoenixCourseId
 * @return {Promise} True on success, false on error
 */
export const getAvailablePrograms = (phoenixCourseId) => {
  const programEnrollmentAPI = API('/api/programEnrollments.v2/', {
    type: 'rest',
  });
  const thirdPartyOrgAPI = API('/api/thirdPartyOrganizations.v1/', {
    type: 'rest',
  });
  return Q().then(() => {
    if (!(userIdentity && userIdentity.get('authenticated'))) {
      return false;
    }
    const uri = new Uri()
      .addQueryParam('q', 'availableProgramsForUserAndCourseId')
      .addQueryParam('includes', 'enterprisePrograms')
      .addQueryParam('fields', 'enterprisePrograms.v1(metadata,thirdPartyOrganizationId)')
      .addQueryParam('userId', userIdentity.get('id'))
      .addQueryParam('courseId', phoenixCourseId);

    return Q(programEnrollmentAPI.get(uri.toString())).then((res) => {
      const program = res.linked['enterprisePrograms.v1'][0];
      const programs = res.linked['enterprisePrograms.v1'];
      const uri2 = new Uri()
        .addQueryParam('fields', 'name')
        .addQueryParam('ids', uniq(programs.map((program) => program.thirdPartyOrganizationId)).join(','));
      return Q(thirdPartyOrgAPI.get(uri2.toString())).then(({ elements }) => {
        const thirdPartyOrganization = elements.find((element) => element.id === program.thirdPartyOrganizationId);
        const thirdPartyOrganizations = elements;
        return { program, programs, thirdPartyOrganization, thirdPartyOrganizations };
      });
    });
  });
};

export const getAvailableInvitedPrograms = (phoenixCourseId) => {
  const programEnrollmentAPI = API('/api/programEnrollments.v2/', {
    type: 'rest',
  });
  const thirdPartyOrgAPI = API('/api/thirdPartyOrganizations.v1/', {
    type: 'rest',
  });
  return Q().then(() => {
    if (!(userIdentity && userIdentity.get('authenticated'))) {
      return false;
    }
    const uri = new Uri()
      .addQueryParam('q', 'availableInvitedProgramsForProduct')
      .addQueryParam('includes', 'enterprisePrograms')
      .addQueryParam('fields', 'enterprisePrograms.v1(metadata,thirdPartyOrganizationId)')
      .addQueryParam('userId', userIdentity.get('id'))
      .addQueryParam('productId', tupleToStringKey([EnrollmentProductTypes.VerifiedCertificate, phoenixCourseId]));

    return Q(programEnrollmentAPI.get(uri.toString())).then((res) => {
      const invitedPrograms = res.linked['enterprisePrograms.v1'];
      const uri2 = new Uri()
        .addQueryParam('fields', 'name')
        .addQueryParam('ids', uniq(invitedPrograms.map((program) => program.thirdPartyOrganizationId)).join(','));
      return Q(thirdPartyOrgAPI.get(uri2.toString())).then(({ elements }) => {
        const invitedThirdPartyOrganizations = elements;
        return { invitedPrograms, invitedThirdPartyOrganizations };
      });
    });
  });
};

/**
 * Available Groups to use in enrollment in a phoenix course for current user
 * @param  {String} phoenixCourseId
 * @return {Promise} Group info on success
 */
export const getAvailableGroups = (phoenixCourseId) => {
  const groupEnrollmentAPI = API('/api/groupEnrollments.v1/', { type: 'rest' });
  return Q().then(() => {
    if (!(userIdentity && userIdentity.get('authenticated'))) {
      return false;
    }
    const uri = new Uri()
      .addQueryParam('q', 'availableGroupsForUserAndCourseId')
      .addQueryParam('includes', 'groups')
      .addQueryParam('userId', userIdentity.get('id'))
      .addQueryParam('courseId', phoenixCourseId);

    return Q(groupEnrollmentAPI.get(uri.toString())).then((res) => {
      return new Group(res.linked['groups.v1'][0]);
    });
  });
};

/**
 * @param  {String} phoenixCourseId
 * @return {String} Value in CourseRoles. Null if no desired role found.
 */
export const getFreeEnrollCourseRolePromise = (phoenixCourseId) => {
  return Q().then(() => {
    if (!(userIdentity && userIdentity.get('authenticated'))) {
      return null;
    }

    return getCourseStatusPromise(phoenixCourseId).then((courseStatus) => {
      if (courseStatus === 'launched') {
        return CourseRoles.LEARNER;
      } else if (courseStatus === 'preenroll') {
        return CourseRoles.PRE_ENROLLED_LEARNER;
      } else {
        return null;
      }
    });
  });
};

/**
 * Enroll in a phoenix course using program
 * @param  {String} phoenixCourseId
 * @param  {String} programId
 * @return {Promise} True on success, false on error
 */
export const enrollInCourseWithProgram = (phoenixCourseId, programId) => {
  const programEnrollmentAPI = API('/api/programEnrollments.v2/', {
    type: 'rest',
  });
  return Q().then(() => {
    if (!(userIdentity && userIdentity.get('authenticated'))) {
      return false;
    }

    const uri = new Uri()
      .addQueryParam('action', 'enrollInCourse')
      .addQueryParam('programId', programId)
      .addQueryParam('userId', userIdentity.get('id'))
      .addQueryParam('courseId', phoenixCourseId);

    return Q(programEnrollmentAPI.post(uri.toString())).then((res) => !!res);
  });
};

/**
 * Enroll in a phoenix course using group
 * @param  {String} phoenixCourseId
 * @param  {String} groupId
 * @return {Promise} True on success, false on error
 */
export const enrollInCourseWithGroup = (phoenixCourseId, groupId) => {
  const groupEnrollmentAPI = API('/api/groupEnrollments.v1/', { type: 'rest' });
  return Q().then(() => {
    if (!(userIdentity && userIdentity.get('authenticated'))) {
      return false;
    }

    const uri = new Uri()
      .addQueryParam('action', 'enrollInCourse')
      .addQueryParam('groupId', groupId)
      .addQueryParam('userId', userIdentity.get('id'))
      .addQueryParam('courseId', phoenixCourseId);

    return Q(groupEnrollmentAPI.post(uri.toString())).then((res) => !!res);
  });
};

/**
 * Enroll in a phoenix course for free
 * @param  {String} phoenixCourseId
 * @return {Promise} True on success, false on error
 */
export const enrollInCourseForFreePromise = (phoenixCourseId, _courseRole) => {
  const openCourseMembershipsApi = API('/api/openCourseMemberships.v1', {
    type: 'rest',
  });
  return Q().then(() => {
    if (!(userIdentity && userIdentity.get('authenticated'))) {
      return false;
    }

    return Q()
      .then(() => {
        return _courseRole || getFreeEnrollCourseRolePromise(phoenixCourseId);
      })
      .then((courseRole) => {
        if (!courseRole) {
          return false;
        }

        const postData = {
          userId: userIdentity.get('id'),
          courseId: phoenixCourseId,
          courseRole,
        };

        return Q(openCourseMembershipsApi.post('', { data: postData })).then((res) => !!res);
      });
  });
};
