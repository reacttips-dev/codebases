import gql from 'graphql-tag';

export const EnrollmentChoiceModalQuery = gql`
  query EnrollmentChoiceModalQuery($programMembershipIds: [String!]!) {
    ProgramMembershipsV2Resource {
      multiGet(ids: $programMembershipIds) {
        elements {
          id
          programId
          createdAt
          membershipState
          enterpriseProgram(eventualConsistency: true) {
            id
            metadata {
              name
            }
          }
        }
      }
    }
  }
`;

export const EnrollmentChoiceModalProductDescriptionQuery = gql`
  query EnrollmentChoiceModalProductDescriptionQuery($productId: String!) {
    XdpV1Resource {
      get(id: $productId) {
        id
        xdpMetadata {
          __typename
          ... on XdpV1_cdpMetadataMember {
            cdpMetadata {
              id
              name
              partners {
                id
                name
              }
              photoUrl
              courseTypeMetadata {
                __typename
                ... on XdpV1_rhymeProjectMember {
                  rhymeProject {
                    typeNameIndex
                  }
                }
                ... on XdpV1_standardCourseMember {
                  standardCourse {
                    typeNameIndex
                  }
                }
              }
            }
          }
          ... on XdpV1_sdpMetadataMember {
            sdpMetadata {
              id
              name
              partners {
                id
                name
              }
              certificateLogo
              courseIds
            }
          }
        }
      }
    }
  }
`;
