/* eslint-disable graphql/template-strings */
import waitForGraphQL from 'js/lib/waitForGraphQL';
import user from 'js/lib/user';
import gql from 'graphql-tag';

import type {
  ProgramMembershipsV2ByUserQueryVariables,
  ProgramMembershipsV2ByUserQuery,
} from 'bundles/naptimejs/resources/__generated__/ProgramMembershipsV2';
import type { Namespaces } from 'bundles/epic/client';
import epic from 'bundles/epic/client';

const programMembershipsV2Query = gql`
  query ProgramMembershipsV2Query($userId: String!) {
    ProgramMembershipsV2 @naptime {
      byUser(userId: $userId, includes: "enterprisePrograms") {
        elements {
          id
          programId
        }
        linked {
          enterpriseProgramsV1 {
            id
            thirdPartyOrganizationId
          }
        }
      }
    }
  }
`;

export type PropsFromGraphql = {
  isEpicEnabledForUser?: boolean;
};

/**
 * HOC for checking if a user's enterprise organization is part of an epic organization list
 * epic must return an array of organization ids
 * contact "@carlchen" on slack if you are trying to use multiple organization id based Epic in the same component
 * @param namespace Epic namespace
 * @param key Epic key
 */
const withUserOrganizationInEpic = <Props>() => <NS extends keyof Namespaces, Key extends keyof Namespaces[NS]>(
  namespace: NS,
  key: Key
) => {
  const epicOrganizationIds = (epic.get(namespace, key) as unknown) as string[];
  return waitForGraphQL<
    Props,
    ProgramMembershipsV2ByUserQuery,
    ProgramMembershipsV2ByUserQueryVariables,
    PropsFromGraphql
  >(programMembershipsV2Query, {
    options: { variables: { userId: String(user.get().id) } },
    props: ({ data, ownProps }) => {
      return {
        ...ownProps,
        isEpicEnabledForUser:
          data?.ProgramMembershipsV2?.byUser?.linked?.enterpriseProgramsV1
            ?.map((it) => it?.thirdPartyOrganizationId)
            .filter(Boolean)
            .some((organizationId) => epicOrganizationIds.includes(organizationId)) || false,
      };
    },
  });
};

export default withUserOrganizationInEpic;
