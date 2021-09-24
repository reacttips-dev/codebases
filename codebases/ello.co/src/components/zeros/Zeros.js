import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import RelationshipContainer from '../../containers/RelationshipContainer'
import Editor from '../editor/Editor'
import { before, css, hover, media, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const zeroStreamStyle = css(
  s.relative,
  s.my0,
  s.mxAuto,
  { maxWidth: 540, padding: '53px 10px' },
  s.bgcWhite,
  select('.Following.MainView & + .StreamContainer > &', s.displayNone),
  media(s.maxBreak2,
    select('& br', s.displayNone),
  ),
)

const zeroStreamLink = css(s.relative,
  before(s.absolute, s.inlineBlock, s.fullWidth, s.bgcBlack, { content: '""', bottom: 6, height: 1 }),
)

const headingStyle = css(s.fontSize18, media(s.minBreak2, s.fontSize24))
const buttonStyle = css(s.mt20, s.fontSize14, s.colorA, s.transitionColor, hover(s.colorBlack))

export const ZeroStream = ({ children, onDismiss }) =>
  (<div className={zeroStreamStyle}>
    <h2 className={headingStyle}>
      {children}
    </h2>
    {onDismiss ?
      <button className={buttonStyle} onClick={onDismiss}>
        <span>Close</span>
      </button> :
      null
     }
  </div>)

ZeroStream.propTypes = {
  children: PropTypes.node.isRequired,
  onDismiss: PropTypes.func,
}

ZeroStream.defaultProps = {
  onDismiss: null,
}


export const ZeroFollowingStream = () =>
  (<ZeroStream emoji="lollipop">
    Follow the creators and communities that inspire you.
  </ZeroStream>)

export const ZeroSubscribedStream = () =>
  (<ZeroStream>
    Category posts you subscribe to live here.&nbsp;<br />
    You aren&rsquo;t subscribed to any categories,&nbsp;
    <Link to="/discover/all" className={zeroStreamLink}>
      go choose some
    </Link>.
  </ZeroStream>)

// -------------------------------------

const zeroStateStyle = css(
  s.fontSize14,
  s.colorA,
  parent('.ZeroStates >', { marginTop: 60 }),
  media(s.minBreak2, parent('.UserDetails', s.relative, { paddingLeft: 240 })),
  media(s.minBreak2, parent('.UserDetails .StreamContainer', s.relative, { marginLeft: -20 })),
  media(s.minBreak4, parent('.UserDetails', s.relative, { paddingLeft: 260 })),
  media(s.minBreak4, parent('.UserDetails .StreamContainer', s.relative, { marginLeft: -40 })),
)

const titleStyle = css(s.mb20, s.fontSize18, s.colorA, media(s.minBreak2, s.fontSize24))
const usernameStyle = css(s.decorationNone)

export const ZeroState = ({ children = 'Sorry, no results found.' }) =>
  (<div className={`ZeroState ${zeroStateStyle}`}>
    {children}
  </div>)

ZeroState.propTypes = {
  children: PropTypes.node,
}


export const ZeroStateCreateRelationship = ({ userId, username }) =>
  (<ZeroState>
    <h2 className={titleStyle}>
      <span className={usernameStyle}>{`@${username}`}</span>
      <span>{' doesn\'t have any followers yet, why don\'t you be their first?'}</span>
    </h2>
    <RelationshipContainer
      userId={userId}
    />
  </ZeroState>)

ZeroStateCreateRelationship.propTypes = {
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
}


export const ZeroStateSayHello = ({ hasPosted = false, onSubmit, username }) =>
  (<ZeroState>
    <h2 className={titleStyle}>
      <span>{'It doesn\'t look like '}</span>
      <span className={usernameStyle}>{`@${username}`}</span>
      <span>{' has posted yet, why don\'t you say hi?'}</span>
    </h2>
    {hasPosted ?
      <p>{`Notification to @${username} has been sent.`}</p> :
      <Editor autoPopulate={`Hi @${username} :wave:`} onSubmit={onSubmit} inline />
    }
  </ZeroState>)

ZeroStateSayHello.propTypes = {
  hasPosted: PropTypes.bool,
  onSubmit: PropTypes.func,
  username: PropTypes.string.isRequired,
}


export const ZeroStateFirstPost = () =>
  (<ZeroState>
    <h2 className={titleStyle}>
      It doesn’t look like you’ve posted yet, why don’t you give it a shot.
    </h2>
    <Editor autoPopulate="Ello World! My first post on :ello:!" inline />
  </ZeroState>)

// -------------------------------------

const zeroStateEditorialStyle = css(
  s.absolute,
  s.flood,
  s.flex,
  s.justifyCenter,
  s.itemsCenter,
  s.fontSize14,
  s.colorWhite,
  s.bgcE5,
)

export const ZeroStateEditorial = () => (
  <div className={zeroStateEditorialStyle}>
    <span>Sorry, no results found.</span>
  </div>
)

