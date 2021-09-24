import gql from 'graphql-tag';
import {commentFields, serviceFields, stackDecisionAnswerFields} from '../shared/fragments';

export const dismissOnboardingChecklist = gql`
  mutation dismissOnboardingChecklist {
    dismissOnboardingChecklist
  }
`;

export const subscribeDigest = gql`
  mutation subscribeDigest($settings: EmailSettingsInput!) {
    updateUser(emailSettings: $settings) {
      __typename
    }
  }
`;

export const updateService = gql`
  mutation updateService($serviceId: ID!, $following: Boolean!) {
    updateService(id: $serviceId, following: $following) {
      id
      following
    }
  }
`;

export const toggleBookmark = gql`
  mutation toggleBookmark($id: ID!, $type: String!, $bookmark: Boolean!) {
    toggleBookmark(id: $id, type: $type, bookmark: $bookmark) {
      ... on StackDecision {
        id
        bookmarked
      }
    }
  }
`;

export const toggleFlag = gql`
  mutation toggleFlag($id: ID!, $type: String!, $flag: Boolean!) {
    toggleFlag(id: $id, type: $type, flag: $flag) {
      ... on StackDecision {
        id
        flagged
      }
      ... on Comment {
        id
        flagged
      }
      ... on Article {
        id
        flagged
      }
    }
  }
`;

export const destroyStackDecision = gql`
  mutation destroyStackDecision($id: ID!) {
    destroyStackDecision(id: $id) {
      id
    }
  }
`;

export const destroyComment = gql`
  mutation destroyComment($id: ID!) {
    destroyComment(id: $id) {
      id
      commentableId
      commentableType
      parentId
    }
  }
`;

export const updateComment = gql`
  mutation updateComment($id: ID!, $content: String!) {
    updateComment(id: $id, content: $content) {
      ...commentFields
      replies {
        ...commentFields
      }
    }
  }
  ${commentFields}
`;

export const createComment = gql`
  mutation createComment(
    $content: String!
    $commentableId: ID!
    $commentableType: String!
    $parentId: ID
  ) {
    createComment(
      content: $content
      commentableId: $commentableId
      commentableType: $commentableType
      parentId: $parentId
    ) {
      ...commentFields
      replies {
        ...commentFields
      }
    }
  }
  ${commentFields}
`;

export const createStackDecision = gql`
  mutation upsertStackDecision(
    $companyId: ID
    $rawContent: String!
    $linkUrl: String
    $stackIdentifier: String
  ) {
    upsertStackDecision(
      companyId: $companyId
      rawContent: $rawContent
      linkUrl: $linkUrl
      stackIdentifier: $stackIdentifier
    ) {
      ...stackDecisionAnswerFields
    }
  }
  ${stackDecisionAnswerFields}
`;

export const updateStackDecision = gql`
  mutation upsertStackDecision(
    $companyId: ID
    $rawContent: String!
    $linkUrl: String
    $stackDecisionId: ID
  ) {
    upsertStackDecision(
      companyId: $companyId
      rawContent: $rawContent
      linkUrl: $linkUrl
      stackDecisionId: $stackDecisionId
    ) {
      id
      draft
      rawContent
      htmlContent
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
  }
  ${serviceFields}
`;

export const trackViews = gql`
  mutation trackViews($decisionIds: [ID!]!, $clientContext: String) {
    trackViews(decisionIds: $decisionIds, clientContext: $clientContext)
  }
`;

export const setPromptInteracted = gql`
  mutation setPromptInteracted {
    setPromptInteracted {
      id
    }
  }
`;
