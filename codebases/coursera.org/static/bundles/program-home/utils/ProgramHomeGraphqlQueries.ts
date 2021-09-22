import gql from 'graphql-tag';
import type {
  EnterpriseProgramsV1SlugQuery as EnterpriseProgramsV1SlugQueryResult,
  EnterpriseProgramsV1SlugQueryVariables,
  EnterpriseProgramsV1GetQuery as EnterpriseProgramsV1GetQueryResult,
  EnterpriseProgramsV1GetQueryVariables,
} from 'bundles/naptimejs/resources/__generated__/EnterpriseProgramsV1';

export const ProgramCurriculumDomainsQuery = gql`
  query ProgramCurriculumDomainsQuery($programId: String!) {
    ProgramCurriculumDomainsV1Resource {
      get(id: $programId) {
        id
        domains {
          id
          slug
          name
          subdomainIds
        }
      }
    }
    SubdomainsV1Resource {
      getAll: getAll {
        elements {
          id
          name
          domainId
          slug
        }
      }
    }
  }
`;

export type EnterpriseProgramsQueryResult = EnterpriseProgramsV1GetQueryResult;

export type EnterpriseProgramsQueryVariables = {
  id: EnterpriseProgramsV1GetQueryVariables['id'];
};

export const EnterpriseProgramsQuery = gql`
  query EnterpriseProgramsQuery($programId: String!) {
    EnterpriseProgramsV1 @naptime {
      get(id: $programId, eventualConsistency: true, includes: "browsingExperience") {
        elements {
          id
          metadata {
            slug
            name
            description
          }
        }
        linked {
          programBrowsingExperiencesV1 {
            id
            browsingExperience
          }
        }
      }
    }
  }
`;

export type EnterpriseProgramBySlugQueryResult = EnterpriseProgramsV1SlugQueryResult;

export type EnterpriseProgramBySlugQueryVariables = {
  programSlug: EnterpriseProgramsV1SlugQueryVariables['slug'];
};

export const EnterpriseProgramBySlugQuery = gql`
  query ProgramBySlug($programSlug: String!) {
    EnterpriseProgramsV1 @naptime {
      slug(
        slug: $programSlug
        eventualConsistency: true
        includes: "browsingExperience, thirdPartyOrg, curriculumDomains, contractTags, contract"
      ) {
        elements {
          id
          thirdPartyOrganizationId
          metadata {
            name
            slug
            tagline
            endedAt
            landingPageBanner
            tutorialVideoUrl
            tutorialVideoAssetId
            curriculumId
            linkedTargetSkillProfileIds
          }
        }
        linked {
          programBrowsingExperiencesV1 {
            id
            browsingExperience
            numCollections
          }
          thirdPartyOrganizationsV1 {
            id
            name
            slug
            rectangularLogo
            squareLogo
            primaryColor
            landingPageBanner
            loginMethod
            programVisibilityRule
            organizationType
          }
          programCurriculumDomainsV1 {
            id
            domains {
              id
              name
              courseCount
              subdomainIds
            }
          }
          enterpriseContractTagsV1 {
            contractTag
          }
          enterpriseContractsV1 {
            enterpriseContractId
            contractType
          }
        }
      }
    }
  }
`;

export const ProgramHomeLoggedInDataQuery = gql`
  query ProgramHomeLoggedInData(
    $programMembershipId: String!
    $userId: String!
    $thirdPartyOrganizationId: String!
    $assessmentId: String!
    $shouldSkipAssessment: Boolean!
  ) {
    ProgramMembershipsV2Resource {
      get(id: $programMembershipId) {
        id
        membershipState
        enterpriseAdminRoles {
          elements {
            id
            role
          }
        }
        userCredits {
          id
          isLimited
          totalAllocatedCourses
          coursesRemaining
          coursesRemainingReason
        }
        externalUserData {
          ... on ProgramMembershipsV2_genericExternalUserDataMember {
            genericExternalUserData {
              fullName
              email
            }
          }
        }
      }
    }

    EnterpriseNoticeAcceptanceLogsV1Resource {
      getByUserIdAndOrganizationId(userId: $userId, thirdPartyOrganizationId: $thirdPartyOrganizationId) {
        elements {
          id
        }
      }
    }

    UserEmailsV2Resource {
      findByUser(userId: $userId) {
        elements {
          id
          email
          isPrimary
        }
      }
    }
    UserQualificationResultsV1Resource {
      getLatestResult(userId: $userId, assessmentId: $assessmentId) @skip(if: $shouldSkipAssessment) {
        elements {
          id
          evaluation {
            score
            maxScore
          }
          action {
            ... on UserQualificationResultsV1_s12nActionMember {
              s12nAction {
                s12nId
              }
            }
            ... on UserQualificationResultsV1_courseActionMember {
              courseAction {
                courseId
              }
            }
          }
        }
      }
    }
  }
`;

export const CourseTypeMetadataByCourseIdQuery = gql`
  query CourseTypeMetadataByCourseIdQuery($courseId: String!) {
    CourseTypeMetadataV1Resource {
      get(id: $courseId) {
        id
        courseTypeMetadata {
          ... on CourseTypeMetadataV1_rhymeProjectMember {
            rhymeProject {
              typeNameIndex
            }
          }
        }
      }
    }
  }
`;

export const CourseTypeMetadataByCourseIdsQuery = gql`
  query CourseTypeMetadataByCourseIdsQuery($courseIds: [String!]!) {
    CourseTypeMetadataV1Resource {
      multiGet(ids: $courseIds) {
        elements {
          id
          courseTypeMetadata {
            ... on CourseTypeMetadataV1_rhymeProjectMember {
              rhymeProject {
                typeNameIndex
              }
            }
          }
        }
      }
    }
  }
`;

export const TargetSkillProfileUserStatesQuery = gql`
  query TargetSkillProfileUserStatesQuery($userId: String!, $programId: String!) {
    TargetSkillProfileUserStatesV1Resource {
      byUserAndProgram(programId: $programId, userId: $userId) {
        elements {
          id
          state
          targetSkillProfileId
          targetSkillProfile {
            id
            slug
            title
          }
          targetSkillProfileSummary {
            id
            targetSkillProficiencies {
              skillId
              skillName
              targetProficiency
            }
            learnerSkillScores {
              elements {
                id
                skillId
                skill {
                  id
                  name
                }
                readableScore
              }
            }
          }
        }
      }
    }
  }
`;

export const ProgramCurriculumAvailableCourseSessionsQueryV1 = gql`
  query ProgramCurriculumCourseSessionsQuery($programId: String!) {
    ProgramCurriculumProductsV1 @naptime {
      available(programId: $programId, includes: "courseSessions") {
        linked {
          onDemandCourseSessionsV1 {
            startsAt
            endsAt
            courseId
          }
        }
      }
    }
  }
`;

export const EnterpriseProgramSessionAssociationsQueryV1 = gql`
  query EnterpriseProgramSessionAssociationsQuery($programId: String!, $productId: String!) {
    EnterpriseProgramSessionAssociationsV1Resource {
      byProgramAndCourse(programId: $programId, courseId: $productId) {
        elements {
          session {
            courseId
            startsAt
            endsAt
          }
        }
      }
    }
  }
`;

export const EnterpriseTargetSkillProfileSummariesQueryV1 = gql`
  query ObjectiveSummaryQuery($objectiveSlug: String!) {
    EnterpriseTargetSkillProfileSummariesV1Resource {
      bySlug(slug: $objectiveSlug) {
        elements {
          id
          slug
          title
          description {
            ... on EnterpriseTargetSkillProfileSummariesV1_cmlMember {
              cml {
                dtdId
                value
              }
            }
          }
          targetSkillProficiencies {
            skillId
            skillName
            targetProficiency
          }
          learnerSkillScores {
            elements {
              id
              skillId
              readableScore
            }
          }
        }
      }
    }
  }
`;
