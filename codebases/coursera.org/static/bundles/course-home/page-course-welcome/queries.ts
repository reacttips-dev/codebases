import gql from 'graphql-tag';

export const courseGradesAndProgressesQuery = gql`
  query courseGradesAndProgressesQuery($ids: String!) {
    GuidedCourseSessionProgressesV1 @naptime {
      multiGet(ids: $ids) {
        elements {
          id
          startedAt
          endedAt
          weeks
          courseProgressState
        }
      }
    }
  }
`;

export const courseNextStepQuery = gql`
  query courseNextStep($ids: String!) {
    GuidedCourseNextStepsV1 @naptime {
      multiGet(ids: $ids) {
        elements {
          id
          nextStep
        }
      }
    }
  }
`;
