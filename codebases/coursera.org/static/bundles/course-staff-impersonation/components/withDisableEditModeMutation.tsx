import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

/* eslint-disable graphql/template-strings */
const disableEditModeMutation = gql`
  mutation PartnerLearnerImpersonationDisableEditModeMutation($input: DataMap!) {
    disableEditMode(input: $input)
      @rest(type: "PartnerLearnerImpersonation", path: "partnerLearnerImpersonation/disableEditMode", method: "POST") {
      msg
    }
  }
`;
/* eslint-enable */

const withDisableEditModeMutation = graphql(disableEditModeMutation, { name: 'disableEditMode' });

export default withDisableEditModeMutation;
