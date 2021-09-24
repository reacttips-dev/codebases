import gql from 'graphql-tag';
import {reasonFields} from './fragments';
import {serviceFields} from '../shared/fragments';

export const toolBySlug = gql`
  query tool($id: ID!) {
    tool(id: $id) {
      id
      imageUrl
      name
      ampStoryEnabled
      description
      followers {
        count
      }
      company {
        name
        slug
        stacks {
          id
        }
      }
      path
      slug
      following
      alternativeTools {
        count
      }
      followers {
        count
      }
      function {
        name
        slug
      }
      layer {
        name
        slug
      }
      category {
        name
        slug
      }
      features
      thumbUrl
      thumbRetinaUrl
      verified
      pressUrl
      githubForksCount
      githubStarsCount
      title
      twitterUsername
      websiteUrl
      stacks
      votes
      privateFollowers {
        count
      }
      footerAlternateTools(first: 5) {
        edges {
          node {
            name
            path
          }
        }
      }
      footerNewTools(first: 5) {
        edges {
          node {
            name
            path
          }
        }
      }
      footerTopTools(first: 5) {
        edges {
          node {
            name
            path
          }
        }
      }
      footerRelatedStackups(first: 5) {
        edges {
          node {
            path
            title
          }
        }
      }
    }
  }
`;

export const alternativeTools = gql`
  query alternativeTools($id: ID!, $after: String, $first: Int) {
    tool(id: $id) {
      id
      alternativeTools(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            path
            slug
            title
            votes
            following
            followers {
              count
            }
            stacks
            githubForksCount
            imageUrl
            thumbRetinaUrl
            name
            description
            contactEnabled
            contactButtonText
            contactFlow
            pros {
              edges {
                node {
                  ...reasonFields
                }
              }
            }
            cons {
              edges {
                node {
                  ...reasonFields
                }
              }
            }
            stackDecisionsWithAlternatives(first: 2) {
              edges {
                node {
                  user {
                    id
                    username
                    title
                    companyName
                    imageUrl
                    thumbUrl
                    displayName
                  }
                  company {
                    imageUrl
                    thumbUrl
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
                    ...serviceFields
                  }
                  topics {
                    name
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${reasonFields}
  ${serviceFields}
`;
