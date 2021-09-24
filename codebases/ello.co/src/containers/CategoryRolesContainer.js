import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Mousetrap from 'mousetrap'
import debounce from 'lodash/debounce'
import {
  addToCategory,
  removeFromCategory,
  userQuickSearch,
  clearQuickSearch,
} from '../actions/user'
import { selectQuickSearchUsers } from '../selectors/user'
import { selectCategoryUsers } from '../selectors/categories'
import { selectId, selectHasRoleAssignmentAccess } from '../selectors/profile'
import { CategoryAddRemoveRoleButton, CategoryRoleUserPicker } from '../components/categories/CategoryRolesRenderables'
import { SHORTCUT_KEYS } from '../constants/application_types'

const ROLES = {
  curators: 'curator',
  moderators: 'moderator',
}

function mapStateToProps(state, props) {
  return {
    categoryUsers: selectCategoryUsers(state, props),
    currentUserId: selectId(state, props),
    hasAssignmentAccess: selectHasRoleAssignmentAccess(state, props),
    quickSearchUsers: selectQuickSearchUsers(state, props),
  }
}

class CategoryRolesContainer extends PureComponent {
  static propTypes = {
    actionType: PropTypes.oneOf(['add', 'remove']),
    categoryId: PropTypes.string.isRequired,
    categoryUsers: PropTypes.array,
    currentUserId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    hasAssignmentAccess: PropTypes.bool.isRequired,
    roleType: PropTypes.string,
    userId: PropTypes.string,
    quickSearchUsers: PropTypes.object.isRequired,
  }
  static defaultProps = {
    actionType: 'add',
    categoryUsers: null,
    currentUserId: null,
    roleType: 'curators',
    userId: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      userPickerOpen: false,
    }
    this.searchUsers = this.searchUsers.bind(this)
    this.addUser = this.addUser.bind(this)
  }

  componentDidUpdate(prevState) {
    if (!prevState.userPickerOpen && this.state.userPickerOpen) {
      this.bindKeys()
    }

    if (prevState.userPickerOpen && !this.state.userPickerOpen) {
      this.bindKeys(true)
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearQuickSearch())
    this.bindKeys(true)
  }

  openCloseUserPicker(setOpen = true) {
    const { dispatch } = this.props

    this.setState({
      userPickerOpen: setOpen,
    })

    dispatch(clearQuickSearch())
  }

  handleMaskClick(e) {
    if (e.target.classList.contains('mask')) {
      return this.openCloseUserPicker(false)
    }
    return null
  }

  bindKeys(unbind = false) {
    const { quickSearchUsers } = this.props

    Mousetrap.unbind(SHORTCUT_KEYS.ESC)

    if (!unbind) {
      Mousetrap.bind(SHORTCUT_KEYS.ESC, () => {
        if (quickSearchUsers.size === 0) {
          this.openCloseUserPicker(false)
        }
      })
    }
  }

  removeRole() {
    const {
      categoryUsers,
      dispatch,
      userId,
    } = this.props

    let categoryUserId = null
    categoryUsers.map((categoryUser) => {
      if (userId === categoryUser.get('userId')) {
        categoryUserId = categoryUser.get('id')
      }
      return categoryUserId
    })

    if (categoryUserId) {
      return dispatch(removeFromCategory(categoryUserId))
    }
    return null
  }

  searchUsers(searchText) {
    const { dispatch } = this.props

    if (searchText === '') {
      return dispatch(clearQuickSearch())
    }

    return debounce(dispatch, 200)(userQuickSearch(searchText))
  }

  addUser(userId) {
    const { categoryId, roleType, dispatch } = this.props
    dispatch(addToCategory({ userId, categoryId, role: ROLES[roleType] }))
    dispatch(clearQuickSearch())
    return this.openCloseUserPicker(false)
  }

  render() {
    const {
      actionType,
      categoryId,
      currentUserId,
      hasAssignmentAccess,
      roleType,
      userId,
      quickSearchUsers,
    } = this.props
    const { userPickerOpen } = this.state

    if (!hasAssignmentAccess) { return null }

    // add moderator or curator
    if (actionType === 'add') {
      return (
        <div className="roles-holder">
          <CategoryAddRemoveRoleButton
            actionType="add"
            handleClick={() => this.openCloseUserPicker()}
            roleType={roleType}
          />
          <CategoryRoleUserPicker
            addUser={this.addUser}
            categoryId={categoryId}
            close={() => this.openCloseUserPicker(false)}
            handleMaskClick={e => this.handleMaskClick(e)}
            handleRolesSubmit={this.addUser}
            isOpen={userPickerOpen}
            listItems={quickSearchUsers}
            roleType={roleType}
            searchUsers={this.searchUsers}
          />
        </div>
      )
    }

    // remove moderator / curator
    if (userId && (userId !== currentUserId)) {
      return (
        <CategoryAddRemoveRoleButton
          actionType={actionType}
          handleClick={() => this.removeRole()}
          roleType={roleType}
          userId={userId}
        />
      )
    }

    return null
  }
}

export default connect(mapStateToProps)(CategoryRolesContainer)
