import gql from 'graphql-tag';
import { EMBED_FRAGMENT } from './embed.gql';
import { MEMBER_FRAGMENT } from './fragments/member.gql';
import { MEDIA_FRAGMENT } from './media.gql';
export const APP_FRAGMENT = gql `
  fragment AppFragment on App {
    __typename
    id
    about
    authorName
    authorUrl
    banner {
      ...MediaFragment
    }
    createdAt
    description
    embeds {
      ...EmbedFragment
    }
    enabledContexts
    favicon {
      ...MediaFragment
    }
    id
    image {
      ...MediaFragment
    }
    installed
    comingSoon
    locked
    name
    privacyPolicyUrl
    slug
    standing
    status
    termsOfServiceUrl
    updatedAt
    requiredPlan
    docsUrl
  }
  ${MEDIA_FRAGMENT}
  ${EMBED_FRAGMENT}
`;
export const APPS = gql `
  query apps($limit: Int!, $status: StoreItemStatus, $after: String) {
    apps(limit: $limit, status: $status, after: $after) {
      __typename
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        __typename
      }
      edges {
        cursor
        node {
          ...AppFragment
        }
        __typename
      }
    }
  }
  ${APP_FRAGMENT}
`;
export const APP = gql `
  query app($id: ID, $slug: String) {
    app(id: $id, slug: $slug) {
      ...AppFragment
    }
  }
  ${APP_FRAGMENT}
`;
export const UPDATE_APP_MUTATION = gql `
  mutation updateApp($id: ID!, $input: UpdateAppInput!) {
    updateApp(id: $id, input: $input) {
      ...AppFragment
    }
  }
  ${APP_FRAGMENT}
`;
export const BASIC_APP_INSTALLATION_FRAGMENT = gql `
  fragment BasicAppInstallation on AppInstallation {
    __typename
    app {
      ...AppFragment
    }
    context
    appVersion
    id
    installedAt
    installedBy {
      ...MemberFragment
    }
    createdAt
    updatedAt
    status
  }
  ${APP_FRAGMENT}
  ${MEMBER_FRAGMENT}
`;
export const INSTALL_APP_MUTATION = gql `
  mutation installApp($appId: ID!, $input: InstallAppInput!) {
    installApp(appId: $appId, input: $input) {
      ...BasicAppInstallation
    }
  }
  ${BASIC_APP_INSTALLATION_FRAGMENT}
`;
export const UNINSTALL_APP_MUTATION = gql `
  mutation uninstallApp($appInstallationId: ID!, $reason: String) {
    uninstallApp(appInstallationId: $appInstallationId, reason: $reason) {
      ...BasicAppInstallation
    }
  }
  ${BASIC_APP_INSTALLATION_FRAGMENT}
`;
export const NETWORK_APPS = gql `
  query networkApps($status: AppInstallationStatus) {
    networkApps(status: $status) {
      ...AppFragment
    }
  }
  ${APP_FRAGMENT}
`;
export const GET_NETWORK_APP_INSTALLATIONS = gql `
  query getNetworkAppInstallations(
    $limit: Int!
    $status: AppInstallationStatus
    $after: String
  ) {
    getNetworkAppInstallations(limit: $limit, status: $status, after: $after) {
      __typename
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        __typename
      }
      edges {
        cursor
        node {
          ...BasicAppInstallation
        }
      }
    }
  }
  ${BASIC_APP_INSTALLATION_FRAGMENT}
`;
export const GET_SPACE_APP_INSTALLATIONS = gql `
  query getSpaceAppInstallations(
    $limit: Int!
    $status: AppInstallationStatus
    $after: String
    $spaceId: ID!
  ) {
    getSpaceAppInstallations(
      limit: $limit
      status: $status
      after: $after
      spaceId: $spaceId
    ) {
      __typename
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        __typename
      }
      edges {
        cursor
        node {
          ...BasicAppInstallation
        }
      }
    }
  }
  ${BASIC_APP_INSTALLATION_FRAGMENT}
`;
export const GET_APP_SPACE_SETTINGS = gql `
  query getAppSpaceSettings($appId: ID!, $spaceId: ID!) {
    getAppSpaceSettings(appId: $appId, spaceId: $spaceId)
  }
`;
export const UPDATE_APP_SPACE_SETTING = gql `
  mutation updateAppSpaceSetting(
    $appId: ID!
    $spaceId: ID!
    $settings: String!
  ) {
    updateAppSpaceSetting(
      appId: $appId
      spaceId: $spaceId
      settings: $settings
    ) {
      __typename
      status
      data
    }
  }
`;
export const GET_APP_NETWORK_SETTINGS = gql `
  query getAppNetworkSettings($appId: ID!) {
    getAppNetworkSettings(appId: $appId)
  }
`;
export const UPDATE_APP_NETWORK_SETTINGS = gql `
  mutation updateAppNetworkSettings($appId: ID!, $settings: String!) {
    updateAppNetworkSettings(appId: $appId, settings: $settings) {
      __typename
      status
      data
    }
  }
`;
export const CREATE_APP_MUTATION = gql `
  mutation createApp($input: CreateAppInput!) {
    createApp(input: $input) {
      ...AppFragment
    }
  }
  ${APP_FRAGMENT}
`;
//# sourceMappingURL=apps.gql.js.map