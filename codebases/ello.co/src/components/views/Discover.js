import React from 'react'
import PropTypes from 'prop-types'
import CategoryInfoContainer from '../../containers/CategoryInfoContainer'
import StreamContainer from '../../containers/StreamContainer'
import { CategorySubNav } from '../categories/CategoryRenderables'
import { MainView } from '../views/MainView'

export const Discover = ({ streamAction, kind, stream }) => {
  const showInfo = (stream !== 'global' && stream !== 'subscribed')
  return (
    <MainView className={`Discover${showInfo ? ' show-info' : ''}`}>
      {showInfo &&
        <CategoryInfoContainer />
      }
      <CategorySubNav stream={stream} kind={kind} />
      <StreamContainer
        action={streamAction}
        paginatorText="Load More"
      />
    </MainView>
  )
}

Discover.propTypes = {
  streamAction: PropTypes.object.isRequired,
  stream: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
}

export default Discover
