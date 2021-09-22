import Q from 'q';
import _ from 'lodash';
import GroupRoles from 'bundles/groups/constants/GroupRoles';
import GroupMembershipAPIUtils from 'bundles/groups/utils/GroupMembershipAPIUtils';

const _data = {}; // cache data

const groupMembershipsPromise = function (groupId, authenticated, isSuperuser) {
  if (!authenticated) {
    return Q({ canModerate: false });
  }

  if (isSuperuser) {
    return Q({ canModerate: true });
  }

  if (_data[groupId]) {
    return Q(_data[groupId]);
  }

  // otherwise check the membership promise
  return GroupMembershipAPIUtils.getMembershipForCurrentUser(groupId).then((response) => {
    const memberships = response.elements;
    const membershipForGroup = _.find(
      memberships,
      (membership) => membership.role === GroupRoles.GroupManager || membership.role === GroupRoles.DerivedGroupManager
    );

    let membership = { canModerate: false };
    if (membershipForGroup) {
      membership = { canModerate: true };
    }

    _data[groupId] = membership;
    return membership;
  });
};

export default groupMembershipsPromise;
