import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const withUpdateGoalMutation = graphql(
  gql`
    mutation($userId: String!, $body: DataMap) {
      action(body: $body, userId: $userId)
        @rest(
          type: "LearnerGoalsV1"
          path: "learnerGoals.v1/?action=updateGoal&userId={args.userId}"
          method: "POST"
          bodyKey: "body"
        ) {
        id
        name
      }
    }
  `,
  { name: 'updateGoal' }
);

export default withUpdateGoalMutation;
