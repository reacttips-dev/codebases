import gql from 'graphql-tag';
import {commentFields, serviceFields} from '../shared/fragments';

export const decisionFragment = gql`
  fragment decision on StackDecision {
    id
    deleted
    rootComments {
      id
      content
      replies {
        id
      }
    }
    commentsCount
  }
`;

export const decisionItem = gql`
  fragment decisionItem on StackDecision {
    id
    htmlContent
    rawContent
    publishedAt
    viewCount
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
    }
    topics {
      name
    }
    services {
      ...serviceFields
    }
  }
  ${serviceFields}
`;

export const commentItem = gql`
  fragment commentItem on Comment {
    ...commentFields
    replies {
      ...commentFields
      parentId
    }
  }
  ${commentFields}
`;
