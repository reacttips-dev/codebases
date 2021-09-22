import React from 'react'
import PropTypes from 'prop-types'

import Delete from './Delete'
import Modal from '../Modal'
import ModalPortal from '../ModalPortal'

class DeleteContainer extends React.Component {
  constructor (props) {
    super(props)

    this.closeModal = this.closeModal.bind(this)
  }

  closeModal () {
    this.props.handleCloseModal()
  }

  render () {
    return (
      <ModalPortal noScroll={false} transitionTime={150}>
        <Modal
          handleCloseModal={this.closeModal}
          fullScreen
          delayTime={250}
          width={null}>
          <Delete
            account={this.props.account}
            actions={this.props.actions}
            config={this.props.config}
            handleCloseModal={this.closeModal}
            isDeleting={this.props.isDeleting}
            serverActions={this.props.serverActions}
            document={this.props.document}
            animateInComponents={this.props.animateInComponents}
            animateOutComponents={this.props.animateOutComponents}
            getRefs={this.props.getRefs}
            startUnmounting={this.props.startUnmounting}
            willUnmount={this.props.willUnmount}
          />
        </Modal>
      </ModalPortal>
    )
  }
}

DeleteContainer.propTypes = {
  actions: PropTypes.object,
  account: PropTypes.object,
  config: PropTypes.object,
  handleCloseModal: PropTypes.func,
  isDeleting: PropTypes.bool,
  serverActions: PropTypes.object,
  document: PropTypes.object,
  animateInComponents: PropTypes.func,
  animateOutComponents: PropTypes.func,
  getRefs: PropTypes.func,
  startUnmounting: PropTypes.func,
  willUnmount: PropTypes.bool
}

export default DeleteContainer
