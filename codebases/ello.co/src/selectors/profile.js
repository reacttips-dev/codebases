import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectIsLoggedIn } from './authentication'
import { selectPathname } from './routing'

// state.profile.xxx
export const selectAllowsAnalytics = state => state.profile.get('allowsAnalytics')
export const selectAnalyticsId = state => state.profile.get('analyticsId')
export const selectAvailability = state => state.profile.get('availability')
export const selectAvatar = state => state.profile.get('avatar')
export const selectBlockedCount = state => state.profile.get('blockedCount')
export const selectBuildVersion = state => state.profile.get('buildVersion')
export const selectBundleId = state => state.profile.get('bundleId')
export const selectCoverImage = state => state.profile.get('coverImage')
export const selectCreatorTypeCategoryIds = state => state.profile.get('creatorTypeCategoryIds', Immutable.List())
export const selectCreatorTypes = state => state.profile.get('creatorTypes', Immutable.List())
export const selectCreatedAt = state => state.profile.get('createdAt')
export const selectEmail = state => state.profile.get('email')
export const selectExternalLinksList = state => state.profile.get('externalLinksList', Immutable.List())
export const selectHasAutoWatchEnabled = state => state.profile.get('hasAutoWatchEnabled')
export const selectHasAvatarPresent = state => state.profile.get('hasAvatarPresent', false)
export const selectHasCoverImagePresent = state => state.profile.get('hasCoverImagePresent', false)
export const selectId = state => state.profile.get('id')
export const selectIsBrand = state => state.profile.get('isBrand', false)
export const selectIsNabaroo = state => state.profile.get('isNabaroo', false)
export const selectIsPublic = state => state.profile.get('isPublic')
export const selectIsStaff = state => state.profile.get('isStaff', false)
export const selectIsCommunity = state => state.profile.get('isCommunity', false)
export const selectProfileIsCollaborateable = state => state.profile.get('isCollaborateable', false)
export const selectProfileIsHireable = state => state.profile.get('isHireable', false)
export const selectLocation = state => state.profile.get('location', '')
export const selectMarketingVersion = state => state.profile.get('marketingVersion')
export const selectMutedCount = state => state.profile.get('mutedCount')
export const selectName = state => state.profile.get('name', '')
export const selectRegistrationId = state => state.profile.get('registrationId')
export const selectShortBio = state => state.profile.get('shortBio', '')
export const selectUsername = state => state.profile.get('username')
export const selectViewsAdultContent = state => state.profile.get('viewsAdultContent')
export const selectWebOnboardingVersion = state => state.profile.get('webOnboardingVersion')
export const selectProfileLinksCategories = state => state.profile.getIn(['links', 'categories'], Immutable.List())
export const selectUuid = state => state.profile.get('uuid')
export const selectSplit = (state, props) => state.profile.getIn(['splits', props.splitName])
export const selectSubscribedCategoryIds = state => state.profile.get('followedCategoryIds', Immutable.List())
export const selectFeaturedInCategoryIds = state => state.profile.getIn(['links', 'categories'], Immutable.List())
export const selectCuratedCategoryIds = state => state.profile.getIn(['links', 'categories'], Immutable.List())
export const selectModeratedCategoryIds = state => state.profile.getIn(['links', 'categories'], Immutable.List())

// Memoized selectors
export const selectIsAvatarBlank = createSelector(
  [selectHasAvatarPresent, selectAvatar], (hasAvatarPresent, avatar) => {
    // if we have a tmp we have an avatar locally
    if (avatar && avatar.get('tmp')) { return false }
    return !hasAvatarPresent || !(avatar && (avatar.get('tmp') || avatar.get('original')))
  },
)

export const selectShowCreatorTypeModal = createSelector(
  [selectIsLoggedIn, selectWebOnboardingVersion], (isLoggedIn, webOnboardingVersion) =>
    isLoggedIn && webOnboardingVersion < 3 && webOnboardingVersion !== null,
)

export const selectIsCoverImageBlank = createSelector(
  [selectHasCoverImagePresent, selectCoverImage], (hasCoverImagePresent, coverImage) => {
    // if we have a tmp we have a coverImage locally
    if (coverImage && coverImage.get('tmp')) { return false }
    return !hasCoverImagePresent || !(coverImage && (coverImage.get('tmp') || coverImage.get('original')))
  },
)

export const selectIsInfoFormBlank = createSelector(
  [selectExternalLinksList, selectName, selectShortBio], (externalLinksList, name, shortBio) => {
    const hasLinks = externalLinksList && externalLinksList.length
    const hasName = name && name.length
    const hasShortBio = shortBio && shortBio.length
    return !(hasLinks || hasName || hasShortBio)
  },
)

export const selectLinksAsText = createSelector(
  [selectExternalLinksList], (externalLinksList) => {
    const links = externalLinksList.size ? externalLinksList : ''
    if (typeof links === 'string') {
      return links
    }
    return links.map(link => link.get('text')).join(', ')
  },
)

export const selectIsOwnPage = createSelector(
  [selectUsername, selectPathname], (username, pathname) => {
    const re = new RegExp(`/${username}$`)
    return re.test(pathname)
  },
)

export const selectProfileIsFeatured = createSelector(
  [selectProfileLinksCategories], categories => !categories.isEmpty(),
)

export const selectBioLabel = createSelector(
  [selectIsCommunity], isCommunity => (isCommunity ? 'Community Info' : 'Bio'),
)

export const selectIsRoleAdministrator = createSelector(
  [selectIsStaff, selectCuratedCategoryIds, selectModeratedCategoryIds],
  (isStaff, curated, moderated) => isStaff || !curated.isEmpty() || !moderated.isEmpty(),
)

export const selectCategoryRoleIds = createSelector(
  [selectCuratedCategoryIds, selectModeratedCategoryIds],
  (curated, moderated) => {
    if (curated.isEmpty() && moderated.isEmpty()) {
      return null
    }

    const categoryRoleIds = {
      curatedIds: curated,
      moderatedIds: moderated,
    }
    return categoryRoleIds
  },
)

// can this current profile add/remove roles from other users in a category
// expects `categoryId` and `roleType` to be in props
const selectPropsCategoryId = (state, props) => get(props, 'categoryId')
const selectPropsRoleType = (state, props) => get(props, 'roleType')
export const selectHasRoleAssignmentAccess = createSelector(
  [
    selectIsStaff,
    selectIsRoleAdministrator,
    selectCuratedCategoryIds,
    selectModeratedCategoryIds,
    selectPropsCategoryId,
    selectPropsRoleType,
  ],
  (isStaff, isRoleAdministrator, curated, moderated, categoryId, roleType) => {
    let hasRoleAssignmentAccess = false

    // super staff
    if (isStaff) { hasRoleAssignmentAccess = true }

    // if not staff, but some level of role administrator, check if it applies to this category
    if (
      !isStaff &&
      isRoleAdministrator &&
      (!curated.isEmpty() || !moderated.isEmpty()) &&
      categoryId
    ) {
      let categoryRoleIds = null
      if (roleType === 'curators' && !curated.isEmpty()) { categoryRoleIds = curated }
      if (roleType === 'moderators' && !moderated.isEmpty()) { categoryRoleIds = moderated }

      if (categoryRoleIds) {
        categoryRoleIds.map((categoryRoleId) => {
          if (categoryRoleId === categoryId) {
            hasRoleAssignmentAccess = true
          }
          return hasRoleAssignmentAccess
        })
      }
    }
    return hasRoleAssignmentAccess
  },
)
