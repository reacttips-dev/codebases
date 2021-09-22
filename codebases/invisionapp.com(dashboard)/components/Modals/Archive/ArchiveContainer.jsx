import React from 'react'
import PropTypes from 'prop-types'

import Archive from './Archive'
import Modal from '../Modal'
import ModalPortal from '../ModalPortal'

class ArchiveContainer extends React.Component {
  constructor (props) {
    super(props)

    this.closeModal = this.closeModal.bind(this)
  }

  closeModal () {
    this.props.handleCloseModal()
  }

  render () {
    return (
      <ModalPortal noScroll transitionTime={250}>
        <Modal
          handleCloseModal={this.closeModal}
          fullScreen>
          <Archive
            actions={this.props.actions}
            document={this.props.document}
            handleCloseModal={this.props.handleCloseModal}
            serverActions={this.props.serverActions}
            handleTracking={this.props.handleTracking}
          />
        </Modal>
      </ModalPortal>
    )
  }
}

ArchiveContainer.propTypes = {
  actions: PropTypes.object,
  document: PropTypes.object,
  handleCloseModal: PropTypes.func,
  serverActions: PropTypes.object,
  handleTracking: PropTypes.func
}

export default ArchiveContainer
