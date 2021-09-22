import Q from 'q';
import type { ActionContext } from 'js/lib/ActionContext';
import * as BranchesService from 'bundles/author-branches/service/branches';
import { getItemDraftInfoByBranch } from 'bundles/authoring/branches/utils/itemDraftPropertiesApiUtils';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { getLatestSelectableBranch } from 'bundles/authoring/branches/utils/BranchUtils';
import BranchPropertiesApiUtils from 'bundles/author-branches/utils/BranchPropertiesApiUtils';
import type { CreateBranchPromisePayload } from 'bundles/author-branches/service/branches';
import type { Draft, AuthoringCourseBranchWithConflictMetadata } from 'bundles/author-branches/types/BranchProperties';
import { loadAllBranchPropertiesForCourse } from 'bundles/author-branches/actions/BranchPropertiesActions';
import { ALL_BRANCHES } from 'bundles/author-branches/constants';

export const selectBranch = (actionContext: ActionContext, { branchId }: { branchId: string }) => {
  if (branchId === ALL_BRANCHES) {
    // ALL_BRANCHES call for branchProperties is a 404: see PARTNER-13889
    return Q();
  }

  const promise = BranchPropertiesApiUtils.getBranchProperties(branchId).then((response) => {
    actionContext.dispatch('SAVE_CONFLICT_METADATA_FOR_BRANCH', {
      branchId,
      conflictMetadata: response.elements[0].conflictMetadata,
    });
  });

  promise.done();
  return promise;
};

export const loadBranchesForCourse = (
  actionContext: ActionContext,
  { courseId, includeUnlisted = false }: { courseId: string; includeUnlisted?: boolean }
) => {
  actionContext.dispatch('ON_BRANCHES_LOADING');

  const promise = BranchesService.getBranchesForCourse(courseId, includeUnlisted).then(
    // @ts-ignore TODO: getBranchesForCourse can return `undefined` promise
    (branches: Array<AuthoringCourseBranchWithConflictMetadata>) => {
      const latestSelectableBranch = getLatestSelectableBranch(branches);

      actionContext.dispatch('ON_BRANCHES_LOAD_SUCCESS', { branches });
      selectBranch(actionContext, {
        branchId: latestSelectableBranch ? latestSelectableBranch.id : courseId,
      });
      actionContext.dispatch('LOAD_FEATURES_FOR_BRANCHES', { branches });
    }
  );

  promise.done();
  return promise;
};

export const loadDraftsForBranch = (actionContext: ActionContext, { branchId }: { branchId: string }) => {
  const promise = getItemDraftInfoByBranch(branchId).then((response) => {
    const drafts: { [draftId: string]: string } = {};
    response.forEach((draft: Draft) => {
      drafts[draft.id] = draft.draftName;
    });

    actionContext.dispatch('SAVE_DRAFTS_FOR_BRANCH', {
      branchId,
      drafts,
    });
  });

  promise.done();
  return promise;
};

export const createBranch = (
  actionContext: ActionContext,
  {
    courseId,
    name,
    sourceBranchId,
    keepAtomsShared,
    plannedLaunchDate,
    done,
    isEmptyCourseShell = false,
  }: {
    courseId: string;
    name: string;
    sourceBranchId: string;
    keepAtomsShared: boolean;
    plannedLaunchDate: number;
    done: () => void;
    isEmptyCourseShell: boolean;
  }
) => {
  actionContext.dispatch('ON_BRANCH_CREATING');

  const branchPromise = isEmptyCourseShell
    ? BranchesService.createFirstPublicBranch
    : BranchesService.createBranchPromise;

  let payload: CreateBranchPromisePayload = { courseId, name, plannedLaunchDate };

  if (!isEmptyCourseShell) {
    payload = Object.assign({}, payload, { sourceBranchId, keepAtomsShared });
  }

  return branchPromise(payload)
    .then(() => {
      actionContext.executeAction(loadBranchesForCourse, { courseId });
      actionContext.executeAction(loadAllBranchPropertiesForCourse, courseId);
    })
    .done(() => done && done());
};

export const validateBranch = (actionContext: ActionContext, { branchId }: { branchId: string }) => {
  actionContext.dispatch('VALIDATE_BRANCH', { branchId });
};
