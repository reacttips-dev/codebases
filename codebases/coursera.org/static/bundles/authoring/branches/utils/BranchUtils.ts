import _ from 'lodash';
import moment from 'moment';
import { branchStatus } from 'bundles/author-branches/constants';
import type { BranchStatusValues } from 'bundles/author-branches/constants';

export const isBaseBranch = (branchId: string) => {
  // Note: the base branch branchId will not include the authoringBranch~ or branch~ prefix,
  // while subsequent branchIds will include the prefix.
  return !/(authoringBranch|branch)~.+/.test(branchId);
};

/**
 * findCorrespondingCourseBranchId - get learner side branchId from the authoring branch id
 * @param {Array} branches - list of authoring branches
 * @param {String} courseId - current course id
 * @param {String} authoringBranchId - current branch id (depends on what is selected from switcher)
 * @return {String} corresponding course branch id
 */
export const findCorrespondingCourseBranchId = (branches: $TSFixMe, courseId: string, authoringBranchId: string) => {
  const courseBranch = _.find(branches, (branch) => branch.id === authoringBranchId);

  return courseBranch ? courseBranch.courseBranchId : courseId;
};

export const getSortedSessions = (branch: $TSFixMe) => {
  return Object.keys(branch.associatedSessions)
    .map((id) => Object.assign({}, branch.associatedSessions[id], { id }))
    .sort((a, b) => {
      return a.startedAt - b.startedAt;
    });
};

// Returns started and not ended yet non-preview sessions sorted by started date.
// Dates are covered with moment.utc().
export const getActiveSessions = (branch: $TSFixMe) => {
  if (!branch.associatedSessions) {
    return null;
  }
  const currentDate = Date.now();

  return Object.keys(branch.associatedSessions)
    .reduce((result, sessionId) => {
      const session = branch.associatedSessions[sessionId];
      if (!session.isPreview && currentDate > session.startedAt && currentDate < session.endedAt) {
        result.push({
          ...session,
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
          id: sessionId,
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'Moment' is not assignable to type 'never'.
          startedAt: moment.utc(session.startedAt),
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'Moment' is not assignable to type 'never'.
          endedAt: moment.utc(session.endedAt),
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'Moment' is not assignable to type 'never'.
          enrollmentEndedAt: moment.utc(session.enrollmentEndedAt),
        });
      }
      return result;
    }, [])
    .sort((a, b) => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'startedAt' does not exist on type 'never... Remove this comment to see the full error message
      return a.startedAt - b.startedAt;
    });
};

export const getDefaultEnrollableSessionId = (branch: $TSFixMe) => {
  if (!branch.associatedSessions) {
    return null;
  }

  const activeSessions = getActiveSessions(branch);
  if (activeSessions && activeSessions.length > 0) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'never'.
    return activeSessions[0].id;
  }

  const sortedSessions = getSortedSessions(branch);
  if (sortedSessions && sortedSessions[0]) {
    return sortedSessions[0].id;
  }

  return null;
};

// associated sessions could change to a new branch if more than 1 session is open for future enrollment
export const associatedSessionsAreFinal = (sortedSessions: $TSFixMe) => {
  return sortedSessions.filter((session: $TSFixMe) => session.enrollmentEndedAt > moment()).length <= 1;
};

export const isLaunched = (status?: BranchStatusValues, isPrivateBranch?: boolean) => {
  if (isPrivateBranch) {
    return status === branchStatus.LIVE || status === branchStatus.ARCHIVED;
  }
  const launchedStatuses = [branchStatus.LIVE, branchStatus.ARCHIVED, branchStatus.UPCOMING];
  return !!launchedStatuses.find((launchedStatus) => {
    return status === launchedStatus;
  });
};

export const canLaunch = (branch: $TSFixMe) => {
  return (
    !isBaseBranch(branch.id) &&
    (branch.branchStatus === branchStatus.NEW || branch.branchStatus === branchStatus.PENDING)
  );
};

export const canCreateNewBranch = (branches: $TSFixMe) => {
  // new branches can only be created if all existing branches have a LIVE or ARCHIVED status,
  // and if all branches with an UPCOMING status are private branches
  return !branches.find((branch: $TSFixMe) => {
    return (
      branch.branchStatus !== branchStatus.LIVE &&
      branch.branchStatus !== branchStatus.ARCHIVED &&
      !branch.isPrivate &&
      branch.branchStatus !== branchStatus.UPCOMING
    );
  });
};

// Certain breaking actions are allowed/disallowed in private live branch, with additional warnings
export const isPrivateLiveBranch = (status: $TSFixMe, isPrivate: $TSFixMe) => {
  return isPrivate && status === branchStatus.LIVE;
};

// This is the definition of 'isBreakingChangeAllowed' from BE where certain
// breaking changes are allowed, e.g. reorder lesson with graded items in it
// exception: add/delete/reorder module is not allowed in PRIVATE LIVE branch
export const allowBreakingAction = (status: $TSFixMe, isPrivate: $TSFixMe) => {
  return isPrivate || status === branchStatus.NEW || status === branchStatus.PENDING;
};

// This function name is inconsistent with BE, see allowBreakingAction() for details
// [fe-tech-debt] Remove this function and use isPrivateLiveBranch() instead.
export const isBreakingChangeAllowed = (branch: $TSFixMe) => {
  return branch.isPrivate && branch.branchStatus === branchStatus.LIVE;
};

export const hasCreatingBranch = (branches: $TSFixMe) => {
  return !!branches.find((branch: $TSFixMe) => branch.branchStatus === branchStatus.CREATING);
};

export const getBranchIdForSession = (sessionId: $TSFixMe, branches: $TSFixMe) => {
  // if only one branch, return it. handles when course isn't yet launched, so no associatedSessions
  if (branches.length === 1) return branches[0].id;

  const branchForSession = branches.find((branch: $TSFixMe) => {
    return branch.associatedSessions[sessionId];
  });
  return branchForSession && branchForSession.id;
};

/**
 * @param  {Array} branches list of branches for the course
 * @return {Object} most recently created branch
 */
export const getPublicBranches = (branches: $TSFixMe) => {
  return branches.filter((branch: $TSFixMe) => !branch.isPrivate && branch.listed);
};

/**
 * getLatestBranch - returns the most recently created branch
 *
 * @param  {Array} branches list of branches for the course
 * @return {Object} most recently created branch
 */
export const getLatestBranch = (branches: $TSFixMe) => {
  if (branches.length === 1) {
    return branches[0];
  }

  // Branches may have null createdAt. If that's the case, return the first branch.
  return _.maxBy(branches, 'createdAt') || branches[0];
};

/**
 * getLatestSelectableBranch - returns the most recently created unarchived branch
 *
 * @param  {Array} branches list of branches for the course
 * @return {Object} most recently created branch
 */
export const getLatestSelectableBranch = (branches: $TSFixMe) => {
  if (branches.length === 1) {
    return branches[0];
  }

  // selectable branches are Unarchived + Created branches
  let selectableBranches = branches.filter(
    (branch: $TSFixMe) => branch.branchStatus !== branchStatus.ARCHIVED && branch.branchStatus !== branchStatus.CREATING
  );

  // fallback to first archived branch if we don't have Unarchived + Created branches anymore
  if (selectableBranches.length === 0) {
    selectableBranches = branches.filter(
      (branch: $TSFixMe) =>
        branch.branchStatus === branchStatus.ARCHIVED && branch.branchStatus !== branchStatus.CREATING
    );
  }

  return getLatestBranch(selectableBranches);
};

/**
 * pushBranchIdToUrl - Sets a query param of the provided branchId
 *
 * @param  {String} a branchId
 * @param  {Object} the react-router history object
 * @param  {boolean} if agVersionId query param should also be pushed in addition to versionId
 */
export const pushBranchIdToUrl = (branchId: string, router: $TSFixMe, pushAgBranchId = false) => {
  const { location, push } = router;
  const currentQuery = location.query;
  // The assignment grading page can take both groupIds and branchIds, but only one at a time. There we need to ensure if
  // we choose a branch, the branchId is the only thing present in the path.
  delete currentQuery.sessionId;
  delete currentQuery.groupId;
  delete currentQuery.agVersionId;
  const updatedQuery = pushAgBranchId
    ? { ...currentQuery, versionId: branchId, agVersionId: branchId }
    : { ...currentQuery, versionId: branchId };
  const newLocation = {
    ...location,
    query: updatedQuery,
  };
  push(newLocation);
};
