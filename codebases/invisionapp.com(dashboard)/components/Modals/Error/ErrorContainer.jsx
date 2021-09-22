import React from 'react'
import PropTypes from 'prop-types'

import Error from './Error'

class ErrorContainer extends React.Component {
  constructor (props) {
    super(props)

    this.closeModal = this.closeModal.bind(this)
  }

  closeModal () {
    this.props.actions.toggleErrorModal('')
  }

  render () {
    return <Error handleCloseModal={this.closeModal} {...this.props} />
  }
}

ErrorContainer.propTypes = {
  actions: PropTypes.object,
  message: PropTypes.string
}

export default ErrorContainer
