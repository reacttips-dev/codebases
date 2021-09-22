import { hot } from 'react-hot-loader/root'
import React from 'react'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'

import configureStore from '../../store'

import SidebarContainer from './SidebarContainer'
import { RouteProvider } from './hooks/useRoute'

const store = configureStore()

const SidebarFeature = ({ onClose, onOpen }) => {
  return (
    <Provider store={store}>
      <RouteProvider>
        <SidebarContainer
          onOpen={onOpen}
          onClose={onClose}
        />
      </RouteProvider>
    </Provider>
  )
}

SidebarFeature.propTypes = {
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default hot(SidebarFeature)
