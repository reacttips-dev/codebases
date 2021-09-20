import React, { Component } from 'react';
import { Button } from '../../../../../../js/components/base/Buttons';
import { Icon, IllustrationFreeForever, Heading, Text } from '@postman/aether';
import { Modal, ModalContent, ModalFooter } from '../../../../../../js/components/base/Modals';
import { UIEventService, OPEN_UPGRADE_TEAM_MODAL } from '../../../../common/dependencies';
import { openUpgradePlanPage } from '../../../../common/ExternalLinkService';
import EffortlessManagement from './illustrations/EffortlessManagement';
import Security from './illustrations/Security';
import FreeForever from './illustrations/FreeForever';

export default class UpgradeTeamModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };

    this.unsubscribeHandler = null;

    this.handleOpen = this.handleOpen.bind(this);
    this.handleUpgrade = this.handleUpgrade.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  getCustomStyles () {
    return {
      width: '686px',
      height: '528px'
    };
  }

  componentDidMount () {
    this.unsubscribeHandler = UIEventService.subscribe(OPEN_UPGRADE_TEAM_MODAL, this.handleOpen);
  }

  componentWillUnmount () {
    this.unsubscribeHandler && this.unsubscribeHandler();
  }

  handleOpen () {
    this.setState({ isOpen: true });
  }

  handleClose () {
    this.setState({ isOpen: false });
  }

  handleUpgrade () {
    openUpgradePlanPage({ source: 'app', label: 'homepage_upgrade' });
    this.handleClose();
  }

  render () {
    return (
      <Modal
        className='upgrade-team-modal'
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
        customStyles={this.getCustomStyles()}
      >
        <ModalContent>
          <Heading
            className='header-title'
            type='h2'
            text='Bring your whole team to Postman'
          />
          <Button
            type='tertiary'
            onClick={this.handleClose}
          >
            <Icon
              name='icon-action-close-stroke'
              color='content-color-tertiary'
            />
          </Button>
          <Text
            className='header-description'
            type='body-large'
            color='content-color-primary'
          >
            Upgrade your plan to expand, organize, and manage your team effortlessly.
          </Text>
          <div className='content-container'>
            <div className='section'>
              <EffortlessManagement />
              <div className='title'>
                Collaborate with everyone
              </div>
              <div className='description'>
                Invite as many team members as you’d like to collaborate and speed up API development.
              </div>
            </div>
            <div className='section'>
              <Security />
              <div className='title'>
                Ramp up security
              </div>
              <div className='description'>
                Set up sign-in authentication, assign roles and permissions to members.
              </div>
            </div>
            <div className='section'>
              <IllustrationFreeForever />
              <div className='title'>
                Much more API calls
              </div>
              <div className='description'>
                Make up to 10,000 Postman API, monitoring, and mock server calls.
              </div>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            type='primary'
            onClick={this.handleUpgrade}
          >
            Upgrade
          </Button>
          <Button
            type='secondary'
            onClick={this.handleClose}
          >
            Maybe later
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
