import gql from 'graphql-tag';
import { PLAN_FRAGMENT } from './billing.gql';
import { MEMBER_FRAGMENT } from './fragments/member.gql';
import { THEMES_FRAGMENT } from './fragments/theme.gql';
import { MEDIA_FRAGMENT } from './media.gql';
import { PERMISSION_ACTION_FRAGMENT } from './permissions.gql';
import { ROLE_FRAGMENT } from './roles.gql';
export const SCRIPT_FRAGMENT = gql `
  fragment ScriptFragment on CustomCode {
    __typename
    position
    code
    anonymize
  }
`;
export const BASIC_NETWORK_FIELDS_FRAGMENT = gql `
  fragment BasicNetworkFields on Network {
    authMemberProps {
      __typename
      context
      permissions {
        ...PermissionAction
      }
    }
    __typename
    id
    companyName
    name
    description
    visibility
    membership
    industry
    logo {
      ...MediaFragment
    }
    favicon {
      ...MediaFragment
    }
    landingPages {
      landingPageForMember
      landingPageForNewMember
      landingPageForGuest
    }
    locale
    domain
    newDomain
    incidentEmails
    hideDefaultAuthenticationForm
    privacyPolicyUrl
    termsOfServiceUrl
    brandColor
    billingEmail
    status
    memberCapacity
    memberCapacityDeclared
    seatsCapacity
    additionalSeatsCapacity
    seatCapacityDeclared
    tribeBranding
    roles {
      ...RoleFragment
    }
    whoCanInvite {
      ...RoleFragment
    }
    subscriptionPlan {
      ...PlanFragment
    }
    membersCount
  }
  ${MEDIA_FRAGMENT}
  ${ROLE_FRAGMENT}
  ${PLAN_FRAGMENT}
  ${PERMISSION_ACTION_FRAGMENT}
`;
export const NETWORK_FIELDS_FRAGMENT = gql `
  fragment NetworkFields on Network {
    ...BasicNetworkFields
    customCodes(anonymize: $anonymize) {
      ...ScriptFragment
    }
    themes {
      ...ThemesFragment
    }
    topNavigation {
      __typename
      enabled
      items {
        link
        openInNewWindow
        text
        type
      }
    }
  }
  ${SCRIPT_FRAGMENT}
  ${THEMES_FRAGMENT}
  ${BASIC_NETWORK_FIELDS_FRAGMENT}
`;
export const AUTH_TOKEN_FRAGMENT = gql `
  fragment AuthTokenFragment on AuthToken {
    __typename
    accessToken
    refreshToken
    role {
      ...RoleFragment
    }
    network {
      ...NetworkFields
      roles {
        ...RoleFragment
      }
    }
    networkPublicInfo {
      domain
      id
      membership
      name
      status
      visibility
      logo {
        ...MediaFragment
      }
      __typename
    }
    member {
      ...MemberFragment
    }
  }
  ${ROLE_FRAGMENT}
  ${MEMBER_FRAGMENT}
  ${NETWORK_FIELDS_FRAGMENT}
  ${MEDIA_FRAGMENT}
`;
export const GET_INVITATION_LINK = gql `
  query getInvitationLink {
    getMemberInvitationLink {
      link
    }
  }
`;
export const GET_NETWORK_INFO = gql `
  query getNetwork(
    $withDefaultSpaces: Boolean = false
    $withRoles: Boolean = false
    $anonymize: Boolean = false
  ) {
    getNetwork {
      ...NetworkFields
      defaultSpaces @include(if: $withDefaultSpaces) {
        id
        name
        description
        image {
          ...MediaFragment
        }
        slug
        banner {
          ...MediaFragment
        }
      }
      roles @include(if: $withRoles) {
        ...RoleFragment
      }
    }
  }
  ${NETWORK_FIELDS_FRAGMENT}
  ${MEDIA_FRAGMENT}
  ${ROLE_FRAGMENT}
`;
export const UPDATE_NETWORK_INFO = gql `
  mutation updateNetwork(
    $input: UpdateNetworkInput!
    $anonymize: Boolean = false
  ) {
    updateNetwork(input: $input) {
      ...NetworkFields
    }
  }
  ${NETWORK_FIELDS_FRAGMENT}
`;
export const GET_TOKENS = gql `
  query getTokens(
    $networkId: ID
    $networkDomain: String
    $refreshToken: String
    $otp: String
    $anonymize: Boolean = false
  ) {
    getTokens(
      networkDomain: $networkDomain
      networkId: $networkId
      refreshToken: $refreshToken
      otp: $otp
    ) {
      ...AuthTokenFragment
    }
  }
  ${AUTH_TOKEN_FRAGMENT}
`;
export const LOGIN_NETWORK = gql `
  query loginNetwork(
    $password: String!
    $usernameOrEmail: String!
    $anonymize: Boolean = false
  ) {
    loginNetwork(
      input: { password: $password, usernameOrEmail: $usernameOrEmail }
    ) {
      ...AuthTokenFragment
    }
  }
  ${AUTH_TOKEN_FRAGMENT}
`;
export const JOIN_NETWORK = gql `
  mutation joinNetwork(
    $password: String!
    $name: String!
    $email: String!
    $anonymize: Boolean = false
  ) {
    joinNetwork(input: { password: $password, email: $email, name: $name }) {
      ...AuthTokenFragment
    }
  }
  ${AUTH_TOKEN_FRAGMENT}
`;
export const RESEND_AUTH_VERIFICATION = gql `
  mutation resendAuthVerification {
    resendVerification {
      status
      __typename
    }
  }
`;
export const VERIFY_MEMBER = gql `
  mutation verifyMember(
    $verificationCode: String!
    $memberId: String!
    $anonymize: Boolean = false
  ) {
    verifyMember(
      input: { verificationCode: $verificationCode, memberId: $memberId }
    ) {
      ...AuthTokenFragment
    }
  }
  ${AUTH_TOKEN_FRAGMENT}
`;
export const RESET_PASSWORD = gql `
  mutation resetPassword($email: String!) {
    resetPassword(input: { email: $email }) {
      status
    }
  }
`;
export const CONFIRM_RESET_PASSWORD = gql `
  mutation confirmResetPassword($token: String!) {
    confirmResetPassword(input: { token: $token }) {
      status
    }
  }
`;
export const DO_RESET_PASSWORD = gql `
  mutation doResetPassword($token: String!, $newPassword: String!) {
    doResetPassword(input: { token: $token, newPassword: $newPassword }) {
      status
    }
  }
`;
export const CHECK_MEMBER_INVITATION_VALIDITY = gql `
  query checkMemberInvitationValidity($token: String!) {
    checkMemberInvitationValidity(token: $token) {
      inviteeEmail
      inviteeName
    }
  }
`;
export const JOIN_NETWORK_WITH_TOKEN = gql `
  mutation joinNetworkWithToken(
    $input: JoinNetworkWithTokenInput!
    $anonymize: Boolean = false
  ) {
    joinNetworkWithToken(input: $input) {
      ...AuthTokenFragment
    }
  }
  ${AUTH_TOKEN_FRAGMENT}
`;
export const CHECK_INVITATION_LINK_VALIDITY = gql `
  query checkInvitationLinkValidity($invitationLinkId: String!) {
    checkInvitationLinkValidity(invitationLinkId: $invitationLinkId) {
      __typename
      id
      link
    }
  }
`;
export const JOIN_NETWORK_WITH_INVITATION_LINK = gql `
  mutation joinNetworkWithInvitationLink(
    $input: JoinNetworkWithLinkInput!
    $anonymize: Boolean = false
  ) {
    joinNetworkWithInvitationLink(input: $input) {
      ...AuthTokenFragment
    }
  }
  ${AUTH_TOKEN_FRAGMENT}
`;
export const GET_SSOS = gql `
  query ssos($status: SsoStatus) {
    ssos(status: $status) {
      authorizationUrl
      userProfileUrl
      buttonText
      clientId
      clientSecret
      idpUrl
      name
      scopes
      status
      tokenUrl
      type
    }
  }
`;
export const GET_SSO_MEMBERSHIP = gql `
  query getSsoMemberships($memberId: String!) {
    getSsoMemberships(memberId: $memberId) {
      id
      ssoType
      memberId
    }
  }
`;
export const LOGIN_WITH_SSO = gql `
  query loginWithSso($input: SsoUrlInput!) {
    loginWithSso(input: $input) {
      url
    }
  }
`;
export const SSO_REDIRECT = gql `
  mutation ssoRedirect(
    $input: LoginWithSsoCodeInput!
    $anonymize: Boolean = false
  ) {
    ssoRedirect(input: $input) {
      ...AuthTokenFragment
    }
  }
  ${AUTH_TOKEN_FRAGMENT}
`;
export const UPDATE_CUSTOM_SSO = gql `
  mutation updateCustomSso($input: UpdateCustomSsoInput!) {
    updateCustomSso(input: $input) {
      authorizationUrl
      userProfileUrl
      buttonText
      clientId
      clientSecret
      idpUrl
      name
      scopes
      status
      tokenUrl
      type
    }
  }
`;
export const UPDATE_DEFAULT_SSO_STATUS = gql `
  mutation updateDefaultSsoStatus($status: SsoStatus!, $sso: DefaultSsoType!) {
    updateDefaultSsoStatus(status: $status, sso: $sso) {
      status
    }
  }
`;
export const DELETE_SSO_MEMBERSHIP = gql `
  mutation deleteSsoMembership($memberId: String!, $type: SsoType!) {
    deleteSsoMembership(memberId: $memberId, type: $type) {
      status
    }
  }
`;
export const GET_REDIRECT_URL = gql `
  query getRedirectUrl($url: String!) {
    getRedirectUrl(url: $url) {
      resolvedUrl
      url
    }
  }
`;
export const DOMAIN_TRANSFER_STATUS = gql `
  fragment DomainTransferStatus on DomainTransferStatus {
    __typename
    aaaarecords
    aaaarecordSuccess
    arecords
    arecordSuccess
    cnames
    cnameSuccess
    domain
    ns
    root
    success
    tribeARecords
    tribeCname
  }
`;
export const ADD_NEW_DOMAIN = gql `
  mutation addNewDomain($domain: String!) {
    addNewDomain(input: { domain: $domain }) {
      ...DomainTransferStatus
    }
  }
  ${DOMAIN_TRANSFER_STATUS}
`;
export const CHECK_NEW_DOMAIN_STATUS = gql `
  query checkNewDomainStatus($domain: String!) {
    checkNewDomainStatus(domain: $domain) {
      ...DomainTransferStatus
    }
  }
  ${DOMAIN_TRANSFER_STATUS}
`;
export const TRANSFER_TO_NEW_DOMAIN = gql `
  mutation transferToNewDomain {
    transferToNewDomain {
      status
      __typename
    }
  }
`;
export const CLEAR_NEW_DOMAIN = gql `
  mutation clearNewDomain {
    clearNewDomain {
      status
      __typename
    }
  }
`;
export const UPDATE_NETWORK_STATUS = gql `
  mutation updateNetworkStatus($status: NetworkStatus!) {
    updateNetworkStatus(input: { status: $status }) {
      status
    }
  }
`;
//# sourceMappingURL=network.gql.js.map