import Q from 'q';
import Uri from 'jsuri';
import API from 'bundles/phoenix/lib/apiWrapper';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import userIdentity from 'bundles/phoenix/template/models/userIdentity';

const groupEnrollmentAPI = API('/api/groupEnrollments.v1/', { type: 'rest' });

/**
 * Enroll in a phoenix course using program
 * @param  {String} phoenixCourseId
 * @return {Promise} Group on success
 */
/* eslint-disable import/prefer-default-export */
export const getAvailableGroups = (s12nId: $TSFixMe) => {
  return Q().then(() => {
    const uri = new Uri()
      .addQueryParam('q', 'availableGroupsForUserAndS12nId')
      .addQueryParam('includes', 'groups')
      .addQueryParam('userId', userIdentity.get('id'))
      .addQueryParam('s12nId', s12nId);

    return Q(groupEnrollmentAPI.get(uri.toString())).then((res) => res.linked['groups.v1']);
  });
};
