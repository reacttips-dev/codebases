import gql from 'graphql-tag';
import {serviceFields} from '../../data/shared/fragments';

export const homepageStackups = gql`
  query homepageStackups {
    homepageStackups {
      id
      path
      services {
        id
        name
        imageUrl
      }
    }
  }
`;

export const homepageJobs = gql`
  query homepageJobs {
    homepageJobs {
      name
      id
      angellistJobUrl
      title
      location
      services {
        ...serviceFields
      }
      company {
        imageUrl
        name
        id
        path
      }
    }
  }
  ${serviceFields}
`;

export const homepageDecisions = gql`
  query homepageDecisions {
    homepageDecisions {
      user {
        id
        username
        title
        companyName
        imageUrl
        displayName
      }
      company {
        imageUrl
        name
        path
        features {
          slug
        }
      }
      link {
        url
        title
      }
      publicId
      publishedAt
      id
      htmlContent
      viewCount
      upvotesCount
      services {
        name
        path
        id
        imageUrl
      }
      topics {
        name
        id
      }
    }
  }
`;

export const alternativeTools = gql`
  query homepageAlternatives {
    homepageTools {
      edges {
        node {
          id
          name
          imageUrl
          slug
          alternativeTools(first: 3) {
            edges {
              node {
                id
                name
                title
                verified
                canonicalUrl
                imageUrl
                slug
                following
                stacks
                fans
                votes
              }
            }
          }
        }
      }
    }
  }
`;
