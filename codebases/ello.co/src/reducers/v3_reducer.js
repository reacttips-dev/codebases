/* eslint-disable no-use-before-define */
import Immutable from 'immutable'
import { camelizeKeys } from 'humps'
import { merge } from 'lodash'
import * as ACTION_TYPES from '../constants/action_types'

// Like .getIn but for regular JS objects
// Does not break if object is missing a key in the middle
// TODO: Immutable 4.x has a functional getIn that works on both Maps and objects.
function deepGet(object, [head, ...tail], fallback = null) {
  const val = object[head]
  if (val === undefined || val === null) { return fallback }
  if (tail.length === 0) { return val }
  return deepGet(val, tail, fallback)
}

// Merge two Immutable maps while preferring data over nulls and never returning undefined.
function smartMergeDeep(oldMap, newMap) {
  const filteredNewMap = newMap.filterNot(v => v === undefined || v === null)
  return oldMap.mergeDeepWith((oldVal, newVal) => {
    if (oldVal === undefined && newVal === undefined) { return null }
    if (oldVal === null || oldVal === undefined) { return newVal }
    return newVal
  }, filteredNewMap)
}

// Given state (immutable), a key path (array[string]), and map merge the map in.
// If a value on either side is null or undefined it "loses" the merge - we always prefer data.
function smartMergeDeepIn(state, keyPath, newMap) {
  const oldMap = state.getIn(keyPath, Immutable.Map())
  const mergedMap = smartMergeDeep(oldMap, newMap)
  return state.setIn(keyPath, mergedMap)
}

function parseList(state, list, parser, mergeAttrs = {}) {
  if (!Array.isArray(list)) { return state }
  return list.reduce((s, record) => parser(s, merge(record, mergeAttrs)), state)
}

function parsePaginationIds(type, models) {
  switch (type) {
    case 'userLoveStream':
      return Immutable.OrderedSet(models.map(m => m.post.id))
    default:
      return Immutable.OrderedSet(models.map(m => m.id))
  }
}

function parsePagination(state, type, models, next, isLastPage, pathname, query, variables) {
  const mergedState = state.mergeDeepIn(['pages', pathname], Immutable.fromJS({
    pagination: Immutable.fromJS({ next, query, variables, isLastPage }),
  }))

  const newPageIds = parsePaginationIds(type, models)
  const existingPageIds = mergedState.getIn(['pages', pathname, 'ids'])

  // If we don't have any existingPageIds just return the new ids.
  if (!existingPageIds || existingPageIds.count() === 0) {
    return mergedState.setIn(['pages', pathname, 'ids'], newPageIds)
  }

  // If we have a before value in the query this is not the first page, so append to ordered set.
  if (variables.before || (variables.get && variables.get('before'))) {
    return mergedState.setIn(['pages', pathname, 'ids'], existingPageIds.concat(newPageIds))
  }

  // If we don't have a before value this is either the first page or re-requesting the first
  // page.
  const unseenPageIds = newPageIds.subtract(existingPageIds)

  // If there are a full page of unseen ids we just load the page fresh.
  if (unseenPageIds.count() >= 20) {
    return mergedState.setIn(['pages', pathname, 'ids'], newPageIds)
  }

  // In that case we need to prepend to either set to show the "newPosts" icon
  if (unseenPageIds.count() > 0) {
    return mergedState.updateIn(['pages', pathname, 'morePostIds'], alreadyUnseen =>
      // Prepend full set, so we can ensure order is correct later, duplicates will be removed
      // when prepended to what is on page.
      newPageIds.concat(alreadyUnseen || Immutable.OrderedSet()),
    )
  }

  // No new posts
  return mergedState
}

function resetSubscribedStreamPagination(state) {
  return state.deleteIn(['pages', '/discover/subscribed'])
    .deleteIn(['pages', '/discover/subscribed/trending'])
    .deleteIn(['pages', '/discover/subscribed/recent'])
}

function parseAsset(state, asset) {
  if (!asset) { return state }
  return smartMergeDeepIn(state, ['assets', asset.id], Immutable.fromJS({
    id: asset.id,
    attachment: asset.attachment,
  }))
}

function reduceAssets(assets) {
  return (assets || []).reduce((byId, asset) => (
    { ...byId, [asset.id]: asset }
  ), {})
}

function categoryUserLinks(categoryUser) {
  const links = {}

  const categoryId = deepGet(categoryUser, ['category', 'id'])
  if (categoryId) { links.category = { type: 'categories', id: categoryId } }

  const userId = deepGet(categoryUser, ['user', 'id'])
  if (userId) { links.user = { type: 'users', id: userId } }

  const featuredById = deepGet(categoryUser, ['featuredBy', 'id'])
  if (featuredById) { links.featuredBy = { type: 'users', id: featuredById } }

  const curatorById = deepGet(categoryUser, ['curatorBy', 'id'])
  if (curatorById) { links.curatorBy = { type: 'users', id: curatorById } }

  const moderatorById = deepGet(categoryUser, ['moderatorBy', 'id'])
  if (moderatorById) { links.moderatorBy = { type: 'users', id: moderatorById } }

  return links
}

function parseCategoryUser(state, categoryUser) {
  if (!categoryUser) { return state }
  const state1 = parseUser(state, categoryUser.user)
  const state2 = parseCategory(state1, categoryUser.category)
  return smartMergeDeepIn(state2, ['categoryUsers', categoryUser.id], Immutable.fromJS({
    id: categoryUser.id,
    role: categoryUser.role,
    userId: categoryUser.userId || deepGet(categoryUser, ['user', 'id']),
    categoryId: categoryUser.categoryId || deepGet(categoryUser, ['category', 'id']),

    // De-normalize these if available to make access easier - infrequently updated.
    categorySlug: deepGet(categoryUser, ['category', 'slug']),
    categoryName: deepGet(categoryUser, ['category', 'name']),
    links: categoryUserLinks(categoryUser),
  }))
}

function parseCategory(state, category) {
  if (!category) { return state }
  const state1 = parseList(state, category.categoryUsers, parseCategoryUser, {
    categoryId: category.id,
  })
  const state2 = parseUser(state1, category.brandAccount)
  return smartMergeDeepIn(state2, ['categories', category.id], Immutable.fromJS({
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    level: category.level,
    order: category.order,
    allowInOnboarding: category.allowInOnboarding,
    isCreatorType: category.isCreatorType,
    tileImage: category.tileImage,
    role: deepGet(category, ['currentUserState', 'role']),
    brandAccountId: deepGet(category, ['brandAccount', 'id']),
  }))
}

function categoryPostLinks(categoryPost) {
  const links = {}

  const categoryId = deepGet(categoryPost, ['category', 'id'])
  if (categoryId) { links.category = { type: 'categories', id: categoryId } }

  const postId = deepGet(categoryPost, ['post', 'id'])
  if (postId) { links.post = { type: 'posts', id: postId } }

  const featuredById = deepGet(categoryPost, ['featuredBy', 'id'])
  if (featuredById) { links.featuredBy = { type: 'users', id: featuredById } }

  return links
}

function parseCategoryPost(state, categoryPost) {
  if (!categoryPost) { return state }
  const state2 = parseCategory(state, categoryPost.category)
  const state3 = parsePost(state2, categoryPost.post)
  const state4 = parseUser(state3, categoryPost.featuredBy)
  return smartMergeDeepIn(state4, ['categoryPosts', categoryPost.id], Immutable.fromJS({
    id: categoryPost.id,
    status: categoryPost.status,
    submittedAt: categoryPost.submittedAt,
    submittedByUsername: deepGet(categoryPost, ['submittedBy', 'username']),
    featuredAt: categoryPost.featuredAt,
    featuredByUsername: deepGet(categoryPost, ['featuredBy', 'username']),
    categorySlug: deepGet(categoryPost, ['category', 'slug']),
    categoryName: deepGet(categoryPost, ['category', 'name']),
    categoryId: deepGet(categoryPost, ['category', 'id']),
    postId: deepGet(categoryPost, ['post', 'id']),
    actions: categoryPost.actions,
    links: categoryPostLinks(categoryPost),
  }))
}

function parseArtistInvite(state, invite) {
  if (!invite || !invite.id) { return state }
  return smartMergeDeepIn(state, ['artistInvites', invite.id], Immutable.fromJS({
    id: invite.id,
    title: invite.title,
    slug: invite.slug,
  }))
}

function artistInviteSubmissionLinks(submission) {
  const links = {}

  const inviteId = deepGet(submission, ['artist_invite', 'id'])
  if (inviteId) { links.artistInvite = { type: 'artist_invites', id: inviteId } }

  const postId = deepGet(submission, ['post', 'id'])
  if (postId) { links.post = { type: 'posts', id: postId } }

  return links
}

function parseArtistInviteSubmission(state, submission) {
  if (!submission || !submission.id) { return state }
  const state2 = parseArtistInvite(state, submission.artistInvite)
  const state3 = parsePost(state2, submission.post)
  return smartMergeDeepIn(state3, ['artistInviteSubmissions', submission.id], Immutable.fromJS({
    id: submission.id,
    status: submission.status,
    actions: submission.actions,
    inviteTitle: deepGet(submission, ['artistInvite', 'title']),
    inviteSlug: deepGet(submission, ['artistInvite', 'slug']),
    postId: deepGet(submission, ['post', 'id']),
    artistInviteId: deepGet(submission, ['artistInvite', 'id']),
    links: artistInviteSubmissionLinks(submission),
  }))
}

function parseUser(state, user) {
  if (!user) { return state }

  const state1 = parseList(state, user.categories, parseCategory)
  const state2 = parseList(state1, user.categoryUsers, parseCategoryUser, { userId: user.id })
  return smartMergeDeepIn(state2, ['users', user.id], Immutable.fromJS({

    // Minumum properties
    id: user.id,
    username: user.username,
    name: user.name,
    avatar: user.avatar,

    // Extended properties
    coverImage: user.coverImage,
    badges: user.badges,
    externalLinksList: user.externalLinksList,
    formattedShortBio: user.formattedShortBio,
    location: user.location,
    metaAttributes: user.metaAttributes,

    // Settings
    isCollaboratable: deepGet(user, ['settings', 'isCollaboratable']),
    isHireable: deepGet(user, ['settings', 'isHireable']),
    hasCommentingEnabled: deepGet(user, ['settings', 'hasCommentingEnabled']),
    hasLovesEnabled: deepGet(user, ['settings', 'hasLovesEnabled']),
    hasRepostingEnabled: deepGet(user, ['settings', 'hasRepostingEnabled']),
    hasSharingEnabled: deepGet(user, ['settings', 'hasSharingEnabled']),
    postsAdultContent: deepGet(user, ['settings', 'postAdultContent']),

    // userStats
    followersCount: deepGet(user, ['userStats', 'followersCount']),
    followingCount: deepGet(user, ['userStats', 'followingCount']),
    postsCount: deepGet(user, ['userStats', 'postsCount']),
    lovesCount: deepGet(user, ['userStats', 'lovesCount']),
    totalViewsCount: deepGet(user, ['userStats', 'totalViewsCount']),

    // currentUserState
    relationshipPriority: deepGet(user, ['currentUserState', 'relationshipPriority']),
  }))
}

function parsePageHeader(state, pageHeader) {
  if (!pageHeader) { return state }
  const state1 = parseUser(state, pageHeader.user)
  const state2 = parseCategory(state1, pageHeader.category)
  return smartMergeDeepIn(state2, ['pageHeaders', pageHeader.id], Immutable.fromJS({
    id: pageHeader.id,
    kind: pageHeader.kind,
    slug: pageHeader.slug,
    postToken: pageHeader.postToken,
    header: pageHeader.header,
    subheader: pageHeader.subheader,
    ctaLink: pageHeader.ctaLink,
    image: pageHeader.image,
    userId: deepGet(pageHeader, ['user', 'id']),
    categoryId: deepGet(pageHeader, ['category', 'id']),
  }))
}

function commentLinks(comment) {
  const links = {}
  const authorId = deepGet(comment, ['author', 'id'])
  if (authorId) { links.author = { id: authorId, type: 'users' } }

  const parentPostId = deepGet(comment, ['parentPost', 'id'])
  if (parentPostId) { links.parentPost = { id: parentPostId, type: 'posts' } }

  return links
}

function postLinks(post) {
  const links = {}
  const authorId = deepGet(post, ['author', 'id'])
  if (authorId) { links.author = { id: authorId, type: 'users' } }

  const repostAuthorId = deepGet(post, ['repostedSource', 'author', 'id'])
  if (repostAuthorId) { links.repostAuthor = { id: repostAuthorId, type: 'users' } }

  const repostId = deepGet(post, ['repostedSource', 'id'])
  if (repostId) { links.repostedSource = { id: repostId, type: 'posts' } }

  const categories = deepGet(post, ['categories'])
  if (categories && !!categories.length) {
    links.categories = categories.map(cat => cat.id)
  }

  const categoryPosts = deepGet(post, ['categoryPosts'])
  if (categoryPosts && !!categoryPosts.length) {
    links.categoryPosts = categoryPosts.map(cp => cp.id)
    links.categories = categoryPosts.map(cp => (cp.category ? cp.category.id : null))
  }

  return links
}

// Camelize data keys, inject assets objects into appropriate region
function parseRegion(post, type, assetsById) {
  return (post[type] || []).map((region, index) => {
    const id = `${post.id}-${index}`
    const assetId = deepGet(region, ['links', 'assets'])
    const asset = assetsById[assetId]
    let data = null
    if (typeof region.data === 'object') {
      data = camelizeKeys(region.data)
    } else {
      data = region.data
    }
    if (region.kind === 'image' && typeof assetId === 'string' && asset) {
      return { ...region, data, id, asset }
    }
    return { ...region, data, id }
  })
}

function parseComment(state, comment) {
  if (!comment) { return state }

  const state1 = parseUser(state, comment.author)
  const state2 = parseList(state1, comment.assets, parseAsset)
  const state3 = parsePost(state2, comment.parentPost)

  const assetsById = reduceAssets(comment.assets)

  return smartMergeDeepIn(state3, ['comments', comment.id], Immutable.fromJS({
    // ids
    id: comment.id,
    authorId: deepGet(comment, ['author', 'id']), // We don't use links for this
    postId: deepGet(comment, ['parentPost', 'id']),

    // Properties
    createdAt: comment.createdAt,

    // Content
    summary: parseRegion(comment, 'summary', assetsById),
    content: parseRegion(comment, 'content', assetsById),

    // Links
    links: commentLinks(comment),
  }))
}

function parsePost(state, post) {
  if (!post) { return state }

  const state1 = parseUser(state, post.author)
  const state2 = parseList(state1, post.assets, parseAsset)
  const state3 = parsePost(state2, post.repostedSource)
  const state4 = parseArtistInviteSubmission(state3, post.artistInviteSubmission)
  const state5 = parseList(state4, post.categories, parseCategory)
  const state6 = parseList(state5, post.categoryPosts, parseCategoryPost)

  const assetsById = reduceAssets(post.assets)
  const repostAssetsById = post.repostedSource ? reduceAssets(post.repostedSource.assets) : null

  return smartMergeDeepIn(state6, ['posts', post.id], Immutable.fromJS({
    // ids
    id: post.id,
    authorId: deepGet(post, ['author', 'id']), // We don't use links for this

    // Properties
    token: post.token,
    createdAt: post.createdAt,
    artistInviteId: deepGet(post, ['artistInviteSubmission', 'artistInvite', 'id']),
    artistInviteSubmissionId: deepGet(post, ['artistInviteSubmission', 'id']),

    // Content
    summary: parseRegion(post, 'summary', assetsById),
    content: parseRegion(post, 'content', assetsById),
    repostContent: parseRegion(post, 'repostContent', repostAssetsById),
    repostId: deepGet(post, ['repostedSource', 'id']),

    // Stats
    lovesCount: deepGet(post, ['postStats', 'lovesCount']),
    commentsCount: deepGet(post, ['postStats', 'commentsCount']),
    viewsCount: deepGet(post, ['postStats', 'viewsCount']),
    repostsCount: deepGet(post, ['postStats', 'repostsCount']),

    // Current user state
    watching: deepGet(post, ['currentUserState', 'watching']),
    loved: deepGet(post, ['currentUserState', 'loved']),
    reposted: deepGet(post, ['currentUserState', 'reposted']),

    // Links
    links: postLinks(post),
  }))
}

function parsePostFromLove(store, love) {
  return parsePost(store, love.post)
}

function loveLinks(love) {
  const links = {}

  const postId = deepGet(love, ['post', 'id'])
  if (postId) { links.post = { id: postId, type: 'posts' } }

  const userId = deepGet(love, ['user', 'id'])
  if (userId) { links.user = { id: userId, type: 'users' } }

  return links
}

function parseLove(state, love) {
  if (!love) { return state }
  const state2 = parsePost(state, love.post)
  const state3 = parseUser(state2, love.user)

  return smartMergeDeepIn(state3, ['loves', love.id], Immutable.fromJS({
    id: love.id,
    postId: deepGet(love, ['post', 'id']),
    userId: deepGet(love, ['user', 'id']),
    createdAt: love.createdAt,
    links: loveLinks(love),
  }))
}

function watchLinks(watch) { return loveLinks(watch) }

function parseWatch(state, watch) {
  if (!watch) { return state }
  const state2 = parsePost(state, watch.post)
  const state3 = parseUser(state2, watch.user)

  return smartMergeDeepIn(state3, ['watches', watch.id], Immutable.fromJS({
    id: watch.id,
    postId: deepGet(watch, ['post', 'id']),
    userId: deepGet(watch, ['user', 'id']),
    createdAt: watch.createdAt,
    links: watchLinks(watch),
  }))
}

function editorialLinks(editorial) {
  const links = {}
  const postId = deepGet(editorial, ['post', 'id'])
  if (postId) { links.post = { id: postId, type: 'post' } }

  const { query, ...variables } = editorial.stream || {}
  if (query) { links.postStream = { query, variables } }

  return links
}

function parseEditorial(state, editorial) {
  if (!editorial) { return state }
  const state1 = parsePost(state, editorial.post)
  return smartMergeDeepIn(state1, ['editorials', editorial.id], Immutable.fromJS({
    id: editorial.id,
    kind: editorial.kind ? editorial.kind.toLowerCase() : null,
    title: editorial.title,
    renderedSubtitle: editorial.subtitle,
    oneByOneImage: editorial.oneByOneImage,
    oneByTwoImage: editorial.oneByTwoImage,
    twoByOneImage: editorial.twoByOneImage,
    twoByTwoImage: editorial.twoByTwoImage,
    url: editorial.url,
    path: editorial.path,
    links: editorialLinks(editorial),
  }))
}

function parseNotificationSubject(state, subject, type) {
  switch (type) {
    case 'Post':
      return { type: 'posts', state: parsePost(state, subject) }
    case 'Comment':
      return { type: 'comments', state: parseComment(state, subject) }
    case 'User':
      return { type: 'users', state: parseUser(state, subject) }
    case 'Love':
      return { type: 'loves', state: parseLove(state, subject) }
    case 'CategoryPost':
      return { type: 'category_posts', state: parseCategoryPost(state, subject) }
    case 'CategoryUser':
      return { type: 'category_users', state: parseCategoryUser(state, subject) }
    case 'ArtistInviteSubmission':
      return { type: 'artist_invite_submissions', state: parseArtistInviteSubmission(state, subject) }
    case 'Watch':
      return { type: 'watches', state: parseWatch(state, subject) }
    default:
      return { type: null, state }
  }
}

function parseNotification(state, notification) {
  if (!notification) { return state }
  if (!notification.subject) { return state }
  const {
    type,
    state: state1,
  } = parseNotificationSubject(state, notification.subject, notification.subjectType)
  return smartMergeDeepIn(state1, ['notifications', notification.id], Immutable.fromJS({
    id: notification.id,
    subjectType: notification.subjectType,
    subjectId: notification.subject.id,
    kind: notification.kind,
    createdAt: notification.createdAt,
    links: {
      subject: {
        id: notification.subject.id,
        type,
      },
    },
  }))
}

function parsePostDetail(state, { payload: { response: { data: { post } } } }) {
  return parsePost(state, post)
}

function parseQueryType(state, type, stream, pathname, query, variables) {
  const { next, isLastPage } = stream
  let models
  let parser
  switch (type) {
    case 'followingPostStream':
    case 'globalPostStream':
    case 'categoryPostStream':
    case 'subscribedPostStream':
    case 'userPostStream':
      models = stream.posts
      parser = parsePost
      break;
    case 'editorialStream':
      models = stream.editorials
      parser = parseEditorial
      break;
    case 'commentStream':
      models = stream.comments
      parser = parseComment
      break;
    case 'userLoveStream':
      models = stream.loves
      parser = parsePostFromLove
      break;
    case 'searchCategories':
      models = stream.categories
      parser = parseCategory
      break;
    case 'notificationStream':
      models = stream.notifications
      parser = parseNotification
      break;
    default:
      models = null
      parser = null
  }
  const state1 = parseList(state, models, parser)
  return parsePagination(state1, type, models, next, isLastPage, pathname, query, variables)
}

function parseStream(state, { meta, payload: { response: { data }, pathname, query, variables } }) {
  return Object.keys(data).reduce((s, key) =>
    parseQueryType(s, key, data[key], meta.resultKey || pathname, query, variables),
  state,
  )
}

function parseCategoryQueries(state, { payload: { response: { data } } }) {
  if (data.category) {
    return parseCategory(state, data.category)
  }
  return parseList(state, data.categoryNav || data.allCategories, parseCategory)
}

function parsePageHeaders(state, { payload: { response: { data: { pageHeaders } } } }) {
  return parseList(state, pageHeaders, parsePageHeader)
}

function parseLoadManyPosts(state, action) {
  const { meta, payload: { response: { data: { findPosts: posts } } } } = action
  const state1 = parseList(state, posts, parsePost)
  if (meta.resultKey) {
    return state1.mergeDeepIn(['pages', meta.resultKey], Immutable.fromJS({
      pagination: { isLastPage: true },
      ids: Immutable.OrderedSet(posts.map(p => p.id)),
    }))
  }
  return state1
}

function parseUserDetail(state, { payload: { response: { data: { findUser: user } } } }) {
  return parseUser(state, user)
}

function parseUserQuickSearch(state, { payload: { response: { data } } }) {
  const { searchUsers: { users } } = data
  return state.set('userQuickSearch', users.reduce((map, user) => (
    map.set(user.id, Immutable.fromJS(user))
  ), Immutable.OrderedMap()))
}

// Dispatch different graphql response types for parsing (reducing)
export default function (state, action) {
  const { type } = action
  switch (type) {
    case ACTION_TYPES.V3.LOAD_STREAM_SUCCESS:
    case ACTION_TYPES.V3.LOAD_NEXT_CONTENT_SUCCESS:
      return parseStream(state, action)
    case ACTION_TYPES.V3.LOAD_CATEGORIES_SUCCESS:
      return parseCategoryQueries(state, action)
    case ACTION_TYPES.V3.CATEGORY.LOAD_SUCCESS:
      return parseCategoryQueries(state, action)
    case ACTION_TYPES.V3.LOAD_PAGE_HEADERS_SUCCESS:
      return parsePageHeaders(state, action)
    case ACTION_TYPES.V3.POST.DETAIL_SUCCESS:
      return parsePostDetail(state, action)
    case ACTION_TYPES.V3.POST.LOAD_MANY_SUCCESS:
      return parseLoadManyPosts(state, action)
    case ACTION_TYPES.V3.USER.DETAIL_SUCCESS:
      return parseUserDetail(state, action)
    case ACTION_TYPES.PROFILE.FOLLOW_CATEGORIES_SUCCESS:
    case ACTION_TYPES.PROFILE.UNFOLLOW_CATEGORIES_SUCCESS:
      return resetSubscribedStreamPagination(state)
    case ACTION_TYPES.V3.USER.QUICK_SEARCH_SUCCESS:
      return parseUserQuickSearch(state, action)
    case ACTION_TYPES.V3.USER.QUICK_SEARCH_CLEAR:
      return state.delete('userQuickSearch')
    default:
      return state
  }
}
