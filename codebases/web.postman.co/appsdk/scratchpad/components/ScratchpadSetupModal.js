import React, { Component } from 'react';
import { Button } from '../../../js/components/base/Buttons';
import { ModalHeader, Modal, ModalContent, ModalFooter } from '../../../js/components/base/Modals';
import { hasScratchpadData, setupWorkspace } from '../services/SetupWorkspace';
import { Text, Icon } from '@postman/aether';
import ScratchpadService from '../../../js/services/ScratchpadService';
import { getDefaultWorkspace } from '../../utils/DefaultWorkspaceUtils';

/**
 *
 */
export default class ScratchpadSetupModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      isInSetupMode: true,
      isErrored: false
    };

    this.getSetupModal = this.getSetupModal.bind(this);
    this.getSetupExitModal = this.getSetupExitModal.bind(this);
    this.getErrorModal = this.getErrorModal.bind(this);
    this.getModalContent = this.getModalContent.bind(this);

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.onUpload = this.onUpload.bind(this);
    this.openConfirmationModal = this.openConfirmationModal.bind(this);

    this.goBackToSetupModal = this.goBackToSetupModal.bind(this);
    this.onConfirmedExit = this.onConfirmedExit.bind(this);
    this.handleGoToScratchpad = this.handleGoToScratchpad.bind(this);
  }

  UNSAFE_componentWillMount () {
    if (window.SDK_PLATFORM === 'desktop') {
      pm.mediator.on('scratchpad-setup', this.showModal);
    }
  }

  async showModal () {
    let isScratchpadDataPresent = await hasScratchpadData();
    if (!isScratchpadDataPresent) {
      pm.logger.info('ScratchpadSetupModal~showModal : No data present in scratchpad');
      return;
    }

    this.setState({
      isOpen: true
    });

    pm.logger.info('ScratchpadSetupModal~showModal: opening the modal');
  }

  closeModal () {
    pm.logger.info('ScratchpadSetupModal~closeModal : Closing modal');

    this.setState({
      isOpen: false,
      isInSetupMode: true,
      isErrored: false
    });
  }

  componentWillUnmount () {
    pm.mediator.off('scratchpad-setup');
  }

  async onUpload () {
    pm.logger.info('ScratchpadSetupModal~onUpload: user chose to move data to workspace');

    try {
      let workspace = await getDefaultWorkspace();
      setupWorkspace(workspace);
      this.closeModal();
    }
    catch (err) {
      pm.logger.error('ScratchpadSetupModal~onUpload: errored out', err);
      this.setState({ isErrored: true });
    }
  }

  openConfirmationModal () {
    pm.logger.info('ScratchpadSetupModal~openConfirmationModal: user chose to keep in Scratch Pad. Switching to setup exit modal');
    this.setState({ isInSetupMode: false });
  }

  goBackToSetupModal () {
    pm.logger.info('ScratchpadSetupModal~goBackToSetupModal: going back to setup modal');
    this.setState({ isInSetupMode: true });
  }

  onConfirmedExit () {
    pm.logger.info('ScratchpadSetupModal~onConfirmedExit: user chose to keep in Scratch Pad');
    this.closeModal();
  }

  handleGoToScratchpad () {
    pm.logger.info('ScratchpadSetupModal~handleGoToScratchpad: switching to scratchpad');
    ScratchpadService.switchToScratchpad();
    this.closeModal();
  }

  getSetupModal () {
    return (
      <React.Fragment>
        <ModalHeader>
          <Text
            className='message'
            color='content-color-secondary'
            typographyStyle={{
              fontSize: 'text-size-m',
              fontWeight: 'text-weight-medium',
              lineHeight: 'line-height-s'
            }}
          >
            Move Scratch Pad data to your workspace?
          </Text>
        </ModalHeader>
        <ModalContent className='scratchpad-setup-modal__content'>
          <Text className='message' type='body-medium' color='content-color-primary' >A workspace is where people come together to work on APIs. Set up your workspace by moving your Scratch Pad data.</Text>
        </ModalContent>
        <ModalFooter className='scratchpad-setup-modal__footer'>
          <Button type='primary' onClick={this.onUpload}>Move Data to Workspace</Button>
          <Button type='secondary' onClick={this.openConfirmationModal}>Keep in Scratch Pad</Button>
        </ModalFooter>
      </React.Fragment>
    );
  }

  getSetupExitModal () {
    return (
      <React.Fragment>
        <ModalHeader>
          <Text
            className='message'
            color='content-color-secondary'
            typographyStyle={{
              fontSize: 'text-size-m',
              fontWeight: 'text-weight-medium',
              lineHeight: 'line-height-s'
            }}
          >
            Keep data in Scratch Pad?
        </Text>
        </ModalHeader>
        <ModalContent className='scratchpad-setup-modal__content'>
          <Text className='message' type='body-medium' color='content-color-primary' >
            All of your Scratch Pad data will stay on your machine. To move the data to a workspace later, you can manually export and import it into your workspace.
          </Text>
        </ModalContent>
        <ModalFooter className='scratchpad-setup-modal__footer'>
          <Button type='primary' onClick={this.onConfirmedExit}>Yes, Keep in Scratch Pad</Button>
          <Button type='secondary' onClick={this.goBackToSetupModal}>Back</Button>
        </ModalFooter>
      </React.Fragment>
    );
  }

  getErrorModal () {
    return (
      <React.Fragment>
        <ModalHeader>
          <Text
            className='message'
            color='content-color-secondary'
            typographyStyle={{
              fontSize: 'text-size-m',
              fontWeight: 'text-weight-medium',
              lineHeight: 'line-height-s'
            }}
          >
            Move Scratch Pad data to your workspace?
        </Text>
        </ModalHeader>
        <ModalContent className='scratchpad-setup-modal__content'>
          <Icon
            name='icon-state-error-stroke'
            color='content-color-error'
          />
          <Text
            className='message message-error'
            color='content-color-error'
            typographyStyle={{
              fontSize: 'text-size-m',
              fontWeight: 'text-weight-medium',
              lineHeight: 'line-height-s'
            }}
          >
            Your Scratch Pad data couldn’t be moved
          </Text>
          <div className='description'>
            <Text className='message' type='body-medium' color='content-color-primary' >
              Please export all of your Scratch Pad data and import it into your workspace.
            </Text>
          </div>
        </ModalContent>
        <ModalFooter className='scratchpad-setup-modal__footer'>
          <Button type='primary' onClick={this.handleGoToScratchpad}>Go to Scratch Pad</Button>
          <Button onClick={this.onConfirmedExit} type='secondary'>Close</Button>
        </ModalFooter>
      </React.Fragment>
    );
  }

  getModalContent () {
    if (this.state.isErrored) {
      return this.getErrorModal();
    }

    if (this.state.isInSetupMode) {
      return this.getSetupModal();
    }

    return this.getSetupExitModal();
  }

  render () {
    return (
      <Modal
        isOpen={this.state.isOpen}
        className='scratchpad-setup-modal'
      >
        {this.getModalContent()}
      </Modal>
    );
  }
}
