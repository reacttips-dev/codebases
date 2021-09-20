import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/base/Modals';
import TeamShareEntities from '../../components/invite-flows/TeamShareEntities';
import TeamDetailsUpdate from '../../components/invite-flows/TeamDetailsUpdate';
import { Tabs, Tab } from '../../components/base/Tabs';
import { Button } from '../../components/base/Buttons';
import { updateTeamDetails } from '../../modules/services/APIService';
import { createEvent } from '../../modules/model-event';
import dispatchUserAction from '../../modules/pipelines/user-action';
import LoadingIndicator from '../../components/base/LoadingIndicator';
import { defaultTeamWorkspaceId } from '../../utils/default-workspace';

import { getStore } from '../../stores/get-store';
import XPath from '../../components/base/XPaths/XPath';
import UIEventService from '../../services/UIEventService';
import { TEAM_DETAILS_UPDATED } from '../../constants/UIEventConstants';
import WorkspaceSwitchService from '../../services/WorkspaceSwitchService';
import { shareEntities } from '../../modules/services/share-entities/ShareEntitiesService';

const entityStore = {
  collection: getStore('CollectionStore'),
  environment: getStore('EnvironmentStore')
};

@observer
export default class InvitationSentModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      loading: false,
      activeTab: 'share',
      teamName: '',
      teamUrl: '',
      collections: [],
      environments: []
    };

    this.handleOpen = this.handleOpen.bind(this, false);
    this.handleClose = this.handleClose.bind(this, true);
    this.handleModalAction = this.handleModalAction.bind(this);
    this.share = this.share.bind(this);
    this.teamUpdate = this.teamUpdate.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleTeamDetailsUpdate = this.handleTeamDetailsUpdate.bind(this);
    this.handleShareEntitiesUpdate = this.handleShareEntitiesUpdate.bind(this);
    this.getModelActionText = this.getModelActionText.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('openInvitationSentModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('openInvitationSentModal', this.handleOpen);
  }

  handleOpen () {
    defaultTeamWorkspaceId().then((defaultTeamWorkspaceId) => {
      this.setState({
        isOpen: true,
        defaultTeamWorkspaceId: defaultTeamWorkspaceId
      });
    });
  }

  handleClose () {
    this.setState({
      isOpen: false,
      defaultTeamWorkspaceId: null,
      activeTab: 'share'
    });
  }

  getStyles () {
    return {
      marginTop: '10vh',
      height: '80vh',
      minWidth: '760px',
      width: '60vw'
    };
  }

  switchToTeamWorkspace () {
    // Switch to default team workspace
    return WorkspaceSwitchService.switchWorkspace(this.state.defaultTeamWorkspaceId)
      .catch((err) => {
        pm.logger.error('InvitationSentModalContainer~switchToTeamWorkspace: Error in switching workspace', err);
      });
  }

  handleModalAction () {
    if (this.state.activeTab === 'share') {
      // Switch to team workspace
      this.switchToTeamWorkspace();

      this.bulkShareEntities();
      return;
    }

    this.teamUpdate();
  }

  bulkShareEntities () {
    this.setState({ loading: true });
    this.share();
  }

  share () {
    let getModelIdMap = (m, e) => _.map(e, (entityId) => {
        let uid = _.get(entityStore[m].find(entityId), 'uid');
        return { model: m, modelId: uid };
      }),
      collectionsToAdd = getModelIdMap('collection', this.state.collections),
      environmentsToAdd = getModelIdMap('environment', this.state.environments),
      entities = _.concat(collectionsToAdd, environmentsToAdd);

    if (_.isEmpty(entities)) {
      this.setState({ loading: false, activeTab: 'setup' });
      return;
    }

    shareEntities(
      entities,
      this.state.defaultTeamWorkspaceId,
      { origin: 'invitation_sent_modal' }
    ).then(() => {
      this.onLifecycleChange && this.onLifecycleChange(); // destruct the reaction
      this.setState({ loading: false, activeTab: 'setup' });
    })
    .catch((e) => {
      pm.toasts.error('Something went wrong in sharing entities');
      this.setState({ loading: false, activeTab: 'setup' });
    });
  }

  teamUpdate () {
    if (!this.state.teamName || !this.state.teamUrl) {
      pm.toasts.error('Please enter team name and team url');
      return;
    }
    this.setState({ loading: true });
    let user = getStore('CurrentUserStore'),
        teamId = user.team.id,
        team_name = this.state.teamName,
        domain = this.state.teamUrl;

    updateTeamDetails({ team_name, domain, organizationId: teamId, user: user }, (err) => {
      this.setState({ loading: false });
      if (err) {
        pm.toasts.error(err.message);
        return;
      }
      let refreshOrganizationEvent = createEvent('refreshOrganizations', 'user');

      dispatchUserAction(refreshOrganizationEvent);
      pm.toasts.success('Team details updated successfully');
      UIEventService.publish(TEAM_DETAILS_UPDATED);
      this.handleClose();
    });
  }

  handleCancel () {
    this.setState({ loading: false });
    if (this.state.activeTab === 'share') {
      this.setState({ activeTab: 'setup' });
      return;
    }
    this.handleClose();
  }

  handleShareEntitiesUpdate (entityObj) {
    this.setState({ collections: entityObj.collections, environments: entityObj.environments });
  }

  handleTeamDetailsUpdate (teamDetails) {
    this.setState({ teamName: teamDetails.teamName, teamUrl: teamDetails.teamUrl });
  }

  getModelActionText () {
    if (this.state.loading) {
      return (<LoadingIndicator className='loading-indicator-size' />);
    }
    if (this.state.activeTab === 'setup') {
      return 'Save';
    }
    return 'Share';
  }

  getFreeTeamWarningMessage () {
    return 'Free teams have a limit on number of requests that can be shared with the team. If you happen to go beyond this limit, your collections might get archived.';
  }

  render () {
    return (
      <XPath identifier='invitationSentModal' isVisible={this.state.isOpen}>
        <Modal
          className='share-entity-model'
          isOpen={this.state.isOpen}
          onRequestClose={this.handleClose}
          customStyles={this.getStyles()}
        >
        <ModalHeader className='share-entity-model-header'>
          <div className='title'>
            INVITATION SENT
          </div>
        </ModalHeader>
        <ModalContent className='share-collection-modal-container'>
          <Tabs
            type='primary'
            defaultActive='share'
            activeRef={this.state.activeTab}
          >
            <Tab refKey='share' className={this.state.activeTab !== 'share' ? 'incomplete-tab-steps' : ''}>Share collections</Tab>
            <Tab refKey='setup' className={this.state.activeTab !== 'setup' ? 'incomplete-tab-steps' : ''}>Setup your team</Tab>
          </Tabs>
          <div className='share-entity-tab-content'>
            { (this.state.activeTab === 'share') &&
              <TeamShareEntities
                onChange={this.handleShareEntitiesUpdate}
                metaText='While you wait for your team members to join, you can start sharing collections with them in your team workspace.'
                warningMessage={this.getFreeTeamWarningMessage()}
                onModalClose={this.handleClose}
              />
            }
            {
              (this.state.activeTab === 'setup') &&
              <TeamDetailsUpdate
                onChange={this.handleTeamDetailsUpdate}
                metaText='Add a dash of personality to your team'
              />
            }
          </div>
        </ModalContent>
          <ModalFooter>
            <XPath identifier='save'>
              <Button
                className='button-large'
                type='primary'
                onClick={this.handleModalAction}
                disabled={this.state.loading}
              >
                {
                  this.getModelActionText()
                }
              </Button>
            </XPath>
            <Button
              type='secondary'
              onClick={this.handleCancel}
              disabled={this.state.loading}
            >
              {
                this.state.activeTab === 'setup' ? 'Cancel' : 'Skip'
              }
            </Button>
          </ModalFooter>
        </Modal>
      </XPath>
    );
  }
}
