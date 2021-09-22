import Q from 'q';
import URI from 'jsuri';
import API from 'js/lib/api';
import { getBranches } from 'bundles/author-common/utils/AuthoringCourseBranchAPIUtils';
import type AuthoringCourseBranch from 'bundles/author-common/models/AuthoringCourseBranch';
import type { ConflictMetadata } from 'bundles/author-branches/types/BranchProperties';

export type CreateBranchPromisePayload = {
  courseId: string;
  name: string;
  plannedLaunchDate: number;
  sourceBranchId?: string;
  keepAtomsShared?: boolean;
};

const authoringCourseBranchesAPI = API('/api/authoringCourseBranches.v1', {
  type: 'rest',
});
const onDemandCourseLaunchEmailsAPI = API('/api/onDemandCourseLaunchEmails.v1', {
  type: 'rest',
});

const authoringCopyBranchesAPI = API('/api/authoringCopyBranches.v2', {
  type: 'rest',
});

/**
 * List branches for a course.
 * NOTE: Excludes course materials. to fetch courseMaterials, use getBranch
 * @param  {string} courseId
 * @param  {boolean} includeUnlisted
 * @returns {Promise.<Array.<BranchObject>>}
 */
export const getBranchesForCourse = function (courseId: string, includeUnlisted = false) {
  return getBranches(courseId, includeUnlisted);
};

/**
 * Get a single branch with courseMaterials by branchId.
 * @param  {string} branchId
 * @returns {Promise.<BranchObject>}
 */
export const getBranchById = function (branchId: string) {
  // TODO: see where we are misusing this
  const courseBranchById = new URI(branchId).toString();

  return Q(authoringCourseBranchesAPI.get(courseBranchById));
};

export const saveBranchById = function ({
  branchId,
  branchData,
}: {
  branchId: string;
  branchData: {
    branch: AuthoringCourseBranch;
    conflictMetadata: ConflictMetadata;
    id: string;
  };
}) {
  const courseBranchById = new URI(branchId).toString();

  return Q(authoringCourseBranchesAPI.put(courseBranchById, { data: branchData })).then((response) => {
    return response.elements[0];
  });
};

export const validateBranch = function (branchId: string) {
  const uri = new URI().addQueryParam('action', 'validateForLaunch').addQueryParam('id', branchId).toString();

  return Q(authoringCourseBranchesAPI.post(uri));
};

export const sendRequestApprovalEmail = function (branchId: string) {
  const uri = new URI().addQueryParam('action', 'requestApproval').addQueryParam('id', branchId).toString();

  return Q(onDemandCourseLaunchEmailsAPI.post(uri));
};

export const launchBranch = function (branchId: string, branchMetadata: ConflictMetadata) {
  const uri = new URI().addQueryParam('action', 'launch').addQueryParam('id', branchId).toString();

  return Q(authoringCourseBranchesAPI.post(uri, { data: branchMetadata }));
};

// creates the first public branch for an empty course shell
export const createFirstPublicBranch = function ({ name, courseId, plannedLaunchDate }: CreateBranchPromisePayload) {
  const uri = new URI().addQueryParam('action', 'createInitialBranch').toString();

  const data = {
    name,
    courseId,
    plannedLaunchDateOption: plannedLaunchDate,
    // per elin@ - `isPrivate` always needs to be false - the private session creation job now calls this API behind
    // the scenes to create private branches when `sourceBranchId` is not defined (a.k.a empty course shell creation)
    isPrivate: false,
  };

  return Q(authoringCourseBranchesAPI.post(uri, { data }));
};

export const createBranchPromise = function ({
  courseId,
  name,
  sourceBranchId,
  keepAtomsShared,
  plannedLaunchDate,
}: CreateBranchPromisePayload) {
  const createNewBranchUri = new URI().toString();

  return Q(
    authoringCopyBranchesAPI.post(createNewBranchUri, {
      data: {
        courseId,
        name,
        sourceBranchId,
        keepAtomsShared,
        createBranchCopyJob: true,
        plannedLaunchDate,
      },
    })
  ).then((response) => {
    return response.elements[0];
  });
};

export const unlistBranch = function (branchId: string) {
  const uri = new URI().addQueryParam('action', 'unlist').addQueryParam('id', branchId).toString();

  return Q(authoringCourseBranchesAPI.post(uri));
};
