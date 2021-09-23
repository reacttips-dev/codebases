import Immutable from 'immutable'
import get from 'lodash/get'
import { createSelector } from 'reselect'
import trunc from 'trunc-html'
import { getLinkArray } from '../helpers/json_helper'
import { selectParamsUsername } from './params'
import { selectJson } from './store'
import { USERS } from '../constants/mapping_types'
import { numberToHuman } from '../lib/number_to_human'
import { selectBadges } from './badges'
import { selectInvitationUserId } from './invitations'

export const selectPropsUserId = (state, props) =>
  get(props, 'userId') || get(props, 'user', Immutable.Map()).get('id')

export const selectUsers = state => state.json.get(USERS, Immutable.Map())

// Memoized selectors

// Requires `userId`, `user` or `params.username` to be found in props
export const selectUser = createSelector(
  [selectPropsUserId, selectInvitationUserId, selectParamsUsername, selectUsers],
  (id, invitationUserId, username, users) => {
    const userId = id || invitationUserId
    if (userId) {
      return users.get(userId, Immutable.Map())
    } else if (username) {
      return (users.find(user => user.get('username') === username)) || Immutable.Map()
    }
    return Immutable.Map()
  },
)

// Properties on the user reducer
// TODO: Supply defaults where applicable
export const selectUserAvatar = createSelector([selectUser], user => user.get('avatar'))
export const selectUserBadForSeo = createSelector([selectUser], user => user.get('badForSeo'))
export const selectUserBadges = createSelector([selectUser], user => user.get('badges', Immutable.List()))
export const selectUserCoverImage = createSelector([selectUser], user => user.get('coverImage'))
export const selectUserExperimentalFeatures = createSelector([selectUser], user => user.get('experimentalFeatures'))
export const selectUserExternalLinksList = createSelector([selectUser], user => user.get('externalLinksList'))
export const selectUserFollowersCount = createSelector([selectUser], user => user.get('followersCount', 0))
export const selectUserFollowingCount = createSelector([selectUser], user => user.get('followingCount', 0))
export const selectUserFormattedShortBio = createSelector([selectUser], user => user.get('formattedShortBio', ''))
export const selectUserHasAutoWatchEnabled = createSelector([selectUser], user => user.get('hasAutoWatchEnabled'))
export const selectUserHasCommentingEnabled = createSelector([selectUser], user => user.get('hasCommentingEnabled'))
export const selectUserHasLovesEnabled = createSelector([selectUser], user => user.get('hasLovesEnabled'))
export const selectUserHasRepostingEnabled = createSelector([selectUser], user => user.get('hasRepostingEnabled'))
export const selectUserHasSharingEnabled = createSelector([selectUser], user => user.get('hasSharingEnabled'))
export const selectUserHref = createSelector([selectUser], user => user.get('href'))
export const selectUserId = createSelector([selectUser], user => user.get('id'))
export const selectUserIsCollaborateable = createSelector([selectUser], user => user.get('isCollaborateable', false))
export const selectUserIsHireable = createSelector([selectUser], user => user.get('isHireable', false))
// TODO: Pull properties out of user.get('links')? - i.e. links.categories
export const selectUserLocation = createSelector([selectUser], user => user.get('location'))
export const selectUserLovesCount = createSelector([selectUser], user => user.get('lovesCount', 0))
export const selectUserMetaAttributes = createSelector([selectUser], user => user.get('metaAttributes', Immutable.Map()))
export const selectUserName = createSelector([selectUser], user => user.get('name'))
export const selectUserPostsAdultContent = createSelector([selectUser], user => user.get('postsAdultContent'))
export const selectUserPostsCount = createSelector([selectUser], user => user.get('postsCount', 0))
export const selectUserRelationshipPriority = createSelector([selectUser], user => user.get('relationshipPriority', null))
export const selectUserTotalViewsCount = createSelector([selectUser], (user) => {
  const count = user.get('totalViewsCount')
  return count ? numberToHuman(count, false) : undefined
})
export const selectUserUsername = createSelector([selectUser], user => user.get('username'))
export const selectUserViewsAdultContent = createSelector([selectUser], user => user.get('viewsAdultContent'))
export const selectIsSystemUser = createSelector([selectUserUsername], username => ['ello', 'elloblog'].some(un => un === username))

// Nested properties on the post reducer
export const selectUserMetaDescription = createSelector(
  [selectUserMetaAttributes], metaAttributes => metaAttributes.get('description'),
)

export const selectUserMetaImage = createSelector(
  [selectUserMetaAttributes], metaAttributes => metaAttributes.get('image'),
)

export const selectUserMetaRobots = createSelector(
  [selectUserMetaAttributes], metaAttributes => metaAttributes.get('robots'),
)

export const selectUserMetaTitle = createSelector(
  [selectUserMetaAttributes], metaAttributes => metaAttributes.get('title'),
)

export const selectUserCategoryUsers = createSelector(
  [selectUser, selectJson], (user, json) =>
    json.get('categoryUsers', Immutable.Map())
      .filter(cu => cu.get('userId') === user.get('id'))
      .valueSeq()
      .toList(),
)

// Derived or additive properties
export const selectUserCategories = createSelector(
  [selectUser, selectJson], (user, json) =>
    getLinkArray(user, 'categories', json) || Immutable.List(),
)

export const selectUserFeaturedCategoryUsers = createSelector(
  [selectUserCategoryUsers], cus => cus.filter(cu => cu.get('role') === 'FEATURED'),
)

export const selectUserCuratorCategoryUsers = createSelector(
  [selectUserCategoryUsers], cus => cus.filter(cu => cu.get('role') === 'CURATOR'),
)

export const selectUserModeratorCategoryUsers = createSelector(
  [selectUserCategoryUsers], cus => cus.filter(cu => cu.get('role') === 'MODERATOR'),
)

export const selectUserFeaturedCategories = createSelector(
  [selectUserFeaturedCategoryUsers, selectJson], (cus, json) => cus.map(
    cu => json.getIn(['categories', cu.get('categoryId')]), [],
  ),
)

export const selectUserCuratorCategories = createSelector(
  [selectUserCuratorCategoryUsers, selectJson], (cus, json) => cus.map(
    cu => json.getIn(['categories', cu.get('categoryId')]), [],
  ),
)

export const selectUserModeratorCategories = createSelector(
  [selectUserModeratorCategoryUsers, selectJson], (cus, json) => cus.map(
    cu => json.getIn(['categories', cu.get('categoryId')]), [],
  ),
)

export const selectUserHasRoles = createSelector(
  [selectUserCategoryUsers], categoryUsers => !categoryUsers.isEmpty(),
)

export const selectUserIsEmpty = createSelector(
  [selectUser], user => user.isEmpty(),
)

// TODO: Evaluate against profile.id and user.id instead?
export const selectUserIsSelf = createSelector(
  [selectUserRelationshipPriority], relationshipPriority => relationshipPriority === 'self',
)

export const selectUserTruncatedShortBio = createSelector(
  [selectUser], user =>
    trunc(
      user.get('formattedShortBio', ''),
      160,
      { sanitizer: { allowedAttributes: { img: ['align', 'alt', 'class', 'height', 'src', 'width'] } } },
    ),
)

export const selectUserProfileBadges = createSelector(
  [selectUserBadges, selectBadges], (userBadges, storeBadges) =>
    userBadges.take(3).map((userBadge) => {
      const badge = storeBadges.find(storeBadge => storeBadge.get('slug') === userBadge) || Immutable.Map()
      return Immutable.Map({
        name: badge.get('name'),
        image: badge.getIn(['image', 'url']),
        slug: badge.get('slug'),
      })
    }),
)

export const selectUserProfileCardBadges = createSelector(
  [selectUserProfileBadges], badges => badges.take(1),
)

export const selectUserBadgeSummary = createSelector(
  [selectUserBadges, selectBadges, selectUserFeaturedCategories],
  (userBadges, storeBadges, categories) =>
    userBadges.flatMap((userBadge) => {
      let badge = storeBadges.find(storeBadge => storeBadge.get('slug') === userBadge)
      if (!badge) return []

      if (userBadge === 'featured') {
        const cats = categories.map(category =>
          Immutable.Map({ slug: category.get('slug'), name: category.get('name') }),
        )
        badge = badge.set('featuredIn', cats)
      }
      return [badge]
    }),
)

export const selectQuickSearchUsers = createSelector([selectJson], json =>
  (json.get('userQuickSearch') || Immutable.OrderedMap()).valueSeq().toList(),
)
