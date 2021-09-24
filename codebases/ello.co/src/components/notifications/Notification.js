import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import { css, hover, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------

const headerStyle = css(s.absolute, { top: 10, left: 10 })

const Header = ({ notifier }) => (
  <header className={headerStyle}>
    <Avatar
      priority={notifier.get('relationshipPriority')}
      sources={notifier.get('avatar')}
      to={`/${notifier.get('username')}`}
      userId={`${notifier.get('id')}`}
      username={notifier.get('username')}
    />
  </header>
)

Header.propTypes = {
  notifier: PropTypes.object.isRequired,
}

// -------------------------------------

const assetStyle = css(
  { float: 'right', width: 80, maxHeight: 80, marginBottom: 4 },
  s.overflowHidden,
  select('& > *', s.inlineBlock, s.alignTop),
  select('& .embetter', s.pointerNone),
  select('& .EmbedRegionContent', s.pointerAuto),
)

const Asset = ({ summaryAsset }) => (
  <div className={assetStyle}>
    {summaryAsset}
  </div>
)
Asset.propTypes = {
  summaryAsset: PropTypes.object.isRequired,
}

// -------------------------------------

const bodyStyle = css(
  { marginBottom: 15 },
  s.breakWord,
  select('& > p', s.mt0, s.mb5, s.colorA),
  select('& a', s.fit, s.breakWord),
  select('& > p a',
    s.inlineBlock,
    s.alignMiddle,
    s.overflowHidden,
    { maxWidth: 150, lineHeight: 1.2, textOverflow: 'ellipsis' },
    s.nowrap,
    s.transitionColor,
  ),
  select('.no-touch & > p a:hover', s.colorBlack),
  parent('.Notification.hasAsset', s.inlineBlock, s.mr10, s.alignTop, { width: 'calc(100% - 90px)' }),
)

const hideMarkdownImageStyle = select('& > .TextRegion img:not(.emoji)', s.displayNone)

const Body = ({ children, summary }) => (
  <div className={bodyStyle}>
    {children}
    {summary && summary.texts && summary.texts.length > 0 &&
      <div className={hideMarkdownImageStyle}>
        {summary.texts}
      </div>
    }
  </div>
)
Body.propTypes = {
  children: PropTypes.node,
  summary: PropTypes.object,
}
Body.defaultProps = {
  children: null,
  summary: null,
}

// -------------------------------------
const footerStyle = css(
  s.fontSize14,
  s.colorA,
  { marginTop: -10 },
)

const footerLinkStyle = css(
  s.transitionColor,
  hover(s.colorBlack),
)

const Footer = ({ activityPath, createdAt }) => (
  <footer className={footerStyle}>
    <Link className={footerLinkStyle} to={activityPath}>
      {new Date(createdAt).timeAgoInWords()}
    </Link>
  </footer>
)
Footer.propTypes = {
  activityPath: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
}

// -------------------------------------

const notificationStyle = css(
  s.relative,
  { padding: '10px 10px 5px 60px', lineHeight: 18 },
  s.overflowHidden,
  select('& + &', { borderTop: '1px solid #e5e5e5' }),
)

export const Notification = ({
  activityPath,
  children,
  className,
  createdAt,
  notifier,
  summary,
}) => {
  const hasAsset = summary && summary.assets && summary.assets.length > 0
  return (
    <div className={classNames(`Notification ${notificationStyle}`, className, { hasAsset })}>
      { notifier &&
        <Header notifier={notifier} />
      }
      {summary && summary.assets && summary.assets.length > 0 &&
        <Asset summaryAsset={summary.assets[0]} />
      }
      { children &&
        <Body summary={summary}>{children}</Body>
      }
      { createdAt &&
        <Footer activityPath={activityPath} createdAt={createdAt} />
      }
    </div>
  )
}
Notification.propTypes = {
  activityPath: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  createdAt: PropTypes.string,
  notifier: PropTypes.object,
  summary: PropTypes.object,
}
Notification.defaultProps = {
  className: null,
  createdAt: null,
  notifier: null,
  summary: null,
}

export default Notification

