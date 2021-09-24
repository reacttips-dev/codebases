import gql from 'graphql-tag';
import {reasonFields, stackDecisionAnswerFields, stackFields} from './fragments';

export const advert = gql`
  query advert($placement: String, $objectType: String, $objectId: String) {
    advert(placement: $placement, objectType: $objectType, objectId: $objectId) {
      ctaText
      imageUrl
      sponsorFeatured
      sponsorToolId
      targetUrl
      text
      title
      bannerAdUrl
      mobileAdUrl
      sidebarAdUrl
    }
  }
`;

export const getSSORedirect = gql`
  query getSSORedirect($email: ID!) {
    getSSORedirect(email: $email)
  }
`;

export const decisionQuery = gql`
  query stackDecision($id: ID!) {
    stackDecision(id: $id) {
      ...stackDecisionAnswerFields
      parent {
        ...stackDecisionAnswerFields
      }
    }
  }
  ${stackDecisionAnswerFields}
`;

export const privateMode = gql`
  query privateMode {
    currentPrivateCompany {
      id
      name
      myRole
      slug
      verified
      privateMode
      imageUrl
      permissions {
        edit
      }
      adoptionStages {
        id
        name
      }
      members {
        count
      }
      emailAddress
      plans {
        slug
      }
      features {
        slug
      }
      forcedVcsProvider
    }
  }
`;

export const user = gql`
  query user {
    me {
      hasPersonalGithubInstall
      privateCompanyMember
      selfServeEnabled
      privateMode
      showTosModal
      id
      path
      imageUrl
      amIAdmin
      title
      displayName
      companyName
      canIModerate
      username
      location
      shouldForceVcsConnection
      selfServeChecklist {
        completed
        dismissed
        items {
          slug
          completed
        }
      }
      stackApiTrialSubscription {
        plan {
          slug
        }
        currentPeriodEndsAt
        active
      }
      stackApiCurrentSubscription {
        couponPercentOff
        plan {
          slug
        }
        currentPeriodEndsAt
        active
      }
      stackApiKey {
        apiKey
        usageLimit
        currentPeriod {
          usageCount
          periodEndsAt
        }
      }
      jobSearch {
        companies {
          name
          imageUrl
          slug
        }
        tools {
          name
          imageUrl
        }
        keywords
        location
        latitude
        longitude
        emailEnabled
      }
      bookmarkedJobs {
        count
        edges {
          node {
            bookmarked
            id
            angellistJobUrl
            title
            location
            tools {
              id
              imageUrl
              name
            }
            company {
              imageUrl
              name
              path
            }
          }
        }
      }
      followedCompanies {
        count
        edges {
          node {
            id
            name
            thumbUrl
            imageUrl
            path
          }
        }
      }
      stacks {
        edges {
          node {
            ...stackFields
          }
        }
      }
      companies {
        id
        slug
        name
        imageUrl
        myRole
        privateMode
        stacks {
          ...stackFields
        }
        plans {
          id
          slug
        }
      }
      decisionPrompt {
        id
        active
        message
        promptType
        selectedTool {
          id
          name
          imageUrl
        }
      }
      emailSettings {
        emailFeedDaily
        emailFeedWeekly
      }
      plans {
        slug
      }
    }
  }
  ${stackFields}
`;

export const userStacks = gql`
  query userStacks {
    me {
      id
      stacks(first: 25) {
        edges {
          node {
            id
            slug
            name
            services {
              id
              slug
            }
          }
        }
      }
      companies {
        id
        name
        stacks {
          id
          slug
          name
          services {
            id
            slug
          }
        }
      }
    }
  }
`;

export const siteSearch = gql`
  query siteSearch($keyword: String) {
    siteSearch(keyword: $keyword) @client {
      type
      id
      name
      username
      title
      imageUrl
      canonicalUrl
    }
  }
`;
export const toolSearch = gql`
  query toolSearch($keyword: String) {
    toolSearch(keyword: $keyword) @client {
      id
      name
      display
      slug
      title
      imageUrl
    }
  }
`;

export const companySearch = gql`
  query companySearch($keyword: String) {
    companySearch(keyword: $keyword) @client {
      id
      name
      slug
      imageUrl
    }
  }
`;

export const companyApiSearch = gql`
  query companyApiSearch($keyword: String) {
    companyApiSearch(keyword: $keyword) @client {
      id
      name
      domain
      type
      imageUrl
    }
  }
`;

export const toolApiSearch = gql`
  query toolApiSearch($keyword: String) {
    toolApiSearch(keyword: $keyword) @client {
      id
      name
      slug
      type
      imageUrl
    }
  }
`;

export const topicSearch = gql`
  query topicSearch($keyword: String) {
    topicSearch(keyword: $keyword) @client {
      id
      name
      display
      title
    }
  }
`;

export const toolPros = gql`
  query stackupToolPros($slug: ID!, $after: String!) {
    tool(id: $slug) {
      id
      pros(first: 7, after: $after) {
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
    }
  }
  ${reasonFields}
`;

export const toolCons = gql`
  query stackupToolCons($slug: ID!, $after: String!) {
    tool(id: $slug) {
      id
      cons(first: 7, after: $after) {
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
    }
  }
  ${reasonFields}
`;
