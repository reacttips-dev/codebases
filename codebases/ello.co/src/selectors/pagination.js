/* eslint-disable import/prefer-default-export */
import { createSelector } from 'reselect'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { findModel } from '../helpers/json_helper'
import { selectPages, selectPagesResult } from '../selectors/pages'
import { selectParamsToken } from '../selectors/params'
import { selectPropsPathname } from '../selectors/routing'
import { selectJson } from '../selectors/store'

const PAGING_BLACKLIST = [
  /^\/enter\b/,
  /^\/forgot-password\b/,
  /^\/join\b/,
  /^\/confirm\b/,
  /^\/signup\b/,
  /^\/following$/,
  /^\/notifications\b/,
  /^\/settings\b/,
  /^\/onboarding\b/,
  /^\/invitations\b/,
]

// Memoized selectors
export const selectPagination = createSelector(
  [selectJson, selectPages, selectPropsPathname, selectPagesResult, selectParamsToken],
  (json, pages, pathname, pagingResult, paramsToken) => {
    let result = pagingResult
    const isPagingEnabled = !(PAGING_BLACKLIST.every(re => re.test(pathname)))
    if (pages && isPagingEnabled) {
      if (!pagingResult && paramsToken) {
        const post = findModel(json, {
          collection: MAPPING_TYPES.POSTS,
          findObj: { token: paramsToken },
        })
        result = post ? pages.get(`/posts/${post.get('id')}/comments`) : null
      }
    }
    return result.get('pagination')
  },
)

