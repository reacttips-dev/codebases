import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { scrollToPosition } from './../../lib/jello'
import {
  ChevronIcon,
  XIcon,
} from '../assets/Icons'
import {
  filterSearch,
  FilterSelectorControlWrapper,
  FilterSelectorListWrapper,
  FilterSelectorInputWrapper,
  ListItem,
} from './../forms/FilterSelectorControl'

export default class CategoryPostSelector extends PureComponent {
  static propTypes = {
    featuredInCategories: PropTypes.array.isRequired,
    isPostEditing: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    postCategories: PropTypes.object,
    resetSelection: PropTypes.bool.isRequired,
    selectedCategories: PropTypes.array.isRequired,
    subscribedCategories: PropTypes.array.isRequired,
    trackEvent: PropTypes.func.isRequired,
    unsubscribedCategories: PropTypes.array.isRequired,
  }
  static defaultProps = {
    postCategories: null,
  }

  constructor(props) {
    super(props)
    const { subscribedCategories, unsubscribedCategories } = props
    this.state = {
      subscribedCategories,
      unsubscribedCategories,
      focused: false,
      open: false,
      searchText: '',
      selectedCategory: null,
      selectedIndex: null,
    }

    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount() {
    const {
      featuredInCategories,
      onSelect,
      postCategories,
      selectedCategories,
    } = this.props
    if (featuredInCategories.length > 0) {
      onSelect(featuredInCategories[0])
    }

    if (selectedCategories || postCategories) {
      this.setCategorySelection()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { subscribedCategories, unsubscribedCategories } = nextProps
    const { searchText } = this.state
    this.setState({
      subscribedCategories: filterSearch(subscribedCategories, searchText),
      unsubscribedCategories: filterSearch(unsubscribedCategories, searchText),
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if ((!prevState.open && this.state.open) ||
      (!this.state.open && !prevState.focused && this.state.focused)) {
      document.addEventListener('mousedown', this.handleClickOutside)
    }

    // close & reset selection
    if (!prevProps.resetSelection && this.props.resetSelection) {
      this.close(false)
    }

    if (this.state.open &&
      (prevState.selectedIndex !== this.state.selectedIndex)) {
      this.scrollToSelectedCategory()
    }

    if (this.props.selectedCategories &&
      prevProps.selectedCategories !== this.props.selectedCategories) {
      this.setCategorySelection()
    }

    if (this.state.open && !this.props.selectedCategories.length > 0) {
      this.categorySelectorRef.focus()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  onSelectLocal = (category) => {
    const { onSelect, trackEvent } = this.props
    trackEvent('category-post-selector-selected', {
      id: category.get('id'),
      slug: category.get('slug'),
    })
    onSelect(category)
  }

  setCategorySelection() {
    const {
      isPostEditing,
      postCategories,
      selectedCategories,
    } = this.props
    const {
      subscribedCategories,
      unsubscribedCategories,
    } = this.state

    if ((selectedCategories.length > 0) || (postCategories)) {
      // assume we only have one selection at a time for now
      let selectedCategory = null
      let selectedIndex = null
      const categories = subscribedCategories.concat(unsubscribedCategories)

      // grab the selected category (if not editing)
      if (!isPostEditing && (selectedCategories.length > 0)) {
        selectedCategory = selectedCategories[0]

        categories.map((category, index) => {
          if (selectedCategory.get('id') === category.get('id')) {
            selectedIndex = index
          }
          return selectedIndex
        })
      }

      // grab the selected category from the post (if editing)
      if (isPostEditing && postCategories) {
        categories.map((category, index) => {
          postCategories.map((categoryPostId) => {
            if (categoryPostId === category.get('id')) {
              selectedCategory = category
              selectedIndex = index
            }
            return selectedIndex
          })
          return selectedIndex
        })
      }

      return this.setState({
        selectedCategory,
        selectedIndex,
      })
    }

    return this.setState({
      selectedCategory: null,
      selectedIndex: null,
    })
  }

  setWrapperRef(node) {
    this.wrapperRef = node
  }

  handleSearch = (event) => {
    const searchText = event.target.value
    const { subscribedCategories, unsubscribedCategories } = this.props
    const { selectedIndex } = this.state

    let newSelectedIndex = selectedIndex
    if (!selectedIndex) {
      newSelectedIndex = searchText === '' ? null : 0
      // newSelectedIndex = 0
    }
    this.setState({
      selectedIndex: newSelectedIndex,
      searchText,
      subscribedCategories: filterSearch(subscribedCategories, searchText),
      unsubscribedCategories: filterSearch(unsubscribedCategories, searchText),
    })
  }

  handleKeyDown = (event) => {
    const { onSelect, trackEvent } = this.props
    const {
      subscribedCategories,
      unsubscribedCategories,
      selectedIndex,
    } = this.state
    const categories = subscribedCategories.concat(unsubscribedCategories)
    const max = categories.length
    const selectedIsNull = (selectedIndex === null)

    if (event.key === 'ArrowDown' && selectedIsNull) {
      this.setState({ selectedIndex: 0 })
    } else if (event.key === 'ArrowDown' && selectedIndex === (max - 1)) {
      this.setState({ selectedIndex: 0 })
    } else if (event.key === 'ArrowDown' && selectedIndex < max) {
      this.setState({ selectedIndex: selectedIndex + 1 })
    } else if (event.key === 'ArrowUp' && !selectedIsNull && selectedIndex > 0) {
      event.preventDefault()
      this.setState({ selectedIndex: selectedIndex - 1 })
    } else if (event.key === 'ArrowUp' && !selectedIsNull && selectedIndex === 0) {
      event.preventDefault()
      this.setState({ selectedIndex: max - 1 })
    } else if (event.key === 'Enter' && !selectedIsNull) {
      const selected = categories[selectedIndex]
      trackEvent('category-post-selector-selected', {
        id: selected.get('id'),
        slug: selected.get('slug'),
      })
      onSelect(categories[selectedIndex])
    } else if (event.key === 'Escape') {
      this.categorySelectorRef.blur()
      this.close()
    }
  }

  handleBlur(isFocused) {
    this.setState({
      focused: isFocused,
    })

    if (isFocused) {
      this.open()
    }
  }

  handleSelectorClick(e) {
    const { isPostEditing } = this.props

    if (!isPostEditing) {
      if (e.target.nodeName === 'polyline' ||
        e.target.nodeName === 'g' ||
        e.target.nodeName === 'svg') {
        return this.close()
      }
      if (e.target.nodeName !== 'BUTTON') {
        return this.open()
      }
    }
    return null
  }

  handleClickOutside(event) {
    if (this.state.open) {
      if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
        this.close()
      }
    }
  }

  scrollToSelectedCategory() {
    const {
      subscribedCategories,
      unsubscribedCategories,
      selectedIndex,
    } = this.state
    const categories = subscribedCategories.concat(unsubscribedCategories)
    const selectedCategory = categories[selectedIndex]
    let selectedCategoryDomId = null
    if (selectedCategory) {
      selectedCategoryDomId = `categorySelect_${selectedCategory.get('id')}`
    }

    // grab elements from the dom
    const categoryListInDom = document.getElementById('categoryList')
    const selectedCategoryItemInDom = document.getElementById(selectedCategoryDomId)

    // determine scroll offset of category item in dom
    let categoryItemInDomTopOffset = null
    let categoryListInDomTopOffset = null
    let categoryItemInDomHeight = null
    let categoryListInDomHeight = null
    if (selectedCategoryDomId) {
      categoryItemInDomTopOffset = selectedCategoryItemInDom.getBoundingClientRect().top
      categoryListInDomTopOffset = categoryListInDom.getBoundingClientRect().top
      categoryItemInDomHeight = selectedCategoryItemInDom.clientHeight
      categoryListInDomHeight = categoryListInDom.clientHeight
    }

    if (categoryItemInDomTopOffset) {
      // adjust scroll offset for window height / nav bar
      const scrollElement = categoryListInDom
      const scrollTo = (categoryItemInDomTopOffset - categoryListInDomTopOffset)
      const scrollCheckOffset = categoryItemInDomHeight

      if (
        ((scrollTo + scrollCheckOffset) > categoryListInDomHeight) ||
        (scrollTo < 0)
      ) {
        // scroll to new position
        scrollToPosition(0, scrollTo, { el: scrollElement, duration: 150 })
      }
    }
  }

  open() {
    if (!this.state.open) {
      this.props.trackEvent('category-post-selector-opened')
      this.setState({
        open: true,
      })
    }
  }

  close(track = true) {
    if (this.state.open) {
      if (track) { this.props.trackEvent('category-post-selector-closed') }
      this.resetSelection(false)
    }
  }

  clearLocal() {
    const { onClear, isPostEditing, trackEvent } = this.props
    if (!isPostEditing) {
      trackEvent('category-post-selector-cleared')
      onClear()
    }
  }

  resetSelection(track = true) {
    const { subscribedCategories, unsubscribedCategories } = this.props
    if (track) { this.props.trackEvent('category-post-selector-reset') }
    this.setState({
      subscribedCategories,
      unsubscribedCategories,
      searchText: '',
      focused: false,
      open: false,
    })
  }

  render() {
    const { isPostEditing } = this.props
    const {
      open,
      searchText,
      selectedCategory,
      selectedIndex,
      subscribedCategories,
      unsubscribedCategories,
    } = this.state
    // Everything except this component could support multiple categories, but for now
    // we can assume there is only one selected category per post.
    const offset = subscribedCategories.length
    return (
      <FilterSelectorControlWrapper
        ref={this.setWrapperRef}
        className={`category-post-selector${isPostEditing ? ' disabled' : ''}`}
        handleClick={e => this.handleSelectorClick(e)}
      >
        <FilterSelectorInputWrapper open={open}>
          {!selectedCategory &&
            <span className="input-with-label">
              {!searchText &&
                <label className="selector-label" htmlFor="categorySelector">
                  {open ? 'Type category name' : 'Choose Category'}
                </label>
              }
              <ChevronIcon />
              <input
                ref={(node) => { this.categorySelectorRef = node }}
                className="selector"
                name="categorySelector"
                type="search"
                value={searchText}
                onChange={this.handleSearch}
                onKeyDown={this.handleKeyDown}
                onBlur={() => this.handleBlur(false)}
                onFocus={() => this.handleBlur(true)}
              />
            </span>
          }
          {selectedCategory &&
            <span className="selected">
              <b>
                <i>
                  {isPostEditing ?
                    'Posted into:'
                    :
                    'Post into:'
                  }
                </i>
                &nbsp;
                {selectedCategory.get('name')}
              </b>
              {!isPostEditing &&
                <button onClick={() => this.clearLocal()}>
                  <span className="label">Remove</span>
                  <span className="icon">
                    <XIcon />
                  </span>
                </button>
              }
            </span>
          }
        </FilterSelectorInputWrapper>
        {open && !isPostEditing &&
          <FilterSelectorListWrapper id="categoryList">
            {subscribedCategories.length > 0 &&
              <span className="subscribed">
                <b>Your Categories</b>
                <ul>
                  {subscribedCategories.map((item, index) =>
                    (<ListItem
                      key={`categorySelect:${item.get('id')}`}
                      item={item}
                      index={index}
                      selectedIndexCurrent={selectedIndex}
                      type="category"
                      onSelect={this.onSelectLocal}
                    />),
                  )}
                </ul>
                <hr className="divider" />
              </span>
            }
            <span className="all">
              <b>All Categories</b>
              <ul>
                {unsubscribedCategories.map((item, index) =>
                  (<ListItem
                    key={`categorySelect:${item.get('id')}`}
                    item={item}
                    index={index + offset}
                    selectedIndexCurrent={selectedIndex}
                    type="category"
                    onSelect={this.onSelectLocal}
                  />),
                )}
              </ul>
            </span>
          </FilterSelectorListWrapper>
        }
      </FilterSelectorControlWrapper>
    )
  }
}
