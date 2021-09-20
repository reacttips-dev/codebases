import React, { Component } from 'react';
import { Icon, Text } from '@postman/aether';
import { observer } from 'mobx-react';
import { Button } from '../../../js/components/base/Buttons';
import { ModalHeader, Modal, ModalContent, ModalFooter } from '../../../js/components/base/Modals';
import ProgressBar from '../../../js/components/base/ProgressBar';
import { ScratchpadSetupService } from '../services/SetupWorkspace';
import NavigationService from '../../../js/services/NavigationService';
import { OPEN_WORKSPACE_IDENTIFIER } from '../../../collaboration/navigation/constants';
import ScratchpadService from '../../../js/services/ScratchpadService';
import { getDefaultWorkspace } from '../../utils/DefaultWorkspaceUtils';

/**
 *
 */
@observer
export default class ScratchpadSetupProgressModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      defaultWorkspace: null
    };

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
    this.renderCompleted = this.renderCompleted.bind(this);
    this.renderInProgress = this.renderInProgress.bind(this);
    this.renderTimeout = this.renderTimeout.bind(this);
    this.handleGoToWorkspace = this.handleGoToWorkspace.bind(this);
    this.handleGoToScratchpad = this.handleGoToScratchpad.bind(this);

  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('scratchpad-setup-progress', this.showModal);
  }

  async showModal () {
    if (!this.state.defaultWorkspace) {
      try {
        let defaultWorkspace = await getDefaultWorkspace();
        this.setState({ defaultWorkspace });
      }
      catch (err) {
        pm.logger.info('ScratchpadSetupProgressModal~showModal: should not fetch default workspace', err);
      }
    }

    this.setState({
      isOpen: true
    });

    pm.logger.info('ScratchpadSetupProgressModal~showModal: opening the modal');
  }

  closeModal () {

    pm.logger.info('ScratchpadSetupProgressModal~closeModal: closing the modal');

    this.setState({
      isOpen: false
    });
  }

  handleGoToWorkspace () {
    pm.logger.info('ScratchpadSetupProgressModal~handleGoToWorkspace: navigation to workspace started');

    let id = _.get(this.state.defaultWorkspace, 'id');
    if (!id) {
      pm.logger.info('ScratchpadSetupProgressModal ~ handleGoToWorkspace: No workspace found');
      pm.toasts.error('Couldn\'t navigate to the workspace.');
      this.closeModal();
      return;
    }

    NavigationService.transitionTo(OPEN_WORKSPACE_IDENTIFIER, { wid: id });
    this.closeModal();
  }

  handleGoToScratchpad () {
    pm.logger.info('ScratchpadSetupProgressModal~handleGoToScratchpad: switching to scratchpad');
    ScratchpadService.switchToScratchpad();
    this.closeModal();
  }

  componentWillUnmount () {
    pm.mediator.off('scratchpad-setup-progress');
  }

  onCancel () {
    this.closeModal();
  }

  renderErrors () {
    return (
      <React.Fragment>
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
            Some of your Scratch Pad data couldn’t be moved
          </Text>
          <div className='description'>
            <Text className='message' type='body-medium' color='content-color-primary' >
              Please export the data from your Scratch Pad and import them into your workspace.
            </Text>
          </div>
        </ModalContent>
        <ModalFooter className='scratchpad-setup-modal__footer'>
          <Button type='primary' onClick={this.handleGoToScratchpad}>Go to Scratch Pad</Button>
          <Button onClick={this.onCancel} type='secondary'>Close</Button>
        </ModalFooter>
      </React.Fragment>
    );
  }

  renderCompleted () {
    return (
      <React.Fragment>
        <ModalContent className='scratchpad-setup-modal__content'>
          <Icon
            name='icon-state-success-stroke'
            color='content-color-success'
          />
          <Text
            className='message message-success'
            color='content-color-success'
            typographyStyle={{
              fontSize: 'text-size-m',
              fontWeight: 'text-weight-medium',
              lineHeight: 'line-height-s'
            }}
          >
            Moved all your Scratch Pad data
          </Text>
          <div className='description'>It’s now available in the workspace <span className='link' onClick={this.handleGoToWorkspace}> My Workspace </span></div>
        </ModalContent>
        <ModalFooter className='scratchpad-setup-modal__footer'>
          <Button type='primary' onClick={this.handleGoToWorkspace}>Go to Workspace</Button>
          <Button onClick={this.onCancel} type='secondary'>Close</Button>
        </ModalFooter>
      </React.Fragment>
    );
  }

  renderInProgress () {
    return (
      <React.Fragment>
        <ModalContent className='scratchpad-setup-modal__content'>
          <Text className='message' type='body-medium' color='content-color-primary' >This may take a few minutes...</Text>
          <ProgressBar />
        </ModalContent>
        <ModalFooter className='scratchpad-setup-modal__footer'>
          <Button onClick={this.onCancel} type='secondary'>Run In Background</Button>
        </ModalFooter>
      </React.Fragment>
    );
  }

  renderTimeout () {
    return (
      <React.Fragment>
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
          <Button onClick={this.onCancel} type='secondary'>Close</Button>
        </ModalFooter>
      </React.Fragment>
    );
  }

  renderContent () {
    if (ScratchpadSetupService.timedOut) {
      return this.renderTimeout();
    }

    if (ScratchpadSetupService.isAllCompleted) {
      if (ScratchpadSetupService.hasErrors()) {
        return this.renderErrors();
      }

      return this.renderCompleted();
    }

    return this.renderInProgress();
  }

  render () {
    return (
      <Modal
        isOpen={this.state.isOpen}
        className='scratchpad-setup-modal'
      >
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
        {this.renderContent()}
      </Modal>
    );
  }
}
