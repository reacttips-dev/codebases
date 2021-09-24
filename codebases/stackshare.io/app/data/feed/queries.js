import gql from 'graphql-tag';
import {serviceFields, stackDecisionAnswerFields, stackDecisionFields} from '../shared/fragments';

export const onboardingChecklist = gql`
  query {
    onboardingChecklist {
      completed
      dismissed
      items {
        slug
        completed
      }
    }
  }
`;

export const trendingTools = gql`
  query trendingTools {
    trendingTools(first: 25) {
      edges {
        node {
          id
          name
          imageUrl
          canonicalUrl
          following
          followContext
        }
      }
    }
  }
`;

export const tools = gql`
  query tools($keyword: String) {
    tools(keyword: $keyword) {
      count
      edges {
        node {
          id
          name
          imageUrl
          canonicalUrl
          following
          followContext
        }
      }
    }
  }
`;

export const followedTools = gql`
  query followedTools {
    tools(keyword: "") {
      count
      edges {
        node {
          id
          name
          imageUrl
          canonicalUrl
          following
          followContext
        }
      }
    }
  }
`;

export const feedContext = gql`
  query feedContext($objectType: String!, $objectSlug: String!) {
    objectInfo(objectType: $objectType, objectSlug: $objectSlug) {
      ... on Company {
        id
        name
        features {
          slug
        }
        __typename
        imageUrl
        canonicalUrl
        path
        tags {
          id
          name
        }
      }
      ... on User {
        id
        displayName
        __typename
        imageUrl
        path
        title
        companyName
      }
      ... on Tool {
        id
        name
        __typename
        imageUrl
        canonicalUrl
        following
        category {
          name
          slug
        }
        layer {
          name
          slug
        }
        function {
          name
          slug
        }
      }
      ... on Layer {
        id
        name
        __typename
      }
      ... on Function {
        id
        name
        __typename
      }
      ... on Category {
        id
        name
        __typename
      }
    }
  }
`;

export const items = gql`
  query items(
    $limit: Int
    $offset: Int
    $feedType: String!
    $typeSlug: String
    $stackupSlug: String
    $itemType: String
  ) {
    feed(
      limit: $limit
      offset: $offset
      feedType: $feedType
      typeSlug: $typeSlug
      stackupSlug: $stackupSlug
      itemType: $itemType
    ) {
      edges {
        node {
          id
          streamId
          object {
            ... on Article {
              id
              title
              description
              outboundUrl
              createdAt
              importSource
              discussionScore
              discussionSourceUrl
              flagged
              services {
                ...serviceFields
              }
              owner {
                ... on Tool {
                  name
                  imageUrl
                  canonicalUrl
                }
                ... on Company {
                  name
                  imageUrl
                  canonicalUrl
                }
              }
            }
            ... on FeaturedPost {
              id
              author {
                ... on User {
                  displayName
                  path
                }
                ... on Company {
                  displayName
                  path
                }
              }
              title
              description
              imageUrl
              views
              path
              relevanceStrength
              promoted
              services {
                ...serviceFields
              }
            }
            ... on StackDecision {
              ...stackDecisionAnswerFields
            }
            ... on Stackup {
              id
              title
              path
              function
              services {
                ...serviceFields
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
  ${stackDecisionAnswerFields}
  ${serviceFields}
`;

export const companyDecisions = gql`
  query companyDecisions($id: ID!, $first: Int, $after: String) {
    company(id: $id) {
      stackDecisions(first: $first, after: $after) {
        edges {
          node {
            ...stackDecisionAnswerFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${stackDecisionAnswerFields}
`;

export const privateFeed = gql`
  query privateFeed($first: Int, $after: String, $feedType: String) {
    privateFeed(first: $first, after: $after, feedType: $feedType) {
      edges {
        node {
          ...stackDecisionAnswerFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${stackDecisionAnswerFields}
`;

export const toolDecisions = gql`
  query toolDecisions($id: ID!, $first: Int, $after: String) {
    tool(id: $id) {
      stackDecisions(first: $first, after: $after) {
        edges {
          node {
            ...stackDecisionAnswerFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${stackDecisionAnswerFields}
`;

export const userDecisions = gql`
  query userDecisions($id: ID!, $first: Int, $after: String) {
    user(id: $id) {
      stackDecisions(first: $first, after: $after) {
        edges {
          node {
            ...stackDecisionAnswerFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${stackDecisionAnswerFields}
`;

export const myDecisions = gql`
  query userDecisions($id: ID!, $first: Int, $after: String) {
    user(id: $id) {
      myDecisions(first: $first, after: $after) {
        edges {
          node {
            ...stackDecisionAnswerFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${stackDecisionAnswerFields}
`;

export const topicSearch = gql`
  query topicSearch($keyword: String) {
    topicSearch(keyword: $keyword) @client {
      id
      name
      display
      title
    }
  }
`;

export const companySearch = gql`
  query companySearch($keyword: String) {
    companySearch(keyword: $keyword) @client {
      id
      name
      imageUrl
    }
  }
`;

export const popularDecisionsQuery = gql`
  query popularDecisions {
    stackDecisions(first: 3) {
      edges {
        node {
          id
          htmlContent
          services {
            id
            name
            imageUrl
          }
          topics {
            id
            name
          }
        }
      }
    }
  }
`;

export const decisionQuery = gql`
  query stackDecision($id: ID!) {
    stackDecision(id: $id) {
      ...stackDecisionAnswerFields
      parent {
        ...stackDecisionAnswerFields
      }
    }
  }
  ${stackDecisionAnswerFields}
`;

export const leaderboards = gql`
  query leaderboards {
    leaderboards {
      name
      items {
        decisionsCount
        rank
        ... on Company {
          slug
          name
          path
          imageUrl
        }
        ... on Tool {
          name
          slug
          imageUrl
        }
        ... on User {
          username
          displayName
          imageUrl
          title
          companyName
        }
      }
    }
  }
`;

export const answersQuery = gql`
  query answersQuery($id: ID!) {
    stackDecision(id: $id) {
      ...stackDecisionFields
      answers(first: 100) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ...stackDecisionFields
          }
        }
      }
    }
  }
  ${stackDecisionFields}
`;
