// Render-props component that store state of CA step in Apollo store and provides function to
// update it.
// Calls child function with the object with following fields:
// * stepState: current step state. This is an object `isSubmitting` and `isSaving` boolean
// properties. New props will be added in the future.
// * setStepState: function to update step. Works similar to `setState`, you can pass an object
// with supported state fields and it will be merged with existing state. For example,
// `setStepState({ isSaving: true })` will update isSaving and keep isSubmitting the same.
// It will find current Compound Assessment item by current userId, courseId and itemId.
// Example:
// <StepState stepId={stepId}>
//   {({ stepState, setStepState }) => (
//     <a onClick={() => setStepState({ isSubmitting: !stepState.isSubmitting })}>
//       { stepState.isSubmitting }
//     </a>
//   )}
// </StepState>
// It uses Apollo Cache to store data and GraphQL to access it.

import React from 'react';

import { Query } from 'react-apollo';

import { UserCourseItemIds, WithUserCourseItemIdsProps } from 'bundles/compound-assessments/lib/withUserCourseItemIds';

import LocalStateConsumer from '../LocalStateConsumer';
import { updateStepState } from './resolvers';
import { stepStateQuery } from './queries';

import { StepState as StepStateType, GetStepStateQueryResult, GetStepStateQueryVariables } from './types';

type RenderProps = {
  stepState: StepStateType;
  setStepState: (x0: Partial<StepStateType>) => void;
};

type Props = {
  stepId: string;
  courseId?: string;
  itemId?: string;
  userId?: number;
  children: (x0: RenderProps) => React.ReactNode;
};

const StepState = ({ children, stepId, courseId, userId, itemId }: Props) => (
  <UserCourseItemIds courseId={courseId} itemId={itemId} userId={userId}>
    {(ids: WithUserCourseItemIdsProps) => (
      <LocalStateConsumer>
        <Query<GetStepStateQueryResult, GetStepStateQueryVariables>
          query={stepStateQuery}
          variables={{ ...ids, stepId }}
        >
          {({ data, client, loading }) => {
            if (loading) {
              return null;
            }
            const stepState = (((data || {}).StepState || {}).get || {}).state || {};
            return children({
              stepState,
              setStepState: (newState) => updateStepState({ ...ids, stepId }, newState, client),
            });
          }}
        </Query>
      </LocalStateConsumer>
    )}
  </UserCourseItemIds>
);

const QUIZ_STEP_ID = 'QUIZ_STEP';
export const QuizStepState = (props: {
  children: (x0: RenderProps) => React.ReactNode;
  itemId: string;
  courseId: string;
}) => <StepState {...props} stepId={QUIZ_STEP_ID} />;

export default StepState;
