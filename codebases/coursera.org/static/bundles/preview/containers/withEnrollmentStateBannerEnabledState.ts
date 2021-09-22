import Naptime from 'bundles/naptimejs';
import type { InferableComponentEnhancerWithProps } from 'recompose';
import { branch, compose, withProps } from 'recompose';
import user from 'js/lib/user';
import connectToRouter from 'js/lib/connectToRouter';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import PrivilegedAuths from 'bundles/naptimejs/resources/privilegedAuths.v1';
import { withOptionalCourseFeaturePermissions } from 'bundles/teach-course/utils/withFeaturePermissions';
import getNavigationFeatures, {
  canViewViewAsLearnerBannerForLearn,
  canViewGroupSwitcherInViewAsLearnerForLearn,
} from 'bundles/authoring/navigation/utils/navigationFeaturePermissions';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import type { FeaturePermissions } from 'bundles/teach-course/utils/types';

type WithRouterProps = {
  courseSlug: string;
};

type WithCourseProps = WithRouterProps & {
  course: CoursesV1 | undefined;
  isOutsourcingAgent: boolean;
};

type WithFeaturePermissions = WithCourseProps & {
  featurePermissions: FeaturePermissions;
};

export type WithEnrollmentBannerProps = {
  isEnrollmentStateBannerEnabled: boolean;
  userCanSwitchGroups: boolean;
  userCanViewTeach: boolean;
};

/**
 * A simple helper HOC that attaches a prop indicating the enrollment
 * state banner is disabled. Useful for branching logic where we frequently
 * want to back out into the disabled state.
 */
const withNotEnabledBanner = withProps<WithEnrollmentBannerProps, {}>(() => {
  return {
    isEnrollmentStateBannerEnabled: false,
    userCanSwitchGroups: false,
    userCanViewTeach: false,
  };
});

/**
 * An HOC which takes a `courseSlug` as input and determines whether
 * the user in the app context is authorized to see the enrollment banner.
 * The HOC results in a prop `isEnrollmentStateBannerEnabled` being injected
 * into the wrapped component.
 */
const withBannerStateByCourse = compose<WithEnrollmentBannerProps, WithRouterProps>(
  Naptime.createContainer<WithCourseProps, WithRouterProps>(({ courseSlug }) => ({
    course: CoursesV1.bySlug(courseSlug, {
      fields: ['slug'],
    }),
    isOutsourcingAgent: PrivilegedAuths.getIsOutsourcingAgent(user),
  })),
  // NOTE: recompose branch typings are really bad; it throws away branch HOC types
  // it also requires a typecast from an HOC with non-empty type parameters
  branch<WithCourseProps>(
    ({ course }) => !course,
    withNotEnabledBanner as InferableComponentEnhancerWithProps<{}, {}>,
    compose(
      withOptionalCourseFeaturePermissions(({ course }) => ({
        featurePermissions: {
          courseId: course.id,
          features: getNavigationFeatures(course.id),
        },
      })),
      // NOTE: recompose branch typings are really bad; it throws away branch HOC types
      // it also requires a typecast from an HOC with non-empty type parameters
      branch<WithFeaturePermissions>(
        ({ featurePermissions }) => !featurePermissions,
        withNotEnabledBanner as InferableComponentEnhancerWithProps<{}, {}>,
        withProps<WithEnrollmentBannerProps, WithFeaturePermissions>(({ isOutsourcingAgent, featurePermissions }) => {
          const userCanViewTeach = featurePermissions.authoringCourse.read;
          const canAccessViewAsLearnerBanner =
            isOutsourcingAgent || canViewViewAsLearnerBannerForLearn(featurePermissions);
          const canSwitchGroupsInViewAsLearner =
            !isOutsourcingAgent && canViewGroupSwitcherInViewAsLearnerForLearn(featurePermissions);

          return {
            isEnrollmentStateBannerEnabled: user.isAuthenticatedUser() && canAccessViewAsLearnerBanner,
            userCanSwitchGroups: canSwitchGroupsInViewAsLearner,
            userCanViewTeach,
          };
        }) as InferableComponentEnhancerWithProps<{}, {}>
      )
    )
  )
);

/**
 * Encapsulates the logic of checking whether the View as Learner feature is enabled.
 * This will give your component a boolean prop `isEnrollmentStateBannerEnabled`.
 *
 * This does NOT tell you whether the banner should be shown. Use
 * withShowEnrollmentStateBanner for that instead.
 *
 * Usage:
 *    const MyComponent = ({ isEnrollmentStateBannerEnabled }) => {
 *      ...
 *    };
 *
 *    _.compose(
 *      withEnrollmentStateBannerEnabledState()
 *    )(MyComponent);
 */
const withEnrollmentStateBannerEnabledState = () =>
  compose<WithEnrollmentBannerProps, {}>(
    connectToRouter(({ params }) => {
      return {
        courseSlug: params.courseSlug,
      };
    }),
    branch<WithRouterProps>(
      ({ courseSlug }) => !!courseSlug,
      withBannerStateByCourse,
      // NOTE: recompose branch typings are really bad; it throws away branch HOC types
      // it also requires a typecast from an HOC with non-empty type parameters
      withNotEnabledBanner as InferableComponentEnhancerWithProps<{}, {}>
    )
  );

export default withEnrollmentStateBannerEnabledState;
