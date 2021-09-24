import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { selectPosts, selectPropsPostId, selectPropsPostIds } from './post'
import { selectComments, selectPropsCommentIds } from './comment'
import { selectArtistInviteSubmissions, selectPropsSubmissionIds } from './artist_invites'
import { getTempAssetId } from './../components/regions/ImageRegion'

/* eslint-disable import/prefer-default-export */

// Requires `postIds`, `postId`, `commentIds`, or `submissionIds` to be found in props
// returns a [`postId`, `assetId`] array pair inside a larger array
export const selectPostsAssetIds = createSelector(
  [
    selectPropsPostIds,
    selectPropsPostId,
    selectPosts,
    selectPropsCommentIds,
    selectComments,
    selectPropsSubmissionIds,
    selectArtistInviteSubmissions,
  ],
  (
    propsPostIds,
    singlePostId,
    posts,
    propsCommentIds,
    comments,
    propsSubmissionIds,
    submissions,
  ) => {
    // standard posts stream
    let postIds = propsPostIds
    let postsToMap = posts

    // single post
    if (!postIds && singlePostId) {
      postIds = []
      postIds.push(singlePostId)
    }

    // comments stream
    if (!postIds && propsCommentIds) {
      postsToMap = comments
      postIds = propsCommentIds
    }

    // artist invites stream
    // need to retrieve actual posts Ids from submissions
    // submissions have no post content, so we still use `posts` as `postsToMap`
    if (!postIds && propsSubmissionIds) {
      postIds = []
      propsSubmissionIds.forEach((submissionId) => {
        const submission = submissions.get(submissionId, Immutable.Map())
        if (submission) {
          postIds.push(submission.getIn(['links', 'post', 'id']))
        }
      })
    }

    // iterate posts in state and return associated assetIds as array
    const combinedPostsAssetIds = []
    postIds.forEach((postId) => {
      const post = postsToMap.get(postId, Immutable.Map())
      const postContent = post.get('content', Immutable.List())
      const postRepostContent = post.get('repostContent')

      // accomodate reposts (if available)
      // retrieve repost `postId` + original post `assetId` pairing
      if (postRepostContent) {
        postRepostContent.forEach((region) => {
          const assetId = region.getIn(['links', 'assets'])
          if (assetId) {
            return combinedPostsAssetIds.push([postId, assetId])
          }
          return null
        })
      }

      // retrieve `postId` + `assetId` pairing
      postContent.forEach((region) => {
        const assetId = region.getIn(['links', 'assets'])
        if (assetId) {
          return combinedPostsAssetIds.push([postId, assetId])
        }

        // brand new post
        if (region.get('kind') === 'image') {
          const url = region.getIn(['data', 'url'])
          if (url) {
            const tempAssetId = getTempAssetId(url)
            return combinedPostsAssetIds.push([postId, tempAssetId])
          }
        }
        return null
      })

      return combinedPostsAssetIds
    })

    return combinedPostsAssetIds
  },
)
