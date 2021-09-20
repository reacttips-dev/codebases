import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Heading, Text } from '@postman/aether';
import { Modal, ModalContent, ModalFooter } from '../../base/Modals';
import { UIEventService, getStore } from '../../../../onboarding/src/common/dependencies';
import MultiUserTeamModalConstants from './MultiUserTeamModalConstants';
import AnalyticsService from '../../../modules/services/AnalyticsService';

const { MULTI_USER_TEAM_MODAL, TEAM_CREATION_ACTION_EVENT, MULTI_USER_TEAM_ACTION } = MultiUserTeamModalConstants;

@observer
export class MultiUserTeamModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount () {
    this.unsubscribeHandler = UIEventService.subscribe(MULTI_USER_TEAM_MODAL, this.handleToggle);
  }

  componentWillUnmount () {
    this.unsubscribeHandler && this.unsubscribeHandler();
  }

  /**
   * @method handleToggle
   *
   * @description Toggles the open state of modal
   */
  handleToggle ({ isOpen = true }) {
    this.setState({ isOpen });
  }

  /**
   * @method handleAnalytics
   *
   * @description Records client events for different actions
   */
  handleAnalytics (category, action, label) {
    AnalyticsService.addEventV2({
      category: category,
      action: action,
      label: label
    });
  }

  /**
   * @method handleAction
   *
   * @description Calls UIEventService to trigger event based on options added
   */
  handleAction (source) {
    switch (source) {
      case MULTI_USER_TEAM_ACTION.ACTION_CLOSE.action:
        UIEventService.publish(TEAM_CREATION_ACTION_EVENT, MULTI_USER_TEAM_ACTION.ACTION_CLOSE.options);
        break;

      case MULTI_USER_TEAM_ACTION.ACTION_INVITE.action:
        UIEventService.publish(TEAM_CREATION_ACTION_EVENT, MULTI_USER_TEAM_ACTION.ACTION_INVITE.options);
        this.handleAnalytics('create_workspace_experiment', 'click', 'invite');
        break;

      case MULTI_USER_TEAM_ACTION.ACTION_CREATE.action:
        UIEventService.publish(TEAM_CREATION_ACTION_EVENT, MULTI_USER_TEAM_ACTION.ACTION_CREATE.options);
        this.handleAnalytics('create_workspace_experiment', 'click', 'create_workspace');
        break;

      case MULTI_USER_TEAM_ACTION.ACTION_TOGGLE.action:
        UIEventService.publish(TEAM_CREATION_ACTION_EVENT, MULTI_USER_TEAM_ACTION.ACTION_TOGGLE.options);
        this.handleAnalytics('create_workspace_experiment', 'click', 'toggle_visibility');
        break;
    }

    this.setState({ isOpen: false });
  }

  /**
   * @method getCustomStyles
   *
   * @description Returns custom styles for modal
   */
  getCustomStyles () {
    return {
      width: '440px'
    };
  }

  render () {
    const teamId = getStore('CurrentUserStore').teamId;

    // If user is a part of a team, bail out
    if (teamId) {
      return null;
    }

    return (
      <Modal
        isOpen={this.state.isOpen}
        size='small'
        className='multi-user-team-modal'
        onClose={this.handleAction.bind(this, MULTI_USER_TEAM_ACTION.ACTION_CLOSE.action)}
        customStyles={this.getCustomStyles()}
      >
        <ModalContent>
          <div className='header'>
            <Heading
              type='h3'
              className='heading'
              text='Create a team workspace with no members?'
            />
            <Button
              onClick={this.handleAction.bind(this, MULTI_USER_TEAM_ACTION.ACTION_CLOSE.action)}
              type='tertiary'
              icon='icon-action-close-stroke'
              className='button'
            />
          </div>
          <div className='content'>
            <Text
              type='body-large'
            >
              In a team workspace, you get to invite people to collaborate and build APIs together. Are you sure you don’t want to invite anyone?
            </Text>
          </div>
          <div className='action'>
            <Button
              type='secondary'
              text='Go Back and Invite'
              size='medium'
              onClick={this.handleAction.bind(this, MULTI_USER_TEAM_ACTION.ACTION_INVITE.action)}
            />
            <Button
              type='primary'
              text='Yes, Create'
              size='medium'
              className='primary'
              onClick={this.handleAction.bind(this, MULTI_USER_TEAM_ACTION.ACTION_CREATE.action)}
            />
          </div>
          </ModalContent>
          <ModalFooter>
          <div className='footer'>
            <Text
              type='body-medium'
              color='content-color-tertiary'
            >
              Looking to work independently?
            </Text>
            <Button
              onClick={this.handleAction.bind(this, MULTI_USER_TEAM_ACTION.ACTION_TOGGLE.action)}
              text='Change visibility to personal'
              type='monochrome-plain'
              className='link'
            />
          </div>
          </ModalFooter>
      </Modal>
    );
  }
}
