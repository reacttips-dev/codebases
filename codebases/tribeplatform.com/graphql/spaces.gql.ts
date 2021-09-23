import gql from 'graphql-tag';
import { MEDIA_FRAGMENT } from './media.gql';
import { PERMISSION_ACTION_FRAGMENT } from './permissions.gql';
import { FEED_POST_FRAGMENT } from './posts.gql';
import { SPACE_TYPE_FRAGMENT } from './spaceTypes.gql';
import { TAG_FRAGMENT } from './tags.gql';
export const SPACE_ROLE_FRAGMENT = gql `
  fragment SpaceRoleFragment on SpaceRole {
    __typename
    id
    name
    type
    description
  }
`;
export const BASIC_SPACE_FRAGMENT = gql `
  fragment BasicSpaceFragment on Space {
    __typename
    authMemberProps {
      context
      membershipStatus
      permissions {
        ...PermissionAction
      }
      __typename
    }
    banner {
      ...MediaFragment
    }
    description
    hidden
    id
    image {
      ...MediaFragment
    }
    inviteOnly
    membersCount
    name
    nonAdminsCanInvite
    private
    slug
    spaceType {
      ...SpaceTypeFields
    }
  }
  ${SPACE_TYPE_FRAGMENT}
  ${MEDIA_FRAGMENT}
  ${PERMISSION_ACTION_FRAGMENT}
`;
export const SPACE_FRAGMENT = gql `
  fragment SpaceFragment on Space {
    ...BasicSpaceFragment
    collection {
      id
    }
    createdBy {
      id
    }
    pinnedPosts {
      ...FeedPostFields
    }
    roles {
      id
      name
      type
    }
  }
  ${BASIC_SPACE_FRAGMENT}
  ${FEED_POST_FRAGMENT}
`;
export const SPACE_JOIN_REQUEST_FRAGMENT = gql `
  fragment SpaceJoinRequestFragment on SpaceJoinRequest {
    __typename
    id
    member {
      id
      email
      emailStatus
      attributes {
        locale
      }
    }
    spaceId
    status
  }
`;
export const GET_SPACES = gql `
  query getSpaces($limit: Int!, $query: String, $after: String, $memberId: ID) {
    getSpaces(
      limit: $limit
      query: $query
      after: $after
      memberId: $memberId
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
          ...BasicSpaceFragment
        }
      }
    }
  }
  ${BASIC_SPACE_FRAGMENT}
`;
export const SPACE_SEO = gql `
  query spaceSeo($id: ID, $slug: ID) {
    space(id: $id, slug: $slug) {
      authMemberProps {
        __typename
        permissions {
          ...PermissionAction
        }
      }
      banner {
        ...MediaFragment
      }
      description
      id
      name
      slug
      spaceType {
        ...SpaceTypeFields
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${SPACE_TYPE_FRAGMENT}
  ${PERMISSION_ACTION_FRAGMENT}
`;
export const SPACE = gql `
  query space($id: ID, $slug: ID) {
    space(id: $id, slug: $slug) {
      ...SpaceFragment
      highlightedTags {
        text
        tag {
          ...TagFragment
        }
        type
      }
    }
  }
  ${SPACE_FRAGMENT}
  ${TAG_FRAGMENT}
`;
export const GET_EXPLORE_SPACES = gql `
  query exploreSpaces($limit: Int!, $collectionId: String) {
    exploreSpaces(limit: $limit, collectionId: $collectionId) {
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
          ...BasicSpaceFragment
        }
      }
    }
  }
  ${BASIC_SPACE_FRAGMENT}
`;
export const CREATE_SPACE = gql `
  mutation CreateSpace($input: CreateSpaceInput!) {
    addSpace(input: $input) {
      ...SpaceFragment
      private
      hidden
      inviteOnly
      nonAdminsCanInvite
    }
  }
  ${SPACE_FRAGMENT}
`;
export const UPDATE_SPACE = gql `
  mutation UpdateSpace($input: UpdateSpaceInput!, $id: ID!) {
    updateSpace(id: $id, input: $input) {
      ...SpaceFragment
      private
      hidden
      inviteOnly
      nonAdminsCanInvite
    }
  }
  ${SPACE_FRAGMENT}
`;
export const REMOVE_SPACE = gql `
  mutation RemoveSpace($spaceId: ID!) {
    removeSpace(spaceId: $spaceId) {
      status
    }
  }
`;
export const GET_SPACE_MEMBERSHIP_REQUESTS = gql `
  query getSpaceMembershipRequests(
    $spaceId: ID!
    $status: SpaceJoinRequestStatus
  ) {
    getSpaceMembershipRequests(spaceId: $spaceId, status: $status) {
      ...SpaceJoinRequestFragment
    }
  }
  ${SPACE_JOIN_REQUEST_FRAGMENT}
`;
export const UPDATE_SPACE_MEMBER_ROLE = gql `
  mutation updateSpaceMemberRole(
    $roleId: String!
    $memberId: ID!
    $spaceId: ID!
  ) {
    updateSpaceMemberRole(
      input: { roleId: $roleId }
      memberId: $memberId
      spaceId: $spaceId
    ) {
      status
      __typename
    }
  }
`;
export const JOIN_SPACE = gql `
  mutation joinSpace($spaceId: ID!) {
    joinSpace(spaceId: $spaceId) {
      status
      __typename
    }
  }
`;
export const LEAVE_SPACE = gql `
  mutation leaveSpace($spaceId: ID!) {
    leaveSpace(spaceId: $spaceId) {
      status
      __typename
    }
  }
`;
export const REQUEST_SPACE_MEMBERSHIP = gql `
  mutation requestSpaceMembership($spaceId: ID!) {
    requestSpaceMembership(spaceId: $spaceId) {
      ...SpaceJoinRequestFragment
    }
  }
  ${SPACE_JOIN_REQUEST_FRAGMENT}
`;
export const GET_SPACE_MEMBERSHIP_REQUEST_FOR_MEMBER = gql `
  query getSpaceMembershipRequestForMember($status: SpaceJoinRequestStatus!) {
    getSpaceMembershipRequestForMember(status: $status) {
      ...SpaceJoinRequestFragment
    }
  }
  ${SPACE_JOIN_REQUEST_FRAGMENT}
`;
export const APPROVE_SPACE_JOIN_REQUEST = gql `
  mutation approveSpaceJoinRequest($spaceId: ID!, $spaceJoinRequestId: ID!) {
    approveSpaceJoinRequest(
      spaceId: $spaceId
      spaceJoinRequestId: $spaceJoinRequestId
    ) {
      __typename
      status
    }
  }
`;
export const DECLINE_SPACE_JOIN_REQUEST = gql `
  mutation declineSpaceJoinRequest($spaceId: ID!, $spaceJoinRequestId: ID!) {
    declineSpaceJoinRequest(
      spaceId: $spaceId
      spaceJoinRequestId: $spaceJoinRequestId
    ) {
      __typename
      status
    }
  }
`;
//# sourceMappingURL=spaces.gql.js.map