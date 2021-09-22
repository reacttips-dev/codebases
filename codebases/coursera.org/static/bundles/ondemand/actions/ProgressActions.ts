import { ActionContext } from 'js/lib/ActionContext';

import Q from 'q';
import _ from 'lodash';
import user from 'js/lib/user';
import epic from 'bundles/epic/client';
import localStorageEx from 'bundles/common/utils/localStorageEx';

import ProgressStoreClass from 'bundles/ondemand/stores/ProgressStore';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import CourseProgress from 'pages/open-course/common/models/courseProgress';
import courseProgressPromise from 'bundles/catalogP/promises/courseProgress';

import getLocalStorageProgressKey from 'bundles/ondemand/utils/progress/utils/getLocalStorageProgressKey';

const deepFilterRecursive = (source: any, keyName: string) => {
  delete source[keyName];

  _.forEach(source, (v) => {
    if (_.isObject(v)) {
      deepFilterRecursive(v, keyName);
    }
  });
};

// Copies the object and deletes any key matching the keyName, and any key in any sub-objects.
const deepFilterKey = (source: any, keyName: string) => {
  const newObject = Object.assign({}, source);
  deepFilterRecursive(newObject, keyName);
  return newObject;
};

/**
 * Generally this is used on the client to update any progress indicators. In those cases
 * updateProgress can be called to update.
 *
 * rawCourseProgress is passed through only for the initial hydration step.
 */
export const updateProgress = function (
  actionContext: ActionContext,
  { courseProgress, rawCourseProgress }: { courseProgress: CourseProgress; rawCourseProgress?: any }
) {
  if (rawCourseProgress == null) {
    actionContext.dispatch('LOAD_COURSE_PROGRESS', {
      courseProgress,
      rawCourseProgress: null,
    });
  } else {
    actionContext.dispatch('LOAD_COURSE_PROGRESS', {
      courseProgress,
      rawCourseProgress,
    });
  }
};

// TODO: Note that all "local storage" merging operations are a HACK put in
// place to help deal with unprecedented amounts of lag. This MUST be cleaned
// up if you see it at any "non-firefighting" time.
// @sgogia

export const saveProgressToLocalStorage = (
  progressId: string,
  courseProgress: $TSFixMe /* TODO: type courseProgress */
) => {
  if (window?.localStorage && epic.get('Flex', 'useLocalStorageProgressOverrides')) {
    const localStorageProgressKey = getLocalStorageProgressKey(progressId);
    const itemsProgress = courseProgress.progressMapping;
    const localStorageProgress = JSON.parse(window.localStorage.getItem(localStorageProgressKey) || '{}');
    Object.keys(itemsProgress).forEach((itemId) => {
      const itemProgressState = itemsProgress[itemId].get('progressState');
      if (itemProgressState === 'Completed') {
        localStorageProgress[itemId] = itemProgressState;
      }
    });
    localStorageEx.setItem(getLocalStorageProgressKey(progressId), localStorageProgress, JSON.stringify);
  }
};

export const getProgress = (
  actionContext: ActionContext,
  {
    courseId,
    refreshProgress,
  }: {
    courseId: string;
    refreshProgress: boolean;
  }
) => {
  if (actionContext.getStore(ProgressStoreClass).hasLoaded() && !refreshProgress) {
    return Q();
  }

  return courseProgressPromise(
    {
      id: `${user.get().id}~${courseId}`,
      fields: ['gradedAssignmentGroupProgress'],
    },
    { forceUpdate: true }
  )
    .then(({ courseProgress, rawCourseProgress }: $TSFixMe /* TODO: type courseProgressPromise */) => {
      const oldRawCourseProgress = actionContext.getStore(ProgressStoreClass).rawCourseProgress;
      // Since reloading progress is expensive, don't load it again if it is unchanged.
      // Filter out the 'timestamp' field since it changes every time and is irrelevant.
      if (
        !actionContext.getStore(ProgressStoreClass).hasLoaded() ||
        !_.isEqual(deepFilterKey(oldRawCourseProgress, 'timestamp'), deepFilterKey(rawCourseProgress, 'timestamp'))
      ) {
        return actionContext.executeAction(updateProgress, {
          courseProgress,
          rawCourseProgress,
        });
      }

      return null;
    })
    .fail(() => {
      return actionContext.executeAction(updateProgress, {
        courseProgress: new CourseProgress(),
      });
    });
};
