import PropTypes from 'prop-types';

import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import { compose, getContext, InferableComponentEnhancer } from 'recompose';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import { refreshCourseViewGrade } from 'bundles/ondemand/actions/CourseViewGradeActions';
import { getProgress } from 'bundles/ondemand/actions/ProgressActions';
import { loadCourseMaterials } from 'bundles/ondemand/actions/CourseActions';

import CourseStoreType from 'bundles/ondemand/stores/CourseStore';

type Context = {
  executeAction: (action: any, payload: object) => void;
};

export type WithRefreshProgressProps = {
  refreshProgress: () => void;
};

/**
 * HOC that adds `refreshProgress` function prop to component.
 * It refetches learner progres in fluxible stores. It could be used after submitting
 * assignments to reflect updated learner progress in navigatin or other places.
 */
// @ts-expect-error TSMIGRATION-3.9
const withRefreshProgress: InferableComponentEnhancer<WithRefreshProgressProps> = compose(
  getContext<Context>({
    executeAction: PropTypes.func.isRequired,
  }),
  connectToStores<WithRefreshProgressProps, Context, { CourseStore: CourseStoreType }>(
    ['CourseStore'],
    ({ CourseStore }, { executeAction }) => {
      const courseId = CourseStore.getCourseId();
      const courseSlug = CourseStore.getCourseSlug();
      return {
        refreshProgress: () => {
          executeAction(refreshCourseViewGrade, { courseId });
          executeAction(getProgress, { courseId, refreshProgress: true });
          executeAction(loadCourseMaterials, { courseSlug, refetch: true });
        },
      };
    }
  )
);

export default withRefreshProgress;
