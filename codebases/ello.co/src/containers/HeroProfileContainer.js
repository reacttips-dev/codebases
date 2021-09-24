import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { trackEvent } from '../actions/analytics'
import { openModal } from '../actions/modals'
import { setIsProfileRolesActive } from '../actions/gui'
import {
  selectUserId,
  selectUserPostsAdultContent,
  selectUserCoverImage,
  selectUserUsername,
  selectUserHasRoles,
} from '../selectors/user'
import {
  selectViewsAdultContent,
  selectIsRoleAdministrator,
} from '../selectors/profile'
import { selectHeroDPI, selectIsProfileRolesActive } from '../selectors/gui'
import { HeroProfile } from '../components/heros/HeroRenderables'
import ShareDialog from '../components/dialogs/ShareDialog'

function mapStateToProps(state, props) {
  return {
    userId: selectUserId(state, props),
    username: selectUserUsername(state, props),
    dpi: selectHeroDPI(state),
    coverImage: selectUserCoverImage(state, props),
    isRolesOpen: selectIsProfileRolesActive(state),
    useGif: selectViewsAdultContent(state) || !selectUserPostsAdultContent(state, props) || false,
    isRoleAdministrator: selectIsRoleAdministrator(state, props),
    userHasRoles: selectUserHasRoles(state, props),
  }
}

class HeroProfileContainer extends Component {
  static propTypes = {
    coverImage: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    dpi: PropTypes.string.isRequired,
    isRolesOpen: PropTypes.bool.isRequired,
    useGif: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    username: PropTypes.string,
    isRoleAdministrator: PropTypes.bool.isRequired,
    userHasRoles: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    coverImage: null,
    userId: null,
    username: null,
  }

  static childContextTypes = {
    onClickShareProfile: PropTypes.func,
    onClickOpenUserRoles: PropTypes.func,
  }

  getChildContext() {
    return {
      onClickShareProfile: this.onClickShareProfile,
      onClickOpenUserRoles: this.onClickOpenUserRoles,
    }
  }

  onClickShareProfile = () => {
    const { dispatch, username } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog username={username} trackEvent={action} />, '', null, 'open-share-dialog-profile'))
  }

  onClickOpenUserRoles = () => {
    const { dispatch, isRolesOpen } = this.props
    dispatch(setIsProfileRolesActive({ isActive: !isRolesOpen }))
  }

  render() {
    const { userId, dpi, coverImage, useGif, isRoleAdministrator, userHasRoles } = this.props
    if (!userId) { return null }
    return (
      <HeroProfile
        dpi={dpi}
        sources={coverImage}
        useGif={useGif}
        userId={userId}
        isRoleAdministrator={isRoleAdministrator}
        userHasRoles={userHasRoles}
      />
    )
  }
}

export default connect(mapStateToProps)(HeroProfileContainer)

