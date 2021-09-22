import gql from 'graphql-tag';

export default gql`
  mutation($id: String!, $body: String!) {
    action(id: $id, body: $body, input: null)
      @rest(
        type: "ForumQuestionVotes"
        path: "onDemandCourseForumQuestionVotes.v1/{args.id}"
        method: "PUT"
        bodyKey: "body"
      ) {
      NoResponse
    }
  }
`;
