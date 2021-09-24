/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import { RolesIcon, ShareIcon } from '../assets/Icons'
import { BadgeButton, MiniPillButtonProfile } from '../buttons/Buttons'
import Hint from '../hints/Hint'
import { numberToHuman } from '../../lib/number_to_human'
import { before, css, hover, media } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------

const UserStatsLink = ({ asDisabled = false, children, to }, { onClickScrollToContent }) =>
  (asDisabled ?
    <span className="UserStatsLink asDisabled">
      {children}
    </span> :
    <Link onClick={onClickScrollToContent} className="UserStatsLink" to={to}>
      {children}
    </Link>)
UserStatsLink.propTypes = {
  asDisabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
}
UserStatsLink.defaultProps = {
  asDisabled: false,
}
UserStatsLink.contextTypes = {
  onClickScrollToContent: PropTypes.func,
}

// -----------------

export const UserRolesButton = ({ className, onClick }) =>
  (<button className={classNames('UserRolesButton', className)} onClick={onClick} >
    <RolesIcon />
  </button>)
UserRolesButton.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

// -----------------

export const UserShareButton = ({ className, onClick }) =>
  (<button className={classNames('UserShareButton', className)} onClick={onClick} >
    <ShareIcon />
  </button>)
UserShareButton.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

// -----------------

export const UserNamesCell = ({ className, name, username, children }) =>
  (<div className={classNames('UserCell UserNamesCell', className, { isSingle: !name })}>
    <h1 className="UserName">
      <Link className="truncate" to={`/${username}`} >{name || `@${username}`}</Link>
    </h1>
    {name ? <h2 className="UserUsername truncate">@{username}</h2> : null}
    { children }
  </div>)
UserNamesCell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  name: PropTypes.string,
  username: PropTypes.string.isRequired,
}
UserNamesCell.defaultProps = {
  name: null,
}

// -----------------

export const UserNamesCellCard = ({ className, name, username }) =>
  (<div className={classNames('UserCell UserNamesCell', className)}>
    <h2 className="UserName">
      <Link className="truncate" to={`/${username}`} >{name || `@${username}`}</Link>
    </h2>
    {name ? <h3 className="UserUsername truncate">@{username}</h3> : null}
  </div>)
UserNamesCellCard.propTypes = {
  className: PropTypes.string.isRequired,
  name: PropTypes.string,
  username: PropTypes.string.isRequired,
}

UserNamesCellCard.defaultProps = {
  name: null,
}

// -----------------

const figuresCellStyle = css(s.flex, s.flexRow, s.itemsCenter)
const totalsCellStyle = css(s.flex2, media(s.maxBreak2, s.justifyCenter))
const badgesCellStyle = css(
  s.relative,
  s.flex2,
  s.justifyEnd,
  media(s.maxBreak2,
    s.justifyCenter,
    before(s.absolute, { top: -20, left: 0, bottom: -17, width: 1, content: '""' }, s.bgcA),
  ),
)
const moreBadgesStyle = css(s.fontSize14, s.ml5, s.colorA, s.transitionColor, hover(s.colorWhite))

export const UserFiguresCell = (
  { badges, badgeCount, className, isBadgesLoaded, onClick, totalViewsCount },
) =>
  (<div className={classNames(`UserCell ${figuresCellStyle}`, className)}>
    <div className={totalsCellStyle}>
      <span className="UserFiguresCount uppercase">{totalViewsCount}</span>
      <span className="UserFiguresLabel">Views</span>
    </div>
    { !badges.isEmpty() && isBadgesLoaded &&
      <div className={badgesCellStyle}>
        { badges.map(badge =>
          (<BadgeButton
            data-slug={badge.get('slug')}
            key={`BadgeButton_${badge.get('slug')}`}
            name={badge.get('name')}
            src={badge.get('image')}
            onClick={onClick}
          />),
        )}
        {badgeCount > 3 &&
          <button className={moreBadgesStyle} onClick={onClick}>
            {`+${badgeCount - 3}`}
          </button>
        }
      </div>
    }
  </div>)
UserFiguresCell.propTypes = {
  badges: PropTypes.object.isRequired,
  badgeCount: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
  isBadgesLoaded: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  totalViewsCount: PropTypes.string.isRequired,
}
UserFiguresCell.defaultProps = {
  onClick: null,
}

// -----------------

export const UserStatsCell = ({
  className, followingCount, followersCount, lovesCount, postsCount, username,
}) =>
  (<div className={classNames('UserCell UserStatsCell', className)}>
    <dl>
      <UserStatsLink to={`/${username}`}>
        <dt>{numberToHuman(postsCount)}</dt>
        <dd><span className="UserStatsCountLabel">Posts</span></dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled={!followingCount} to={`/${username}/following`}>
        <dt>{numberToHuman(followingCount)}</dt>
        <dd><span className="UserStatsCountLabel">Following</span></dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink
        asDisabled={typeof followersCount === 'string' || !followersCount}
        to={`/${username}/followers`}
      >
        <dt>
          {
            typeof followersCount === 'string' ?
              followersCount :
              numberToHuman(followersCount)
          }
        </dt>
        <dd><span className="UserStatsCountLabel">Followers</span></dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled={!lovesCount} to={`/${username}/loves`} >
        <dt>{numberToHuman(lovesCount)}</dt>
        <dd><span className="UserStatsCountLabel">Loves</span></dd>
      </UserStatsLink>
    </dl>
  </div>)
UserStatsCell.propTypes = {
  className: PropTypes.string.isRequired,
  followingCount: PropTypes.number.isRequired,
  followersCount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  lovesCount: PropTypes.number.isRequired,
  postsCount: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
}

// -----------------

export const UserInfoCell = ({ className, onClickOpenBio, truncatedShortBio }) =>
  (<div className={classNames('UserCell UserInfoCell', className)}>
    { truncatedShortBio && truncatedShortBio.length ?
      <div className="UserShortBio" dangerouslySetInnerHTML={{ __html: truncatedShortBio }} /> : null
    }
    { onClickOpenBio ?
      <button className="MoreBioButton" onClick={onClickOpenBio} >
        <span className="MoreBioButtonLabel">See More</span>
      </button> : null
    }
  </div>)
UserInfoCell.propTypes = {
  className: PropTypes.string.isRequired,
  onClickOpenBio: PropTypes.func,
  truncatedShortBio: PropTypes.string.isRequired,
}
UserInfoCell.defaultProps = {
  onClickOpenBio: null,
}

// -----------------

export const UserLinksCell = ({ className, externalLinksList, isMobile }) => {
  const externalLinks = []
  const externalLinksIcon = []
  if (externalLinksList && externalLinksList.size) {
    externalLinksList.forEach((link, i) => {
      if (link.get('icon')) {
        externalLinksIcon.push(
          <span className="UserExternalLinksIcon" key={`${link.get('type')}_${i + 1}`}>
            <a href={link.get('url')} rel="noopener noreferrer" target="_blank">
              <img alt={link.get('type')} src={link.get('icon')} />
              <Hint>{link.get('type')}</Hint>
            </a>
          </span>,
        )
      } else {
        externalLinks.push(
          <span className="UserExternalLinksLabel" key={`${link.get('text')}_${i + 1}`}>
            <a href={link.get('url')} rel="noopener noreferrer" target="_blank">{link.get('text')}</a>
          </span>,
        )
      }
    })
  }
  // Magic numbers explained:
  // 32 = the height of an icon (22) + the margin-top (10)
  // 34 = the top/bottom padding of the container (17)
  // 5 = top position of the right icon content
  const linkIconHeight = isMobile ?
    (Math.ceil(externalLinksIcon.length / 3) * 32) + 34 + 5 :
    (Math.ceil(externalLinksIcon.length / 4) * 32) + 34 + 5
  const style = externalLinksIcon.length > 0 && externalLinks.length ?
    { height: linkIconHeight } :
    { height: null }
  return (
    <div
      className={classNames('UserCell UserLinksCell', className)}
      data-num-icons={externalLinksIcon.length}
      data-num-links={externalLinks.length}
      style={style}
    >
      <div className="UserExternalLinksLeft">
        {externalLinks}
      </div>
      <div className="UserExternalLinksRight">
        {externalLinksIcon}
      </div>
    </div>
  )
}

UserLinksCell.propTypes = {
  className: PropTypes.string.isRequired,
  externalLinksList: PropTypes.object,
  isMobile: PropTypes.bool.isRequired,
}
UserLinksCell.defaultProps = {
  externalLinksList: null,
}

export const UserProfileButtons = ({ children, className, onClickCollab, onClickHireMe }) =>
  (<div className={classNames('UserProfileButtons', className)}>
    {onClickCollab ?
      <MiniPillButtonProfile onClick={onClickCollab} >Collab</MiniPillButtonProfile> : null
    }
    {onClickHireMe ?
      <MiniPillButtonProfile onClick={onClickHireMe} >Hire</MiniPillButtonProfile> : null
    }
    {children}
  </div>)

UserProfileButtons.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  onClickCollab: PropTypes.func,
  onClickHireMe: PropTypes.func,
}
UserProfileButtons.defaultProps = {
  onClickCollab: null,
  onClickHireMe: null,
}

