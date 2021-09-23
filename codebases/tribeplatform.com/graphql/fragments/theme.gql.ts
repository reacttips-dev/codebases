import gql from 'graphql-tag';
export const THEMES_FRAGMENT = gql `
  fragment ThemesFragment on Themes {
    active {
      name
      status
      tokens {
        colors {
          key
          value
        }
      }
    }
  }
`;
//# sourceMappingURL=theme.gql.js.map