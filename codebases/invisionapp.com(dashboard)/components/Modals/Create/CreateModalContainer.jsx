import React from 'react'
import PropTypes from 'prop-types'

import EventStack from './ActiveEventStack'
import keycode from 'keycode'

import CreateModal from './CreateModal.jsx'

class CreateModalContainer extends React.Component {
  constructor (props) {
    super(props)

    this.handleGlobalKeydown = this.handleGlobalKeydown.bind(this)
  }

  componentWillMount () {
    this.eventToken = EventStack.addListenable([
      ['keydown', this.handleGlobalKeydown]
    ])
  }

  componentWillUnmount () {
    EventStack.removeListenable(this.eventToken)
  }

  handleGlobalKeydown (event) {
    if (keycode(event) === 'esc') {
      this.props.handleCancelModal()
    }
  }

  render () {
    return <CreateModal {...this.props} />
  }
}

CreateModalContainer.defaultProps = {
  hasSpaces: false,
  projectId: '',
  updateSpace: function () {}
}

CreateModalContainer.propTypes = {
  account: PropTypes.object,
  actions: PropTypes.object.isRequired,
  config: PropTypes.object,
  handleCancelModal: PropTypes.func.isRequired,
  hasSpaces: PropTypes.bool,
  projectId: PropTypes.string,
  serverActions: PropTypes.object,
  space: PropTypes.object,
  updateSpace: PropTypes.func,
  user: PropTypes.object,
  viewType: PropTypes.string,
  filters: PropTypes.object
}

export default CreateModalContainer
