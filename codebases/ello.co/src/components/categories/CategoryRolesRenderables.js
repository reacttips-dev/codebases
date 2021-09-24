import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import classNames from 'classnames'
import { scrollToPosition } from './../../lib/jello'
import { CircleAddRemove } from '../assets/Icons'
import { DismissButtonLG } from '../buttons/Buttons'
import { css, hover, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'
import Avatar from './../assets/Avatar'

const categoryAddRoleTriggerStyle = css(
  s.wv20,
  s.hv20,
  select('& .label', s.displayNone),
  select('& .icon',
    s.transitionColor,
    s.colorA,
  ),
  hover(
    select('& .icon',
      s.colorBlack,
    ),
  ),

  // add version
  select('&.add-role',
    select('& .icon',
      s.colorGreen,
      select('& svg',
        { verticalAlign: 'baseline' },
      ),
    ),
    hover(
      select('& .icon',
        s.colorDarkGreen,
      ),
    ),
  ),
  // remove version
  select('&.remove-role',
    select('& .icon',
      select('& svg',
        { transform: 'rotate(45deg)' },
      ),
    ),
  ),
)

export function CategoryAddRemoveRoleButton({
  actionType,
  handleClick,
  roleType,
}) {
  const actionName = actionType === 'add' ? 'Add' : 'Remove'
  const roleName = roleType === 'curators' ? 'Curator' : 'Moderator'

  return (
    <button
      className={`${actionType}-role${actionType === 'add' ? ' open-trigger' : ''} ${categoryAddRoleTriggerStyle}`}
      title={`${actionName} ${roleName}`}
      onClick={handleClick}
    >
      <span className="label">
        {actionName} {roleName}
      </span>
      <span className="icon">
        <CircleAddRemove />
      </span>
    </button>
  )
}
CategoryAddRemoveRoleButton.propTypes = {
  actionType: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  roleType: PropTypes.string.isRequired,
}

const categoryRoleUserStyle = css(
  s.flex,
  s.itemsCenter,
  s.fullWidth,
  s.colorBlack,
  select('& button',
    s.block,
    s.fullWidth,
    s.p5,
    s.leftAlign,
  ),
  select('& .Avatar',
    s.inlineBlock,
    s.wv20,
    s.hv20,
    s.mr10,
  ),
  select('& .username',
    s.inlineBlock,
  ),
  select('&.isSelected, &:hover',
    s.colorWhite,
    s.bgcBlack,
    {
      cursor: 'pointer',
      borderRadius: 3,
    },
  ),
)

function ListItemUser({
  handleClick,
  isSelected,
  userId,
  username,
  avatar,
}) {
  return (
    <li
      className={`${isSelected ? 'isSelected' : ''} ${categoryRoleUserStyle}`}
      id={`user_${userId}`}
    >
      <button onClick={e => handleClick(e, userId, username)}>
        <Avatar userId={userId} size="small" sources={avatar} />
        <span className="username">
          @{username}
        </span>
      </button>
    </li>
  )
}
ListItemUser.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  avatar: PropTypes.object.isRequired,
}

const categoryRoleUserPickerModalStyle = css(
  s.block,
  s.relative,
  s.bgcF2,
  { margin: '0 auto' },
  select(
    '> .mask',
    s.fullscreen,
    s.fullWidth,
    s.fullHeight,
    s.bgcModal,
    s.zModal,
    { transition: `background-color 0.4s ${s.ease}` },

    media(s.minBreak2,
      s.flex,
      s.itemsCenter,
      s.justifyCenter,
    ),
  ),
)
const categoryRoleUserPickerStyle = css(
  s.relative,
  s.block,
  s.p20,
  s.mt40,
  s.colorBlack,
  s.fullWidth,
  s.leftAlign,
  s.bgcWhite,
  {
    borderRadius: 5,
  },

  media(s.minBreak2,
    s.m0,
    s.pt40,
    {
      maxWidth: 300,
      width: '80%',
    },
  ),
  media(s.minBreak4,
    { width: '60%' },
  ),

  select('& .CloseModal',
    s.colorA,
    { top: 14, right: 20 },
    hover(s.colorBlack),

    media(s.maxBreak2,
      { top: 7, right: 7 },
    ),
  ),

  select('& h1',
    s.sansBlack,
    s.fontSize24,
  ),
)

const userPickerStyle = css(
  s.block,
  s.fullWidth,
  select('& form',
    s.flex,
    s.fullWidth,
    s.itemsCenter,
    s.justifySpaceBetween,
    s.mt30,
    select('& label',
      s.relative,
      s.fullWidth,
      select('& .label-text',
        s.absolute,
        s.colorA,
        s.zIndex2,
        {
          left: 10,
          top: 7,
        },
      ),
      select('& .input-holder',
        s.relative,
        s.fullWidth,
        select('& input',
          s.resetInput,
          s.block,
          s.fullWidth,
          s.pr10,
          s.hv40,
          s.lh40,
          s.fontSize14,
          s.colorBlack,
          s.bgcEA,
          s.transitionBgColor,
          {
            paddingLeft: 30,
            borderRadius: 5,
          },

          select('&:focus',
            s.bgcF2,
          ),

          select('&.has-items',
            {
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
            },
          ),
        ),
      ),
    ),
  ),
)

const userResultsListStyle = css(
  s.resetList,
  s.absolute,
  s.fullWidth,
  s.p10,
  s.bgcWhite,
  s.overflowHidden,
  s.overflowScrollWebY,
  {
    border: '1px solid #f2f2f2',
    borderRadius: 0,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },

  media('(min-width: 40em) and (max-height: 820px)',
    { maxHeight: 200 },
  ),
)

export class CategoryRoleUserPicker extends PureComponent {
  static propTypes = {
    close: PropTypes.func.isRequired,
    handleMaskClick: PropTypes.func.isRequired,
    handleRolesSubmit: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    listItems: PropTypes.object.isRequired,
    roleType: PropTypes.string,
    searchUsers: PropTypes.func.isRequired,
  }
  static defaultProps = {
    newRole: null,
    roleType: 'curator',
  }

  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      selectedItem: null,
      selectedIndex: null,
    }

    this.clearResults = this.clearResults.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleRolesSubmitLocal = this.handleRolesSubmitLocal.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchText !== this.state.searchText) {
      this.setItemSelection()
    }

    if (this.props.isOpen &&
      (prevState.selectedIndex !== this.state.selectedIndex)) {
      this.scrollToHighlightedItem()
    }

    if (prevProps.isOpen && !this.props.isOpen) {
      this.clearResults()
    }
  }

  setItemSelection() {
    const { listItems } = this.props
    const { searchText } = this.state

    if (listItems && searchText !== '') {
      let selectedItem = null
      let selectedIndex = null

      // grab the selected item + index
      listItems.map((user, index) => {
        if (searchText === user.get('username')) {
          selectedIndex = index
          selectedItem = user
        }
        return selectedIndex
      })

      return this.setState({
        selectedItem,
        selectedIndex,
      })
    }

    return this.clearResults()
  }

  scrollToHighlightedItem() {
    const { listItems } = this.props
    const { selectedIndex } = this.state
    const listItemsArray = Array.from(listItems)
    const selectedItem = listItemsArray[selectedIndex]
    let selectedItemDomId = null
    if (selectedItem) {
      selectedItemDomId = `user_${selectedItem.get('id')}`
    }

    // grab elements from the dom
    const itemListInDom = document.getElementById('userPickerList')
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

  handleRolesSubmitLocal(e, userId, username) {
    e.preventDefault()
    const { handleRolesSubmit } = this.props

    if (username) {
      // display the selection in the input (makes people feel better)
      this.setState({
        searchText: username,
      })
    }

    if (userId) {
      // submit the userId
      handleRolesSubmit(userId)
    }
  }

  handleKeyDown = (event) => {
    const {
      close,
      listItems,
    } = this.props
    const {
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
      const userId = listItemsArray[selectedIndex].get('id')
      const username = listItemsArray[selectedIndex].get('username')
      this.handleRolesSubmitLocal(event, userId, username)
    } else if (event.key === 'Escape' && max === 0) {
      close()
    }
    return null
  }

  handleSearch = (event) => {
    const searchText = event.target.value
    const { searchUsers } = this.props
    const { selectedIndex } = this.state

    let newSelectedIndex = selectedIndex
    if (!selectedIndex) {
      newSelectedIndex = searchText === '' ? null : 0
    }
    this.setState({
      selectedIndex: newSelectedIndex,
      searchText,
    })

    if (searchUsers) {
      searchUsers(searchText)
    }
  }

  clearResults() {
    return this.setState({
      searchText: null,
    })
  }

  render() {
    const {
      close,
      handleMaskClick,
      isOpen,
      listItems,
      roleType,
    } = this.props

    const {
      searchText,
      selectedItem,
      selectedIndex,
    } = this.state

    if (!isOpen) {
      return null
    }

    const roleName = roleType === 'curators' ? 'Curator' : 'Moderator'
    const hasItems = listItems && listItems.size > 0

    return (
      <div className={categoryRoleUserPickerModalStyle}>
        <div className="mask" role="presentation" onClick={handleMaskClick}>
          <div className={categoryRoleUserPickerStyle}>
            <DismissButtonLG
              onClick={close}
            />
            <div className={`pick-user ${userPickerStyle}`}>
              <h1>Add {roleName}</h1>
              <form>
                <label htmlFor={`add-${roleType}`}>
                  <span className="label-text">@</span> <span className="input-holder">
                    <input
                      autoComplete="off"
                      className={`username${hasItems ? ' has-items' : ''}`}
                      id={`add-${roleType}`}
                      name={`add-${roleType}`}
                      onChange={this.handleSearch}
                      onKeyDown={this.handleKeyDown}
                      type="search"
                      value={searchText || ''}
                    />
                  </span>
                  {hasItems &&
                    <ul
                      className={userResultsListStyle}
                      id="userPickerList"
                    >
                      {listItems.map((user, index) => {
                        // set `isSelected`
                        let isSelected = false
                        if (selectedIndex !== null) {
                          isSelected = selectedIndex === index
                        }
                        if ((selectedIndex === null) && selectedItem) {
                          isSelected = selectedItem && selectedItem.get('username') === user.get('username')
                        }

                        return (
                          <ListItemUser
                            key={user.get('id')}
                            handleClick={this.handleRolesSubmitLocal}
                            userId={user.get('id')}
                            username={user.get('username')}
                            avatar={user.get('avatar')}
                            isSelected={isSelected}
                          />
                        )
                      })}
                    </ul>
                  }
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
