import Uri from 'jsuri';
import Q from 'q';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import AuxiliaryInfo from 'bundles/payments/models/cart/auxiliaryInfo';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import CourseEnrollInfoItem from 'bundles/payments/models/cart/courseEnrollInfoItem';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import createS12nCartPromise from 'bundles/payments/promises/createSpecializationCart';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import createVCCartPromise from 'bundles/payments/promises/createVCCart';
import { redirectToCheckout } from 'bundles/payments-common/utils/redirectToCheckout';
import API from 'bundles/phoenix/lib/apiWrapper';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import userIdentity from 'bundles/phoenix/template/models/userIdentity';
import logger from 'js/app/loggerSingleton';
import user from 'js/lib/user';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import courseMembershipPromise from 'pages/open-course/common/promises/membership';

const programEnrollmentAPI = API('/api/programEnrollments.v2/', {
  type: 'rest',
});
const groupEnrollmentAPI = API('/api/groupEnrollments.v1/', { type: 'rest' });

/**
 * Enroll as free learner. If a role is passed in, use that (pre-enroll, etc.)
 *   Refer to bundles/common/constants/CourseRoles for possible course roles.
 *
 * @param  {role} role - Role of the learner
 * @param  {string} courseId - Course to create cc cart for.
 * @returns {undefined|Promise.<Cart>} bundles/payments/models/cart - though this isn't used
 *    since we immediately redirect.
 */
export const freeEnroll = (role: $TSFixMe, courseId: $TSFixMe) => {
  return function () {
    return courseMembershipPromise(user.get().id, courseId).invoke('enroll', role);
  };
};

/**
 * Create a cc cart and redirect to the checkout page for that cart.
 *
 * @param  {string} courseId - Id of course to create CC cart for.
 * @returns {undefined|Promise.<Cart>} bundles/payments/models/cart - though this isn't used
 *    since we immediately redirect.
 */
export const singleEnroll = (courseId: $TSFixMe) => {
  return function () {
    const promise = createVCCartPromise(courseId).then(redirectToCheckout);
    promise.done();
    return promise;
  };
};

/**
 * Enroll in a phoenix course using program
 * @param  {String} phoenixCourseId
 * @param  {String} programId
 * @return {Promise} True on success, false on error
 */
export const programEnroll = (s12nId: $TSFixMe, programId: $TSFixMe) => {
  return () => {
    const uri = new Uri()
      .addQueryParam('action', 'enrollInS12n')
      .addQueryParam('programId', programId)
      .addQueryParam('userId', user.get().id)
      .addQueryParam('s12nId', s12nId);

    return Q(programEnrollmentAPI.post(uri.toString()))
      .then((res) => !!res)
      .fail((err) => {
        logger.error(`Unable to enroll in program ${programId}: ${err.message}`);
        return false;
      });
  };
};

/**
 * Enroll using group
 * @param  {String} s12nId
 * @param  {String} groupId
 * @return {Promise} True on success, false on error
 */
export const groupEnroll = (s12nId: $TSFixMe, groupId: $TSFixMe) => {
  return () => {
    const uri = new Uri()
      .addQueryParam('action', 'enrollInS12n')
      .addQueryParam('groupId', groupId)
      .addQueryParam('userId', user.get().id)
      .addQueryParam('s12nId', s12nId);

    return Q(groupEnrollmentAPI.post(uri.toString()))
      .then((res) => !!res)
      .fail((err) => {
        logger.error(`Unable to enroll in group ${groupId}: ${err.message}`);
        return false;
      });
  };
};

/**
 * Create a bulk pay cart and redirect to the checkout page for that cart.
 *
 * @param  {string} s12nId - Specialization to enroll in
 * @param  {string} continueCourseId - Course to ask the user to continue to on payment confirmation.
 * @returns {undefined|Promise.<Cart>} bundles/payments/models/cart - though this isn't used
 *    since we immediately redirect.
 */
export const fullEnroll = (s12nId: $TSFixMe, continueCourseId: $TSFixMe) => {
  return function () {
    const options = {};
    if (continueCourseId) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'auxiliaryCartInfo' does not exist on typ... Remove this comment to see the full error message
      options.auxiliaryCartInfo = new AuxiliaryInfo([
        new CourseEnrollInfoItem({
          definition: { courseId: continueCourseId },
        }),
      ]).toJSON();
    }

    const promise = createS12nCartPromise(s12nId, options).then(redirectToCheckout);

    promise.done();
    return promise;
  };
};
