import gql from 'graphql-tag';
import { EMBED_FRAGMENT } from './embed.gql';
import { MEMBER_FRAGMENT } from './fragments/member.gql';
import { MEDIA_FRAGMENT } from './media.gql';
import { PERMISSION_ACTION_FRAGMENT } from './permissions.gql';
import { POST_TYPE_FRAGMENT, SPACE_TYPE_FRAGMENT } from './spaceTypes.gql';
export const POST_AUTHOR_FRAGMENT = gql `
  fragment PostAuthorFields on SpaceMember {
    __typename
    member {
      __typename
      id
      name
      tagline
      profilePicture {
        ...MediaFragment
      }
      role {
        id
        type
        name
        __typename
      }
    }
    role {
      id
      name
      type
      __typename
    }
  }
  ${MEDIA_FRAGMENT}
`;
export const POST_FRAGMENT = gql `
  fragment PostFields on Post {
    __typename
    id
    slug
    mappingFields {
      key
      type
      value
    }
    postTypeId
    postType {
      ...PostTypeFields
    }
    authMemberProps {
      context
      permissions {
        ...PermissionAction
      }
      __typename
    }
    hasMoreContent
    isAnonymous
    isHidden
    shortContent
    createdAt
    owner {
      ...PostAuthorFields
    }
    createdBy {
      ...PostAuthorFields
    }
    tags {
      id
      slug
      title
    }
    status
    embeds {
      ...EmbedFragment
    }
    mentions {
      id
      username
      name
    }
    reactions {
      count
      reacted
      reaction
      participants(limit: 50) {
        nodes {
          participant {
            id
            name
          }
        }
      }
    }
    space {
      __typename
      id
      slug
      name
      spaceType {
        ...SpaceTypeFields
      }
      image {
        ...MediaFragment
      }
      banner {
        ...MediaFragment
      }
      authMemberProps {
        context
        membershipStatus
        permissions {
          ...PermissionAction
        }
        __typename
      }
    }
    topRepliers {
      repliesCount
    }
    imageIds
    pinnedInto
    repliesCount
    totalRepliesCount
    repliedToIds
  }
  ${POST_TYPE_FRAGMENT}
  ${SPACE_TYPE_FRAGMENT}
  ${MEDIA_FRAGMENT}
  ${POST_AUTHOR_FRAGMENT}
  ${EMBED_FRAGMENT}
  ${PERMISSION_ACTION_FRAGMENT}
`;
export const REPLY_FRAGMENT = gql `
  fragment ReplyFields on Post {
    __typename
    id
    mappingFields {
      __typename
      key
      type
      value
    }
    postTypeId
    postType {
      ...PostTypeFields
    }
    hasMoreContent
    shortContent
    createdAt
    createdBy {
      ...PostAuthorFields
    }
    owner {
      ...PostAuthorFields
    }
    title
    tags {
      id
      slug
      title
    }
    status
    authMemberProps {
      context
      permissions {
        ...PermissionAction
      }
      __typename
    }
    reactions {
      count
      reacted
      reaction
      participants(limit: 50) {
        nodes {
          participant {
            id
            name
          }
        }
      }
    }
    embeds {
      ...EmbedFragment
    }
    mentions {
      id
      username
      name
    }
    space {
      id
      name
      slug
      spaceType {
        ...SpaceTypeFields
      }
    }
    repliesCount
    totalRepliesCount
    repliedTo {
      __typename
      id
    }
  }
  ${SPACE_TYPE_FRAGMENT}
  ${POST_AUTHOR_FRAGMENT}
  ${POST_TYPE_FRAGMENT}
  ${PERMISSION_ACTION_FRAGMENT}
  ${EMBED_FRAGMENT}
`;
export const FEED_POST_FRAGMENT = gql `
  fragment FeedPostFields on Post {
    __typename
    id
    slug
    mappingFields {
      __typename
      key
      type
      value
    }
    postTypeId
    postType {
      __typename
      context
      id
      name
      pluralName
      postTypeTemplateId
      createdAt
      primaryReactionType
      singleChoiceReactions
      updatedAt
    }
    hasMoreContent
    isAnonymous
    isHidden
    shortContent
    createdAt
    createdBy {
      ...PostAuthorFields
    }
    owner {
      ...PostAuthorFields
    }
    tags {
      id
      slug
      title
    }
    status
    authMemberProps {
      context
      permissions {
        ...PermissionAction
      }
      __typename
    }
    reactions {
      count
      reacted
      reaction
      participants(limit: 50) {
        nodes {
          participant {
            id
            name
          }
        }
      }
    }
    embeds {
      ...EmbedFragment
    }
    mentions {
      id
      username
      name
    }
    space {
      __typename
      id
      name
      slug
    }
    imageIds
    pinnedInto
    repliesCount
    totalRepliesCount
    replies(limit: 3) {
      nodes {
        owner {
          member {
            name
            id
            profilePicture {
              ...MediaFragment
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
  ${MEDIA_FRAGMENT}
  ${POST_AUTHOR_FRAGMENT}
  ${PERMISSION_ACTION_FRAGMENT}
  ${EMBED_FRAGMENT}
`;
export const GET_POST = gql `
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      ...PostFields
      repliedTo {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`;
export const GET_POSTS = gql `
  query getPosts(
    $after: String
    $before: String
    $excludePins: Boolean
    $filterBy: [PostListFilterByInput!]
    $limit: Int!
    $orderBy: PostListOrderByEnum
    $postTypeIds: [String!]
    $reverse: Boolean
    $spaceIds: [ID!]!
  ) {
    getPosts(
      after: $after
      before: $before
      excludePins: $excludePins
      filterBy: $filterBy
      limit: $limit
      orderBy: $orderBy
      postTypeIds: $postTypeIds
      reverse: $reverse
      spaceIds: $spaceIds
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          ...FeedPostFields
        }
      }
    }
  }
  ${FEED_POST_FRAGMENT}
`;
export const GET_SPACE_TOPIC_POSTS = gql `
  query getSpaceTopicPosts(
    $spaceId: ID!
    $limit: Int!
    $after: String
    $topicId: ID!
  ) {
    getSpaceTopicPosts(
      spaceId: $spaceId
      limit: $limit
      after: $after
      topicId: $topicId
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          ...FeedPostFields
        }
      }
    }
  }
  ${FEED_POST_FRAGMENT}
`;
export const GET_FEED = gql `
  query getFeed(
    $after: String
    $before: String
    $filterBy: [PostListFilterByInput!]
    $limit: Int!
    $onlyMemberSpaces: Boolean
    $orderBy: PostListOrderByEnum
    $postTypeIds: [String!]
    $reverse: Boolean
  ) {
    getFeed(
      after: $after
      before: $before
      filterBy: $filterBy
      limit: $limit
      onlyMemberSpaces: $onlyMemberSpaces
      orderBy: $orderBy
      postTypeIds: $postTypeIds
      reverse: $reverse
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          ...FeedPostFields
        }
      }
    }
  }
  ${FEED_POST_FRAGMENT}
`;
export const GET_MEMBER_FEED = gql `
  query getMemberFeed($memberId: ID!, $limit: Int!, $after: String) {
    getMemberPosts(memberId: $memberId, limit: $limit, after: $after) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          ...FeedPostFields
        }
      }
    }
  }
  ${FEED_POST_FRAGMENT}
`;
export const GET_POST_REPLIES = gql `
  query getReplies(
    $postId: ID!
    $offset: Int
    $before: String
    $after: String
    $limit: Int!
    $reverse: Boolean = true
  ) {
    getReplies(
      postId: $postId
      offset: $offset
      limit: $limit
      before: $before
      after: $after
      reverse: $reverse
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
        __typename
        node {
          ...ReplyFields
        }
      }
    }
  }
  ${REPLY_FRAGMENT}
`;
export const ADD_POST = gql `
  mutation addPost(
    $spaceId: ID!
    $mappingFields: [PostMappingFieldInput!]
    $postTypeId: String!
    $tagNames: [String!]
  ) {
    addPost(
      input: {
        mappingFields: $mappingFields
        postTypeId: $postTypeId
        publish: true
        tagNames: $tagNames
      }
      spaceId: $spaceId
    ) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`;
export const UPDATE_POST = gql `
  mutation updatePost(
    $id: ID!
    $mappingFields: [PostMappingFieldInput!]
    $tagNames: [String!]
  ) {
    updatePost(
      input: {
        publish: false
        mappingFields: $mappingFields
        tagNames: $tagNames
      }
      id: $id
    ) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`;
export const REMOVE_POST = gql `
  mutation removePost($postId: ID!) {
    removePost(postId: $postId) {
      status
      __typename
    }
  }
`;
export const PIN_POST_TO_SPACE = gql `
  mutation pinPostToSpace($postId: ID!) {
    pinPostToSpace(postId: $postId) {
      status
      __typename
    }
  }
`;
export const UNPIN_POST_FROM_SPACE = gql `
  mutation unpinPostFromSpace($postId: ID!) {
    unpinPostFromSpace(postId: $postId) {
      status
      __typename
    }
  }
`;
export const ADD_REACTION = gql `
  mutation addReaction($input: AddReactionInput!, $postId: ID!) {
    addReaction(input: $input, postId: $postId) {
      status
      __typename
    }
  }
`;
export const REMOVE_REACTION = gql `
  mutation removeReaction($reaction: String!, $postId: ID!) {
    removeReaction(reaction: $reaction, postId: $postId) {
      status
      __typename
    }
  }
`;
export const ADD_REPLY = gql `
  mutation addReply(
    $postId: ID!
    $mappingFields: [PostMappingFieldInput!]
    $postTypeId: String!
  ) {
    addReply(
      input: {
        publish: true
        postTypeId: $postTypeId
        mappingFields: $mappingFields
      }
      postId: $postId
    ) {
      ...ReplyFields
    }
  }
  ${REPLY_FRAGMENT}
`;
export const POST_REACTION_PARTICIPANT_FRAGMENT = gql `
  fragment PostReactionParticipantFields on PostReactionParticipant {
    participant {
      ...MemberFragment
    }
  }
  ${MEMBER_FRAGMENT}
`;
export const GET_POST_REACTION_PARTICIPANTS = gql `
  query getPostReactionParticipants(
    $postId: ID!
    $reactionId: ID!
    $limit: Int!
    $after: String
  ) {
    getPostReactionParticipants(
      postId: $postId
      reaction: $reactionId
      limit: $limit
      after: $after
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          ...PostReactionParticipantFields
        }
      }
    }
  }
  ${POST_REACTION_PARTICIPANT_FRAGMENT}
`;
export const MEMBER_SPACES_PINNED_POSTS = gql `
  query memberSpacesPinnedPosts($limit: Int!, $after: String, $memberId: ID!) {
    memberSpaces(limit: $limit, after: $after, memberId: $memberId) {
      edges {
        node {
          space {
            pinnedPosts {
              ...FeedPostFields
            }
          }
        }
      }
    }
  }
  ${FEED_POST_FRAGMENT}
`;
export const HIDE_POST = gql `
  mutation hidePost($postId: ID!) {
    hidePost(id: $postId) {
      status
      __typename
    }
  }
`;
export const UNHIDE_POST = gql `
  mutation unhidePost($postId: ID!) {
    unhidePost(id: $postId) {
      status
      __typename
    }
  }
`;
//# sourceMappingURL=posts.gql.js.map