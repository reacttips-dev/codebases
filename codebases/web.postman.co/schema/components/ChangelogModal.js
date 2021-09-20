import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Modal, ModalHeader, ModalContent } from '../../js/components/base/Modals';
import DiffStrap from './DiffStrap';
import DiffText from './DiffText';

@pureRender
export default class ChangelogModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showSchemaChangelogModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showSchemaChangelogModal', this.handleOpen);
  }

  handleOpen (data) {
    this.setState({
      isOpen: true,
      diff: data.diff,
      apiName: data.apiName
    });
  }

  handleClose () {
    this.setState({
      isOpen: false
    });
  }

  render () {
    return (
      <Modal
        fullscreen
        className='diff-view-modal'
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
      >
        <ModalHeader className='diff-view-modal-header'>Changes to schema for {this.state.apiName}</ModalHeader>
        <ModalContent className='diff-view-modal-content'>
          <div className='diff-view-modal-content__fullscreen'>
            <DiffStrap diff={this.state.diff} />
            <DiffText diff={this.state.diff} />
          </div>
        </ModalContent>
      </Modal>
    );
  }
}
