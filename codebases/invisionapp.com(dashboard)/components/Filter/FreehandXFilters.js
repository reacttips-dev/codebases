import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { ANALYTICS_SORTS } from '../../constants/SortTypes'
import {
  APP_HOME_SORTED
} from '../../constants/TrackingEvents'
import { trackEvent } from '../../utils/analytics'

import FreehandXFilterDropdown from './FreehandXFilterDropdown'

import styles from '../../css/filters.css'

const FreehandXFilters = ({
  align,
  alignSort,
  analyticsSetContext,
  createdByTypes,
  externalDocConfig,
  externalDocFilterEntries,
  filterTypes,
  isLoading,
  mqs,
  onCreatedByChange,
  onFilterType,
  onSortChange,
  page,
  path,
  scrollToFilterTop,
  selected,
  isSearch,
  showFilters,
  sortTypes,
  viewType
}) => {
  const handleClick = (type) => {
    analyticsSetContext({ page: 0 })
    onFilterType(type)

    scrollToFilterTop && scrollToFilterTop()
  }

  const handleOnCreatedByChange = (value) => {
    trackEvent(APP_HOME_SORTED, {
      page: page,
      sort: ANALYTICS_SORTS[createdByTypes[value]] || 'viewed'
    })

    onCreatedByChange(createdByTypes[value])
    scrollToFilterTop()
  }

  const handleOnSortChange = (value) => {
    trackEvent(APP_HOME_SORTED, {
      page: page,
      sort: ANALYTICS_SORTS[createdByTypes[value]] || 'viewed'
    })

    onSortChange(sortTypes[value])
    scrollToFilterTop()
  }

  const getResponsiveFilterView = () => {
    if ((!filterTypes || filterTypes.length === 0) && (!createdByTypes || createdByTypes.length === 0)) {
      return
    }

    const options = filterTypes.map(type => ({ name: type }))

    return (
      <>
        <div className={cx(styles.responsiveFilters, { [styles.alignLeft]: align === 'left' })}>
          { filterTypes && filterTypes.length > 0 &&
          <FreehandXFilterDropdown
            align={align}
            name='typeFilter'
            onSelect={handleClick}
            options={options}
            externalDocConfig={externalDocConfig}
            externalDocFilterEntries={externalDocFilterEntries}
            selected={selected.type}
            useName
            mqs={mqs}
            isSearch={isSearch}
          />
          }

          { createdByTypes && createdByTypes.length > 0 &&
          <FreehandXFilterDropdown
            align={align}
            name='createdByFilter'
            onSelect={handleOnCreatedByChange}
            options={createdByTypes.map(s => ({ name: s }))}
            selected={selected.createdByType}
            mqs={mqs}
            useName={false}
          />
          }
        </div>
        <div className={cx(styles.responsiveFilters, { [styles.alignLeft]: alignSort === 'left' })}>
          { viewType !== 'search' &&
          <FreehandXFilterDropdown
            align={alignSort}
            name='sort'
            onSelect={handleOnSortChange}
            options={sortTypes.map(s => ({ name: s }))}
            selected={selected.sortType}
            mqs={mqs}
            useName={false}
          />
          }
        </div>
      </>
    )
  }

  if (!showFilters) return null

  const contents = (
    <div className={styles.contents}>
      {
        getResponsiveFilterView()
      }
    </div>
  )

  return contents
}

FreehandXFilters.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
  alignSort: PropTypes.oneOf(['left', 'right']),
  analyticsSetContext: PropTypes.func,
  createdByTypes: PropTypes.array,
  externalDocConfig: PropTypes.object,
  externalDocFilterEntries: PropTypes.object,
  filterTypes: PropTypes.array,
  isFreehandOnly: PropTypes.bool,
  isLoading: PropTypes.bool,
  mqs: PropTypes.object,
  onCreatedByChange: PropTypes.func,
  onFilterType: PropTypes.func,
  onSortChange: PropTypes.func,
  page: PropTypes.string,
  path: PropTypes.string,
  scrollToFilterTop: PropTypes.func,
  selected: PropTypes.shape({
    type: PropTypes.string,
    createdByType: PropTypes.string,
    sortType: PropTypes.string
  }),
  isSearch: PropTypes.bool,
  showFilters: PropTypes.bool,
  sortTypes: PropTypes.array,
  viewType: PropTypes.string
}

FreehandXFilters.defaultProps = {
  align: 'left',
  alignSort: 'right',
  createdByTypes: [],
  filterTypes: [],
  isSearch: false,
  page: 'documents',
  path: ''
}

export default FreehandXFilters
