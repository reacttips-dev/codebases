/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import BackgroundImage from '../assets/BackgroundImage'
import { BadgeButton } from '../buttons/Buttons'
import { MarkerIcon } from '../assets/Icons'
import RelationshipContainer from '../../containers/RelationshipContainer'
import UserDetailRolesContainer from '../../containers/UserDetailRolesContainer'
import {
  UserFiguresCell,
  UserInfoCell,
  UserLinksCell,
  UserNamesCell,
  UserNamesCellCard,
  UserProfileButtons,
  UserRolesButton,
  UserShareButton,
  UserStatsCell,
} from './UserParts'
import { css, select } from '../../styles/jss'
import * as s from '../../styles/jso'

// -----------------

export class UserCompact extends PureComponent {
  static propTypes = {
    avatar: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    relationshipPriority: PropTypes.string,
    username: PropTypes.string.isRequired,
    useSmallRelationships: PropTypes.bool,
  }
  static defaultProps = {
    relationshipPriority: null,
    useSmallRelationships: false,
  }
  render() {
    const {
      avatar,
      id,
      relationshipPriority,
      username,
      useSmallRelationships,
    } = this.props
    return (
      <div className="UserCompact">
        <div className="UserCompactHeader">
          <Link className="UserCompactUserLink truncate" to={`/${username}`}>
            <Avatar
              priority={relationshipPriority}
              sources={avatar}
              userId={id}
              username={username}
            />
            <span className="UserCompactUsername">{`@${username}`}</span>
          </Link>
        </div>
        <RelationshipContainer className={`${useSmallRelationships ? 'isInHeader' : ''}`} relationshipPriority={relationshipPriority} userId={id} />
      </div>
    )
  }
}

// ----------------- -- based on UserCompact --
export class UserRoleList extends PureComponent {
  static propTypes = {
    avatar: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    hasRoleAccess: PropTypes.bool.isRequired,
    relationshipPriority: PropTypes.string,
    username: PropTypes.string.isRequired,
    useSmallRelationships: PropTypes.bool,
  }
  static defaultProps = {
    relationshipPriority: null,
    useSmallRelationships: false,
  }
  render() {
    const {
      avatar,
      id,
      hasRoleAccess,
      relationshipPriority,
      username,
      useSmallRelationships,
    } = this.props
    return (
      <div className="UserCompact">
        <div className="UserCompactHeader">
          <Link className="UserCompactUserLink truncate" to={`/${username}`}>
            <Avatar
              priority={relationshipPriority}
              sources={avatar}
              userId={id}
              username={username}
            />
            <span className="UserCompactUsername">{`@${username}`}</span>
          </Link>
        </div>
        {!hasRoleAccess &&
          <RelationshipContainer className={`${useSmallRelationships ? 'isInHeader' : ''}`} relationshipPriority={relationshipPriority} userId={id} />
        }
      </div>
    )
  }
}

// -----------------

// TODO: Move to InvitationRenderable?
export class UserInvitee extends PureComponent {
  static contextTypes = {
    onClickReInvite: PropTypes.func.isRequired,
  }
  static propTypes = {
    avatar: PropTypes.object,
    className: PropTypes.string,
    id: PropTypes.string,
    invitationAcceptedAt: PropTypes.string,
    invitationEmail: PropTypes.string,
    relationshipPriority: PropTypes.string,
    username: PropTypes.string,
  }
  static defaultProps = {
    avatar: null,
    className: null,
    id: null,
    invitationAcceptedAt: null,
    invitationEmail: null,
    relationshipPriority: null,
    username: null,
  }
  render() {
    const {
      avatar,
      id,
      invitationAcceptedAt,
      invitationEmail,
      relationshipPriority,
      username,
    } = this.props
    if (invitationAcceptedAt) {
      return (
        <div className={classNames(this.props.className, 'UserInvitee')}>
          <div className="UserInviteeHeader">
            <Link className="UserInviteeUserLink truncate" to={`/${username}`}>
              <Avatar
                priority={relationshipPriority}
                sources={avatar}
                userId={id}
                username={username}
              />
              <span className="UserInviteeUsername">{`@${username}`}</span>
            </Link>
          </div>
          <RelationshipContainer userId={id} />
        </div>
      )
    } else if (invitationEmail) {
      return (
        <div className={classNames(this.props.className, 'UserInvitee')}>
          <div className="UserInviteeHeader">
            <a className="UserInviteeUserLink truncate" href={`mailto: ${invitationEmail}`}>
              <Avatar />
              <span className="UserInviteeEmail">{invitationEmail}</span>
            </a>
          </div>
          <button className="UserInviteeAction" onClick={this.context.onClickReInvite}>
            <span>Re-Invite</span>
          </button>
        </div>
      )
    }
    return null
  }
}

// -----------------

const cardBadgeStyle = css(
  s.absolute, { top: 10, right: 10, zIndex: 10 },
  select('& .Hint', { top: 40, left: 'auto', right: 0 }),
)

export class UserProfileCard extends PureComponent {
  static contextTypes = {
    onClickCollab: PropTypes.func,
    onClickHireMe: PropTypes.func,
    onClickOpenBadgeModal: PropTypes.func,
  }
  static propTypes = {
    avatar: PropTypes.object.isRequired,
    coverImage: PropTypes.object.isRequired,
    followersCount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    followingCount: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    isMiniProfileCard: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    lovesCount: PropTypes.number.isRequired,
    name: PropTypes.string,
    postsCount: PropTypes.number.isRequired,
    relationshipPriority: PropTypes.string,
    truncatedShortBio: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    userProfileCardBadges: PropTypes.object.isRequired,
  }
  static defaultProps = {
    name: null,
    relationshipPriority: null,
  }
  render() {
    const { onClickCollab, onClickHireMe, onClickOpenBadgeModal } = this.context
    const {
      avatar,
      coverImage,
      followersCount,
      followingCount,
      id,
      isMiniProfileCard,
      isMobile,
      lovesCount,
      name,
      postsCount,
      relationshipPriority,
      truncatedShortBio,
      username,
      userProfileCardBadges,
    } = this.props
    return (
      <div className={classNames('UserProfileCard', { isMiniProfileCard })}>
        <Avatar
          className={classNames('inUserProfileCard', { isMiniProfileCard })}
          priority={relationshipPriority}
          size={isMobile || isMiniProfileCard ? 'regular' : 'large'}
          sources={avatar}
          to={`/${username}`}
          userId={id}
          username={username}
        />
        <UserProfileButtons
          className={classNames('inUserProfileCard', { isMiniProfileCard })}
          onClickCollab={onClickCollab}
          onClickHireMe={onClickHireMe}
        >
          <RelationshipContainer
            className="isPill inUserProfileCard"
            relationshipPriority={relationshipPriority}
            userId={id}
          />
        </UserProfileButtons>
        <UserNamesCellCard
          className={classNames('inUserProfileCard', { isMiniProfileCard })}
          name={name}
          username={username}
        />
        <UserStatsCell
          className={classNames('inUserProfileCard', { isMiniProfileCard })}
          followingCount={followingCount}
          followersCount={followersCount}
          lovesCount={lovesCount}
          postsCount={postsCount}
          username={username}
        />
        { (!isMobile && !isMiniProfileCard) &&
          <UserInfoCell
            className="inUserProfileCard"
            truncatedShortBio={truncatedShortBio}
          />
        }
        <BackgroundImage
          className={classNames('inUserProfileCard hasOverlay6', { isMiniProfileCard })}
          dpi="xhdpi"
          sources={coverImage}
          to={`/${username}`}
        />
        { onClickOpenBadgeModal &&
          <div className={cardBadgeStyle}>
            <BadgeButton
              data-slug={userProfileCardBadges.get('slug')}
              name={userProfileCardBadges.get('name')}
              src={userProfileCardBadges.get('image')}
              onClick={onClickOpenBadgeModal}
            />
          </div>
        }
      </div>
    )
  }
}

// -----------------

const locationStyle = css(
  s.inlineBlock, s.mb10, s.colorA, s.alignMiddle, { marginTop: 2, marginLeft: -4 }, s.fontSize14,
  select('& .MarkerIcon', s.mr5, { marginTop: -4, transform: 'scale(0.8)' }),
)

export class UserProfile extends PureComponent {
  static contextTypes = {
    onClickCollab: PropTypes.func,
    onClickHireMe: PropTypes.func,
    onClickOpenBio: PropTypes.func,
    onClickOpenBadgeModal: PropTypes.func,
    onClickShareProfile: PropTypes.func,
    onClickRoles: PropTypes.func,
  }
  static propTypes = {
    avatar: PropTypes.object.isRequired,
    externalLinksList: PropTypes.object,
    followersCount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    followingCount: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    isBadgesLoaded: PropTypes.bool.isRequired,
    isCollaborateable: PropTypes.bool.isRequired,
    isHireable: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isRolesOpen: PropTypes.bool.isRequired,
    isSelf: PropTypes.bool.isRequired,
    location: PropTypes.string,
    lovesCount: PropTypes.number.isRequired,
    name: PropTypes.string,
    postsCount: PropTypes.number.isRequired,
    relationshipPriority: PropTypes.string,
    totalViewsCount: PropTypes.string,
    truncatedShortBio: PropTypes.string.isRequired,
    useGif: PropTypes.bool.isRequired,
    userBadgeCount: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    userProfileBadges: PropTypes.object.isRequired,
  }

  static defaultProps = {
    externalLinksList: null,
    location: null,
    name: null,
    relationshipPriority: null,
    totalViewsCount: null,
  }

  render() {
    const {
      onClickCollab,
      onClickHireMe,
      onClickOpenBio,
      onClickOpenBadgeModal,
      onClickShareProfile,
      onClickRoles,
    } = this.context
    const {
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
      isSelf,
      isRolesOpen,
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
    } = this.props

    return (
      <div className="UserProfile">
        <Avatar
          alt={name || username}
          className="inUserProfile"
          priority={relationshipPriority}
          size="large"
          sources={avatar}
          useGif={useGif}
          userId={id}
          username={username}
        />
        <UserNamesCell
          className="inUserProfile"
          name={name}
          username={username}
        >
          { location &&
            <span className={locationStyle}>
              <MarkerIcon />
              {location}
            </span>
          }
          {onClickShareProfile &&
            <UserShareButton
              className="inUserProfile"
              onClick={onClickShareProfile}
            />
          }
          {onClickRoles &&
            <UserRolesButton
              className="inUserProfile"
              onClick={onClickRoles}
            />
          }
          {isLoggedIn && !isSelf ?
            <RelationshipContainer
              hasBlockMuteButton
              className="inUserProfile"
              relationshipPriority={relationshipPriority}
              userId={id}
            /> : null
          }
        </UserNamesCell>
        {(totalViewsCount || !userProfileBadges.isEmpty()) &&
          <UserFiguresCell
            badges={userProfileBadges}
            badgeCount={userBadgeCount}
            isBadgesLoaded={isBadgesLoaded}
            className="inUserProfile"
            onClick={onClickOpenBadgeModal}
            totalViewsCount={totalViewsCount}
          />
        }
        <UserStatsCell
          className="inUserProfile"
          followersCount={followersCount}
          followingCount={followingCount}
          lovesCount={lovesCount}
          postsCount={postsCount}
          username={username}
        />
        <UserInfoCell
          className="inUserProfile"
          onClickOpenBio={onClickOpenBio}
          truncatedShortBio={truncatedShortBio}
        />
        <UserLinksCell
          className="inUserProfile"
          externalLinksList={externalLinksList}
          isMobile={isMobile}
        />
        <UserProfileButtons
          className="inUserProfile"
          onClickCollab={isCollaborateable ? onClickCollab : null}
          onClickHireMe={isHireable ? onClickHireMe : null}
        >
          <RelationshipContainer
            className="isPill inUserProfile"
            relationshipPriority={relationshipPriority}
            userId={id}
          />
        </UserProfileButtons>
        <UserDetailRolesContainer
          isOpen={isRolesOpen}
          userId={id}
          username={username}
        />
      </div>
    )
  }
}
