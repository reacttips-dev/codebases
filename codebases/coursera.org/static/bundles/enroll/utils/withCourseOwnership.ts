import Naptime from 'bundles/naptimejs';
import { branch, compose, mapProps } from 'recompose';
import user from 'js/lib/user';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for this module.
import EnrollmentProductTypes from 'bundles/enroll-course/common/EnrollmentProductTypes';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for this module.
import ProductOwnershipsV2 from 'bundles/naptimejs/resources/productOwnerships.v2';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for this module.
import SubscriptionTrialsV1 from 'bundles/naptimejs/resources/subscriptionTrials.v1';
import { VERIFIED_CERTIFICATE } from 'bundles/payments/common/ProductType';

type InputProps = {
  courseId: string;
};

type PropsFromCourse = {
  course: CoursesV1;
};

type PropsFromCourseOwnership = PropsFromCourse & {
  courseOwnership: ProductOwnershipsV2;
};

type PropsFromSubscriptionTrials = {
  subscriptionTrials?: Array<SubscriptionTrialsV1>;
};

type PropsFromComputedProductOwnerships = PropsFromCourseOwnership & {
  ownsCourse: boolean;
};

type PropsFromComputedSubscriptionTrials = {
  isFreeTrial?: boolean;
};

export type PropsFromWithCourseOwnership = PropsFromCourseOwnership &
  PropsFromSubscriptionTrials &
  PropsFromComputedProductOwnerships &
  PropsFromComputedSubscriptionTrials;

export const isValidSubscriptionTrial = (subscriptionTrial: SubscriptionTrialsV1): boolean => {
  const now = Date.now();
  return subscriptionTrial.createdAt <= now && subscriptionTrial.endsAt >= now;
};

export const isCourseGrantedByFreeTrial = (
  courseId: string,
  courseSpecializationIds: Array<string>,
  subscriptionTrials: Array<SubscriptionTrialsV1>
): boolean => {
  return subscriptionTrials.some((subscriptionTrial) => {
    if (!isValidSubscriptionTrial(subscriptionTrial)) {
      // Sanity check. The subscription itself is invalid, e.g. it has expired.
      return false;
    }

    if (subscriptionTrial.productType === EnrollmentProductTypes.VerifiedCertificate) {
      // This is a course subscription. Check to see if it's this course.
      return subscriptionTrial.productItemId === courseId;
    } else if (subscriptionTrial.productType === EnrollmentProductTypes.Specialization) {
      // This is a specialization subscription. Check to see if it's one of the specializations
      // that includes this course.
      return courseSpecializationIds.includes(subscriptionTrial.productItemId);
    }

    return false;
  });
};

/**
 * This HOC provides ownership information for a single course. This includes:
 *
 *    1. `ownsCourse` - Whether or not the user owns the course.
 *    2. `isFreeTrial` - Whether or not that ownership is actually a free trial.
 *
 * `isFreeTrial` is only defined if `ownsCourse` is true.
 *
 * Usage:
 *
 *   export default compose<PropsToComponent, PropsFromCaller>(
 *     // Other HOCs...
 *
 *     // NOTE: At this point `courseId` MUST be in the passed props, either from the caller
 *     // or from another HOC prior in the chain.
 *     withCourseOwnership, // DO NOT "call" this HOC like `withCourseOwnership()`.
 *
 *     // Other HOCs...
 *   )(YourComponent);
 */
const withCourseOwnership = branch<InputProps>(
  () => user.isAuthenticatedUser(),

  compose<PropsFromWithCourseOwnership, InputProps>(
    // First figure out if the user owns the course, which they will if they have purchased the course or
    // a specialization including the course, or have a Coursera Plus subscription, or potentially
    // a number of other things. They will also "own" the course if they have a free trial to the course
    // or one of its specializations.
    Naptime.createContainer<PropsFromCourseOwnership, InputProps>(({ courseId }) => {
      return {
        course: CoursesV1.get(courseId, {
          // This lets us check subscription trials for specializations.
          fields: ['s12nIds'],
        }),

        courseOwnership: ProductOwnershipsV2.get(tupleToStringKey([user.get().id, VERIFIED_CERTIFICATE, courseId]), {
          fields: ['owns'],
        }),
      };
    }),

    mapProps<PropsFromComputedProductOwnerships, PropsFromCourse & PropsFromCourseOwnership>(
      ({ course, courseOwnership, ...propsFromCaller }) => {
        return {
          course,
          courseOwnership,
          ownsCourse: courseOwnership?.owns,
          ...propsFromCaller, // Needed to pass everything through
        };
      }
    ),

    // Next, if the user does own the course, figure out of that ownership is due to a free trial.
    Naptime.createContainer<PropsFromSubscriptionTrials, InputProps & PropsFromComputedProductOwnerships>(
      ({ ownsCourse }) => {
        return {
          subscriptionTrials: ownsCourse
            ? SubscriptionTrialsV1.finder('findByUser', {
                params: {
                  userId: user.get().id,
                },
                fields: ['createdAt', 'endsAt', 'productType', 'productItemId'],
              })
            : undefined,
        };
      }
    ),

    mapProps<
      PropsFromComputedSubscriptionTrials,
      InputProps & PropsFromComputedProductOwnerships & PropsFromSubscriptionTrials
    >(({ courseId, course, courseOwnership, ownsCourse, subscriptionTrials, ...propsFromCaller }) => {
      return {
        courseId,
        course,
        courseOwnership,
        ownsCourse,
        subscriptionTrials,
        isFreeTrial:
          subscriptionTrials && isCourseGrantedByFreeTrial(courseId, course.s12nIds || [], subscriptionTrials),
        ...propsFromCaller, // Needed to pass everything through
      };
    })
  )

  // Don't do anything if the user is not authenticated.
);

export default withCourseOwnership;
