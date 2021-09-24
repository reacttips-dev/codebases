import gql from 'graphql-tag';
import {stackDecisionAnswerFields} from '../shared/fragments';

export const trackViews = gql`
  mutation trackViews($decisionIds: [ID!]!, $clientContext: String) {
    trackViews(decisionIds: $decisionIds, clientContext: $clientContext)
  }
`;

export const trackAdClick = gql`
  mutation trackClick($eventType: String!, $eventPayload: Hash!) {
    trackClick(eventType: $eventType, eventPayload: $eventPayload)
  }
`;

export const toggleUpvote = gql`
  mutation toggleUpvote($id: ID!, $type: String!, $upvote: Boolean!) {
    toggleUpvote(id: $id, type: $type, upvote: $upvote) {
      ... on StackDecision {
        id
        upvoted
        upvotesCount
      }
      ... on Comment {
        id
        upvoted
        upvotesCount
      }
      ... on Reason {
        id
        upvoted
        upvotesCount
      }
    }
  }
`;

export const addToolToStack = gql`
  mutation addToolToStack($id: ID!, $stackId: ID!) {
    addToolToStack(id: $id, stackId: $stackId) {
      id
    }
  }
`;

export const createVendorLead = gql`
  mutation createVendorLead(
    $toolId: ID!
    $firstName: String!
    $lastName: String!
    $email: String!
    $companyName: String
    $phone: String
    $message: String
  ) {
    createVendorLead(
      toolId: $toolId
      firstName: $firstName
      lastName: $lastName
      email: $email
      companyName: $companyName
      phone: $phone
      message: $message
    )
  }
`;

export const createReason = gql`
  mutation createReason($slug: String!, $text: String!, $con: Boolean!) {
    createReason(slug: $slug, text: $text, con: $con) {
      id
    }
  }
`;

export const setPromptInteracted = gql`
  mutation setPromptInteracted {
    setPromptInteracted {
      id
    }
  }
`;

export const upsertStructuredDecision = gql`
  mutation upsertStructuredDecision(
    $companyId: ID
    $rawContent: String!
    $stackDecisionId: ID
    $linkUrl: String
    $stackIdentifier: String
    $migration: MigrationDecisionStructureInput
    $protip: SimpleDecisionStructureInput
    $tool: ToolDecisionStructureInput
    $getAdvice: SimpleDecisionStructureInput
    $giveAdvice: GiveAdviceDecisionStructureInput
    $freeform: FreeformDecisionStructureInput
    $private: Boolean!
  ) {
    upsertStructuredDecision(
      companyId: $companyId
      rawContent: $rawContent
      stackDecisionId: $stackDecisionId
      linkUrl: $linkUrl
      stackIdentifier: $stackIdentifier
      migration: $migration
      protip: $protip
      tool: $tool
      getAdvice: $getAdvice
      giveAdvice: $giveAdvice
      freeform: $freeform
      private: $private
    ) {
      ...stackDecisionAnswerFields
    }
  }
  ${stackDecisionAnswerFields}
`;

export const skipForceVcsConnection = gql`
  mutation skipForceVcsConnection {
    skipForceVcsConnection
  }
`;
