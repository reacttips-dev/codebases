import gql from 'graphql-tag';

import user from 'js/lib/user';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EnterpriseProgramsV1 from 'bundles/naptimejs/resources/enterprisePrograms.v1';

import { ProgramOptions } from 'bundles/page/common/types';

export const programAndDegreeMembershipQuery = gql`
  query membershipQuery($userId: String!) {
    ProgramMembershipsV2Resource {
      byUser(userId: $userId) {
        elements {
          id
          enterpriseProgram(eventualConsistency: true) {
            id
            thirdPartyOrganizationId
            browsingExperience {
              id
              browsingExperience
            }
            metadata {
              slug
              name
              description
              endedAt
              launchedAt
              curriculumId
            }
            userRosters {
              elements {
                contractTag {
                  contractTag
                }
              }
            }
          }
          membershipState
          programId
          createdAt
          userId
        }
      }
    }
    DegreeLearnerMembershipsV1Resource {
      byUser(userId: $userId) {
        elements {
          id
          createdAt
          degreeId
          role
          degree {
            id
            name
            slug
            internalLaunchType
            supportEmailAddress
            partnerIds
          }
        }
      }
    }
    ProgramSwitcherSelectionsV1Resource {
      get(id: $userId) {
        id
        selectionType
        programId
        degreeId
      }
    }
  }
`;

export const graphqlProgramOptions = {
  options: () => ({ variables: { userId: user.get().id.toString() } }),
  props: ({
    data: {
      ProgramMembershipsV2Resource,
      DegreeLearnerMembershipsV1Resource,
      ProgramSwitcherSelectionsV1Resource,
      error,
    },
  }: ProgramOptions) => {
    if (error) {
      return { error: true };
    }
    return {
      degreeMemberships: DegreeLearnerMembershipsV1Resource && DegreeLearnerMembershipsV1Resource.byUser.elements,
      programMemberships: ProgramMembershipsV2Resource && ProgramMembershipsV2Resource.byUser.elements,
      degrees:
        (DegreeLearnerMembershipsV1Resource &&
          DegreeLearnerMembershipsV1Resource.byUser.elements &&
          DegreeLearnerMembershipsV1Resource.byUser.elements.map(({ degree }: $TSFixMe) => degree)) ||
        [],
      programs:
        (ProgramMembershipsV2Resource &&
          ProgramMembershipsV2Resource.byUser.elements &&
          // Below mapping is to emulate the original naptime response structure
          ProgramMembershipsV2Resource.byUser.elements.map(
            ({ enterpriseProgram }: $TSFixMe) =>
              new EnterpriseProgramsV1({
                ...enterpriseProgram,
                programName: enterpriseProgram.metadata.name,
                program: {
                  definition: {
                    ...enterpriseProgram,
                  },
                },
              })
          )) ||
        [],
      switcherSelections: ProgramSwitcherSelectionsV1Resource && ProgramSwitcherSelectionsV1Resource.get,
    };
  },
};
