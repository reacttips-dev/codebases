import gql from 'graphql-tag';
export const TAG_FRAGMENT = gql `
  fragment TagFragment on Tag {
    ... on Tag {
      description
      id
      slug
      title
    }
  }
`;
export const GET_SPACE_TOPICS = gql `
  query getSpaceTopics($limit: Int!, $spaceId: ID!, $query: String) {
    getSpaceTopics(limit: $limit, spaceId: $spaceId, query: $query) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          ...TagFragment
        }
      }
    }
  }
  ${TAG_FRAGMENT}
`;
export const UPDATE_SPACE_HIGHLIGHTED_TOPICS = gql `
  mutation updateSpaceHighlightedTopics(
    $input: UpdateHighlightedTags!
    $spaceId: ID!
  ) {
    updateSpaceHighlightedTopics(input: $input, spaceId: $spaceId) {
      status
    }
  }
`;
export const UPDATE_SPACE_HIGHLIGHTED_TAGS = gql `
  mutation updateSpaceHighlightedTags(
    $input: UpdateHighlightedTags!
    $spaceId: ID!
  ) {
    updateSpaceHighlightedTags(input: $input, spaceId: $spaceId) {
      status
    }
  }
`;
//# sourceMappingURL=tags.gql.js.map