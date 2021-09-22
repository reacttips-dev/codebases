import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import redirect from 'js/lib/coursera.redirect';

import type { PartnerLearnerImpersonationSession } from 'bundles/course-staff-impersonation/utils/types';

type Props = {
  actAsLearnerSession: PartnerLearnerImpersonationSession;
  children: ({ terminateSession }: { terminateSession: () => Promise<void> }) => React.ReactNode;
};

/* eslint-disable graphql/template-strings */
const terminateSessionMutation = gql`
  mutation PartnerLearnerImpersonationTerminateSessionMutation($input: DataMap!) {
    terminateSession(input: $input)
      @rest(type: "PartnerLearnerImpersonation", path: "partnerLearnerImpersonation/terminateSession", method: "POST") {
      msg
    }
  }
`;
/* eslint-enable */

const WithTerminateSessionMutation = ({ children, actAsLearnerSession }: Props) => (
  <Mutation mutation={terminateSessionMutation} variables={{ input: {} }}>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    {(terminateSession: () => Promise<any>) => {
      const handleTerminateSession = () =>
        terminateSession().then(() => redirect.setLocation(actAsLearnerSession.returnUrl));
      return children({ terminateSession: handleTerminateSession });
    }}
  </Mutation>
);

export default WithTerminateSessionMutation;
