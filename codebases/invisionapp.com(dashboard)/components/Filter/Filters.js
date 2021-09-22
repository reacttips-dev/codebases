import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import debounce from 'lodash/debounce'

import { Search } from '@invisionapp/helios'
import { FILTER_RHOMBUS, FILTER_HARMONY, FILTER_SPECS } from '../../constants/FilterTypes'
import { ANALYTICS_SORTS } from '../../constants/SortTypes'
import {
  APP_HOME_SORTED,
  APP_SEARCHFILTER_OPENED,
  APP_SEARCHFILTER_STARTED
} from '../../constants/TrackingEvents'
import { analyticsPathToPageName } from '../../utils/filters'
import { trackEvent } from '../../utils/analytics'

import FilterDropdown from './FilterDropdown'

import styles from '../../css/filters.css'

class Filters extends Component {
  static propTypes = {
    align: PropTypes.oneOf(['left', 'right']),
    analyticsSetContext: PropTypes.func,
    enableRhombus: PropTypes.bool,
    enableSpecs: PropTypes.bool,
    externalDocFilterEntries: PropTypes.object,
    filterTypes: PropTypes.array,
    onFilterType: PropTypes.func,
    onSearch: PropTypes.func,
    onSortChange: PropTypes.func,
    scrollToFilterTop: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    searchTerm: PropTypes.string,
    selected: PropTypes.shape({
      sortType: PropTypes.string,
      type: PropTypes.string
    }),
    showFilters: PropTypes.bool,
    showSearch: PropTypes.bool,
    sortTypes: PropTypes.array,
    studioWebEnabled: PropTypes.bool,
    page: PropTypes.string,
    path: PropTypes.string
  }

  static defaultProps = {
    align: 'right',
    enableRhombus: false,
    enableSpecs: false,
    filterTypes: [],
    page: 'documents',
    path: '',
    sortTypes: [],
    studioWebEnabled: false
  }

  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.onSortChange = this.onSortChange.bind(this)

    this.state = {
      analyticsSearchStartFired: false,
      isSearchVisible: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.path !== nextProps.path) {
      // Force the search to close if we switched between spaces and documents (but not between tabs within these pages)
      const oldPathRoot = this.props.path && this.props.path.startsWith('/spaces') ? 'spaces' : 'documents'
      const newPathRoot = nextProps.path && nextProps.path.startsWith('/spaces') ? 'spaces' : 'documents'
      if (oldPathRoot !== newPathRoot) {
        this.handleChangeVisibility(false)
      }
    }
  }

  handleClick (type) {
    this.props.analyticsSetContext({ page: 0 })
    this.props.onFilterType(type)

    this.props.scrollToFilterTop && this.props.scrollToFilterTop()
  }

  handleSearch = (e) => {
    const value = typeof e === 'string' ? e : e.target.value
    this.debouncedHandleSearch(value)
  }

  handleChangeVisibility = (isVisible) => {
    if (isVisible) {
      trackEvent(APP_SEARCHFILTER_OPENED, {
        page: analyticsPathToPageName(this.props.path)
      })
      this.setState({
        analyticsSearchStartFired: false
      })
    }
    this.setState({
      isSearchVisible: isVisible
    })

    this.handleSearch('')
  }

  debouncedHandleSearch = debounce((value) => {
    if (value === this.props.searchTerm) { return }

    const {
      path
    } = this.props

    // We don't care about what the user search for as of now - simply track when he started to search for something
    if (value && (value.trim() !== '') && (this.state && !this.state.analyticsSearchStartFired)) {
      trackEvent(APP_SEARCHFILTER_STARTED, {
        page: analyticsPathToPageName(path)
      })

      this.setState({
        analyticsSearchStartFired: true
      })
    }

    this.props.onSearch && this.props.onSearch(value)
    this.props.scrollToFilterTop && this.props.scrollToFilterTop()
  }, 250)

  onSortChange (value) {
    trackEvent(APP_HOME_SORTED, {
      page: this.props.page,
      sort: ANALYTICS_SORTS[this.props.sortTypes[value]] || 'viewed'
    })

    this.props.onSortChange(this.props.sortTypes[value])
    this.props.scrollToFilterTop()
  }

  getResponsiveFilterView = () => {
    const {
      align,
      filterTypes,
      selected,
      sortTypes,
      enableRhombus,
      mqs,
      studioWebEnabled,
      enableSpecs,
      externalDocConfig,
      externalDocFilterEntries
    } = this.props

    if ((!filterTypes || filterTypes.length === 0) && (!sortTypes || sortTypes.length === 0)) {
      return
    }

    const options = filterTypes
      .filter(type => {
        switch (type) {
          case FILTER_RHOMBUS:
            return enableRhombus
          case FILTER_HARMONY:
            return studioWebEnabled
          case FILTER_SPECS:
            return enableSpecs
          default:
            return true
        }
      })
      .map(type => ({
        name: type
      })
      )

    // return null
    return (
      <div className={cx(styles.responsiveFilters, { [styles.alignLeft]: align === 'left' })}>
        { filterTypes && filterTypes.length > 0 &&
        <FilterDropdown
          align={align}
          name='filter'
          onSelect={this.handleClick}
          options={options}
          externalDocConfig={externalDocConfig}
          externalDocFilterEntries={externalDocFilterEntries}
          selected={selected.type}
          useName
          mqs={mqs}
        />
        }

        { sortTypes && sortTypes.length > 0 &&
        <FilterDropdown
          align={align}
          name='sort'
          onSelect={this.onSortChange}
          options={sortTypes.map(s => ({ name: s }))}
          selected={selected.sortType}
          mqs={mqs}
          useName={false}
        />
        }
      </div>
    )
  }

  render () {
    const {
      searchPlaceholder,
      path,
      showFilters,
      showSearch
    } = this.props
    const { isSearchVisible } = this.state

    if (!showFilters) return null

    const contents = (
      <div className={styles.contents}>
        { showSearch &&
          <Search
            className={cx(styles.searchWrap, styles.isWithSidebar, { [styles.searchOpen]: isSearchVisible })}
            align='left'
            id='search-documents'
            key={path && path.startsWith('/spaces') ? 'spaces' : 'documents'}
            placeholder={searchPlaceholder}
            onChange={this.handleSearch}
            onChangeVisibility={this.handleChangeVisibility}
          />
        }
        {
          this.getResponsiveFilterView()
        }
      </div>
    )

    return contents
  }
}

export default Filters
