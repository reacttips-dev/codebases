import gql from 'graphql-tag';
export const MEDIA_URL_FRAGMENT = gql `
  fragment MediaUrls on MediaUrls {
    full
    large
    medium
    small
    thumb
    __typename
  }
`;
export const MEDIA_FRAGMENT = gql `
  fragment MediaFragment on Media {
    ... on Image {
      id
      url
      width
      height
      dominantColorHex
      dpi
      cropHeight
      cropWidth
      cropX
      cropY
      cropZoom
      urls {
        ...MediaUrls
      }
    }
    ... on Emoji {
      id
      text
    }
    __typename
  }
  ${MEDIA_URL_FRAGMENT}
`;
export const CREATE_IMAGES = gql `
  mutation createImages($input: [CreateImageInput!]!) {
    createImages(input: $input) {
      fields
      mediaId
      mediaUrl
      signedUrl
      urls {
        ...MediaUrls
      }
      __typename
    }
  }
  ${MEDIA_URL_FRAGMENT}
`;
export const UPDATE_IMAGE = gql `
  mutation updateImage($id: String!, $input: UpdateImageInput!) {
    updateImage(id: $id, input: $input) {
      ...MediaFragment
    }
  }
  ${MEDIA_FRAGMENT}
`;
export const CREATE_EMOJIS = gql `
  mutation createEmojis($input: [CreateEmojiInput!]!) {
    createEmojis(input: $input) {
      id
      text
    }
  }
`;
export const GET_MEDIA = gql `
  query getMedia($mediaId: ID!) {
    getMedia(mediaId: $mediaId) {
      ...MediaFragment
    }
  }
  ${MEDIA_FRAGMENT}
`;
//# sourceMappingURL=media.gql.js.map