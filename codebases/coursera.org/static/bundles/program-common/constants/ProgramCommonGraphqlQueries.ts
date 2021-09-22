import gql from 'graphql-tag';
import { CollectionDescriptionFragment } from 'bundles/program-common/components/collections/CollectionDescription';

export const ConstantProductCardCourseFragment = gql`
  fragment ConstantProductCardCourseFragment on CoursesV1 {
    id
    promoPhoto: photoUrl
    name
    upcomingSessionStartDate
    partners {
      elements {
        id
        name
        logo
        squareLogo
        classLogo
      }
    }
    display
    courseTypeMetadata {
      id
      courseTypeMetadata {
        __typename
      }
    }
  }
`;

export const ProductCardS12nFragment = gql`
  fragment ProductCardS12nFragment on OnDemandSpecializationsV1 {
    id
    promoPhoto: logo
    name
    productVariant
    courseIds
    partners {
      elements {
        id
        name
        logo
        squareLogo
        classLogo
      }
    }
  }
`;

export const CollectionDetailsFragment = gql`
fragment CollectionDetailsFragment on ProgramCurriculumCollectionsV1 {
  trackId
  courses {
    elements {
      ...ConstantProductCardCourseFragment
    }
  }
  s12ns {
    elements {
      ...ProductCardS12nFragment
    }
  }
  items {
    productId
    productState {
      ... on ProgramCurriculumCollectionsV1_programCourseWithStateMember {
        productState: programCourseWithState {
          courseId
          state
          isWishlisted
        }
      }
      ... on ProgramCurriculumCollectionsV1_programS12nWithStateMember {
        productState: programS12nWithState {
          s12nId
          state
          isWishlisted
        }
      }
    }
  }
  collectionContextMetadata {
    ... on ProgramCurriculumCollectionsV1_skillProfileMember {
      skillProfile {
        targetSkillProfileId
        skillIds
        targetSkillProfileSlug
        skillsMetadata {
          elements {
            id
            skillName
          }
        }
      }
    }
    ... on ProgramCurriculumCollectionsV1_singleSkillMember {
      singleSkill {
        targetSkillProfileId
        skillId
      }
    }
  }
  associatedSessions {
    elements {
      courseId
      startsAt
      endsAt
    }
  }
}
${ConstantProductCardCourseFragment},
${ProductCardS12nFragment},
`;

export const CollectionListItemFragment = gql`
  fragment CollectionListItemFragment on ProgramCurriculumCollectionsV1 {
    id
    title
    image
    courseIds
    s12nIds
    collectionTrackingId
    ...CollectionDescriptionFragment,
    ...CollectionDetailsFragment

  }
  ${CollectionDescriptionFragment},
  ${CollectionDetailsFragment}
`;

export const EnterpriseConfigurationCourseMetadataFragment = gql`
  fragment EnterpriseConfigurationMetadataFragment on EnterpriseProductConfigurationMetadataV1 {
    id
    metadataType {
      ... on EnterpriseProductConfigurationMetadataV1_courseMember {
        course {
          courseId
          hasMultipleOfferings
          isExclusive
          isRecommendedForCredit
          isSelectedForCredit
          isConfigurationAllowed
        }
      }
    }
  }
`;

export const ProgramProductMetadataMultiGetQuery = gql`
  query CommonProgramProductMetadataMultiGetQuery($ids: [String!]!) {
    ProgramProductMetadataV1Resource {
      multiGet(ids: $ids) {
        elements {
          id
          programId
          metadataType {
            ... on ProgramProductMetadataV1_courseMember {
              course {
                isExclusive
                isSelectedForCredit
                courseId
              }
            }
          }
        }
      }
    }
  }
`;

export const EnterpriseProgramSessionAssociationsByProgramsAndCourseQuery = gql`
  query EnterpriseProgramSessionAssociationsByProgramsAndCourseQuery($courseId: String!, $programIds: [String!]!) {
    EnterpriseProgramSessionAssociationsV1Resource {
      byProgramsAndCourse(courseId: $courseId, programIds: $programIds) {
        elements {
          programId
          session {
            startsAt
            endsAt
          }
        }
      }
    }
  }
`;

export const ProgramProductMetadataFragment = gql`
  fragment ProgramProductMetadataFragment on ProgramProductMetadataV1 {
    id
    metadataType {
      ... on ProgramProductMetadataV1_courseMember {
        course {
          isExclusive
          isSelectedForCredit
          courseId
        }
      }
    }
  }
`;

export const ProgramCourseMetadataFragment = gql`
  fragment ProgramCourseMetadataFragment on ProgramProductMetadataV1_org_coursera_enterprise_curriculumbuilder_ProgramCourseMetadata {
    isExclusive
    isSelectedForCredit
    courseId
  }
`;

export const ProgramProductMetadataQueryV1 = gql`
  query ProgramProductMetadataGetQuery($id: String!) {
    ProgramProductMetadataV1Resource {
      get(id: $id) {
        ...ProgramProductMetadataFragment
      }
    }
  }
  ${ProgramProductMetadataFragment}
`;
