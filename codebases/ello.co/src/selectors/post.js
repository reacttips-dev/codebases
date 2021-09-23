import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectPages } from './pages'
import { selectParamsToken } from './params'
import {
  selectCategoryCollection,
  selectCategoryForPath,
  selectCategoryPostCollection,
} from './categories'
import { LOAD_STREAM_REQUEST } from '../constants/action_types'
import { COMMENTS, POSTS } from '../constants/mapping_types'
import { selectIsPostDetail } from './routing'
import { numberToHuman } from '../lib/number_to_human'
import { selectIsLoggedIn } from './authentication'
import { selectIsGridMode, selectIsMobile } from './gui'
import { selectId as selectProfileId } from './profile'
import { selectStreamType, selectStreamMappingType, selectStreamPostIdOrToken } from './stream'
import { selectUsers } from './user'
import {
  selectArtistInviteSubmissions,
  selectArtistInvites,
} from './artist_invites'

const countProtector = count => (count < 0 ? 0 : count)

export const selectPropsPostId = (state, props) =>
  get(props, 'postId') || get(props, 'post', Immutable.Map()).get('id')
export const selectPropsPostIds = (state, props) => get(props, 'postIds')

export const selectPropsPostIsRelated = (state, props) => get(props, 'isRelatedPost', false)
export const selectPropsLocationStateFrom = (state, props) => get(props, ['location', 'state', 'from'], null)
export const selectPosts = state => state.json.get(POSTS, Immutable.Map())

// Memoized selectors
// Requires `postId`, `post` or `params.token` to be found in props
export const selectPost = createSelector(
  [selectPropsPostId, selectParamsToken, selectPosts], (id, token, posts) => {
    if (id) {
      return posts.get(id, Immutable.Map())
    } else if (token) {
      return (posts.find(post => post.get('token') === token)) || Immutable.Map()
    }
    return Immutable.Map()
  },
)

// Properties on the post reducer
export const selectPostAuthorId = createSelector([selectPost], post => post.get('authorId'))
export const selectPostBody = createSelector([selectPost], post => post.get('body'))
export const selectPostCommentsCount = createSelector([selectPost], post => countProtector(post.get('commentsCount')))
export const selectPostContent = createSelector([selectPost], post => (post.get('content') || Immutable.Map()))
export const selectPostContentWarning = createSelector([selectPost], post => post.get('contentWarning'))
export const selectPostCreatedAt = createSelector([selectPost], post => post.get('createdAt'))
export const selectPostHref = createSelector([selectPost], post => post.get('href'))
export const selectPostId = createSelector([selectPost], post => post.get('id'))
export const selectPostIsAdultContent = createSelector([selectPost], post => post.get('isAdultContent'))
export const selectPostMetaAttributes = createSelector([selectPost], post => post.get('metaAttributes', Immutable.Map()))
export const selectPostLoved = createSelector([selectPost], post => post.get('loved'))
export const selectPostLovesCount = createSelector([selectPost], post => countProtector(post.get('lovesCount')))
export const selectPostRepostContent = createSelector([selectPost], post => (post.get('repostContent') || Immutable.Map()))
export const selectPostRepostId = createSelector([selectPost], post => post.get('repostId'))
export const selectPostReposted = createSelector([selectPost], post => post.get('reposted'))
export const selectPostRepostsCount = createSelector([selectPost], post => countProtector(post.get('repostsCount')))
export const selectPostShowComments = createSelector([selectPost], post => post.get('showComments', false))
export const selectPostSummary = createSelector([selectPost], post => (post.get('summary') || Immutable.Map()))
export const selectPostToken = createSelector([selectPost], post => post.get('token'))
export const selectPostViewsCount = createSelector([selectPost], post => countProtector(post.get('viewsCount')))
export const selectPostViewsCountRounded = createSelector(
  [selectPostViewsCount], count => numberToHuman(count, false),
)
export const selectPostWatching = createSelector([selectPost], post => post.get('watching') || false)

// Nested properties on the post reducer
export const selectPostMetaDescription = createSelector(
  [selectPostMetaAttributes], metaAttributes => metaAttributes.get('description'),
)

export const selectPostMetaCanonicalUrl = createSelector(
  [selectPostMetaAttributes], metaAttributes => metaAttributes.get('canonicalUrl'),
)

export const selectPostMetaEmbeds = createSelector(
  [selectPostMetaAttributes], (metaAttributes) => {
    const embeds = (metaAttributes.get('embeds') || Immutable.List()).toArray()
    const openGraphEmbeds = embeds.map(embed => ({ property: 'og:video', content: embed }))
    return { openGraphEmbeds }
  },
)

export const selectPostMetaImages = createSelector(
  [selectPostMetaAttributes], (metaAttributes) => {
    const images = (metaAttributes.get('images') || Immutable.List()).toArray()
    const openGraphImages = images.map(image => ({ property: 'og:image', content: image }))
    const schemaImages = images.map(image => ({ name: 'image', itemprop: 'image', content: image }))
    return { openGraphImages, schemaImages }
  },
)

export const selectPostMetaRobots = createSelector(
  [selectPostMetaAttributes], metaAttributes => metaAttributes.get('robots'),
)

export const selectPostMetaTitle = createSelector(
  [selectPostMetaAttributes], metaAttributes => metaAttributes.get('title'),
)

export const selectPostMetaUrl = createSelector(
  [selectPostMetaAttributes], metaAttributes => metaAttributes.get('url'),
)

// Derived or additive properties
export const selectPostAuthor = createSelector(
  [selectUsers, selectPostAuthorId], (users, authorId) =>
    users.get(authorId, Immutable.Map()),
)

export const selectPostAuthorUsername = createSelector(
  [selectPostAuthor], author => author.get('username'),
)

export const selectPostAuthorHasCommentingEnabled = createSelector(
  [selectPostAuthor], author => author.get('hasCommentingEnabled'),
)

export const selectPostHasRelatedButton = createSelector(
  [selectPostId, selectPages, selectIsMobile], (postId, pages, isMobile) =>
    !pages.getIn([`/posts/${postId}/related_posts`, 'ids'], Immutable.List()).isEmpty() && !isMobile,
)

// TODO: Pull other properties out of post.get('links')?
export const selectPostRepostAuthorId = createSelector([selectPost], post =>
  post.getIn(['links', 'repostAuthor', 'id']),
)

export const selectPostCategories = createSelector(
  [selectPost], post => post.getIn(['links', 'categories'], Immutable.List()),
)

export const selectPostCategory = createSelector(
  [selectCategoryCollection, selectPostCategories], (collection, categoryIds) =>
    (collection && collection.get(categoryIds ? `${categoryIds.first()}` : null)),
)

export const selectPostCategoryName = createSelector(
  [selectPostCategory], category => category && category.get('name', null),
)

export const selectPostCategorySlug = createSelector(
  [selectPostCategory], category => (category ? `/discover/${category.get('slug')}` : null),
)

export const selectPostCategoryPostIds = createSelector(
  [selectPost], post => post.getIn(['links', 'categoryPosts'], Immutable.List()))

export const selectPostCategoryPosts = createSelector(
  [selectCategoryPostCollection, selectPostCategoryPostIds], (collection, cpIds) =>
    (collection && cpIds.map(id => collection.get(id))))

export const selectPostCategoryPostForPath = createSelector(
  [selectPostCategoryPosts, selectCategoryForPath], (categoryPosts, category) =>
    !!category && categoryPosts.find(cp => cp.get('categoryId') === category.get('id')))

export const selectPostCategoryPostStatusForPath = createSelector(
  [selectPostCategoryPostForPath], categoryPost => categoryPost && categoryPost.get('status'))

export const selectPostCategoryPostActionsForPath = createSelector(
  [selectPostCategoryPostForPath], categoryPost => categoryPost && categoryPost.get('actions'))

export const selectPostDetailPath = createSelector(
  [selectPostAuthorUsername, selectPostToken], (username, token) => `/${username}/post/${token}`,
)

export const selectPostIsArtistInviteSubmission = createSelector(
  [selectPost], post => post && !!post.get('artistInviteId'),
)

export const selectPostArtistInviteSubmissionId = createSelector(
  [selectPost], post => post && post.get('artistInviteSubmissionId'),
)

export const selectPostArtistInviteSubmission = createSelector(
  [selectPostArtistInviteSubmissionId, selectArtistInviteSubmissions],
  (id, submissions) => id && submissions.get(id),
)

export const selectPostArtistInviteSubmissionStatus = createSelector(
  [selectPostArtistInviteSubmissionId, selectArtistInviteSubmissions],
  (id, submissions) => id && submissions.getIn([id, 'status']),
)

export const selectPostArtistInviteId = createSelector(
  [selectPost], post => post && post.get('artistInviteId'),
)

export const selectPostArtistInvite = createSelector(
  [selectPostArtistInviteId, selectArtistInvites],
  (id, invites) => id && invites.get(id, null),
)

export const selectPostIsCommentsRequesting = createSelector(
  [selectStreamType, selectStreamMappingType, selectStreamPostIdOrToken,
    selectPostId, selectPostToken],
  (streamType, streamMappingType, streamPostIdOrToken, postId, postToken) =>
    streamType === LOAD_STREAM_REQUEST && streamMappingType === COMMENTS &&
    (`${streamPostIdOrToken}` === `${postId}` || `${streamPostIdOrToken}` === `${postToken}`),
)

export const selectPostIsEditing = createSelector([selectPost], post =>
  post.get('isEditing', false),
)

export const selectPostIsEmpty = createSelector(
  [selectPost], post => post.isEmpty(),
)

export const selectPostIsGridMode = createSelector(
  [selectIsPostDetail, selectIsGridMode, selectPropsPostIsRelated],
  (isPostDetail, isGridMode, isRelated) =>
    (isPostDetail ? isRelated : isGridMode),
)

export const selectPostIsOwn = createSelector(
  [selectPostAuthorId, selectProfileId], (authorId, profileId) =>
    `${authorId}` === `${profileId}`,
)

export const selectPostIsOwnOriginal = createSelector(
  [selectPostRepostAuthorId, selectProfileId], (repostAuthorId, profileId) =>
    `${repostAuthorId}` === `${profileId}`,
)

export const selectPostIsRepost = createSelector(
  [selectPostRepostContent], repostContent => !!(repostContent && repostContent.size),
)

export const selectPostIsReposting = createSelector([selectPost], post =>
  post.get('isReposting', false),
)

export const selectPostIsWatching = createSelector(
  [selectIsLoggedIn, selectPostWatching], (isLoggedIn, watching) => isLoggedIn && watching,
)

export const selectPostRepostAuthor = createSelector(
  [selectUsers, selectPostRepostAuthorId], (users, repostAuthorId) =>
    users.get(repostAuthorId, Immutable.Map()),
)

export const selectPostRepostAuthorWithFallback = createSelector(
  [selectPostIsRepost, selectPostRepostAuthor, selectPostAuthor],
  (isRepost, repostAuthor, author) =>
    (isRepost ? ((repostAuthor.get('id') && repostAuthor) || author) : null),
)

// Editor and drawer states for a given post
export const selectPostShowEditor = createSelector(
  [selectPostIsEditing, selectPostIsReposting, selectPostBody, selectPropsPostIsRelated],
  (isEditing, isReposting, postBody, isRelated) =>
    !!((isEditing || isReposting) && postBody) && !isRelated,
)

export const selectPostShowCommentEditor = createSelector(
  [selectPostShowEditor, selectPostShowComments, selectIsPostDetail, selectPropsPostIsRelated],
  (showEditor, showComments, isPostDetail, isRelated) =>
    !showEditor && !isPostDetail && showComments && !isRelated,
)

const selectPostDetailCommentLabel = createSelector(
  [selectPostCommentsCount, selectPostAuthorHasCommentingEnabled, selectIsLoggedIn],
  (commentsCount, hasCommentingEnabled, isLoggedIn) => {
    if (!hasCommentingEnabled || (!isLoggedIn && Number(commentsCount) < 1)) { return null }
    return (Number(commentsCount) > 0 ?
      `${numberToHuman(commentsCount)} Comment${commentsCount === 1 ? '' : 's'}` : 'Comments')
  },
)

const selectPostDetailLovesLabel = createSelector(
  [selectPostLovesCount], lovesCount =>
    (Number(lovesCount) > 0 ?
      `${numberToHuman(lovesCount)} Love${lovesCount === 1 ? '' : 's'}` : null),
)

const selectPostDetailRepostsLabel = createSelector(
  [selectPostRepostsCount], repostsCount =>
    (Number(repostsCount) > 0 ?
      `${numberToHuman(repostsCount)} Repost${repostsCount === 1 ? '' : 's'}` : null),
)

export const selectPostDetailTabs = createSelector(
  [selectPostDetailCommentLabel, selectPostDetailLovesLabel, selectPostDetailRepostsLabel],
  (commentsLabel, lovesLabel, repostsLabel) => [
    commentsLabel && { type: 'comments', children: commentsLabel },
    lovesLabel && { type: 'loves', children: lovesLabel },
    repostsLabel && { type: 'reposts', children: repostsLabel },
  ].filter(tab => tab),
)

export const selectPostFirstImage = createSelector(
  [selectPostSummary], (blocks) => {
    if (blocks.isEmpty()) { return Immutable.Map() }
    return blocks.filter(block => /image/.test(block.get('kind')) && block.getIn(['asset', 'attachment']))
      .map(block => block.getIn(['asset', 'attachment']))
      .first()
  },
)

// Proxy selectors from the repost to the original post.

export const selectOriginalPostId = createSelector([selectPost], post =>
  post.getIn(['links', 'repostedSource', 'id'], null))

export const selectOriginalPostArtistInviteSubmission = (state, props) => {
  const postId = selectOriginalPostId(state, props)
  return postId && selectPostArtistInviteSubmission(state, { postId })
}

export const selectOriginalPostArtistInvite = (state, props) => {
  const postId = selectOriginalPostId(state, props)
  return postId && selectPostArtistInvite(state, { postId })
}
