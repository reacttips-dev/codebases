import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose, branch, mapProps, withProps } from 'recompose';
import cookie from 'js/lib/cookie';
import waitFor from 'js/lib/waitFor';

import type { PartnerLearnerImpersonationSession } from 'bundles/course-staff-impersonation/utils/types';

export type PartnerLearnerImpersonationSessionQueryData = {
  data: { loading: boolean; session: PartnerLearnerImpersonationSession | null };
};

export type ActAsLearnerSessionProps = {
  actAsLearnerSession: PartnerLearnerImpersonationSession | null;
};

/* eslint-disable graphql/template-strings */
const partnerLearnerImpersonationSessionQuery = gql`
  query PartnerLearnerImpersonationSessionQuery {
    session @rest(type: "PartnerLearnerImpersonationSession", path: "partnerLearnerImpersonation", method: "GET") {
      impersonator
      actsAs
      contexts
      startsAt
      expiresAt
      returnUrl
      redirectUrl
      unauthorizedUrl
      routes
      editMode
    }
  }
`;
/* eslint-enable */

// TODO (kuan): use a generic type to represent passthrough props (i.e. <P extends {}>)
export default branch<{}>(
  () => !!cookie.get('PLIS_ID') && !!cookie.get('PLIS'),
  compose<ActAsLearnerSessionProps, {}>(
    graphql<{}, {}, {}, PartnerLearnerImpersonationSessionQueryData>(partnerLearnerImpersonationSessionQuery),
    waitFor<PartnerLearnerImpersonationSessionQueryData>(({ data }) => !data.loading),
    mapProps<ActAsLearnerSessionProps, PartnerLearnerImpersonationSessionQueryData>(({ data, ...props }) => ({
      actAsLearnerSession: data.session,
      ...props,
    }))
  ),
  // @ts-ignore
  withProps<ActAsLearnerSessionProps, {}>({ actAsLearnerSession: null })
);
