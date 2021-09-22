// Component to fetch data for Compound Assessments via `onDemandAssignmentPresentations.v1`
// `learner` finder.
// Uses GraphQL + Naptime to fetch it. This is render-props component, the first argument of
// `children` is the resulting assignment. It gets `courseId`, `userId` and `itemId` itself
// but you can pass them as props.
import React from 'react';

import { Query } from 'react-apollo';

import withUserCourseItemIds from 'bundles/compound-assessments/lib/withUserCourseItemIds';

import type { QueryResult } from 'react-apollo';
import type { WithUserCourseItemIdsProps } from 'bundles/compound-assessments/lib/withUserCourseItemIds';

import type { FormElementNodeWithId } from 'bundles/compound-assessments/components/api/types/CompoundAssessmentsForm';

import {
  onDemandAssignmentPresentationsLearnerQuery,
  onDemandAssignmentPresentationsGraderQuery,
  onDemandAssignmentPresentationsExecutionQuery,
} from './onDemandAssignmentPresentationsQuery';

import type {
  OnDemandAssignmentPresentationsQuery as Data,
  OnDemandAssignmentPresentationsQueryVariables as Variables,
  OnDemandAssignmentPresentationsQuery_OnDemandAssignmentPresentationsV1_learner_elements as AssignmentPresentationType,
  OnDemandAssignmentPresentationsQuery_OnDemandAssignmentPresentationsV1_learner_elements_phases as Phase,
  OnDemandAssignmentPresentationsQuery_OnDemandAssignmentPresentationsV1_learner_elements_singleFormPhase as SingleFormPhase,
  OnDemandAssignmentPresentationsQuery_OnDemandAssignmentPresentationsV1_learner_elements_reviewPhase as ReviewPhase,
} from './types/OnDemandAssignmentPresentationsQuery';

export type {
  AssignmentPresentationType as AssignmentPresentation,
  Phase,
  SingleFormPhase,
  ReviewPhase,
  FormElementNodeWithId as FormPart,
};

export type AssignmentPresentationRenderProps = (
  assignment?: AssignmentPresentationType,
  response?: QueryResult<Data, Variables>
) => React.ReactNode;

type Props = {
  children: AssignmentPresentationRenderProps;
};

type ForExecutionProps = {
  skip?: boolean;
  executionId: string;
};

export const AssignmentPresentationLearner = ({
  children,
  courseId,
  userId,
  itemId,
}: WithUserCourseItemIdsProps & Props) => (
  <Query<Data, Variables>
    query={onDemandAssignmentPresentationsLearnerQuery}
    variables={{ itemId, userId: userId.toString(), courseId }}
  >
    {(response) => {
      const assignment: AssignmentPresentationType | undefined =
        response?.data?.OnDemandAssignmentPresentationsV1?.learner?.elements?.[0];
      return children(assignment, response);
    }}
  </Query>
);

export const AssignmentPresentationGrader = ({
  children,
  courseId,
  userId,
  itemId,
}: WithUserCourseItemIdsProps & Props) => (
  <Query<Data, Variables>
    query={onDemandAssignmentPresentationsGraderQuery}
    variables={{ itemId, userId: userId.toString(), courseId }}
    fetchPolicy="network-only"
  >
    {(response) => {
      const assignment = !response?.loading
        ? response?.data?.OnDemandAssignmentPresentationsV1?.grader?.elements?.[0]
        : undefined;
      return children(assignment, response);
    }}
  </Query>
);

const parseForExecutionResponseData = (data?: Data) =>
  data?.OnDemandAssignmentPresentationsV1?.forExecution?.elements?.[0];

export const AssignmentPresentationForExecution = ({
  children,
  courseId,
  userId,
  itemId,
  executionId,
  skip,
}: WithUserCourseItemIdsProps & Props & ForExecutionProps) => {
  return (
    <Query<Data, Variables>
      skip={skip}
      query={onDemandAssignmentPresentationsExecutionQuery}
      variables={{ itemId, userId: userId.toString(), courseId, executionId }}
    >
      {(response) => {
        const assignment = !response?.loading ? parseForExecutionResponseData(response?.data) : undefined;

        return children(assignment, response);
      }}
    </Query>
  );
};

export const AssignmentPresentationLearnerWithUserCourseItemIds = withUserCourseItemIds(AssignmentPresentationLearner);

export default AssignmentPresentationLearnerWithUserCourseItemIds;
