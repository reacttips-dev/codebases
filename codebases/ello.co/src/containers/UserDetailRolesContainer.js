import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Mousetrap from 'mousetrap'
import { setIsProfileRolesActive } from '../actions/gui'
import { searchAdministratedCategories } from '../actions/profile'
import {
  addToCategory as setAdministratedCategoryRole,
  removeFromCategory,
} from '../actions/user'
import UserDetailRoles from '../components/users/UserRolesRenderables'
import { SHORTCUT_KEYS } from '../constants/application_types'
import { selectUserCategoryUsers } from '../selectors/user'
import { selectIsStaff } from '../selectors/profile'
import { selectAdministeredCategories } from '../selectors/categories'

export function mapStateToProps(state, props) {
  return {
    classList: state.modal.get('classList'),
    categoryUsers: selectUserCategoryUsers(state, props),
    administeredCategories: selectAdministeredCategories(state, props),
    isStaff: selectIsStaff(state, props),
  }
}

class UserDetailRolesContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    categoryUsers: PropTypes.object.isRequired,
    administeredCategories: PropTypes.object.isRequired,
    categorySearchTerm: PropTypes.string,
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    isStaff: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    categorySearchTerm: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      categorySearchTerm: null,
      newRole: null,
    }
    this.handleRolesSubmit = this.handleRolesSubmit.bind(this)
    this.handleDeleteRole = this.handleDeleteRole.bind(this)
  }

  componentDidMount() {
    const { dispatch, categorySearchTerm } = this.props
    Mousetrap.bind(SHORTCUT_KEYS.ESC, () => { this.close() })
    dispatch(searchAdministratedCategories(categorySearchTerm))
  }

  componentDidUpdate(prevProps, prevState) {
    const { dispatch } = this.props
    const { categorySearchTerm } = this.state
    if (prevState.categorySearchTerm !== categorySearchTerm) {
      dispatch(searchAdministratedCategories(categorySearchTerm))
    }
  }

  componentWillUnmount() {
    this.close()
    Mousetrap.unbind(SHORTCUT_KEYS.ESC)
  }

  close() {
    this.props.dispatch(setIsProfileRolesActive({ isActive: false }))

    this.setState({
      newRole: null,
    })
  }

  handleMaskClick(e) {
    if (e.target.classList.contains('mask')) {
      return this.close()
    }
    return null
  }

  searchCategories(term) {
    this.setState({ categorySearchTerm: term })
  }

  handleRolesSubmit(roleParams, successCallback) {
    this.setState({
      newRole: roleParams,
    })
    this.props.dispatch(setAdministratedCategoryRole(roleParams, successCallback))
    return null
  }

  handleDeleteRole(categoryUserId) {
    this.props.dispatch(removeFromCategory(categoryUserId))
    return null
  }

  render() {
    const {
      isOpen,
      categoryUsers,
      administeredCategories,
      userId,
      username,
      isStaff,
    } = this.props

    const { newRole } = this.state

    return (
      <UserDetailRoles
        administeredCategories={administeredCategories}
        categoryUsers={categoryUsers}
        close={() => this.close()}
        handleDeleteRole={this.handleDeleteRole}
        handleMaskClick={e => this.handleMaskClick(e)}
        handleRolesSubmit={this.handleRolesSubmit}
        isOpen={isOpen}
        newRole={newRole}
        searchCategories={term => this.searchCategories(term)}
        userId={userId}
        username={username}
        isStaff={isStaff}
      />
    )
  }
}

export default connect(mapStateToProps)(UserDetailRolesContainer)
