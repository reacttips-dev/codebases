import gql from 'graphql-tag';
import {reasonFields} from './fragments';

export const toolBySlug = gql`
  query tool($id: ID!) {
    tool(id: $id) {
      id
      private
      imageUrl
      thumbUrl
      thumbRetinaUrl
      name
      pressUrl
      contactFlow
      legacyThirdPartyId
      jobsCount
      type
      keywords
      packageUrl
      packageManager {
        slug
        miniImageUrl
        websiteUrl
        packageManagerTools {
          imageUrl
          thumbUrl
          thumbRetinaUrl
          name
          id
          slug
          path
        }
      }
      featuredPosts {
        edges {
          node {
            id
            views
            title
          }
        }
      }
      alternativeTools(first: 5) {
        edges {
          node {
            id
            name
            description
          }
        }
      }
      followers {
        count
      }
      privateStacks {
        count
      }
      privateUsersUsing {
        count
      }
      privateUsersUsingViaPersonalStacks {
        count
      }
      privateUsersViaContributedStacks {
        count
      }
      teams {
        count
      }
      privateStackDecisions {
        count
      }
      privateFollowers {
        count
      }
      company {
        name
        amIOwner
        slug
        path
        stacks {
          id
        }
        owners {
          amIAdmin
          canIModerate
          id
        }
      }
      pros {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ...reasonFields
          }
        }
      }
      slug
      path
      verified
      title
      twitterUsername
      websiteUrl
      following
      githubStarsCount
      githubForksCount
      githubUpdatedAt
      hackernewsOnlineMentionsCount
      redditOnlineMentionsCount
      stackOverflowOnlineMentionsCount
      description
      ampStoryEnabled
      stacks
      votes
      jobs
      relatedStackups {
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
      allToolIntegrations {
        count
      }
      companyStacksUsing {
        count
      }
      userStacksUsing {
        count
      }
      features
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
      adoptionStage {
        id
        name
      }
    }
  }
  ${reasonFields}
`;

export const contactBySlug = gql`
  query contactBySlug($id: ID!) {
    tool(id: $id) {
      id
      contactEnabled
      contactButtonText
      contactFlow
    }
  }
`;

// Please do not add anything directly under the tool below here.
// We have an updateQuery function that needs this format

export const toolDecisions = gql`
  query toolDecisions($id: ID!, $after: String) {
    tool(id: $id) {
      stackDecisions(first: 6, after: $after) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
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
            id
            htmlContent
            viewCount
            publishedAt
            upvotesCount
            services {
              name
              path
              id
              imageUrl
              thumbUrl
            }
            topics {
              name
              id
            }
          }
        }
      }
      id
    }
  }
`;

export const privateStackDecisions = gql`
  query privateStackDecisions($id: ID!, $after: String) {
    tool(id: $id) {
      privateStackDecisions(first: 6, after: $after) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
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
            private
            viewCount
            upvotesCount
            services {
              name
              path
              id
              imageUrl
              thumbUrl
            }
            topics {
              name
              id
            }
          }
        }
      }
      id
    }
  }
`;

export const relatedStackups = gql`
  query relatedStackups($id: ID!, $after: String) {
    tool(id: $id) {
      relatedStackups(first: 6, after: $after) {
        edges {
          node {
            id
            path
            services {
              id
              name
              imageUrl
              thumbUrl
            }
          }
        }
      }
      id
    }
  }
`;

export const companyStacksUsing = gql`
  query companyStacksUsing($id: ID!, $after: String, $first: Int) {
    tool(id: $id) {
      companyStacksUsing(first: $first, after: $after) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            name
            imageUrl
            thumbUrl
            thumbRetinaUrl
            identifier
            id
          }
        }
      }
      id
    }
  }
`;

export const toolIntegrations = gql`
  query allToolIntegrations($id: ID!, $after: String, $first: Int) {
    tool(id: $id) {
      allToolIntegrations(first: $first, after: $after) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            imageUrl
            thumbUrl
            thumbRetinaUrl
            name
            id
            slug
            path
          }
        }
      }
      id
    }
  }
`;

export const userStacksUsing = gql`
  query userStacksUsing($id: ID!, $after: String, $first: Int) {
    tool(id: $id) {
      userStacksUsing(first: $first, after: $after) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            name
            imageUrl
            thumbUrl
            thumbRetinaUrl
            identifier
            id
          }
        }
      }
      id
    }
  }
`;

export const privateUsersUsing = gql`
  query privateUsersUsing($id: ID!, $after: String, $first: Int) {
    tool(id: $id) {
      privateUsersUsing(first: $first, after: $after) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            displayName
            imageUrl
            thumbUrl
            thumbRetinaUrl
            id
            path
          }
        }
      }
      id
    }
  }
`;

export const privateUsersUsingViaPersonalStacks = gql`
  query privateUsersUsingViaPersonalStacks($id: ID!, $after: String, $first: Int) {
    tool(id: $id) {
      privateUsersUsingViaPersonalStacks(first: $first, after: $after) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            displayName
            imageUrl
            thumbUrl
            thumbRetinaUrl
            id
            path
          }
        }
      }
      id
    }
  }
`;

export const privateUsersViaContributedStacks = gql`
  query privateUsersViaContributedStacks($id: ID!, $after: String, $first: Int) {
    tool(id: $id) {
      privateUsersViaContributedStacks(first: $first, after: $after) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            displayName
            imageUrl
            thumbUrl
            thumbRetinaUrl
            id
            path
          }
        }
      }
      id
    }
  }
`;

export const teams = gql`
  query privateTeams($id: ID!, $after: String, $first: Int) {
    tool(id: $id) {
      teams(first: $first, after: $after) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            imageUrl
            canonicalUrl
            id
            name
            description
            stacksCount
            privateToolsCount
            membersCount
          }
        }
      }
      id
    }
  }
`;

export const tool = gql`
  query tool($id: ID!) {
    tool(id: $id) {
      stackDecisions(first: 6) {
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
            }
            link {
              url
              title
            }
            publicId
            createdAt
            id
            htmlContent
            viewCount
            upvotesCount
            services {
              name
              path
              id
              imageUrl
              thumbUrl
            }
            topics {
              name
              id
            }
          }
        }
      }
      id
    }
  }
`;

export const followers = gql`
  query followers($id: ID!, $after: String, $first: Int) {
    tool(id: $id) {
      followers(first: $first, after: $after) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            displayName
            username
            imageUrl
            title
            popularity
            path
            stacksCount
            favoritesCount
            votesCount
          }
        }
      }
      id
    }
  }
`;

export const privateFollowers = gql`
  query privateFollowers($id: ID!, $after: String, $first: Int) {
    tool(id: $id) {
      privateFollowers(first: $first, after: $after) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            displayName
            username
            imageUrl
            title
            popularity
            path
            stacksCount
            favoritesCount
            votesCount
          }
        }
      }
      id
    }
  }
`;

export const privateStacks = gql`
  query privateStacks($id: ID!, $after: String, $first: Int) {
    tool(id: $id) {
      privateStacks(first: $first, after: $after) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            slug
            name
            path
            services(withoutPackages: true) {
              id
              name
              slug
              title
              imageUrl
              layer {
                slug
              }
            }
          }
        }
      }
      id
    }
  }
`;

export const privateCompanyStacks = gql`
  query privateCompanyStacks($id: ID!, $after: String, $first: Int) {
    tool(id: $id) {
      privateCompanyStacks(first: $first, after: $after) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            slug
            name
            path
            private
            repoStack
            services(withoutPackages: true) {
              id
              name
              slug
              title
              imageUrl
              layer {
                slug
              }
            }
          }
        }
      }
      id
    }
  }
`;

export const posts = gql`
  query posts($id: ID!, $after: String, $first: Int) {
    tool(id: $id) {
      featuredPosts(first: $first, after: $after) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            views
            title
            imageUrl
            publishedAt
            canonicalUrl
            previewImageUrl
            company {
              name
            }
            tools {
              id
              name
              slug
              title
              verified
              imageUrl
              canonicalUrl
              path
              votes
              fans
              stacks
              following
              followContext
            }
            favoriteStacksCount
          }
        }
      }
      id
    }
  }
`;
