import { getPagingQueryParams } from '../helpers/uri_helper'
import * as ENV from '../../env'

const API_VERSION = 'v2'
const PER_PAGE = 25
const ARTIST_INVITES_PER_PAGE = 20
const basePath = () => `${ENV.API_DOMAIN}/api`

function getAPIPath(relPath, queryParams = {}) {
  let path = `${basePath()}/${API_VERSION}/${relPath}`
  const queryArr = []
  Object.keys(queryParams).forEach((param) => {
    queryArr.push(`${param}=${queryParams[param]}`)
  })
  if (queryArr.length) {
    path = `${path}?${queryArr.join('&')}`
  }
  return path
}
// Creative Briefs
export function artistInvites(isPreview) {
  const query = {
    per_page: ARTIST_INVITES_PER_PAGE,
    ...getPagingQueryParams(window.location.search),
  }
  if (isPreview) { query.preview = true }
  return {
    path: getAPIPath('artist_invites', query),
  }
}
export function artistInviteDetail(slug) {
  return {
    path: getAPIPath(`artist_invites/${slug}`),
  }
}
// Announcements
export function announcements() {
  return {
    path: getAPIPath('most_recent_announcements'),
  }
}
export function markAnnouncementRead() {
  return {
    path: `${announcements().path}/mark_last_read_announcement`,
  }
}
// Assets
export function s3CredentialsPath() {
  return {
    path: getAPIPath('assets/credentials'),
  }
}
// Authentication
export function accessTokens() {
  return {
    path: `${basePath()}/oauth/token`,
  }
}

export function loginToken() {
  return {
    path: `${basePath()}/oauth/token`,
  }
}

export function logout() {
  return {
    path: `${basePath()}/oauth/logout`,
  }
}

export function forgotPassword() {
  return {
    path: getAPIPath('forgot-password'),
  }
}

export function resetPassword() {
  return {
    path: getAPIPath('reset_password'),
  }
}

export function refreshAuthToken(refreshToken) {
  const params = { refresh_token: refreshToken }
  return {
    path: `${basePath()}/oauth/token`,
    params,
  }
}

export function webappToken() {
  return {
    path: `${basePath()}/webapp-token`,
  }
}

export function signupPath() {
  return {
    path: getAPIPath('signup'),
  }
}

export function emailConfirmation() {
  return {
    path: getAPIPath('email-confirmation'),
  }
}

export function checkConfirmationCode() {
  return {
    path: getAPIPath('check-confirmation-code'),
  }
}

export function authenticationPromo() {
  return {
    path: `${ENV.PROMO_HOST}/authentication.json`,
  }
}

// Current User Profile
export function profilePath() {
  return {
    path: getAPIPath('profile'),
  }
}
export function profileLocationAutocomplete(location) {
  return {
    path: getAPIPath('profile/location_autocomplete', { location }),
  }
}
export function profileAvailableToggles() {
  return {
    path: getAPIPath('profile/settings'),
  }
}
export function profileBlockedUsers() {
  return {
    path: getAPIPath('profile/blocked'),
  }
}
export function profileMutedUsers() {
  return {
    path: getAPIPath('profile/muted'),
  }
}
export function profileExport() {
  return {
    path: getAPIPath('profile/export'),
  }
}
export function followCategories() {
  return {
    path: getAPIPath('profile/followed_categories'),
  }
}
// Onboarding
export function communitiesPath() {
  const params = { name: 'onboarding', per_page: PER_PAGE }
  return {
    path: getAPIPath('interest_categories/members', params),
    params,
  }
}
export function relationshipBatchPath() {
  return {
    path: getAPIPath('relationships/batches'),
  }
}
// Badges
export function badges() {
  return {
    path: getAPIPath('badges.json', { timestamp: '1516732706' }),
  }
}
// Categories
export function categories() {
  return {
    path: getAPIPath('categories', { meta: true }),
  }
}
export function categoryPosts(type) {
  const typePath = type ? `/${type}` : ''
  return {
    path: getAPIPath(`categories${typePath}/posts/recent`, { per_page: PER_PAGE }),
  }
}
export function pagePromotionals() {
  return {
    path: getAPIPath('page_promotionals?include_extras=true'),
  }
}
// Streams
export function followingStream() {
  const params = { per_page: PER_PAGE }
  return {
    path: getAPIPath('following/posts/recent', params),
    params,
  }
}
// Posts
export function postDetail(idOrToken, userIdOrToken) {
  const params = { comment_count: false, user_id: userIdOrToken }
  return {
    path: getAPIPath(`posts/${idOrToken}`, params),
  }
}
export function editPostDetail(idOrToken) {
  const params = { comment_count: false }
  return {
    path: getAPIPath(`posts/${idOrToken}`, params),
  }
}
export function relatedPosts(idOrToken, perPage) {
  return {
    path: getAPIPath(`posts/${idOrToken}/related`, { per_page: perPage }),
  }
}
// Loves
export function lovePost(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}/loves`),
  }
}
export function unlovePost(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}/love`),
  }
}
// CategoryUsers
export function createCategoryUserPath() {
  return {
    path: getAPIPath('category_users'),
  }
}
export function deleteCategoryUserPath(id) {
  return {
    path: getAPIPath(`category_users/${id}`),
  }
}
// Watch
export function watchPost(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}/watches`),
  }
}
export function unwatchPost(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}/watch`),
  }
}
export function deletePost(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}`),
  }
}
export function flagPost(idOrToken, kind) {
  return {
    path: getAPIPath(`posts/${idOrToken}/flag/${kind}`),
  }
}
export function postLovers(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}/lovers`, { per_page: 10 }),
  }
}
export function postReplyAll(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}/commenters_usernames`),
  }
}
export function postReposters(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}/reposters`, { per_page: 10 }),
  }
}
export function createPost(repostId) {
  const params = {}
  if (repostId) { params.repost_id = repostId }
  return {
    path: getAPIPath('posts', params),
    params,
  }
}
export function updatePost(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}`),
  }
}
export function postPreviews() {
  return {
    path: getAPIPath('post_previews'),
  }
}

export function trackPostViews(postIds, postTokens, streamKind, streamId) {
  return {
    path: getAPIPath('post_views', { post_tokens: postTokens, post_ids: postIds, kind: streamKind, id: streamId }),
  }
}
export function userAutocompleter(word) {
  return {
    path: getAPIPath('users/autocomplete', { terms: word.replace(/@|:/ig, ''), per_page: 10 }),
  }
}
export function loadEmojis() {
  if (ENV.USE_LOCAL_EMOJI) {
    return {
      path: '/static/emojis.json',
    }
  }
  return {
    path: `${ENV.AUTH_DOMAIN}/emojis.json`,
  }
}
// Dummy editor endpoint to use for default action on text tools form
export function textToolsPath() {
  return {
    path: getAPIPath('editor-text-tools'),
  }
}
// Comments
export function commentsForPost(idOrToken) {
  const params = {
    per_page: 10,
    ...getPagingQueryParams(window.location.search),
  }
  return {
    path: getAPIPath(`posts/${idOrToken}/comments`, params),
  }
}
export function createComment(postId) {
  return {
    path: getAPIPath(`posts/${postId}/comments`),
  }
}
export function editComment(comment) {
  return {
    path: getAPIPath(`posts/${comment.get('postId')}/comments/${comment.get('id')}`),
  }
}
export function deleteComment(comment) {
  return {
    path: getAPIPath(`posts/${comment.get('postId')}/comments/${comment.get('id')}`),
  }
}
export function flagComment(comment, kind) {
  return {
    path: getAPIPath(`posts/${comment.get('postId')}/comments/${comment.get('id')}/flag/${kind}`),
  }
}
// Users
export function userDetail(idOrUsername) {
  const params = { post_count: false }
  return {
    path: getAPIPath(`users/${idOrUsername}`, params),
  }
}
export function userFollowing(idOrUsername, priority) {
  const params = {
    per_page: 10,
    ...getPagingQueryParams(window.location.search),
  }

  if (priority) params.priority = priority

  return {
    path: getAPIPath(`users/${idOrUsername}/following`, params),
  }
}

export function userResources(idOrUsername, resource) {
  const params = {
    per_page: 10,
    ...getPagingQueryParams(window.location.search),
  }
  return {
    path: getAPIPath(`users/${idOrUsername}/${resource}`, params),
    params,
  }
}
export function collabWithUser(id) {
  return {
    path: getAPIPath(`users/${id}/collaborate`),
  }
}
export function flagUser(idOrUsername, kind) {
  return {
    path: getAPIPath(`users/${idOrUsername}/flag/${kind}`),
  }
}
export function hireUser(id) {
  return {
    path: getAPIPath(`users/${id}/hire_me`),
  }
}
// Search
export function searchPosts(params) {
  const newParams = {
    ...getPagingQueryParams(window.location.search),
    ...params,
  }
  return {
    path: getAPIPath('posts', newParams),
    params: newParams,
  }
}
export function searchUsers(params) {
  const newParams = {
    ...getPagingQueryParams(window.location.search),
    ...params,
  }
  return {
    path: getAPIPath('users', newParams),
    params: newParams,
  }
}
// Notifications
export function notifications(params = {}) {
  const newParams = { per_page: PER_PAGE, ...params }
  if (newParams.category && newParams.category === 'all') {
    delete newParams.category
  }
  return {
    path: getAPIPath('notifications', newParams),
    newParams,
  }
}
export function newNotifications() {
  return {
    path: getAPIPath('notifications'),
  }
}
// AVAILABILITY
export function availability() {
  return {
    path: getAPIPath('availability'),
  }
}
// INVITE
export function invite() {
  return {
    path: getAPIPath('invitations', { per_page: 100 }),
  }
}
export function getInviteEmail(code) {
  return {
    path: getAPIPath(`invitations/${code}`),
  }
}
// RELATIONSHIPS
export function relationshipAdd(userId, priority) {
  return {
    path: getAPIPath(`users/${userId}/add/${priority}`),
  }
}
// Android Push Subscriptions
export function registerForGCM(regId) {
  return {
    path: getAPIPath(`profile/push_subscriptions/gcm/${regId}`),
  }
}
// Split a/b testing
export function splitStart(uuid, name, alternative1, alternative2) {
  return {
    path: getAPIPath(`split/${name}/start`, { alternative1, alternative2, uuid }),
  }
}
export function splitFinish(uuid, name) {
  return {
    path: getAPIPath(`split/${name}/finish`, { uuid }),
  }
}

export { API_VERSION, getAPIPath, PER_PAGE }

