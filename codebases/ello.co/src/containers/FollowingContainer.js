import React from 'react'
import PropType from 'prop-types'
import { loadFollowing } from '../actions/stream'
import { Following } from '../components/views/Following'

const FollowingContainer = ({ location: { pathname } }) => {
  const kind = /^\/following\/trending\b/.test(pathname) ? 'trending' : 'recent'
  return (<Following streamAction={loadFollowing(kind)} />)
}
FollowingContainer.propTypes = {
  location: PropType.object.isRequired,
}

export default FollowingContainer

