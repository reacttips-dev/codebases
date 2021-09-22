import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

/* eslint-disable graphql/template-strings */
const enableEditModeMutation = gql`
  mutation PartnerLearnerImpersonationEnableEditModeMutation($courseId: String!, $input: DataMap!) {
    enableEditMode(courseId: $courseId, input: $input)
      @rest(
        type: "PartnerLearnerImpersonation"
        path: "partnerLearnerImpersonation/enableEditMode/{args.courseId}"
        method: "POST"
      ) {
      msg
    }
  }
`;
/* eslint-enable */

const withEnableEditModeMutation = graphql(enableEditModeMutation, { name: 'enableEditMode' });

export default withEnableEditModeMutation;
