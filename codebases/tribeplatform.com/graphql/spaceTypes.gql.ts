import gql from 'graphql-tag';
export const POST_TYPE_FRAGMENT = gql `
  fragment PostTypeFields on PostType {
    __typename
    context
    id
    name
    pluralName
    postTypeTemplateId
    createdAt
    primaryReactionType
    singleChoiceReactions
    updatedAt
    validReplyTypes {
      __typename
      id
      name
      pluralName
      validReplyTypes {
        __typename
        id
        name
        pluralName
      }
    }
  }
`;
export const SPACE_TYPE_FRAGMENT = gql `
  fragment SpaceTypeFields on SpaceType {
    __typename
    id
    name
    availablePostTypes {
      ...PostTypeFields
    }
  }
  ${POST_TYPE_FRAGMENT}
`;
export const GET_SPACE_TYPES = gql `
  query getSpaceTypes($limit: Int!) {
    getSpaceTypes(limit: $limit) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          ...SpaceTypeFields
        }
      }
    }
  }
  ${SPACE_TYPE_FRAGMENT}
`;
//# sourceMappingURL=spaceTypes.gql.js.map