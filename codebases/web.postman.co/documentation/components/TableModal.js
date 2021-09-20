import React from 'react';

import { Modal, ModalContent, ModalHeader } from '../../js/components/base/Modals';

export default class TableModal extends React.Component {
  state = {
    isOpen: false,
    content: null
  }

  componentDidMount () {
    pm.mediator.on('openTableModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('openTableModal', this.handleRequestClose);
    this.timeout && clearTimeout(this.timeout);
  }

  handleOpen = (data) => {
    this.setState({
      isOpen: true,
      content: data.body
    });
  }

  handleRequestClose = () => {
    this.setState({ isOpen: false });
  }

  render () {
    return (
      <Modal
        className='table-modal'
        isOpen={this.state.isOpen}
        onRequestClose={this.handleRequestClose}
        customStyles={{
          marginTop: '17vh',
          maxHeight: '70vh',
          width: '70vw'
        }}
      >
        <ModalHeader>Table</ModalHeader>
        {this.state.content
          ? (
            <ModalContent className='description-preview'>
              <div className='click-to-expand-container'>
                <table>
                  {this.state.content}
                </table>
              </div>
            </ModalContent>
          )
          : null}
      </Modal>
    );
  }
}
