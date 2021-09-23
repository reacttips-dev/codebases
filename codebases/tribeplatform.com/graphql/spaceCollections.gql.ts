import gql from 'graphql-tag';
import { MEDIA_FRAGMENT } from './media.gql';
import { BASIC_SPACE_FRAGMENT } from './spaces.gql';
export const SPACE_COLLECTION_FRAGMENT = gql `
  fragment SpaceCollectionFragment on Collection {
    ... on Collection {
      __typename
      id
      slug
      name
      description
      createdAt
    }
  }
`;
export const GET_SPACE_COLLECTIONS = gql `
  query getSpaceCollections {
    getGroups {
      ...SpaceCollectionFragment
      spaces(limit: 500) {
        totalCount
        edges {
          node {
            id
            name
            slug
            image {
              ...MediaFragment
            }
            banner {
              ...MediaFragment
            }
            hidden
            private
            description
            membersCount
            authMemberProps {
              membershipStatus
            }
            spaceType {
              availablePostTypes {
                name
                id
                pluralName
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${SPACE_COLLECTION_FRAGMENT}
`;
export const GET_SPACE_COLLECTION = gql `
  query getSpaceCollection($groupId: ID!) {
    getGroup(groupId: $groupId) {
      ...SpaceCollectionFragment
      spaces(limit: 500) {
        totalCount
        edges {
          node {
            ...BasicSpaceFragment
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${BASIC_SPACE_FRAGMENT}
  ${SPACE_COLLECTION_FRAGMENT}
`;
export const CREATE_SPACE_COLLECTION = gql `
  mutation createSpaceCollection($input: CreateCollectionInput!) {
    addGroup(input: $input) {
      ...SpaceCollectionFragment
    }
  }
  ${SPACE_COLLECTION_FRAGMENT}
`;
export const UPDATE_SPACE_COLLECTION = gql `
  mutation updateSpaceCollection(
    $input: UpdateCollectionInput!
    $groupId: ID!
  ) {
    updateGroup(groupId: $groupId, input: $input) {
      __typename
      status
    }
  }
`;
export const REMOVE_SPACE_COLLECTION = gql `
  mutation removeSpaceCollection($groupId: ID!) {
    removeGroup(groupId: $groupId) {
      __typename
      status
    }
  }
`;
export const ORGANIZE_SPACE_COLLECTION_SPACES = gql `
  mutation organizeSpaceCollectionSpaces(
    $spaceIds: [String!]!
    $groupId: String!
  ) {
    organizeGroupSpaces(groupId: $groupId, spaceIds: $spaceIds) {
      __typename
      status
    }
  }
`;
//# sourceMappingURL=spaceCollections.gql.js.map