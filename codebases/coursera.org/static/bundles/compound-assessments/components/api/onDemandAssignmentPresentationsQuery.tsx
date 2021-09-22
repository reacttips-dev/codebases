/* eslint-disable graphql/template-strings */

import gql from 'graphql-tag';

const onDemandAssignmentPresentationsFragments = gql`
  fragment GradeFragment on PresentationGrade {
    rawScore
    passingFraction
    maxScore
  }

  fragment ReviewPhaseFragment on Phase_reviewPhase {
    typeName
    definition {
      baseTaskId
      deadline

      # You need to comment this if you want to generate flow types from this query.
      # Then fix it manually.
      givenReviewTasks {
        reviewee
        revieweeProfile
        ...FormTaskFragment
      }
      receivedReviewCount
      requiredReviewsToGive
      requiredReviewsToReceive
      willBeStaffReviewed
      reviewsWillBeShownToLearner
      fulfilledGivenReviews
      fulfilledReceivedReviews
      canRequestAllocation
      isPendingAllocation
      givenReviewCount
    }
  }

  fragment FormTaskFragment on FormTask {
    taskIdHash
    validationErrors {
      ...ValidataionErrorsFragment
    }
    updatedAt
    submittedAt
    executionId
    versionedExecutionId
    possibleActions
    lastSubmittedAt
    proctoring {
      ...ProctoringFragment
    }
    availabilityWindow {
      startsAt
      endsAt
    }
    # You need to comment this if you want to generate flow types from this query, then fix it
    # manually. It has troubles with Naptime vs GraphQL unions.
    form
  }

  fragment ValidataionErrorsFragment on ResponseValidationWithId {
    id
    error {
      reason {
        ...ValidationErrorReasonFragment
      }
      debugMessage
    }
  }

  fragment ProctoringFragment on Proctoring {
    completedAttempts
    remainingAttempts
    remainingSubmissionsInAttempt
    attemptDeadline
    nextAttemptDuration
    needsDraftSubmission
    serverTimestamp
    secondsLeftInLatestAttempt
    nextAttemptSubmissionLimit
  }

  fragment ValidationErrorReasonFragment on ValidationErrorReason {
    ... on ValidationErrorReason_invalidCml {
      typeName
      definition
    }
    ... on ValidationErrorReason_tooLong {
      typeName
      definition
    }
    ... on ValidationErrorReason_generic {
      typeName
      definition
    }
    ... on ValidationErrorReason_invalidUrl {
      typeName
      definition
    }
    ... on ValidationErrorReason_empty {
      typeName
      definition
    }
    ... on ValidationErrorReason_missingReviewPart {
      typeName
      definition
    }
  }
`;

export const onDemandAssignmentPresentationsLearnerQuery = gql`
  query OnDemandAssignmentPresentationsLearnerQuery($userId: String!, $courseId: String!, $itemId: String!)
  @redirectToLogin {
    OnDemandAssignmentPresentationsV1 @naptime {
      learner(userId: $userId, courseId: $courseId, itemId: $itemId) {
        elements {
          id
          submissionStatus
          phases {
            ... on Phase_singleFormPhase {
              typeName
              definition {
                baseTaskId
                deadline
                relatedAsyncTasks

                task {
                  ...FormTaskFragment
                }
                fulfilled
              }
            }
            ... on Phase_reviewPhase {
              ...ReviewPhaseFragment
            }
          }
          teamId
          teamNeedsToBeAssigned
          groupNeedsToBeEnrolled
          assignmentVersionOutdated

          grade {
            ...GradeFragment
          }

          userId
          courseId
          itemId
        }
      }
    }
  }
  ${onDemandAssignmentPresentationsFragments}
`;

export const onDemandAssignmentPresentationsGraderQuery = gql`
  query OnDemandAssignmentPresentationsGraderQuery($userId: String!, $courseId: String!, $itemId: String!) {
    OnDemandAssignmentPresentationsV1 @naptime {
      grader(userId: $userId, courseId: $courseId, itemId: $itemId) {
        elements {
          submissionStatus
          phases {
            ... on Phase_singleFormPhase {
              typeName
              definition {
                baseTaskId
                deadline

                task {
                  ...FormTaskFragment
                }
                fulfilled
              }
            }
            ... on Phase_reviewPhase {
              ...ReviewPhaseFragment
            }
          }
          teamId
          teamNeedsToBeAssigned
          assignmentVersionOutdated

          grade {
            ...GradeFragment
          }

          userId
          courseId
          itemId
        }
      }
    }
  }
  ${onDemandAssignmentPresentationsFragments}
`;

export const onDemandAssignmentPresentationsExecutionQuery = gql`
  query OnDemandAssignmentPresentationsExecutionQuery(
    $userId: String!
    $courseId: String!
    $itemId: String!
    $executionId: String
  ) {
    OnDemandAssignmentPresentationsV1 @naptime {
      forExecution(userId: $userId, courseId: $courseId, itemId: $itemId, executionId: $executionId) {
        elements {
          submissionStatus
          phases {
            ... on Phase_singleFormPhase {
              typeName
              definition {
                baseTaskId
                deadline

                task {
                  ...FormTaskFragment
                }
                fulfilled
              }
            }
            ... on Phase_reviewPhase {
              ...ReviewPhaseFragment
            }
          }
          teamId
          teamNeedsToBeAssigned
          assignmentVersionOutdated

          grade {
            ...GradeFragment
          }

          userId
          courseId
          itemId
        }
      }
    }
  }
  ${onDemandAssignmentPresentationsFragments}
`;

export default onDemandAssignmentPresentationsLearnerQuery;
