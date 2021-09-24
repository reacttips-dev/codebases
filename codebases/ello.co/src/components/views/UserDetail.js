import React from 'react'
import PropTypes from 'prop-types'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../views/MainView'
import { ZeroStateCreateRelationship, ZeroStateFirstPost, ZeroStateSayHello } from '../zeros/Zeros'
import { css, media, parent } from '../../styles/jss'
import * as s from '../../styles/jso'
import { isElloAndroid } from '../../lib/jello'

// TODO: Seems like we move this up to Zeros.js?
const zeroStatesStyle = css(
  { maxWidth: 560 },
  s.p10,
  media(s.minBreak2, s.p0, parent('.UserDetails', { maxWidth: 800 })),
  media(s.minBreak4, parent('.UserDetails', { maxWidth: 820 })),
)

const ZeroStates = ({
  isLoggedIn,
  isSelf,
  hasSaidHelloTo,
  hasZeroFollowers,
  hasZeroPosts,
  onSubmitHello,
  userId,
  username,
}) =>
  (<div className={`ZeroStates ${zeroStatesStyle}`}>
    {isSelf && hasZeroPosts && !isElloAndroid() && <ZeroStateFirstPost />}
    {!isSelf && hasZeroFollowers &&
    <ZeroStateCreateRelationship {...{ userId, username }} />
      }
    {isLoggedIn && !isSelf && hasZeroPosts && !isElloAndroid() &&
    <ZeroStateSayHello
      onSubmit={() => onSubmitHello({ username })}
      hasPosted={hasSaidHelloTo}
      username={username}
    />
      }
  </div>)
ZeroStates.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  isSelf: PropTypes.bool.isRequired,
  hasSaidHelloTo: PropTypes.bool.isRequired,
  hasZeroFollowers: PropTypes.bool.isRequired,
  hasZeroPosts: PropTypes.bool.isRequired,
  onSubmitHello: PropTypes.func,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
}
ZeroStates.defaultProps = {
  onSubmitHello: null,
}

export const UserDetail = (props) => {
  // deconstruct props
  const {
    hasSaidHelloTo,
    hasZeroFollowers,
    hasZeroPosts,
    isLoggedIn,
    isPostHeaderHidden,
    isSelf,
    isSystemUser,
    onSubmitHello,
    streamAction,
    userId,
    username,
  } = props

  // construct component props
  const streamProps = { action: streamAction, isPostHeaderHidden }
  const zeroProps = {
    isLoggedIn,
    isSelf,
    hasSaidHelloTo,
    hasZeroFollowers,
    hasZeroPosts,
    onSubmitHello,
    userId,
    username,
  }
  return (
    <MainView className="UserDetail">
      <div className="UserDetails">
        {!isSystemUser && (hasZeroPosts || hasZeroFollowers) && <ZeroStates {...zeroProps} />}
        {streamAction && <StreamContainer {...streamProps} paginatorText="Load More" />}
      </div>
    </MainView>
  )
}

UserDetail.propTypes = {
  hasSaidHelloTo: PropTypes.bool.isRequired,
  hasZeroFollowers: PropTypes.bool.isRequired,
  hasZeroPosts: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isPostHeaderHidden: PropTypes.bool.isRequired,
  isSelf: PropTypes.bool.isRequired,
  isSystemUser: PropTypes.bool.isRequired,
  onSubmitHello: PropTypes.func,
  onTabClick: PropTypes.func,
  streamAction: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
}

export const UserDetailError = ({ children }) =>
  (<MainView className="UserDetail">
    <section className="StreamContainer isError">
      {children}
    </section>
  </MainView>)

UserDetailError.propTypes = {
  children: PropTypes.node.isRequired,
}

