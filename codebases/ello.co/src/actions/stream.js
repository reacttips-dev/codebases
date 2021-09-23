import React from 'react'
import { V3 } from '../constants/action_types'
import { postsAsGrid, postsAsList } from '../components/streams/StreamRenderables'
import { ZeroFollowingStream } from '../components/zeros/Zeros'
import {
  followingPostStreamQuery,
} from '../queries/postStreamQueries'

const KINDS = {
  recent: 'RECENT',
  trending: 'TRENDING',
}

export function loadFollowing(kind, before) {
  return {
    type: V3.LOAD_STREAM,
    payload: {
      query: followingPostStreamQuery,
      variables: { kind: KINDS[kind], before },
    },
    meta: {
      renderStream: {
        asList: postsAsList,
        asGrid: postsAsGrid,
        asZero: <ZeroFollowingStream />,
      },
    },
  }
}

export default loadFollowing

