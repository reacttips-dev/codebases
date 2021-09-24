import gql from 'graphql-tag';

export const toggleBookmark = gql`
  mutation toggleBookmark($id: ID!, $bookmark: Boolean!) {
    toggleBookmark(id: $id, type: "CompanyJob", bookmark: $bookmark) {
      ... on Job {
        __typename
      }
    }
  }
`;

export const saveJobSearch = gql`
  mutation saveJobSearch(
    $toolSlugs: [String!]!
    $companySlugs: [String!]!
    $keywords: [String!]!
    $location: String!
    $latitude: Float
    $longitude: Float
    $emailEnabled: Boolean!
  ) {
    saveJobSearch(
      toolSlugs: $toolSlugs
      companySlugs: $companySlugs
      keywords: $keywords
      location: $location
      latitude: $latitude
      longitude: $longitude
      emailEnabled: $emailEnabled
    ) {
      __typename
    }
  }
`;

export const updateEmailSettings = gql`
  mutation saveJobSearch($emailEnabled: Boolean!) {
    saveJobSearch(emailEnabled: $emailEnabled) {
      __typename
    }
  }
`;

export const destroyJobSearch = gql`
  mutation {
    destroyJobSearch
  }
`;
