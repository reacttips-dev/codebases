import gql from 'graphql-tag';
export const ROLE_FRAGMENT = gql `
  fragment RoleFragment on Role {
    __typename
    id
    name
    type
    description
    visible
  }
`;
export const GET_ROLES = gql `
  query getRoles {
    getRoles {
      ...RoleFragment
    }
  }
  ${ROLE_FRAGMENT}
`;
//# sourceMappingURL=roles.gql.js.map