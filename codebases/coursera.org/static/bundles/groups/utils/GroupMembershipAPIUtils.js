/**
 * Interface with the server
 */

import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';
import user from 'js/lib/user';

import GroupTypesUserData from 'bundles/groups/constants/GroupTypesUserData';

const groupsAPI = API('/api/groups.v1', { type: 'rest' });
const groupMembershipsAPI = API('/api/groupMemberships.v2', { type: 'rest' });
const basicProfilesAPI = API('/api/basicProfiles.v1', { type: 'rest' });

const GroupMembershipAPIUtils = {
  getMembers(groupId, start, limit) {
    const uri = new URI()
      .addQueryParam('q', 'members')
      .addQueryParam('groupId', groupId)
      .addQueryParam('includes', 'userPublicProfiles')
      .addQueryParam('fields', 'userPublicProfiles.v1(externalUserId),isViewAsLearnerMembership')
      .addQueryParam('limit', limit);

    return Q(groupMembershipsAPI.get(uri.toString()));
  },

  getMembershipForCurrentUser(groupId) {
    const uri = new URI().addQueryParam('q', 'currentUser').addQueryParam('groupId', groupId);

    return Q(groupMembershipsAPI.get(uri.toString()));
  },

  deleteMember(groupId, memberId) {
    return Q(groupMembershipsAPI.delete(`${memberId}~${groupId}`));
  },

  deleteMembers(groupId, members) {
    const uri = new URI().addQueryParam('action', 'deleteMemberships').addQueryParam('groupId', groupId);
    return Q(groupMembershipsAPI.post(uri.toString(), { data: members }));
  },

  searchMembers(groupId, text) {
    const uri = new URI().addQueryParam('q', 'search').addQueryParam('groupId', groupId).addQueryParam('text', text);

    return Q(groupMembershipsAPI.get(uri.toString()));
  },

  myCourseGroupsWithSettings(userId, courseId) {
    const uri = new URI()
      .addQueryParam('q', 'userAndCourse')
      .addQueryParam('userId', userId)
      .addQueryParam('courseId', courseId)
      .addQueryParam('includes', 'groups,groupSettings');

    return Q(groupMembershipsAPI.get(uri.toString()));
  },

  getCourseSessionGroup(userId, courseId, sessionId) {
    if (!userId || !courseId || !sessionId) {
      return Q();
    }

    const uri = new URI()
      .addQueryParam('q', 'userAndSession')
      .addQueryParam('userId', userId)
      .addQueryParam('courseId', courseId)
      .addQueryParam('sessionId', sessionId);

    return Q(groupMembershipsAPI.get(uri.toString()));
  },

  enrollUserInGroup(groupId) {
    return Q(groupsAPI.get(groupId))
      .then((response) => response.elements[0])
      .then((group) => {
        const basicProfilesUri = new URI().addQueryParam('q', 'me').addQueryParam('fields', 'emailAddress');
        return Q(basicProfilesAPI.get(basicProfilesUri.toString()))
          .then((response) => response.elements[0])
          .then((profile) => {
            const groupMembershipUri = new URI(user.get().id + '~' + groupId).addQueryParam('skipNotification', true);
            // Coursera does not have data for LMS systems (studentId, sisUserId, etc), so we are just adding the
            // 'required' fields and defaulting them as blanks, because the groupMemembershipsAPI requires the fields to
            // be present but they don't have to be valid
            return Q(
              groupMembershipsAPI.put(groupMembershipUri.toString(), {
                data: {
                  role: 'Member',
                  userData: {
                    // We determine the userData type but provide all the required fields for every possible type since
                    // we default them to blank anyways.
                    typeName: GroupTypesUserData[group.typeName],
                    definition: {
                      fullName: profile.name,
                      email: profile.emailAddress,
                      userEmail: profile.emailAddress,
                      username: '',
                      firstName: profile.name.split(' ')[0],
                      lastName: profile.name.split(' ').slice(-1)[0],
                      studentId: '',
                      name: profile.name,
                      sisUserId: '',
                      sisLoginId: '',
                      section: '',
                    },
                  },
                },
              })
            );
          });
      });
  },
};

export default GroupMembershipAPIUtils;

export const {
  getMembers,
  getMembershipForCurrentUser,
  deleteMember,
  deleteMembers,
  searchMembers,
  myCourseGroupsWithSettings,
  getCourseSessionGroup,
  enrollUserInGroup,
} = GroupMembershipAPIUtils;
