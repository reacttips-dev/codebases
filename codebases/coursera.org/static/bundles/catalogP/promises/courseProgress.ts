import courseProgressData from 'bundles/catalogP/data/courseProgress';
import createLinkedModels from 'bundles/catalogP/lib/createLinkedModels';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'page... Remove this comment to see the full error message
import CourseProgress from 'pages/open-course/common/models/courseProgress';
import getLocalStorageProgressKey from 'bundles/ondemand/utils/progress/utils/getLocalStorageProgressKey';
import epic from 'bundles/epic/client';
import { cloneDeep } from 'lodash';

// TODO: Note that all "local storage" merging operations are a HACK put in
// place to help deal with unprecedented amounts of lag. This MUST be cleaned
// up if you see it at any "non-firefighting" time.
// @sgogia

const readProgressFromLocalStorage = (courseProgressId: $TSFixMe) => {
  if (window?.localStorage) {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
    return JSON.parse(window.localStorage.getItem(getLocalStorageProgressKey(courseProgressId)));
  }
  return undefined;
};

const mergeProgressFromLocalStorage = (rawProgress: $TSFixMe, localStorageProgress: $TSFixMe) => {
  if (!localStorageProgress || !rawProgress?.elements || rawProgress.elements.length === 0) {
    return rawProgress;
  }

  const mergedItemProgresses = cloneDeep(rawProgress.elements[0].items);
  Object.keys(localStorageProgress).forEach((itemId) => {
    if (!mergedItemProgresses[itemId] && localStorageProgress[itemId] === 'Completed') {
      mergedItemProgresses[itemId] = {
        progressState: localStorageProgress[itemId],
        timestamp: Date.now(), // not used on client
      };
    }
    if (localStorageProgress[itemId] === 'Completed') {
      mergedItemProgresses[itemId].progressState = localStorageProgress[itemId];
    }
  });

  return {
    paging: rawProgress.paging,
    linked: rawProgress.linked,
    elements: [
      {
        ...rawProgress.elements[0],
        items: mergedItemProgresses,
      },
    ],
  };
};

export default function (options: $TSFixMe, memoizeOptions: $TSFixMe) {
  return courseProgressData(options, memoizeOptions).then(function (data) {
    let mergedWithLocalData;
    if (epic.get('Flex', 'useLocalStorageProgressOverrides')) {
      const localProgressData = readProgressFromLocalStorage(options.id);
      mergedWithLocalData = mergeProgressFromLocalStorage(data, localProgressData);
    } else {
      mergedWithLocalData = data;
    }
    return {
      courseProgress: createLinkedModels(CourseProgress.prototype.resourceName, mergedWithLocalData).first(),
      rawCourseProgress: mergedWithLocalData,
    };
  });
}
