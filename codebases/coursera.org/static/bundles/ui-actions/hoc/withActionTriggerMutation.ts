import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

export default graphql(
  gql`
    mutation($traceId: ID, $body: DataMap) {
      action(body: $body, traceId: $traceId)
        @rest(
          type: "UiActionsV1"
          path: "uiActions.v1/?action=publishActionEvent&traceId={args.traceId}"
          method: "POST"
          bodyKey: "body"
        ) {
        auth
      }
    }
  `,
  {
    name: 'triggerAction',
  }
);
