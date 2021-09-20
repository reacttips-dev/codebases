import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Modal, ModalHeader, ModalContent } from '../Modals';
import Diff from './Diff';

@pureRender
export default class DiffModalView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false,
      previous: '',
      current: '',
      type: 'lines',
      modalHeader: ''
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showDiffModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showDiffModal', this.handleOpen);
  }

  handleOpen (previous, current, type = 'sentences', modalHeader) {
    this.setState({
      isOpen: true,
      previous: previous,
      current: current,
      type: type,
      modalHeader: modalHeader
    });
  }

  handleClose () {
    this.setState({
      isOpen: false,
      previous: '',
      current: '',
      type: 'lines'
    });
  }

  getCustomStyles () {
    return {
      marginTop: 0,
      height: '100%',
      width: '100%'
    };
  }

  render () {

    return (
      <Modal
        fullscreen
        className='diff-view-modal'
        customStyles={this.getCustomStyles()}
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
      >
        <ModalHeader className='diff-view-modal-header'>{this.state.modalHeader}</ModalHeader>
        <ModalContent className='diff-view-modal-content'>
          <Diff
            ignoreOverlay
            current={this.state.current}
            previous={this.state.previous}
            type={this.state.type}
          />
        </ModalContent>
      </Modal>
    );
  }
}
