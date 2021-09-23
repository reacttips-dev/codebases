import gql from 'graphql-tag';
import { MEDIA_FRAGMENT } from '../media.gql';
import { PERMISSION_ACTION_FRAGMENT } from '../permissions.gql';
import { ROLE_FRAGMENT } from '../roles.gql';
export const MEMBER_FRAGMENT = gql `
  fragment MemberFragment on Member {
    __typename
    displayName
    name
    id
    attributes {
      locale
    }
    authMemberProps {
      context
      permissions {
        ...PermissionAction
      }
      __typename
    }
    profilePicture {
      ...MediaFragment
    }
    banner {
      ...MediaFragment
    }
    status
    username
    email
    emailStatus
    tagline
    lastSeen
    role {
      ...RoleFragment
    }
  }
  ${MEDIA_FRAGMENT}
  ${ROLE_FRAGMENT}
  ${PERMISSION_ACTION_FRAGMENT}
`;
//# sourceMappingURL=member.gql.js.map