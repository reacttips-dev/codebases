import gql from 'graphql-tag';

/* eslint-disable graphql/template-strings */
export const stepStateFragment = gql`
  fragment StepStateFragment on LocalStepState {
    id
    state {
      isSaving
      isAutoSaving
      isSubmitting
      showSubmitSuccessModal
      showValidation
      isDeadlineExpired
      errorCode
    }
  }
`;

export const stepStateQuery = gql`
  query GetStepStateQuery($stepId: String!, $itemId: String!, $courseId: String!, $userId: String!) {
    StepState @client {
      get(stepId: $stepId, itemId: $itemId, courseId: $courseId, userId: $userId) @client {
        ...StepStateFragment
      }
    }
  }
  ${stepStateFragment}
`;
/* eslint-enable graphql/template-strings */
