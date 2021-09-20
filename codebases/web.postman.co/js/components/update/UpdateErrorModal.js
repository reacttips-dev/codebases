import React, { Component } from 'react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../base/Modals';
import { Button } from '../base/Buttons';
import { UPDATE_FLOW_TROUBLESHOOT_LINK } from '../../constants/AppUrlConstants';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
export default class UpdateErrorModal extends Component {
  constructor (props) {
    super(props);

    this.setAppOnline = this.setAppOnline.bind(this);
    this.setAppOffline = this.setAppOffline.bind(this);

    this.state = { isAppOnline: navigator.onLine };
  }

  UNSAFE_componentWillMount () {
    window.addEventListener('online', this.setAppOnline);
    window.addEventListener('offline', this.setAppOffline);
  }

  componentWillUnmount () {
    window.removeEventListener('online', this.setAppOnline);
    window.removeEventListener('offline', this.setAppOffline);
  }

  setAppOnline () {
    this.setState({ isAppOnline: true });
  }

  setAppOffline () {
    this.setState({ isAppOnline: false });
  }

  render () {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        className='update-error'
      >
        <ModalHeader>UPDATE FAILED</ModalHeader>
        <ModalContent>
          <div className='update-error__message'>
            Something went wrong while trying to update your app. Check the DevTools for more details.
          </div>
          <Button
            className='learn-more-button'
            type='text'
            onClick={() => { openExternalLink(UPDATE_FLOW_TROUBLESHOOT_LINK); }}
          >
            Learn more about troubleshooting updates
          </Button>
        </ModalContent>
        <ModalFooter>
          <Button
            type='primary'
            onClick={this.props.onRetryUpdate}
            disabled={!this.state.isAppOnline}
            tooltip={!this.state.isAppOnline ? 'You need to be online to check for updates.' : null}
          >Retry update</Button>
          <Button
            type='secondary'
            onClick={this.props.onManualDownload}
          >Manually download</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
