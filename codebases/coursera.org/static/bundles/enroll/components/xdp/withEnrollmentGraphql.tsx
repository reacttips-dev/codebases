import gql from 'graphql-tag';

import waitForGraphQL from 'js/lib/waitForGraphQL';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import user from 'js/lib/user';

import { SPECIALIZATION, VERIFIED_CERTIFICATE } from 'bundles/payments/common/ProductType';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import CourseraPlusEnrollmentChoices from 'bundles/enroll/utils/CourseraPlusEnrollmentChoices';
import type {
  EnrollmentAvailableChoicesV1GetQuery,
  EnrollmentAvailableChoicesV1GetQueryVariables,
} from 'bundles/naptimejs/resources/__generated__/EnrollmentAvailableChoicesV1';

type PropsToHOC = {
  isSpecialization?: boolean;
  s12nId?: string;
  courseId?: string;
};

type PropsFromQuery = {
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
};

export const EnrollmentAvailableChoicesQuery = gql`
  query EnrollmentAvailableChoicesQuery($id: String!) {
    EnrollmentAvailableChoicesV1 @naptime {
      get(id: $id, includeProgramInvitationCheck: true) {
        elements {
          id
          enrollmentChoiceReasonCode
          canEnrollThroughS12nSubscriptionFreeTrial
          enrollmentChoices {
            enrollmentChoiceType
            enrollmentChoiceData
          }
        }
      }
    }
  }
`;

const withEnrollmentGraphql = () => {
  return waitForGraphQL<
    PropsToHOC,
    EnrollmentAvailableChoicesV1GetQuery,
    EnrollmentAvailableChoicesV1GetQueryVariables,
    PropsFromQuery
  >(EnrollmentAvailableChoicesQuery, {
    skip: ({ isSpecialization, s12nId, courseId }: PropsToHOC) => {
      const productId = isSpecialization ? s12nId : courseId;

      return !user.isAuthenticatedUser() || !productId;
    },
    options: ({ isSpecialization, s12nId, courseId }: PropsToHOC) => {
      const productType = isSpecialization ? SPECIALIZATION : VERIFIED_CERTIFICATE;
      const productId = isSpecialization ? s12nId : courseId;

      return {
        variables: {
          id: tupleToStringKey([user.get()?.id, productType, productId || '']),
        },
      };
    },
    props: ({ data }) => {
      const enrollmentAvailableChoicesResponse = data?.EnrollmentAvailableChoicesV1?.get?.elements?.[0];

      return {
        enrollmentAvailableChoices: enrollmentAvailableChoicesResponse
          ? new EnrollmentAvailableChoicesV1(enrollmentAvailableChoicesResponse)
          : undefined,
        courseraPlusEnrollmentChoices: enrollmentAvailableChoicesResponse
          ? new CourseraPlusEnrollmentChoices(enrollmentAvailableChoicesResponse)
          : undefined,
      };
    },
  });
};

export default withEnrollmentGraphql;
