import { ActionContext } from 'js/lib/ActionContext';

import Q from 'q';
import _ from 'lodash';
import CourseStoreClass from 'bundles/ondemand/stores/CourseStore';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import courseMaterialsPromise from 'pages/open-course/common/promises/courseMaterials';

// TODO(lewis): Replace with more well defined error. We should NOT use a SSR error here.
import JSApplicationError from 'bundles/ssr/lib/errors/JSApplicationError';

export default (
  actionContext: ActionContext,
  courseSlug: string,
  refetch = false,
  refetchLearnerGoals: (() => Promise<any>) | null = null
) => {
  if (actionContext.getStore(CourseStoreClass).hasLoaded() && !refetch) {
    return Q();
  }

  if (refetchLearnerGoals) {
    refetchLearnerGoals();
  }

  return courseMaterialsPromise(courseSlug).then((courseMaterialsData: $TSFixMe /* TODO: type CourseMaterials */) => {
    if (!courseMaterialsData) {
      throw new JSApplicationError('No Course Materials received.');
    }

    const { rawCourseMaterials } = courseMaterialsData;
    const oldRawCourseMaterials = actionContext.getStore(CourseStoreClass).rawCourseMaterials;

    // Since reloading the course materials is expensive, don't load it again if it is unchanged.
    if (!actionContext.getStore(CourseStoreClass).loaded || !_.isEqual(oldRawCourseMaterials, rawCourseMaterials)) {
      actionContext.dispatch('LOAD_COURSE_MATERIALS', courseMaterialsData);
    }

    return courseMaterialsData;
  });
};
