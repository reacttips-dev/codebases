import Q from 'q';

import type { ActionContext } from 'js/lib/ActionContext';
import loadCourseMaterialsUtil from 'bundles/course/utils/loadCourseMaterials';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { getViewAsLearnerGroups } from 'bundles/groups/utils/getViewAsLearnerGroups';

export const loadCourseMaterials = (
  actionContext: ActionContext,
  {
    courseSlug,
    refetchLearnerGoals,
    refetch,
  }: { refetchLearnerGoals?: () => Promise<any>; courseSlug: string; refetch: boolean }
): Q.Promise<any> => loadCourseMaterialsUtil(actionContext, courseSlug, refetch, refetchLearnerGoals);

export const initializeCourseApp = (
  actionContext: ActionContext,
  {
    courseId,
    branchesWithSessions,
    userCanSwitchGroups,
    excludeEmptyGroup,
  }: { courseId: string; branchesWithSessions: any; userCanSwitchGroups?: boolean; excludeEmptyGroup?: boolean }
) => {
  const viewAsLearnerGroupsPromise = userCanSwitchGroups ? getViewAsLearnerGroups(courseId) : Q([]);
  return viewAsLearnerGroupsPromise.then((groups: $TSFixMe /* TODO: type GroupAPIUtil */) => {
    /* eslint-disable no-param-reassign */
    const branchesSessionsGroups = branchesWithSessions.map((
      branch: $TSFixMe /* TODO: type branchesWithSessions */
    ) => ({
      id: branch.id,
      conflictMetadata: branch.conflictMetadata,
      associatedSessionsList: Object.keys(branch.properties.associatedSessions).map(function (key) {
        const sessionGroups = groups.filter(
          (group: $TSFixMe /* TODO: type GroupAPIUtil */) => group.scopeId.split('~')[1] === key
        );
        return { id: key, groups: sessionGroups, ...branch.properties.associatedSessions[key] };
      }),
      ...branch.properties,
    }));
    actionContext.dispatch('RECEIVE_BRANCHES_SESSIONS_GROUPS_FOR_COURSE', {
      branchesSessionsGroups,
      excludeEmptyGroup,
    });
  });
};

export const setCourseIdentifiers = (
  actionContext: ActionContext,
  {
    courseId,
    courseSlug,
  }: {
    courseId: string;
    courseSlug: string;
  }
) => {
  if (!courseId) {
    throw new Error('Missing courseId');
  }

  if (!courseSlug) {
    throw new Error('Missing courseSlug');
  }

  actionContext.dispatch('SET_COURSE_IDENTIFIERS', {
    courseId,
    courseSlug,
    courseCertificates: [],
  });
};
