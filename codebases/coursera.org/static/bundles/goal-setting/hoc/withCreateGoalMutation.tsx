import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const withCreateGoalMutation = graphql(
  gql`
    mutation($body: DataMap) {
      action(body: $body)
        @rest(
          type: "LearnerGoalsV1"
          path: "learnerGoals.v1/?action=createFromChoice"
          method: "POST"
          bodyKey: "body"
        ) {
        id
        name
      }
    }
  `,
  { name: 'createGoal' }
);

export default withCreateGoalMutation;
