import gql from 'graphql-tag';

export const serviceFields = gql`
  fragment serviceFields on Tool {
    id
    name
    slug
    title
    verified
    imageUrl
    canonicalUrl
    path
    votes
    fans
    stacks
    following
    followContext
  }
`;

export const commentFields = gql`
  fragment commentFields on Comment {
    id
    content
    postedAt
    upvoted
    flagged
    upvotesCount
    parentId
    user {
      id
      path
      imageUrl
      displayName
    }
  }
`;

export const stackFields = gql`
  fragment stackFields on Stack {
    id
    imageUrl
    name
    identifier
    path
    private
    owner {
      ... on User {
        id
        imageUrl
        username
      }
      ... on Company {
        id
        imageUrl
        slug
        name
      }
    }
  }
`;

export const stackDecisionFields = gql`
  fragment stackDecisionFields on StackDecision {
    id
    publicId
    htmlContent
    rawContent
    publishedAt
    commentsCount
    private
    upvotesCount
    upvoted
    flagged
    bookmarked
    viewCount
    draft
    createdAt
    decisionType
    private
    permissions {
      edit
      delete
    }
    subjectTools {
      ...serviceFields
    }
    fromTools {
      ...serviceFields
    }
    toTools {
      ...serviceFields
    }
    deleted @client
    link {
      url
      title
      imageUrl
    }
    company {
      id
      path
      imageUrl
      name
      slug
    }
    topics {
      name
    }
    services {
      ...serviceFields
    }
    user {
      id
      username
      path
      imageUrl
      displayName
      title
      companyName
    }
    rootComments {
      ...commentFields
      replies {
        ...commentFields
        parentId
      }
    }
  }
  ${commentFields}
  ${serviceFields}
`;

export const stackDecisionAnswerFields = gql`
  fragment stackDecisionAnswerFields on StackDecision {
    id
    permissions {
      edit
      delete
    }
    publicId
    htmlContent
    rawContent
    publishedAt
    private
    commentsCount
    upvotesCount
    upvoted
    flagged
    bookmarked
    viewCount
    draft
    createdAt
    decisionType
    private
    answers(first: 2) {
      count
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
    subjectTools {
      ...serviceFields
    }
    fromTools {
      ...serviceFields
    }
    toTools {
      ...serviceFields
    }
    deleted @client
    link {
      url
      title
      imageUrl
    }
    company {
      id
      path
      imageUrl
      name
      slug
      features {
        slug
      }
    }
    stack {
      ...stackFields
    }
    topics {
      name
    }
    services {
      ...serviceFields
    }
    user {
      id
      username
      path
      imageUrl
      displayName
      title
      companyName
    }
    rootComments {
      ...commentFields
      replies {
        ...commentFields
        parentId
      }
    }
  }
  ${stackFields}
  ${commentFields}
  ${serviceFields}
  ${stackDecisionFields}
`;

export const userFields = gql`
  fragment userFields on User {
    id
    displayName
    imageUrl
    title
    popularity
    path
    stacksCount
    favoritesCount
    votesCount
  }
`;

export const reasonFields = gql`
  fragment reasonFields on Reason {
    id
    upvoted
    upvotesCount
    text
  }
`;

export const adviceAnswers = gql`
  fragment adviceAnswers on StackDecision {
    id
    answers(first: 2) {
      count
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
  ${stackDecisionFields}
`;
