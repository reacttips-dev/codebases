import gql from 'graphql-tag';
export const PERMISSION_ACTION_FRAGMENT = gql `
  fragment IsAuthorizedFragment on IsAuthorized {
    authorized
    reason
    requiredPlan
    __typename
  }

  fragment InputPathPermissionsFragment on InputPathPermissions {
    isAuthorized {
      ...IsAuthorizedFragment
    }
    path
    values {
      isAuthorized {
        authorized
        reason
        requiredPlan
      }
      value
    }
    __typename
  }
  fragment PathPermissionsFragment on PathPermissions {
    #    TODO atm returns server error
    #    isAuthorized {
    #      ...IsAuthorizedFragment
    #    }
    path
    __typename
  }

  fragment PermissionAction on ActionPermissions {
    __typename
    name
    isAuthorized {
      ...IsAuthorizedFragment
    }
    inputPermissions {
      ...InputPathPermissionsFragment
    }
    outputPermissions {
      ...PathPermissionsFragment
    }
  }
`;
export const GET_PERMISSIONS = gql `
  query getPermissions($contexts: [PermissionsContextInput!] = []) {
    getPermissions(contexts: $contexts) {
      contextAwareActions {
        __typename
        context
        entityActions {
          __typename
          id
          actions {
            ...PermissionAction
          }
        }
      }
    }
  }
  ${PERMISSION_ACTION_FRAGMENT}
`;
//# sourceMappingURL=permissions.gql.js.map