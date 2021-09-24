import React from 'react'
import * as ACTION_TYPES from '../constants/action_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import navCategoriesQuery from '../queries/navCategories'
import allCategoriesQuery from '../queries/allCategories'
import { ZeroSubscribedStream } from '../components/zeros/Zeros'
import {
  globalPostStreamQuery,
  subscribedPostStreamQuery,
  categoryPostStreamQuery,
} from '../queries/postStreamQueries'
import categoryDetailsQuery from '../queries/categoryDetailsQuery'

const KINDS = {
  featured: 'FEATURED',
  recent: 'RECENT',
  trending: 'TRENDING',
  shop: 'SHOP',
}

const postStreamMeta = {
  renderStream: {
    asList: StreamRenderables.postsAsList,
    asGrid: StreamRenderables.postsAsGrid,
  },
}

export function getCategories() {
  return {
    type: ACTION_TYPES.V3.LOAD_CATEGORIES,
    payload: {
      query: allCategoriesQuery,
      variables: {},
    },
  }
}

export function getNavCategories() {
  return {
    type: ACTION_TYPES.V3.LOAD_CATEGORIES,
    payload: {
      query: navCategoriesQuery,
      variables: {},
    },
  }
}

export function loadGlobalPostStream(kind, before) {
  return {
    type: ACTION_TYPES.V3.LOAD_STREAM,
    payload: {
      query: globalPostStreamQuery,
      variables: { kind: KINDS[kind], before },
    },
    meta: postStreamMeta,
  }
}

export function loadSubscribedPostStream(kind, before) {
  return {
    type: ACTION_TYPES.V3.LOAD_STREAM,
    payload: {
      query: subscribedPostStreamQuery,
      variables: { kind: KINDS[kind], before },
    },
    meta: {
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
        asZero: <ZeroSubscribedStream />,
      },
    },
  }
}

export function loadCategoryPostStream(slug, kind, before) {
  return {
    type: ACTION_TYPES.V3.LOAD_STREAM,
    payload: {
      query: categoryPostStreamQuery,
      variables: { kind: KINDS[kind], slug, before },
    },
    meta: postStreamMeta,
  }
}

export function loadCategoryDetails(slug) {
  return {
    type: ACTION_TYPES.V3.CATEGORY.LOAD,
    payload: {
      query: categoryDetailsQuery,
      variables: { slug, roles: ['CURATOR', 'MODERATOR'] },
    },
  }
}

export function bindDiscoverKey(type) {
  return {
    type: ACTION_TYPES.GUI.BIND_DISCOVER_KEY,
    payload: { type },
  }
}
