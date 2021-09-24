import gql from 'graphql-tag';
import { MEMBER_FRAGMENT } from './fragments/member.gql';
import { THEMES_FRAGMENT } from './fragments/theme.gql';
import { MEDIA_FRAGMENT } from './media.gql';
import { PERMISSION_ACTION_FRAGMENT } from './permissions.gql';
import { ROLE_FRAGMENT } from './roles.gql';
export const MEMBER_INVITATION_FRAGMENT = gql `
  fragment MemberInvitationFragment on MemberInvitation {
    __typename
    createdAt
    expiresAt
    id
    invitationMessage
    invitee {
      ...MemberFragment
    }
    inviteeEmail
    inviteeName
    inviter {
      ...MemberFragment
    }
    joinedAt
    network {
      id
      name
      logo {
        ...MediaFragment
      }
      domain
    }
    role {
      ...RoleFragment
    }
    status
  }
  ${MEDIA_FRAGMENT}
  ${ROLE_FRAGMENT}
  ${MEMBER_FRAGMENT}
`;
export const MEMBER_SPACE_NOTIFICATION_SETTINGS_FRAGMENT = gql `
  fragment MemberSpaceNotificationSettingsFragment on MemberSpaceNotificationSettings {
    __typename
    channel
    enabled
    preference
    sameAsDefault
    space {
      __typename
      id
      slug
    }
  }
`;
export const GET_NETWORK_MEMBERS = gql `
  query getNetworkMembers($limit: Int!, $query: String, $after: String) {
    getMembers(limit: $limit, query: $query, after: $after) {
      totalCount
      edges {
        node {
          ...MemberFragment
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${MEMBER_FRAGMENT}
`;
export const GET_MEMBER_BY_ID = gql `
  query getMemberById($memberId: ID!) {
    getMember(memberId: $memberId) {
      ...MemberFragment
    }
  }
  ${MEMBER_FRAGMENT}
`;
export const GET_MEMBER_INVITATIONS = gql `
  query getMemberInvitations(
    $limit: Int!
    $query: String
    $after: String
    $status: MemberInvitationStatus
    $reverse: Boolean = true
  ) {
    memberInvitations(
      limit: $limit
      query: $query
      after: $after
      status: $status
      reverse: $reverse
    ) {
      totalCount
      edges {
        node {
          ...MemberInvitationFragment
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${MEMBER_INVITATION_FRAGMENT}
`;
export const MEMBER_INVITATIONS_TOTAL_COUNT = gql `
  query memberInvitationsTotalCount(
    $limit: Int!
    $query: String
    $after: String
    $status: MemberInvitationStatus
  ) {
    memberInvitations(
      limit: $limit
      query: $query
      after: $after
      status: $status
    ) {
      totalCount
    }
  }
`;
export const GET_SPACE_MEMBERS = gql `
  query getSpaceMembers(
    $spaceId: ID!
    $roleIds: [ID!]
    $after: String
    $limit: Int!
  ) {
    getSpaceMembers(
      spaceId: $spaceId
      roleIds: $roleIds
      after: $after
      limit: $limit
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          member {
            ...MemberFragment
          }
          role {
            id
            name
          }
        }
      }
    }
  }
  ${MEMBER_FRAGMENT}
`;
export const ADD_SPACE_MEMBERS = gql `
  mutation addSpaceMembers($input: [AddSpaceMemberInput!]!, $spaceId: ID!) {
    addSpaceMembers(input: $input, spaceId: $spaceId) {
      member {
        ...MemberFragment
      }
    }
  }
  ${MEMBER_FRAGMENT}
`;
export const REMOVE_SPACE_MEMBERS = gql `
  mutation removeSpaceMembers($memberIds: [ID!]!, $spaceId: ID!) {
    removeSpaceMembers(memberIds: $memberIds, spaceId: $spaceId) {
      status
      __typename
    }
  }
`;
export const GET_AUTH_MEMBER = gql `
  query getAuthMember {
    getAuthMember {
      ...MemberFragment
      network {
        themes {
          ...ThemesFragment
        }
      }
    }
  }
  ${MEMBER_FRAGMENT}
  ${THEMES_FRAGMENT}
`;
export const UPDATE_MEMBER = gql `
  mutation updateMember($input: UpdateMemberInput!, $id: ID) {
    updateMember(id: $id, input: $input) {
      ...MemberFragment
    }
  }
  ${MEMBER_FRAGMENT}
`;
export const REMOVE_MEMBER = gql `
  mutation removeMember($memberId: ID!) {
    removeMember(memberId: $memberId) {
      status
      __typename
    }
  }
`;
export const INVITE_NETWORK_MEMBERS = gql `
  mutation inviteMembers($input: InviteMembersInput!) {
    inviteMembers(input: $input) {
      id
      createdAt
      inviteeEmail
      inviteeName
      status
    }
  }
`;
export const MEMBER_SPACES = gql `
  query memberSpaces(
    $limit: Int!
    #    $query: String
    $after: String
    $memberId: ID!
    $collectionId: String
  ) {
    memberSpaces(
      limit: $limit
      #      query: $query
      after: $after
      memberId: $memberId
      collectionId: $collectionId
    ) {
      __typename
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        __typename
      }
      edges {
        cursor
        __typename
        node {
          member {
            ...MemberFragment
          }
          role {
            id
            name
            type
          }
          space {
            __typename
            id
            name
            description
            image {
              ...MediaFragment
            }
            slug
            banner {
              ...MediaFragment
            }
            postsCount
            membersCount
            createdAt
            createdBy {
              id
              name
              profilePicture {
                ...MediaFragment
              }
            }
            private
            hidden
            inviteOnly
            nonAdminsCanInvite
            authMemberProps {
              context
              permissions {
                ...PermissionAction
              }
              __typename
            }
          }
        }
      }
    }
  }
  ${PERMISSION_ACTION_FRAGMENT}
  ${MEMBER_FRAGMENT}
  ${MEDIA_FRAGMENT}
`;
export const MEMBER_NOTIFICATION_SETTINGS = gql `
  query memberNotificationSettings($id: ID!) {
    memberNotificationSettings(id: $id) {
      __typename
      spaces {
        ...MemberSpaceNotificationSettingsFragment
      }
    }
  }
  ${MEMBER_SPACE_NOTIFICATION_SETTINGS_FRAGMENT}
`;
export const UPDATE_MEMBER_SPACE_NOTIFICATION_SETTINGS = gql `
  mutation updateMemberSpaceNotificationSettings(
    $channel: NotificationChannel!
    $input: UpdateMemberSpaceNotificationSettingsInput!
    $memberId: ID
    $spaceId: ID!
  ) {
    updateMemberSpaceNotificationSettings(
      channel: $channel
      input: $input
      memberId: $memberId
      spaceId: $spaceId
    ) {
      ...MemberSpaceNotificationSettingsFragment
    }
  }
  ${MEMBER_SPACE_NOTIFICATION_SETTINGS_FRAGMENT}
`;
//# sourceMappingURL=members.gql.js.map