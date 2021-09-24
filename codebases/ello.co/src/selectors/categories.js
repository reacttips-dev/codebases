import { Map, OrderedSet, List } from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import startCase from 'lodash/startCase'
import { CATEGORIES } from '../constants/mapping_types'
import { META } from '../constants/locales/en'
import { selectParamsType } from './params'
import { selectPathname } from './routing'
import { selectSubscribedCategoryIds, selectFeaturedInCategoryIds } from './profile'
import { selectIsLoggedIn } from './authentication'

export const selectPropsCategoryId = (state, props) => get(props, 'categoryId')

// state.json.categories.xxx
export const selectCategoryCollection = state => state.json.get(CATEGORIES, Map())
export const selectCategoryPostCollection = state => state.json.get('categoryPosts', Map())
export const selectCategoryUsersCollection = state => state.json.get('categoryUsers', Map())

// Requires `categoryId` to be found in props
export const selectCategory = createSelector(
  [selectPropsCategoryId, selectCategoryCollection], (id, categories) =>
    categories.get(id, Map()),
)

export const selectCategoryUsers = createSelector(
  [selectPropsCategoryId, selectCategoryUsersCollection], (id, categoryUsers) =>
    categoryUsers.filter(categoryUser => categoryUser.get('categoryId') === id).toArray())

export const selectCategoryName = createSelector([selectCategory], category => category.get('name'))
export const selectCategorySlug = createSelector([selectCategory], category => category.get('slug'))
export const selectCategoryTileImageUrl = createSelector([selectCategory], category => category.getIn(['tileImage', 'large', 'url']))
export const selectCategoryIsSubscribed = createSelector(
  [selectCategory, selectIsLoggedIn, selectSubscribedCategoryIds],
  (category, isLoggedIn, subscribedIds) => (
    category && isLoggedIn && subscribedIds.includes(category.get('id'))))
export const selectCategoryIsPromo = createSelector([selectCategory], category => category.get('level') === 'promo')

export const selectAllCategoriesAsArray = createSelector([selectCategoryCollection],
  categories => (categories || Map()).valueSeq())


const levelEnum = {
  promoted: 10,
  primary: 20,
  secondary: 30,
  tertiary: 40,
}

function sortCategoriesByLevelAndOrder(a, b) {
  const levelA = levelEnum[a.get('level')]
  const levelB = levelEnum[b.get('level')]
  const orderA = a.get('order')
  const orderB = b.get('order')

  if (levelA > levelB) {
    return 1
  } else if (levelB > levelA) {
    return -1
  } else if (orderA > orderB) {
    return 1
  } else if (orderB > orderA) {
    return -1
  }
  return 0
}

export const selectOrderedCategories = createSelector(
  [selectAllCategoriesAsArray], categories => categories.sort(sortCategoriesByLevelAndOrder))

export const selectOrderedCategoryIds = createSelector(
  [selectOrderedCategories], cats => cats.map(cat => cat.get('id')))

export const selectOnboardingCategoriesFiltered = createSelector(
  [selectOrderedCategories], categories =>
    categories.filter(category => category.get('allowInOnboarding')).toArray())

export const selectCreatorTypeCategories = createSelector(
  [selectOrderedCategories], categories =>
    categories.filter(category => category.get('isCreatorType')).toArray())

export const selectSubscribedCategories = createSelector(
  [selectCategoryCollection, selectSubscribedCategoryIds], (categories, ids) =>
    ids.map(id => categories.get(id)).filter(val => !!val).toArray())

export const selectFeaturedInCategories = createSelector(
  [selectCategoryCollection, selectFeaturedInCategoryIds], (categories, ids) =>
    ids.map(id => categories.get(id)).filter(val => !!val).toArray())

export const selectUnsubscribedCategories = createSelector(
  [selectOrderedCategories, selectSubscribedCategoryIds], (categories, ids) =>
    categories.filter(cat => !ids.includes(cat.get('id'))).toArray())

const selectPostSelectedCategoryIds = (state, props) => props.categoryIds || []

export const selectPostSelectedCategories = createSelector(
  [selectCategoryCollection, selectPostSelectedCategoryIds], (categories, ids) =>
    ids.map(id => categories.get(id)).filter(val => !!val))

export const selectCategoryTabs = createSelector(
  [selectCategoryCollection, selectIsLoggedIn, selectSubscribedCategoryIds],
  (categories, isLoggedIn, subscribedIds) => {
    if (!categories) { return [] }

    const promoIds = OrderedSet(categories.filter(cat => cat.get('level') === 'promo').keySeq())
    let navIds = promoIds

    if (isLoggedIn) {
      navIds = navIds.concat(subscribedIds)
    } else {
      const primaryIds = categories.filter(cat => cat.get('level') === 'primary').keySeq()
      navIds = navIds.concat(primaryIds)
    }

    return navIds.reduce((ids, id) => {
      const label = categories.getIn([id, 'name'])
      const slug = categories.getIn([id, 'slug'])
      const categoryLevel = categories.getIn([id, 'level'])

      if (!slug || !label) { return ids }
      return ids.push({
        label,
        to: `/discover/${slug}`,
        promo: (categoryLevel === 'promo'),
        sources: {
          small: categories.getIn([id, 'tileImage', 'small', 'url']),
          large: categories.getIn([id, 'tileImage', 'large', 'url']),
        },
      })
    }, List()).toArray()
  },
)

// determine if any non-promo categories are subscribed to
export const selectAreCategoriesSubscribed = createSelector(
  [selectSubscribedCategoryIds],
  (subscribedIds) => {
    if (subscribedIds && subscribedIds.size > 0) { return true }
    return false
  })

export const selectCategoryPageTitle = createSelector(
  [selectParamsType, selectCategoryCollection], (paramsType, categories) => {
    switch (paramsType) {
      case 'all':
        return null
      case undefined:
      case 'recommended':
        return 'Featured'
      default: {
        const cat = categories &&
          categories.find(c => c.get('slug') === paramsType)
        return cat ? cat.get('name') : startCase(paramsType).replace(/\sX\s/, ' x ')
      }
    }
  },
)

export const selectCategoryForPath = createSelector(
  [selectPathname, selectAllCategoriesAsArray], (pathname, categories) => {
    const slug = pathname
      .replace('/discover/', '')
      .replace('/recent', '')
      .replace('/shop', '')
      .replace('/trending', '')
    return categories.find(category => category.get('slug') === slug) || Map()
  },
)

export const selectDiscoverMetaData = createSelector(
  [selectParamsType, selectCategoryForPath, selectCategoryPageTitle],
  (type, category, pageTitle) => {
    const titlePrefix = pageTitle ? `${pageTitle} | ` : ''
    const title = `${titlePrefix}Ello`
    const image = category.getIn(['tileImage', 'large', 'url'], META.IMAGE)
    let description = ''
    switch (type) {
      case undefined:
      case 'featured':
      case 'recommended':
        description = META.FEATURED_PAGE_DESCRIPTION
        break
      case 'recent':
        description = META.RECENT_PAGE_DESCRIPTION
        break
      case 'trending':
        description = META.TRENDING_PAGE_DESCRIPTION
        break
      case 'all':
        description = META.ALL_PAGE_DESCRIPTION
        break
      default: {
        description = category && category.get('description') ?
          category.get('description') : META.DESCRIPTION
        break
      }
    }
    return { description, image, title }
  },
)

export const selectAdministeredCategoryIds = state =>
  state.json.getIn(['pages', 'administeredCategoryProfileSearch', 'ids'], OrderedSet())
export const selectAdministeredCategories = createSelector(
  [selectAdministeredCategoryIds, selectCategoryCollection],
  (ids, categories) => ids.map(id => categories.get(id)),
)
