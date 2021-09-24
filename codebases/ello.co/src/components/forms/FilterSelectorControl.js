import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { scrollToPosition } from './../../lib/jello'
import { css, media, parent, select } from './../../styles/jss'
import * as s from './../../styles/jso'
import {
  ChevronIcon,
  XIcon,
} from '../assets/Icons'

const filterSelectorControlStyle = css(
  s.inlineBlock,
  s.relative,
  {
    width: 300,
  },
  media(s.maxBreak2,
    s.m0,
    s.fullWidth,
    { marginBottom: 10 },
  ),
  parent('.PostGrid .isPostReposting',
    s.m0,
    s.fullWidth,
    { marginBottom: 10 },
  ),
)

const selectorSelectedStyle = css(
  { cursor: 'pointer' },
  select('& input', s.resetInput),
  select('& .selector, & .selected',
    s.fullWidth,
    s.block,
    s.pr20,
    s.pl20,
    s.zIndex2,
    {
      cursor: 'pointer',
      paddingTop: 9,
      paddingBottom: 9,
      lineHeight: 20,
      border: '1px solid #aaa',
      borderRadius: 5,
    },
  ),
  select('&.open .selector, &.open .selected',
    {
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
    },
  ),
  // selector
  select('& .selector',
    s.relative,
  ),
  select('&.open .selector',
    {
      cursor: 'text',
    },
  ),
  select('& .selector-label',
    s.absolute,
    s.colorA,
    s.fontSize14,
    s.lh40,
    s.zIndex1,
    {
      left: 20,
    },
  ),
  select('& svg.ChevronIcon',
    s.absolute,
    s.block,
    s.colorA,
    s.rotate90,
    s.zIndex1,
    {
      cursor: 'pointer',
      top: 10,
      right: 10,
    },
    // select('& polyline', { fill: '#aaa' }),
  ),
  select('&.open svg.ChevronIcon',
    s.zIndex3,
  ),
  // selected
  select('& .selected',
    s.fontSize14,
    {
      lineHeight: 14,
      borderColor: '#979797',
    },
    select('& b',
      s.sansRegular,
      s.inlineBlock,
      s.fullWidth,
      s.truncate,
      {
        width: 'calc(100% - 24px)',
        lineHeight: 20,
        verticalAlign: 'middle',
      },
      select('& i',
        s.sansRegular,
        s.colorA,
      ),
    ),
    select('& button',
      s.absolute,
      {
        right: 15,
      },
      media(s.maxBreak2,
        { right: 18 },
      ),
    ),
    select('& button span.label', s.displayNone),
  ),
)

const selectorItemsStyle = css(
  s.absolute,
  s.fullWidth,
  s.p10,
  s.overflowHidden,
  s.overflowScrollWebY,
  s.bgcWhite,
  s.zTools,
  {
    top: 39,
    left: 0,
    maxHeight: 260,
    border: '1px solid #aaa',
    borderRadius: 0,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  select('& .divider',
    s.p0,
    s.m10,
    s.bgcA,
    {
      height: 1,
      border: 0,
    },
  ),
  // list items
  select('& b',
    s.block,
    s.m0,
    s.p5,
    s.pr10,
    s.pl10,
    s.colorA,
    s.sansRegular,
    {
      lineHeight: 20,
    },
  ),
  select('& ul',
    s.resetList,
    select('& li',
      s.m0,
      s.p0,
      select('& button',
        s.block,
        s.fullWidth,
        {
          marginTop: 1,
          marginBottom: 1,
          padding: 4,
          height: 'auto',
          textAlign: 'left',
          lineHeight: 20,
        },
        // have to be below `padding: 4`
        s.pr10,
        s.pl10,
      ),
      select('& button:active',
        s.colorBlack,
        s.bgcWhite,
      ),

      select('&.isSelected button, & button:hover',
        s.colorWhite,
        s.bgcBlack,
        { borderRadius: 3 },
      ),
    ),
  ),
  // mobile tweaks
  media(s.maxBreak2,
    s.relative,
    s.block,
    {
      WebkitOverflowScrolling: 'none',
      overflowX: 'hidden',
      overflowY: 'visible',
      top: 'auto',
      left: 'auto',
      maxHeight: '100%',
      borderTopWidth: 0,
    },
  ),
)

export function filterSearch(listItems, searchText) {
  if (searchText === '') { return listItems }
  return Array.from(listItems).filter(c => c.get('name').toLowerCase().includes(searchText.toLowerCase()))
}

export function FilterSelectorControlWrapper({ children, className, handleClick }) {
  return (
    /* eslint-disable jsx-a11y/interactive-supports-focus */
    <aside
      className={classNames(className, `${filterSelectorControlStyle}`)}
      role="searchbox"
      onClick={handleClick}
    >
      {children}
    </aside>
  )
}
FilterSelectorControlWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
}
FilterSelectorControlWrapper.defaultProps = {
  children: null,
  className: undefined,
}

export function FilterSelectorListWrapper({ children, id }) {
  return (
    <span
      id={id}
      className={selectorItemsStyle}
    >
      {children}
    </span>
  )
}
FilterSelectorListWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  id: PropTypes.string.isRequired,
}
FilterSelectorListWrapper.defaultProps = {
  children: null,
}

export function FilterSelectorInputWrapper({ children, open }) {
  return (
    <span className={classNames({ open }, `${selectorSelectedStyle}`)}>
      {children}
    </span>
  )
}
FilterSelectorInputWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  open: PropTypes.bool,
}
FilterSelectorInputWrapper.defaultProps = {
  children: null,
  open: false,
}

export function ListItem({ item, index, selectedIndexCurrent, type, onSelect }) {
  const isSelected = selectedIndexCurrent === index
  return (
    <li
      id={`${type}Select_${item.get('id')}`}
      className={classNames({ isSelected })}
    >
      <button
        role="option"
        aria-selected={isSelected}
        onClick={() => onSelect(item)}
      >
        {item.get('name')}
      </button>
    </li>
  )
}
ListItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedIndexCurrent: PropTypes.number,
  type: PropTypes.string,
}
ListItem.defaultProps = {
  selectedIndexCurrent: null,
  type: 'item',
}

export class FilterSelectorControl extends PureComponent {
  static propTypes = {
    assignedItems: PropTypes.object,
    isEditing: PropTypes.bool,
    labelText: PropTypes.string,
    listItems: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    resetSelection: PropTypes.bool,
    searchCallback: PropTypes.func,
    searchPromptText: PropTypes.string,
    selectedItems: PropTypes.array.isRequired,
    selectedPromptText: PropTypes.string,
    trackEvent: PropTypes.func,
    type: PropTypes.string,
  }
  static defaultProps = {
    assignedItems: null,
    isEditing: false,
    labelText: 'Choose',
    resetSelection: false,
    searchCallback: null,
    searchPromptText: 'Type something…',
    selectedPromptText: null,
    trackEvent: null,
    type: 'filter-select',
  }

  constructor(props) {
    super(props)
    const { listItems } = props
    this.state = {
      listItems,
      focused: false,
      open: false,
      searchText: '',
      selectedItem: null,
      selectedIndex: null,
    }

    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount() {
    const {
      assignedItems,
      selectedItems,
    } = this.props
    if (selectedItems || assignedItems) {
      this.setItemSelection()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { listItems } = nextProps
    const { searchText } = this.state
    this.setState({
      listItems: filterSearch(listItems, searchText),
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
      this.scrollToHighlightedItem()
    }

    if (this.props.selectedItems &&
      prevProps.selectedItems !== this.props.selectedItems) {
      this.setItemSelection()
    }

    if (this.state.open && !this.props.selectedItems.length > 0) {
      this.itemSelectorRef.focus()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  onSelectLocal = (item) => {
    const { onSelect, trackEvent, type } = this.props

    if (trackEvent) {
      let trackEventName = null
      switch (type) {
        case ('postCategorySelect'):
          trackEventName = 'category-post-selector-selected'
          break
        default:
          return null
      }

      if (trackEventName) {
        return trackEvent(trackEventName, {
          id: item.get('id'),
          slug: item.get('slug'),
        })
      }
    }

    onSelect(item)
    return this.close()
  }

  setItemSelection() {
    const {
      isEditing,
      assignedItems,
      selectedItems,
    } = this.props
    const {
      listItems,
    } = this.state

    if ((selectedItems.length > 0) || (assignedItems)) {
      // assume we only have one selection at a time for now
      let selectedItem = null
      let selectedIndex = null

      // grab the selected item (if not editing)
      if (!isEditing && (selectedItems.length > 0)) {
        selectedItem = selectedItems[0]

        Array.from(listItems).map((item, index) => {
          if (selectedItem.get('id') === item.get('id')) {
            selectedIndex = index
          }
          return selectedIndex
        })
      }

      // grab the selected item from the post (if editing)
      if (isEditing && assignedItems) {
        Array.from(listItems).map((item, index) => {
          assignedItems.map((assignedItemId) => {
            if (assignedItemId === item.get('id')) {
              selectedItem = item
              selectedIndex = index
            }
            return selectedIndex
          })
          return selectedIndex
        })
      }

      return this.setState({
        selectedItem,
        selectedIndex,
      })
    }

    return this.setState({
      selectedItem: null,
      selectedIndex: null,
    })
  }

  setWrapperRef(node) {
    this.wrapperRef = node
  }

  handleSearch = (event) => {
    const searchText = event.target.value
    const { listItems } = this.props
    const { selectedIndex } = this.state

    let newSelectedIndex = selectedIndex
    if (!selectedIndex) {
      newSelectedIndex = searchText === '' ? null : 0
    }
    this.setState({
      selectedIndex: newSelectedIndex,
      searchText,
      listItems: filterSearch(listItems, searchText),
    })

    if (this.props.searchCallback) {
      this.props.searchCallback(searchText)
    }
  }

  handleKeyDown = (event) => {
    const { trackEvent, type } = this.props
    const {
      listItems,
      selectedIndex,
    } = this.state
    const listItemsArray = Array.from(listItems)
    const max = listItemsArray.length
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
      const selected = listItemsArray[selectedIndex]

      if (trackEvent) {
        let trackEventName = null
        switch (type) {
          case ('postCategorySelect'):
            trackEventName = 'category-post-selector-selected'
            break
          default:
            return null
        }

        if (trackEventName) {
          return trackEvent(trackEventName, {
            id: selected.get('id'),
            slug: selected.get('slug'),
          })
        }
      }

      this.onSelectLocal(listItemsArray[selectedIndex])
    } else if (event.key === 'Escape') {
      this.itemSelectorRef.blur()
      this.close()
    }
    return null
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
    if (e.target.nodeName === 'polyline' ||
      e.target.nodeName === 'g' ||
      e.target.nodeName === 'svg') {
      return this.close()
    }
    if (e.target.nodeName !== 'BUTTON') {
      return this.open()
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

  scrollToHighlightedItem() {
    const { type } = this.props
    const {
      listItems,
      selectedIndex,
    } = this.state
    const listItemsArray = Array.from(listItems)
    const selectedItem = listItemsArray[selectedIndex]
    let selectedItemDomId = null
    if (selectedItem) {
      selectedItemDomId = `${type}Select_${selectedItem.get('id')}`
    }

    // grab elements from the dom
    const itemListInDom = document.getElementById(`${type}List`)
    const selectedListItemInDom = document.getElementById(selectedItemDomId)

    // determine scroll offset of item in dom
    let selectedListItemInDomTopOffset = null
    let itemListInDomTopOffset = null
    let itemInDomHeight = null
    let itemListInDomHeight = null
    if (selectedItemDomId) {
      selectedListItemInDomTopOffset = selectedListItemInDom.getBoundingClientRect().top
      itemListInDomTopOffset = itemListInDom.getBoundingClientRect().top
      itemInDomHeight = selectedListItemInDom.clientHeight
      itemListInDomHeight = itemListInDom.clientHeight
    }

    if (selectedListItemInDomTopOffset) {
      // adjust scroll offset for window height / nav bar
      const scrollElement = itemListInDom
      const scrollTo = (selectedListItemInDomTopOffset - itemListInDomTopOffset)
      const scrollCheckOffset = itemInDomHeight

      if (
        ((scrollTo + scrollCheckOffset) > itemListInDomHeight) ||
        (scrollTo < 0)
      ) {
        // scroll to new position
        scrollToPosition(0, scrollTo, { el: scrollElement, duration: 150 })
      }
    }
  }

  open() {
    if (!this.state.open) {
      const { trackEvent, type } = this.props

      if (trackEvent) {
        let trackEventName = null
        switch (type) {
          case ('postCategorySelect'):
            trackEventName = 'category-post-selector-opened'
            break
          default:
            return null
        }

        if (trackEventName) {
          trackEvent(trackEventName)
        }
      }

      return this.setState({
        open: true,
      })
    }
    return null
  }

  close(track = true) {
    if (this.state.open) {
      const { trackEvent, type } = this.props

      if (trackEvent && track) {
        let trackEventName = null
        switch (type) {
          case ('postCategorySelect'):
            trackEventName = 'category-post-selector-closed'
            break
          default:
            return null
        }

        if (trackEventName) {
          trackEvent(trackEventName)
        }
      }

      return this.resetSelection(false)
    }
    return null
  }

  clearLocal(track = true) {
    const { onClear, trackEvent, type } = this.props

    if (trackEvent && track) {
      let trackEventName = null
      switch (type) {
        case ('postCategorySelect'):
          trackEventName = 'category-post-selector-cleared'
          break
        default:
          return null
      }

      if (trackEventName) {
        trackEvent(trackEventName)
      }
    }
    return onClear()
  }

  resetSelection(track = true) {
    const { listItems, trackEvent, type } = this.props

    if (trackEvent && track) {
      let trackEventName = null
      switch (type) {
        case ('postCategorySelect'):
          trackEventName = 'category-post-selector-reset'
          break
        default:
          return null
      }

      if (trackEventName) {
        trackEvent(trackEventName)
      }
    }

    return this.setState({
      listItems,
      searchText: '',
      focused: false,
      open: false,
    })
  }

  render() {
    const {
      labelText,
      searchPromptText,
      selectedPromptText,
      type,
    } = this.props
    const {
      open,
      searchText,
      selectedItem,
      selectedIndex,
      listItems,
    } = this.state
    // Everything except this component could support multiple item selections, but for now
    // we can assume there is only one selected item at a time.
    return (
      <FilterSelectorControlWrapper
        className={`fs fs-${type}`}
        handleClick={e => this.handleSelectorClick(e)}
      >
        <span ref={this.setWrapperRef}>
          <FilterSelectorInputWrapper open={open}>
            {!selectedItem &&
              <span className="input-with-label">
                {!searchText &&
                  <label
                    className="selector-label"
                    htmlFor={type}
                  >
                    {open ? searchPromptText : labelText}
                  </label>
                }
                <ChevronIcon />
                <input
                  ref={(node) => { this.itemSelectorRef = node }}
                  className="selector"
                  name={type}
                  type="search"
                  value={searchText}
                  onChange={this.handleSearch}
                  onKeyDown={this.handleKeyDown}
                  onBlur={() => this.handleBlur(false)}
                  onFocus={() => this.handleBlur(true)}
                />
              </span>
            }
            {selectedItem &&
              <span className="selected">
                {selectedPromptText ?
                  <b>
                    <i>{selectedPromptText}:</i>
                    &nbsp;
                    {selectedItem.get('name')}
                  </b>
                  :
                  <b>{selectedItem.get('name')}</b>
                }
                <button onClick={() => this.clearLocal()}>
                  <span className="label">Remove</span>
                  <span className="icon">
                    <XIcon />
                  </span>
                </button>
              </span>
            }
          </FilterSelectorInputWrapper>
          {open &&
            <FilterSelectorListWrapper id={`${type}List`}>
              <ul>
                {Array.from(listItems).map((item, index) => (
                  <ListItem
                    key={`${type}Select:${item.get('id')}`}
                    item={item}
                    index={index}
                    selectedIndexCurrent={selectedIndex}
                    type={type}
                    onSelect={this.onSelectLocal}
                  />),
                )}
              </ul>
            </FilterSelectorListWrapper>
          }
        </span>
      </FilterSelectorControlWrapper>
    )
  }
}
