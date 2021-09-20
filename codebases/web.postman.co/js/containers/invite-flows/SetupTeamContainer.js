import React, { Component } from 'react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/base/Modals';
import { Button } from '../../components/base/Buttons';
import dispatchAppAction from '../../modules/pipelines/app-action';
import { createEvent } from '../../modules/model-event';
import { updateTeamDetails } from '../../modules/services/APIService';
import LoadingIndicator from '../../components/base/LoadingIndicator';
import dispatchUserAction from '../../modules/pipelines/user-action';
import { getStore } from '../../stores/get-store';
import TeamDetailsUpdate from '../../components/invite-flows/TeamDetailsUpdate';
import WorkspaceSwitchService from '../../services/WorkspaceSwitchService';
import { reaction } from 'mobx';

export default class SetupTeamContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      loading: false,
      teamName: '',
      teamUrl: ''
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleOpen = this.handleToggle.bind(this, false);
    this.handleClose = this.handleToggle.bind(this, true);
    this.handleCancel = this.handleCancel.bind(this, true);
    this.handleTeamDetailsUpdate = this.handleTeamDetailsUpdate.bind(this);
    this.teamUpdate = this.teamUpdate.bind(this);
    this.updateTeamDetails = this.updateTeamDetails.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('openSetupTeamModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('openSetupTeamModal', this.handleOpen);
  }

  getStyles () {
    return {
      marginTop: '10vh',
      height: '70vh',
      minWidth: '760px',
      width: '60vw`'
    };
  }

  handleToggle (value = this.state.isOpen, activeTab = this.state.activeTab, callback) {
    !value && this.switchToTeamWorkspace();
    this.setState({
      isOpen: !value,
      activeTab
    }, () => {
      _.isFunction(callback) && callback();
    });
  }

  handleCancel () {
    this.setState({ loading: false });
    this.handleClose();
  }

  switchToTeamWorkspace () {
    let workspaceId = getStore('ActiveWorkspaceStore').id;

    return WorkspaceSwitchService.switchWorkspace(workspaceId)
      .catch((err) => {
        pm.logger.error('SetupTeamContainer~switchToTeamWorkspace: Could not switch workspace.', err);
        return;
      });
  }

  teamUpdate () {
    this.setState({ loading: true });
    let teamId = _.get(getStore('CurrentUserStore'), 'team.id');

    if (!teamId) {
      let teamIdCreationDisposer = reaction(
        () => _.get(getStore('CurrentUserStore'), 'team.id'),
        (teamId) => {
          if (teamId) {
            teamIdCreationDisposer();
            this.switchToTeamWorkspace();

            return this.updateTeamDetails(teamId);
          }
        }
      );
    }

    return this.updateTeamDetails(teamId);
  }

  updateTeamDetails (teamId) {
    let user = getStore('CurrentUserStore'),
      team_name = this.state.teamName,
      domain = this.state.teamUrl;

    updateTeamDetails({ team_name, domain, organizationId: teamId, user: user }, (err, response) => {
      this.setState({ loading: false });
      if (err) {
        pm.toasts.error(err.message);
        return;
      }
      let refreshOrganizationEvent = createEvent('refreshOrganizations', 'user');

      dispatchUserAction(refreshOrganizationEvent);
      pm.toasts.success('Team details updated successfully');
      this.handleClose();
    });
  }

  handleTeamDetailsUpdate (teamDetails) {
    this.setState({ teamName: teamDetails.teamName, teamUrl: teamDetails.teamUrl });
  }

  render () {
    return (
      <Modal
        className='share-entity-model'
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
        customStyles={this.getStyles()}
      >
        <ModalHeader className='share-entity-model-header'>
          <div className='title'>
            Invitation sent
          </div>
        </ModalHeader>
        <ModalContent className='share-collection-modal-container team-setup-container'>
        <TeamDetailsUpdate
          onChange={this.handleTeamDetailsUpdate}
          metaText='Add a dash of personality to your team'
        />
        </ModalContent>
          <ModalFooter>
          <Button
            className='button-large'
            type='primary'
            onClick={this.teamUpdate}
            disabled={this.state.loading || !_.trim(this.state.teamName) || !_.trim(this.state.teamUrl)}
          >
              {
                 (this.state.loading) ?
                  <LoadingIndicator
                    className='loading-indicator-size'
                  /> : 'Save'
               }
              </Button>
              <Button
                type='text'
                onClick={this.handleCancel}
              >
                Cancel
              </Button>
          </ModalFooter>
      </Modal>
    );
  }
}
