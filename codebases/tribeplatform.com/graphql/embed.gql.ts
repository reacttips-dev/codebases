import gql from 'graphql-tag';
export const EMBED_FRAGMENT = gql `
  fragment EmbedFragment on Embed {
    ... on Embed {
      __typename
      author
      html
      id
      url
      thumbnail_url
      thumbnail_width
      thumbnail_height
    }
  }
`;
export const EMBED = gql `
  query embed($url: String!, $options: String) {
    embed(input: { url: $url, options: $options }) {
      ...EmbedFragment
    }
  }
  ${EMBED_FRAGMENT}
`;
//# sourceMappingURL=embed.gql.js.map