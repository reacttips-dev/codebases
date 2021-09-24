import React from 'react'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import { ZeroState } from '../components/zeros/Zeros'

export function searchForPosts(terms) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: {
      endpoint: api.searchPosts({
        per_page: api.PER_PAGE,
        terms: encodeURIComponent(terms),
      }),
    },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      renderStream: {
        asGrid: StreamRenderables.postsAsGrid,
        asList: StreamRenderables.postsAsList,
        asZero: <ZeroState />,
      },
      resultKey: '/search/posts',
    },
  }
}

export function searchForUsers(terms) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: {
      endpoint: api.searchUsers({
        per_page: api.PER_PAGE,
        terms: encodeURIComponent(terms),
      }),
    },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asGrid: StreamRenderables.usersAsGrid,
        asList: StreamRenderables.usersAsGrid,
        asZero: <ZeroState />,
      },
      resultKey: '/search/users',
    },
  }
}

