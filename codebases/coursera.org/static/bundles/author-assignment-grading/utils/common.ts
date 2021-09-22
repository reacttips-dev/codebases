import { RouteNames } from 'pages/teach-course/constants';
import type { ItemType } from 'bundles/item/types/ItemType';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type GroupMember from 'bundles/authoring/groups/models/GroupMember';
import { isResetLearnerProgressEnabled } from 'bundles/author-assignment-grading/components/common/utils/utils';

import type { SocialProfile } from 'bundles/assess-common/types/SocialProfile';

// routes to not render the right sidebar for
const rightSidebarBlacklistRoutes = [...Object.values(RouteNames.USER_CHANGE_LOG)];
// temporary blacklist routes to support epic
const tempRightSidebarBlacklistRoutes = [...rightSidebarBlacklistRoutes, ...Object.values(RouteNames.USER_EXCEPTION)];

/**
 * whether the right sidebar should be rendered for item grading
 *
 * @param  {Object} routes react-router routes object
 * @return {boolean}
 */
export const shouldShowRightSidebar = (currentRoute: any, courseId: string, itemType: ItemType): boolean => {
  if (!currentRoute) {
    return false;
  }
  const isRightSidebarHiddenForUserException = isResetLearnerProgressEnabled(courseId, itemType);

  return isRightSidebarHiddenForUserException
    ? !tempRightSidebarBlacklistRoutes.includes(currentRoute.name)
    : !rightSidebarBlacklistRoutes.includes(currentRoute.name);
};

export const getUserItemInteractionId = (userId: string | number, courseBranchId: string, itemId: string): string => {
  return tupleToStringKey([userId, courseBranchId, itemId]);
};

export const compareByNaturalSortOrder = (a?: string, b?: string) =>
  (a ?? '').toLowerCase().localeCompare((b ?? '').toLowerCase(), undefined, { numeric: true });

export const getUserProfilesWithGroupMembershipUpdates = (
  groupMembers: Array<GroupMember>,
  socialProfiles: { [userId: string]: SocialProfile },
  isAnonymized = false
): { [userId: string]: SocialProfile } => {
  // returns a new map of socialProfiles with names replaced with groupMembership name if available, or with anonymized name if specified.
  const updatedSocialProfiles = socialProfiles;
  Object.keys(socialProfiles).forEach((learnerId) => {
    const groupMember = groupMembers.find((member) => member.userId.toString() === learnerId);
    if (groupMember) {
      updatedSocialProfiles[learnerId].fullName = groupMember.getDisplayName(isAnonymized);
      if (isAnonymized) {
        updatedSocialProfiles[learnerId].photoUrl = '';
      }
    }
  });
  return updatedSocialProfiles;
};
