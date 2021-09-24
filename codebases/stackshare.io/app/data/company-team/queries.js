import gql from 'graphql-tag';

export const team = gql`
  query companyMembers($id: ID!, $first: Int, $after: String) {
    companyMembers(id: $id, after: $after, first: $first) {
      count
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          company {
            id
            name
          }
          user {
            id
            displayName
            imageUrl
            title
          }
          role
        }
      }
    }
  }
`;

export const invitation = gql`
  query companyInvitations($id: ID!, $first: Int, $after: String) {
    companyMemberInvitations(id: $id, after: $after, first: $first) {
      count
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          company {
            name
          }
          email
          role
        }
      }
    }
  }
`;

export const company = gql`
  query company($id: ID!) {
    company(id: $id) {
      id
      name
      imageUrl
      privateMode
      slug
      verified
      githubAppInstalled
      azureAppInstalled
      azureInstallationToken
    }
  }
`;

export const searchUsername = gql`
  query searchUsername($term: String!) {
    searchCompanyOwners(term: $term) {
      edges {
        node {
          id
          displayName
          imageUrl
        }
      }
    }
  }
`;

export const pendingInvitation = gql`
  query companyMembers($id: ID!) {
    company(id: $id) {
      companyOrgInvites {
        edges {
          node {
            githubUsername
            githubId
            role
          }
        }
      }
    }
  }
`;

export const isGithubOrgSynced = gql`
  query isGithubOrgSynced($id: ID!) {
    company(id: $id) {
      id
      githubOrgSynced
    }
  }
`;

export const repoAnalysisProgress = gql`
  query repoAnalysisProgress {
    currentPrivateCompany {
      id
      repoStacksCount
      repoAnalysisProgress
    }
  }
`;
