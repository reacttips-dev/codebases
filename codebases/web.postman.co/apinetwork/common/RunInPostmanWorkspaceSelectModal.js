import React, { Component } from 'react';

import { getStore, NavigationService, SyncWorkspaceController } from '../../onboarding/src/common/dependencies';
import { OPEN_WORKSPACE_IDENTIFIER } from '../../collaboration/navigation/constants';
import WorkspaceSelectorModal from '../components/PrivateNetwork/modals/WorkspaceSelectorModal';
import { observer } from 'mobx-react';
import { importEntities } from '../services/RunButtonService';
import { APINetworkImporter } from '../controllers/APINetworkImporter';

const defaultState = {
  isOpen: false,
  allWorkspaces: [],
  loading: false,
  selectedWorkspace: null
};

@observer
export default class RunInPostmanWorkspaceSelectModal extends Component {
  constructor (props) {
    super(props);

    this.state = defaultState;
    this.importContext = null;

    this.userStore = getStore('CurrentUserStore');

    this.handleOpen = this.handleOpen.bind(this);

    pm.mediator.on('openRunInPostmanWorkspaceSelectModal', this.handleOpen);
  }

  handleOpen (context) {
    this.importContext = context;

    this.setState({
      isOpen: true
    }, () => {
      this.getWorkspaces();
    });
  }

  handleClose () {
    this.setState(defaultState);
  }

  async getWorkspaces () {
    this.setState({ loading: true });

    await getStore('SyncStatusStore').onSyncAvailable();

    const userId = _.get(this.userStore, 'id');

    SyncWorkspaceController
      .getAll()
      .then((workspaces) => {
        const filteredWorkspaces = workspaces.filter((workspace) => {
          return _.get(workspace, `members.users.${userId}`);
        });

        this.setState({ allWorkspaces: filteredWorkspaces, loading: false });
      })
      .catch((err) => {
        pm.logger.error('RunInPostmanWorkspaceSelectModal~getAllWorkspaces', err);

        pm.toasts.error('There was an error fetching the workspaces. Please try again');
      });
  }

  handleRedirectToWorkspace (workspaceId, collectionId) {
    // Wait for the toast feedback and then redirect
    setTimeout(async () => {
      NavigationService.transitionTo('build.collection', {
        cid: collectionId,
        wid: workspaceId
      });
    }, 1000);
  }

  async handleHashEnvironmentImport (collection, hashEnvironment, { userId, workspaceId, traceId }) {
    try {
      const environments = await APINetworkImporter.decodeURLHashEnvironments({ urlHash: hashEnvironment, entityId: collection });

      if (!_.isEmpty(environments)) {
        await APINetworkImporter.importEnvironment({ name: _.get(environments, '0.name'), values: _.get(environments, '0.values'), owner: userId, workspace: workspaceId, traceId });

        pm.toasts.success('Environment ' + _.get(environments, '0.name') + ' imported');
      }
    }
    catch (err) {
      pm.logger.error('RunInPostmanWorkspaceSelectModal~handleHashEnvironmentImport', err);

      pm.toasts.error('There was an error importing the environment');
    }
  }

  async handleWorkspaceSelect (workspaceId) {
    if (!workspaceId || !this.importContext) {
      return;
    }

    const { collection, environment, hashEnvironment, traceId, versionTag } = this.importContext,
      userId = _.get(this.userStore, 'id'),
      accessToken = _.get(this.userStore, 'auth.access_token');

    try {
      const response = await importEntities(collection, environment, workspaceId, { accessToken, versionTag });

      // If hash environment is present and not an environment id, we can safely say this is from the embedded Run in Postman flow
      if (!environment && hashEnvironment) {
        this.handleHashEnvironmentImport(collection, hashEnvironment, { userId, workspaceId, traceId });
      }

      pm.toasts.success(`The collection ${environment ? 'and environment have been imported' : 'has been imported'} successfully.`);

      // Use the collection UID. Response is collection id
      this.handleRedirectToWorkspace(workspaceId, `${userId}-${_.get(response, 'data.collectionId')}`);

      this.handleClose();
    }
    catch (e) {
      pm.toasts.error('There was an error importing this collection. Please try again.');
    }
  }

  componentWillUnmount () {
    pm.mediator.off('openRunInPostmanWorkspaceSelectModal', this.handleOpen);
  }

  render () {
    return (
      <WorkspaceSelectorModal
        loading={this.state.loading}
        allWorkspaces={this.state.allWorkspaces}
        currentUser={this.userStore}
        isOpen={this.state.isOpen}
        actionText='Import'
        selectedWorkspace={this.state.selectedWorkspace}
        title='Import Collection'
        primaryButtonLabel='Import'
        workspaces={this.state.allWorkspaces}
        onCancel={() => {
          this.handleClose();
        }}
        onWorkspaceSelect={(workspace) => {
          this.setState({ selectedWorkspace: workspace.id });

          this.handleWorkspaceSelect(workspace.id);
        }}
      />
    );
  }
}
