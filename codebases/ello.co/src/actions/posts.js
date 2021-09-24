import { LOAD_STREAM, POST, V3 } from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import { findPostQuery } from '../queries/findPost'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import { resetEditor } from '../actions/editor'
import commentStreamQuery from '../queries/commentStreamQuery'

export function createPost(body, editorId, repostId, repostedFromId, artistInviteId, categoryIds) {
  const data = { category_ids: categoryIds || [] }
  if (body.length > 0) {
    data.body = body
  }
  if (data && !repostId && !repostedFromId && artistInviteId) {
    data.artist_invite_id = artistInviteId
  }
  return {
    type: POST.CREATE,
    payload: {
      body: data,
      editorId,
      endpoint: api.createPost(repostId),
      method: 'POST',
    },
    meta: {
      artistInviteId,
      mappingType: MAPPING_TYPES.POSTS,
      repostId,
      repostedFromId,
      successAction: resetEditor(editorId),
    },
  }
}

export function deletePost(post) {
  return {
    type: POST.DELETE,
    payload: {
      endpoint: api.deletePost(post.get('id')),
      method: 'DELETE',
      model: post,
    },
    meta: {},
  }
}

export function flagPost(post, kind) {
  return {
    type: POST.FLAG,
    payload: {
      endpoint: api.flagPost(post.get('id'), kind),
      method: 'POST',
    },
    meta: {},
  }
}

// commentsAsList needs the "parent post" so that the correct editor is referenced when replying to
// a comment.
export function loadComments(postId, addUpdateKey = true) {
  const obj = {
    type: V3.LOAD_STREAM,
    payload: {
      query: commentStreamQuery,
      variables: { id: postId },
      postIdOrToken: postId,
    },
    meta: {
      mappingType: MAPPING_TYPES.COMMENTS,
      mergeResults: true,
      renderStream: {
        asList: StreamRenderables.commentsAsList,
        asGrid: StreamRenderables.commentsAsList,
      },
      resultKey: `/posts/${postId}/comments`,
      updateKey: `/posts/${postId}`,
    },
  }
  if (addUpdateKey) {
    obj.meta.updateKey = `/posts/${postId}/`
  }
  return obj
}

export function loadEditablePost(idOrToken) {
  return {
    type: POST.EDITABLE,
    payload: { endpoint: api.editPostDetail(idOrToken) },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      updateResult: false,
    },
  }
}

export function loadPostDetail(token, username) {
  return {
    type: V3.POST.DETAIL,
    payload: {
      query: findPostQuery,
      variables: { token, username },
    },
  }
}

export function loadRelatedPosts(postId, perPage) {
  return {
    type: LOAD_STREAM,
    payload: {
      endpoint: api.relatedPosts(postId, perPage),
      postIdOrToken: postId,
    },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      renderStream: {
        asList: StreamRenderables.postsAsRelated,
        asGrid: StreamRenderables.postsAsRelated,
      },
      resultKey: `/posts/${postId}/related_posts`,
    },
  }
}

export function lovePost({ post, trackLabel, trackOptions }) {
  const postId = post.get('id')
  return {
    type: POST.LOVE,
    payload: {
      endpoint: api.lovePost(postId),
      method: 'POST',
      model: post,
      trackLabel,
      trackOptions,
    },
    meta: {
      mappingType: MAPPING_TYPES.LOVES,
      resultKey: `/posts/${postId}/love`,
      updateKey: `/posts/${postId}/`,
    },
  }
}

export function watchPost(post) {
  const postId = post.get('id')
  return {
    type: POST.WATCH,
    payload: {
      endpoint: api.watchPost(postId),
      method: 'POST',
      model: post,
    },
    meta: {
      mappingType: MAPPING_TYPES.WATCHES,
      resultKey: `/posts/${postId}/watch`,
      updateKey: `/posts/${postId}/`,
    },
  }
}

export function toggleComments(post, showComments) {
  return {
    type: POST.TOGGLE_COMMENTS,
    payload: {
      model: post,
      showComments,
    },
  }
}

export function toggleEditing(post, isEditing) {
  return {
    type: POST.TOGGLE_EDITING,
    payload: {
      model: post,
      isEditing,
    },
  }
}

export function toggleReposting(post, isReposting) {
  return {
    type: POST.TOGGLE_REPOSTING,
    payload: {
      model: post,
      isReposting,
    },
  }
}

export function trackPostViews(ids, tokens, streamKind, streamId) {
  return {
    type: POST.TRACK_VIEWS,
    payload: {
      endpoint: api.trackPostViews(ids, tokens, streamKind, streamId),
      method: 'GET',
    },
    meta: {},
  }
}

// Currently not tracking unlove's but trying to keep the api similar to the `lovePost` action.
export function unlovePost({ post, trackLabel, trackOptions }) {
  const postId = post.get('id')
  return {
    type: POST.LOVE,
    payload: {
      endpoint: api.unlovePost(postId),
      method: 'DELETE',
      model: post,
      trackLabel,
      trackOptions,
    },
    meta: {
      resultKey: `/posts/${postId}/love`,
      updateKey: `/posts/${postId}/`,
    },
  }
}

export function unwatchPost(post) {
  const postId = post.get('id')
  return {
    type: POST.WATCH,
    payload: {
      endpoint: api.unwatchPost(postId),
      method: 'DELETE',
      model: post,
    },
    meta: {
      resultKey: `/posts/${postId}/watch`,
      updateKey: `/posts/${postId}/`,
    },
  }
}

export function updatePost(post, body, editorId) {
  return {
    type: POST.UPDATE,

    payload: {
      body: { body },
      editorId,
      endpoint: api.updatePost(post.get('id')),
      method: 'PATCH',
      model: post,
    },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
    },
  }
}

