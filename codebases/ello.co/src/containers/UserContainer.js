import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import get from 'lodash/get'
import { trackEvent } from '../actions/analytics'
import { inviteUsers } from '../actions/invitations'
import { closeModal, openModal } from '../actions/modals'
import { collabWithUser, hireUser } from '../actions/user'
import { setIsProfileRolesActive } from '../actions/gui'
import { BadgeSummaryDialog, TextMarkupDialog } from '../components/dialogs/DialogRenderables'
import MessageDialog from '../components/dialogs/MessageDialog'
import ShareDialog from '../components/dialogs/ShareDialog'
import {
  UserCompact,
  UserInvitee,
  UserProfileCard,
  UserProfile,
  UserRoleList,
} from '../components/users/UserRenderables'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectBadgesHasLoaded } from '../selectors/badges'
import { selectIsMobile, selectIsProfileRolesActive } from '../selectors/gui'
import {
  selectInvitationAcceptedAt,
  selectInvitationEmail,
} from '../selectors/invitations'
import { selectHasRoleAssignmentAccess, selectViewsAdultContent } from '../selectors/profile'
import { selectIsPostDetail } from '../selectors/routing'
import {
  selectUser,
  selectUserAvatar,
  selectUserBadges,
  selectUserBadgeSummary,
  selectUserCoverImage,
  selectUserExternalLinksList,
  selectUserFollowersCount,
  selectUserFollowingCount,
  selectUserFormattedShortBio,
  selectUserId,
  selectUserIsCollaborateable,
  selectUserIsEmpty,
  selectUserIsHireable,
  selectUserIsSelf,
  selectUserLocation,
  selectUserLovesCount,
  selectUserName,
  selectUserPostsAdultContent,
  selectUserPostsCount,
  selectUserProfileBadges,
  selectUserProfileCardBadges,
  selectUserRelationshipPriority,
  selectUserTotalViewsCount,
  selectUserTruncatedShortBio,
  selectUserUsername,
} from '../selectors/user'

export function makeMapStateToProps() {
  return (state, props) => {
    const truncatedShortBio = selectUserTruncatedShortBio(state, props)
    return {
      avatar: selectUserAvatar(state, props),
      coverImage: selectUserCoverImage(state, props),
      externalLinksList: selectUserExternalLinksList(state, props),
      followersCount: selectUserFollowersCount(state, props),
      followingCount: selectUserFollowingCount(state, props),
      formattedShortBio: selectUserFormattedShortBio(state, props),
      hasRoleAccess: selectHasRoleAssignmentAccess(state, props),
      id: selectUserId(state, props),
      invitationAcceptedAt: selectInvitationAcceptedAt(state, props),
      invitationEmail: selectInvitationEmail(state, props),
      isBadgesLoaded: selectBadgesHasLoaded(state),
      isCollaborateable: selectUserIsCollaborateable(state, props),
      isHireable: selectUserIsHireable(state, props),
      isLoggedIn: selectIsLoggedIn(state),
      isRolesOpen: selectIsProfileRolesActive(state),
      isSelf: selectUserIsSelf(state, props),
      isShortBioTruncated: truncatedShortBio.text.length >= 150,
      isMiniProfileCard: selectIsPostDetail(state, props),
      isMobile: selectIsMobile(state),
      isUserEmpty: selectUserIsEmpty(state, props),
      location: selectUserLocation(state, props),
      lovesCount: selectUserLovesCount(state, props),
      name: selectUserName(state, props),
      postsCount: selectUserPostsCount(state, props),
      relationshipPriority: selectUserRelationshipPriority(state, props),
      totalViewsCount: selectUserTotalViewsCount(state, props),
      truncatedShortBio: truncatedShortBio.html,
      useGif: selectViewsAdultContent(state) || !selectUserPostsAdultContent(state, props),
      user: selectUser(state, props),
      userBadgeCount: selectUserBadges(state, props).size,
      userBadgeSummary: selectUserBadgeSummary(state, props),
      userProfileBadges: selectUserProfileBadges(state, props),
      userProfileCardBadges: selectUserProfileCardBadges(state, props).first() || Immutable.Map(),
      username: selectUserUsername(state, props),
    }
  }
}

class UserContainer extends Component {

  static propTypes = {
    avatar: PropTypes.object,
    className: PropTypes.string,
    coverImage: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    externalLinksList: PropTypes.object,
    followersCount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    followingCount: PropTypes.number.isRequired,
    formattedShortBio: PropTypes.string,
    hasRoleAccess: PropTypes.bool,
    invitationAcceptedAt: PropTypes.string,
    invitationEmail: PropTypes.string,
    id: PropTypes.string,
    isBadgesLoaded: PropTypes.bool.isRequired,
    isCollaborateable: PropTypes.bool.isRequired,
    isHireable: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMiniProfileCard: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isRolesOpen: PropTypes.bool.isRequired,
    isSelf: PropTypes.bool.isRequired,
    isShortBioTruncated: PropTypes.bool.isRequired,
    isUserEmpty: PropTypes.bool.isRequired,
    location: PropTypes.string,
    lovesCount: PropTypes.number.isRequired,
    name: PropTypes.string,
    postsCount: PropTypes.number.isRequired,
    relationshipPriority: PropTypes.string,
    showBlockMuteButton: PropTypes.bool,
    totalViewsCount: PropTypes.string,
    truncatedShortBio: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
      'compact',
      'invitee',
      'grid',
      'profile',
      'roles',
    ]).isRequired,
    useGif: PropTypes.bool,
    useSmallRelationships: PropTypes.bool,
    user: PropTypes.object.isRequired,
    username: PropTypes.string,
    userBadgeCount: PropTypes.number.isRequired,
    userBadgeSummary: PropTypes.object.isRequired,
    userProfileBadges: PropTypes.object.isRequired,
    userProfileCardBadges: PropTypes.object.isRequired,
  }

  static defaultProps = {
    avatar: null,
    coverImage: null,
    className: null,
    externalLinksList: null,
    formattedShortBio: null,
    hasRoleAccess: false,
    id: null,
    invitationAcceptedAt: null,
    invitationEmail: null,
    location: null,
    name: null,
    relationshipPriority: null,
    totalViewsCount: null,
    useGif: false,
    useSmallRelationships: false,
    username: null,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
  }

  static childContextTypes = {
    onClickCollab: PropTypes.func,
    onClickHireMe: PropTypes.func,
    onClickOpenBio: PropTypes.func,
    onClickOpenBadgeModal: PropTypes.func,
    onClickReInvite: PropTypes.func,
    onClickShareProfile: PropTypes.func,
    onClickRoles: PropTypes.func,
  }

  getChildContext() {
    const {
      isBadgesLoaded,
      isCollaborateable,
      isHireable,
      isLoggedIn,
      isMobile,
      isShortBioTruncated,
      userBadgeCount,
    } = this.props
    const collabFunc = isLoggedIn ? this.onOpenCollabModal : this.onOpenSignupModal
    const hiremeFunc = isLoggedIn ? this.onOpenHireMeModal : this.onOpenSignupModal
    return {
      onClickCollab: isCollaborateable ? collabFunc : null,
      onClickHireMe: isHireable ? hiremeFunc : null,
      onClickOpenBio: isShortBioTruncated ? this.onClickOpenBio : null,
      onClickOpenBadgeModal: userBadgeCount && isBadgesLoaded ? this.onClickOpenBadgeModal : null,
      onClickReInvite: this.onClickReInvite,
      onClickShareProfile: isMobile ? this.onClickShareProfile : null,
      onClickRoles: isMobile ? this.onClickRoles : null,
    }
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.user, this.props.user) ||
      ['isLoggedIn', 'isBadgesLoaded', 'isMiniProfileCard', 'isMobile', 'isRelationshipHidden', 'isRolesOpen'].some(prop =>
        nextProps[prop] !== this.props[prop],
      )
  }

  onClickOpenBio = () => {
    const { dispatch, formattedShortBio, isMobile } = this.props
    dispatch(openModal(
      <TextMarkupDialog html={formattedShortBio} />,
      isMobile ? 'isFlex hasOverlay9' : 'hasOverlay9',
    ))
  }

  onClickShareProfile = () => {
    const { dispatch, username } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog username={username} trackEvent={action} />, '', null, 'open-share-dialog-profile'))
  }

  onClickRoles = () => {
    const { dispatch, isRolesOpen } = this.props
    dispatch(setIsProfileRolesActive({ isActive: !isRolesOpen }))
  }

  onClickOpenBadgeModal = (e) => {
    const { dispatch, userBadgeSummary } = this.props
    const slug = get(e, 'target.dataset.slug')
    const trackAction = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(
      <BadgeSummaryDialog badges={userBadgeSummary} trackEvent={trackAction} />,
      '',
      null,
      'badge-opened',
      slug ? { badge: slug } : null,
    ))
  }

  onOpenCollabModal = () => {
    const { dispatch, name, username } = this.props
    dispatch(openModal(
      <MessageDialog
        name={name || username}
        onConfirm={this.onConfirmCollab}
        onDismiss={this.onDismissModal}
        titlePrefix="Collaborate with"
      />,
      '',
      null,
      'open-collab-dialog-profile',
    ))
  }

  onConfirmCollab = ({ message }) => {
    const { dispatch, id } = this.props
    dispatch(collabWithUser(id, message))
  }

  onOpenHireMeModal = () => {
    const { dispatch, name, username } = this.props
    dispatch(openModal(
      <MessageDialog
        name={name || username}
        onConfirm={this.onConfirmHireMe}
        onDismiss={this.onDismissModal}
        titlePrefix="Hire"
      />,
      '',
      null,
      'open-hire-dialog-profile',
    ))
  }

  onConfirmHireMe = ({ message }) => {
    const { dispatch, id } = this.props
    dispatch(hireUser(id, message))
  }

  onDismissModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onOpenSignupModal = () => {
    const { onClickOpenRegistrationRequestDialog } = this.context
    onClickOpenRegistrationRequestDialog('hire-me-button')
  }

  onClickReInvite = () => {
    const { dispatch, invitationEmail } = this.props
    dispatch(inviteUsers([invitationEmail]))
  }

  render() {
    const {
      avatar,
      className,
      coverImage,
      externalLinksList,
      followersCount,
      followingCount,
      hasRoleAccess,
      id,
      invitationAcceptedAt,
      invitationEmail,
      isBadgesLoaded,
      isCollaborateable,
      isHireable,
      isLoggedIn,
      isMiniProfileCard,
      isMobile,
      isRolesOpen,
      isSelf,
      isUserEmpty,
      location,
      lovesCount,
      name,
      postsCount,
      relationshipPriority,
      totalViewsCount,
      truncatedShortBio,
      type,
      useGif,
      useSmallRelationships,
      userBadgeCount,
      username,
      userProfileBadges,
      userProfileCardBadges,
    } = this.props
    if (isUserEmpty && !invitationEmail) { return null }
    switch (type) {
      case 'compact':
        return (
          <UserCompact
            {...{
              avatar,
              id,
              useSmallRelationships,
              relationshipPriority,
              username,
            }}
          />
        )
        // TODO: Move to InvitationContainer?
      case 'invitee':
        return (
          <UserInvitee
            {...{
              avatar,
              className,
              id,
              invitationAcceptedAt,
              invitationEmail,
              relationshipPriority,
              username,
            }}
          />
        )
      case 'grid':
        return (
          <UserProfileCard
            {...{
              avatar,
              coverImage,
              followersCount,
              followingCount,
              id,
              isBadgesLoaded,
              isMiniProfileCard,
              isMobile,
              lovesCount,
              name,
              postsCount,
              relationshipPriority,
              truncatedShortBio,
              username,
              userProfileCardBadges,
            }}
          />
        )
      case 'profile':
        return (
          <UserProfile
            {...{
              avatar,
              externalLinksList,
              followersCount,
              followingCount,
              id,
              isBadgesLoaded,
              isCollaborateable,
              isHireable,
              isLoggedIn,
              isMobile,
              isRolesOpen,
              isSelf,
              location,
              lovesCount,
              name,
              postsCount,
              relationshipPriority,
              totalViewsCount,
              truncatedShortBio,
              useGif,
              userBadgeCount,
              username,
              userProfileBadges,
            }}
          />
        )
      case 'roles':
        return (
          <UserRoleList
            {...{
              avatar,
              id,
              hasRoleAccess,
              useSmallRelationships,
              relationshipPriority,
              username,
            }}
          />
        )
      default:
        return null
    }
  }
}

export default connect(makeMapStateToProps)(UserContainer)
