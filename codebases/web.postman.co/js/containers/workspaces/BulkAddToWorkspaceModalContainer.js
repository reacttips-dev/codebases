import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/base/Modals';
import { Button } from '../../components/base/Buttons';
import BulkAddToWorkspaceModal from '../../components/workspaces/BulkAddToWorkspaceModal';

import { getStore } from '../../stores/get-store';
import AnalyticsService from '../../modules/services/AnalyticsService';
import AddToWorkspaceEmpty from '../../components/empty-states/AddToWorkspaceEmpty';
import { shareEntities } from '../../modules/services/share-entities/ShareEntitiesService';
import LoadingIndicator from '../../components/base/LoadingIndicator';

import SyncWorkspaceController from '../../modules/controllers/SyncWorkspaceController';

const initialState = {
    isOpen: false,
    isLoading: false,
    selectedWorkspace: {},
    selectedCollections: [],
    selectedEnvironments: [],
    activeTab: 'collections',
    workspaces: []
  },
  entityStore = {
    collection: getStore('CollectionStore'),
    environment: getStore('EnvironmentStore')
  };

@observer
export default class BulkAddToWorkspaceModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = initialState;

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSelectCollection = this.handleSelectCollection.bind(this);
    this.handleSelectEnvironment = this.handleSelectEnvironment.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('openBulkAddToWorkspaceModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('openBulkAddToWorkspaceModal', this.handleOpen);
  }

  handleOpen (workspaceId, activeTab = 'collections') {
    this.setState({
      isOpen: true,
      isLoading: true
    });

    return SyncWorkspaceController.getAll({ dependencies: true })
      .then((allWorkspaces) => {
        let workspaces = [];
        console.log('All workspaces', allWorkspaces);

        _.forEach(allWorkspaces, function (workspace) {
          if (workspace && _.get(workspace, ['members', 'users', getStore('CurrentUserStore').id]) && workspace.id !== workspaceId) {
            workspaces.push(workspace);
          }
        });

        this.setState({
          selectedWorkspace: _.first(workspaces) && _.first(workspaces).id,
          workspaceId: workspaceId,
          activeTab: activeTab,
          workspaces,
          isLoading: false
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });

        pm.toasts.error('Could not find workspaces');
        pm.logger.error('Could not find workspaces', err);

        this.handleClose();
      });
  }

  handleClose () {
    this.state.isOpen && this.setState(initialState);
  }

  handleChange (field, value) {
    if (field === 'selectedWorkspace') {
      this.handleSelectEnvironment([]);
      this.handleSelectCollection([]);
    }
    this.setState({ [field]: value });
  }

  handleTabSelect (activeTab) {
    this.setState({ activeTab });
  }

  handleAdd () {
    let getModelIdMap = (m, e) => _.map(e, (entityId) => {
        let uid = _.get(entityStore[m].find(entityId), 'uid', '');
        return { model: m, modelId: uid };
      }),
      collectionsToAdd = getModelIdMap('collection', this.state.selectedCollections),
      environmentsToAdd = getModelIdMap('environment', this.state.selectedEnvironments);

    shareEntities(
      _.concat(collectionsToAdd, environmentsToAdd),
      this.state.workspaceId,
      { origin: 'browse/add_to_ws' }
    );

    this.handleClose();
  }

  handleCancel () {
    this.handleClose();
  }

  getCustomStyles () {
    return {
      overflowY: 'auto',
      maxHeight: '90vh',
      marginTop: '10vh'
    };
  }

  handleSelectEnvironment (selectedEnvironments) {
    this.setState({ selectedEnvironments });
  }

  handleSelectCollection (selectedCollections) {
    this.setState({ selectedCollections });
  }

  getFreeTeamWarningMessage () {
    return 'Sharing collections in team workspaces will affect the usage limit for shared requests. [Check your usage before sharing.](#)';
  }

  render () {
    return (
      <Modal
        className='add-to-workspace-modal'
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
        customStyles={this.getCustomStyles()}
      >
        <ModalHeader>ADD TO THIS WORKSPACE</ModalHeader>
        <ModalContent>
          {
            this.state.isLoading ? <LoadingIndicator /> :
              !_.isEmpty(this.state.selectedWorkspace) ?
                <BulkAddToWorkspaceModal
                  workspaces={this.state.workspaces}
                  selectedCollections={this.state.selectedCollections}
                  selectedWorkspace={_.find(this.state.workspaces, { id: this.state.selectedWorkspace })}
                  selectedEnvironments={this.state.selectedEnvironments}
                  onChange={this.handleChange}
                  onSelectEnvironment={this.handleSelectEnvironment}
                  onSelectCollection={this.handleSelectCollection}
                  onTabSelect={this.handleTabSelect}
                  activeTab={this.state.activeTab}
                  freeTeamWarningMessage={this.getFreeTeamWarningMessage()}
                  onWarningMessageLinkClick={this.handleClose}
                /> :
                <AddToWorkspaceEmpty onCreateWorkspace={this.handleClose} />
          }
        </ModalContent>
        <ModalFooter>
          <Button
            type='primary'
            disabled={_.isEmpty(this.state.selectedCollections) && _.isEmpty(this.state.selectedEnvironments) && !this.state.isLoading}
            onClick={this.handleAdd}
          >
            Add to this Workspace
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
