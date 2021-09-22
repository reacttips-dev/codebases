import gql from 'graphql-tag';
import discoveryCollectionsGql from 'js/lib/discoveryCollectionsGql';

const RhymeProjectFragment = gql`
  fragment RhymeProjectFragment on CourseTypeMetadataV1_rhymeProjectMember {
    ... on CourseTypeMetadataV1_rhymeProjectMember {
      rhymeProject {
        typeNameIndex
      }
    }
  }
`;

const DomainFragment = gql`
  fragment DomainFragment on DomainsV1 {
    description
    displayColor
    id
    name
    slug
    keywords
    backgroundImageUrl
    subdomains {
      elements {
        ...SubdomainFragment
      }
    }
  }
`;

const SubdomainFragment = gql`
  fragment SubdomainFragment on SubdomainsV1 {
    id
    domainId
    slug
    name
    description
  }
`;

const DomainSubdomainQuery = gql`
  query DomainSubdomainQuery($domainSlug: String!, $subdomainSlug: String!) {
    DomainsV1Resource {
      slug(slug: $domainSlug) {
        elements {
          ...DomainFragment
        }
      }
    }
    SubdomainsV1Resource {
      slug(slug: $subdomainSlug) {
        elements {
          ...SubdomainFragment
        }
      }
    }
  }
  ${DomainFragment}
  ${SubdomainFragment}
`;

const DomainGetAllQuery = gql`
  query DomainGetAllQuery {
    DomainsV1Resource {
      domains: getAll {
        elements {
          id
          slug
          name
          description
          backgroundImageUrl
          subdomains {
            elements {
              id
              slug
              name
              domainId
              description
            }
          }
        }
      }
    }
  }
`;

const SubdomainGetAllQuery = gql`
  query SubdomainGetAllQuery {
    SubdomainsV1Resource {
      subdomains: getAll {
        elements {
          id
          slug
          domainId
          name
          description
        }
      }
    }
  }
`;

const BrowseLightweightCourseFragment = gql`
  fragment BrowseLightweightCourseFragment on CoursesV1 {
    id
    slug
    name
    photoUrl
    s12nIds
    premiumExperienceVariant
    level
    workload
    primaryLanguages
    partners {
      elements {
        id
        name
        squareLogo
        classLogo
        logo
      }
    }
    courseTypeMetadata {
      id
      courseTypeMetadata {
        ...RhymeProjectFragment
      }
    }
  }
  ${RhymeProjectFragment}
`;

const LightweightS12nFragment = gql`
  fragment LightweightS12nFragment on OnDemandSpecializationsV1 {
    name
    id
    slug
    logo
    courseIds
    partners {
      elements {
        id
        name
        squareLogo
        classLogo
        logo
      }
    }
    metadata {
      headerImage
      level
    }
    productVariant
  }
`;

const CollectionQuery = gql`
  query CollectionQuery(
    $contextType: String!
    $contextId: String!
    $skip: Boolean = false
    $numEntriesPerCollection: Int
    $limit: Int
    $start: String = "0"
  ) {
    BrowseCollectionsV1Resource @skip(if: $skip) {
      byCollections(
        contextType: $contextType
        contextId: $contextId
        numEntriesPerCollection: $numEntriesPerCollection
        limit: $limit
        start: $start
      ) {
        elements {
          label
          id
          linkedCollectionPageMetadata {
            url
            label
          }
          debug
          entries {
            id
            courseId
            onDemandSpecializationId
            resourceName
            score
            isPartOfCourseraPlus
            isFreeCertificate
          }
          courses {
            elements {
              ...BrowseLightweightCourseFragment
            }
          }
          s12ns {
            elements {
              ...LightweightS12nFragment
            }
          }
        }
        paging {
          total
        }
      }
    }
  }
  ${BrowseLightweightCourseFragment}
  ${LightweightS12nFragment}
`;

// To be used with the 'discoveryCollectionsGql' link.
// DiscoveryCollections resource is part of the disco-collections-application schema located at:
// coursera.org/dgs/disco-collections-application/graphql
const DiscoveryCollectionsQuery = discoveryCollectionsGql`
  query DiscoveryCollectionsQuery($contextType: String!, $contextId: String!) {
    DiscoveryCollections {
      queryCollections(input: { contextType: $contextType, contextId: $contextId }) {
        __typename
        id
        label
        entities {
          __typename
          id
          slug
          name
          url
          partnerIds
          imageUrl
          partners {
            id
            name
            logo
          }
          ... on DiscoveryCollections_specialization {
            courseCount
            isPartOfCourseraPlus
          }
          ... on DiscoveryCollections_course {
            isPartOfCourseraPlus
            isCostFree
          }
          ... on DiscoveryCollections_guidedProject {
            isPartOfCourseraPlus
            isCostFree
          }
          ... on DiscoveryCollections_professionalCertificate {
            isPartOfCourseraPlus
          }
        }
      }
    }
  }
`;

export {
  DomainGetAllQuery,
  DomainSubdomainQuery,
  SubdomainGetAllQuery,
  DomainFragment,
  SubdomainFragment,
  CollectionQuery,
  DiscoveryCollectionsQuery,
};
