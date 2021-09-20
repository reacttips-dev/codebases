import React, { Component } from 'react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../base/Modals';
import { Button } from '../base/Buttons';
import Markdown from '../base/Markdown';
import LoadingIndicator from '../base/LoadingIndicator';
import KeyMaps from '../base/keymaps/KeyMaps';

export default class UpdateAvailableModal extends Component {
  constructor (props) {
    super(props);
    this.dismissHandler = this.dismissHandler.bind(this);
  }

  getCustomStyles () {
    return {
      marginTop: '15vh',
      height: '70vh',
      width: '720px'
    };
  }

  getKeymapHandlers () {
    return { 'select': pm.shortcuts.handle('select', this.props.onDownloadUpdate) };
  }

  dismissHandler () {
    pm.updateNotifier.set('updateModalDismissed', true);
    this.props.onRequestClose();
  }

  render () {
    return (
      <Modal
        className='update-available'
        customStyles={this.getCustomStyles()}
        isOpen={this.props.isOpen}
        onRequestClose={this.dismissHandler}
      >
        <ModalHeader>
          UPDATE AVAILABLE (v{this.props.updateVersion})
        </ModalHeader>
        <ModalContent>
          <KeyMaps shortcuts={pm.shortcuts.getShortcuts()} handlers={this.getKeymapHandlers()}>
            {
              _.isEmpty(this.props.releaseNotes) ?
              (<div className='update-available__loading-container'>
                <LoadingIndicator className='update-available__notes-loader' />
              </div>) :
              (<div className='changelog-content'>
                <Markdown source={this.props.releaseNotes || ''} />
              </div>)
            }
          </KeyMaps>
        </ModalContent>
        <ModalFooter>
          <Button
            type='primary'
            onClick={this.props.onDownloadUpdate}
          >Update</Button>
          <Button
            type='secondary'
            onClick={this.dismissHandler}
          >Dismiss</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
