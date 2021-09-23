import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import {
  loadUserDetail, loadUserLoves, loadUserPostsV3, loadUserUsers, loadUserFollowing,
} from '../actions/user'
import { sayHello } from '../actions/zeros'
import { ErrorState4xx } from '../components/errors/Errors'
import { UserDetail, UserDetailError } from '../components/views/UserDetail'
import { USER } from '../constants/action_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectHasSaidHelloTo } from '../selectors/gui'
import { selectParamsType, selectParamsUsername } from '../selectors/params'
import { selectStreamType } from '../selectors/stream'
import {
  selectUserFollowersCount,
  selectUserId,
  selectUserIsEmpty,
  selectUserIsSelf,
  selectUserPostsCount,
  selectIsSystemUser,
} from '../selectors/user'

// TODO: move this to a selector and test it
export function getStreamAction({ type = 'posts', username }) {
  switch (type) {
    case 'following':
      return loadUserFollowing(`~${username}`)
    case 'followers':
      return loadUserUsers(`~${username}`, type)
    case 'loves':
      return loadUserLoves(`~${username}`)
    case 'posts':
    default:
      return loadUserPostsV3(`~${username}`, type)
  }
}

const selectUserDetailStreamAction = createSelector(
  [selectParamsType, selectParamsUsername],
  (type, username) => getStreamAction({ type, username }),
)

// TODO: move other properties to selectors and test them
function mapStateToProps(state, props) {
  const type = selectParamsType(state, props) || 'posts'
  const isSelf = selectUserIsSelf(state, props)
  const isUserEmpty = selectUserIsEmpty(state, props)
  const username = selectParamsUsername(state, props)
  return {
    hasSaidHelloTo: !isUserEmpty ? !isSelf && selectHasSaidHelloTo(state, props) : false,
    hasZeroFollowers: !(selectUserFollowersCount(state, props)),
    hasZeroPosts: !(selectUserPostsCount(state, props)),
    id: selectUserId(state, props),
    isLoggedIn: selectIsLoggedIn(state),
    isPostHeaderHidden: type !== 'loves',
    isSelf,
    isSystemUser: selectIsSystemUser(state, props),
    isUserEmpty,
    streamAction: selectUserDetailStreamAction(state, props),
    streamType: selectStreamType(state),
    username,
    viewKey: `userDetail/${username}/${type}`,
  }
}

class UserDetailContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    hasSaidHelloTo: PropTypes.bool.isRequired,
    hasZeroFollowers: PropTypes.bool.isRequired,
    hasZeroPosts: PropTypes.bool.isRequired,
    id: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    isPostHeaderHidden: PropTypes.bool.isRequired,
    isSelf: PropTypes.bool.isRequired,
    isSystemUser: PropTypes.bool.isRequired,
    isUserEmpty: PropTypes.bool.isRequired,
    streamAction: PropTypes.object.isRequired,
    streamType: PropTypes.string, // eslint-disable-line
    username: PropTypes.string.isRequired,
    viewKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    id: null,
    streamType: null,
  }

  componentWillMount() {
    const { dispatch, username } = this.props
    this.state = { renderType: USER.DETAIL_REQUEST }
    dispatch(loadUserDetail({ username }))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, username } = this.props
    if (username !== nextProps.username) {
      dispatch(loadUserDetail({ username: nextProps.username }))
    }
    switch (nextProps.streamType) {
      case USER.DETAIL_FAILURE:
      case USER.DETAIL_REQUEST:
      case USER.DETAIL_SUCCESS:
        this.setState({ renderType: nextProps.streamType })
        break
      default:
        break
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.renderType !== this.state.renderType) { return true }
    return [
      'hasSaidHelloTo',
      'hasZeroFollowers',
      'hasZeroPosts',
      'id',
      'isLoggedIn',
      'isPostHeaderHidden',
      'isSelf',
      'isUserEmpty',
      'streamAction',
      'tabs',
      'username',
      'viewKey',
    ].some(prop => nextProps[prop] !== this.props[prop])
  }

  render() {
    const {
      dispatch,
      hasSaidHelloTo,
      hasZeroFollowers,
      hasZeroPosts,
      id,
      isLoggedIn,
      isPostHeaderHidden,
      isSelf,
      isSystemUser,
      isUserEmpty,
      streamAction,
      username,
      viewKey,
    } = this.props
    const { renderType } = this.state
    const shouldBindHello = hasZeroPosts && !hasSaidHelloTo

    // render failure if we don't have an initial user
    if (isUserEmpty) {
      if (renderType === USER.DETAIL_FAILURE) {
        return (
          <UserDetailError>
            <ErrorState4xx />
          </UserDetailError>
        )
      }
      return null
    }
    // TODO: Move functions out of props and into context
    const props = {
      hasSaidHelloTo,
      hasZeroFollowers,
      hasZeroPosts,
      isLoggedIn,
      isPostHeaderHidden,
      isSelf,
      isSystemUser,
      onSubmitHello: shouldBindHello ? bindActionCreators(sayHello, dispatch) : null,
      streamAction,
      userId: id,
      username,
    }
    return <UserDetail {...props} key={viewKey} />
  }
}

export default connect(mapStateToProps)(UserDetailContainer)

