import React from 'react'
import PropTypes from 'prop-types'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../views/MainView'

export const Following = ({ streamAction }) =>
  (<MainView className="Following">
    <StreamContainer
      action={streamAction}
      paginatorText="Load More"
    />
  </MainView>)

Following.propTypes = {
  streamAction: PropTypes.object.isRequired,
}

export default Following

