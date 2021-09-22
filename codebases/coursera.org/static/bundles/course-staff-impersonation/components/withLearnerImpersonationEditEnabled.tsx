import Naptime from 'bundles/naptimejs';
import { branch, compose, withProps } from 'recompose';
import type { InferableComponentEnhancerWithProps } from 'recompose';
import user from 'js/lib/user';
import connectToRouter from 'js/lib/connectToRouter';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import PrivilegedAuths from 'bundles/naptimejs/resources/privilegedAuths.v1';
import { withOptionalCourseFeaturePermissions } from 'bundles/teach-course/utils/withFeaturePermissions';
import getNavigationFeatures, {
  canToggleEditModeForActAsLearner,
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
  isActAsLearnerEditModeEnabled: boolean;
};

/**
 * A simple helper HOC that attaches a prop indicating the enrollment
 * state banner is disabled. Useful for branching logic where we frequently
 * want to back out into the disabled state.
 */
const withNotEnabledBanner = withProps<WithEnrollmentBannerProps, {}>(() => {
  return {
    isActAsLearnerEditModeEnabled: false,
  };
});

/**
 * An HOC which takes a `courseSlug` as input and determines whether
 * the user in the app context is authorized to toggle view as learner edit mode.
 * The HOC results in a prop `isActAsLearnerEditModeEnabled` being injected
 * into the wrapped component.
 */
const withActAsLearnerEditModeByCourse = compose<WithEnrollmentBannerProps, WithRouterProps>(
  Naptime.createContainer<WithCourseProps, WithRouterProps>(({ courseSlug }) => ({
    course: CoursesV1.bySlug(courseSlug, {
      fields: ['slug'],
    }),
    isOutsourcingAgent: PrivilegedAuths.getIsOutsourcingAgent(user),
  })),
  branch<WithCourseProps>(
    ({ course }) => !course,
    withNotEnabledBanner as InferableComponentEnhancerWithProps<{}, {}>,
    compose(
      withOptionalCourseFeaturePermissions(({ course }) => ({
        featurePermissions: {
          courseId: course.id,
          features: getNavigationFeatures(course.id),
        },
        courseId: course.id,
      })),
      branch<WithFeaturePermissions>(
        ({ featurePermissions }) => !featurePermissions,
        withNotEnabledBanner as InferableComponentEnhancerWithProps<{}, {}>,
        withProps<WithEnrollmentBannerProps, WithFeaturePermissions>(({ isOutsourcingAgent, featurePermissions }) => {
          const isActAsLearnerEditModeEnabled =
            isOutsourcingAgent || canToggleEditModeForActAsLearner(featurePermissions);

          return {
            isActAsLearnerEditModeEnabled,
          };
        }) as InferableComponentEnhancerWithProps<{}, {}>
      )
    )
  )
);

const withLearnerImpersonationEditEnabled = () =>
  compose<WithEnrollmentBannerProps, {}>(
    connectToRouter(({ params }) => {
      return {
        courseSlug: params.courseSlug,
      };
    }),
    branch<WithRouterProps>(
      ({ courseSlug }) => !!courseSlug,
      withActAsLearnerEditModeByCourse,
      withNotEnabledBanner as InferableComponentEnhancerWithProps<{}, {}>
    )
  );

export default withLearnerImpersonationEditEnabled;
