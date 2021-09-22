import gql from 'graphql-tag';

export const LearnerCourseScheduleSuggestionsQuery = gql`
  query LearnerCourseScheduleSuggestionsQuery($id: String!) {
    LearnerCourseScheduleSuggestionsV1Resource(id: $id)
      @rest(
        type: "LearnerCourseScheduleSuggestionsV1Resource"
        path: "learnerCourseScheduleSuggestions.v1/{args.id}"
        method: "GET"
      ) {
      elements @type(name: "LearnerCourseScheduleSuggestion") {
        suggestions
      }
    }
  }
`;

export const LearnerCourseScheduleRunningAndUpcomingQuery = gql`
  query LearnerCourseScheduleRunningAndUpcomingQuery($id: String!, $userId: String!) {
    OnDemandLearnerSessionsV1Resource {
      runningAndUpcoming(courseIds: [$id], learnerId: $userId, limit: 16) {
        elements {
          id
          startsAt
          endsAt
          enrollmentEndsAt
          enrollmentStartsAt
          isActiveEnrollment
          isEnrollableNow
          sessionSwitch {
            canSwitch
            isRecommendedSwitch
            changesDescription {
              ... on OnDemandLearnerSessionsV1_cmlMember {
                cml {
                  dtdId
                  value
                }
              }
            }
          }
          isEnrolled
        }
      }
    }
  }
`;

export default {
  LearnerCourseScheduleSuggestionsQuery,
  LearnerCourseScheduleRunningAndUpcomingQuery,
};
