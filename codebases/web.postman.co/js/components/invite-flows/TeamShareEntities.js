import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { getStore } from '../../stores/get-store';
import { Dropdown, DropdownButton, DropdownMenu, MenuItem } from '../base/Dropdowns';
import { Tabs, Tab } from '../base/Tabs';
import { Button } from '../base/Buttons';
import { Checkbox } from '../base/Inputs';
import { decomposeUID } from '../../utils/uid-helper';
import AddToWorkspaceEmpty from '../empty-states/AddToWorkspaceEmpty';
import Alert from '../messaging/Alert';
import XPath from '../base/XPaths/XPath';
import LoadingIndicator from '../base/LoadingIndicator';
import SyncWorkspaceController from '../../modules/controllers/SyncWorkspaceController';

@observer
export default class TeamShareEntities extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      loading: false,
      selectedWorkspace: '',
      selectedCollections: [],
      selectedEnvironments: [],
      activeTab: 'collections',
      isAllCollectionSelected: false,
      isAllEnvironmentSelected: false,
      workspaces: []
    };

    this.handleWorkspaceSelect = this.handleWorkspaceSelect.bind(this);
    this.handleSelectAllCollection = this.handleSelectAllCollection.bind(this);
    this.handleSelectAllEnvironments = this.handleSelectAllEnvironments.bind(this);
    this.getCollections = this.getCollections.bind(this);
    this.getEnvironments = this.getEnvironments.bind(this);
    this.getWorkspacesList = this.getWorkspacesList.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.setState({
      isOpen: true,
      loading: true
    });

    SyncWorkspaceController.getAll({ dependencies: true })
      .then((workspaces) => {
        this.setState({
          loading: false,
          workspaces: workspaces
        });
      })
      .catch((err) => {
        pm.logger.error('Could not find workspaces', err);
        pm.toasts.error('Could not find workspaces');

        this.setState({ loading: false });

        this.onModalClose && this.onModalClose();
      });
  }

  handleCollectionSelect (id) {
    let selectedCollections = [];
    if (_.includes(this.state.selectedCollections, id)) {
      selectedCollections = _.filter(this.state.selectedCollections, (itemId) => { return itemId !== id; });
    }
    else {
      selectedCollections = this.state.selectedCollections;
      selectedCollections.push(id);
    }
    this.setState({ selectedCollections });
    this.props.onChange && this.props.onChange({ collections: selectedCollections, environments: this.state.selectedEnvironments });
  }

  handleEnvironmentSelect (id) {
    let selectedEnvironments = [];
    if (_.includes(this.state.selectedEnvironments, id)) {
      selectedEnvironments = _.filter(this.state.selectedEnvironments, (itemId) => { return itemId !== id; });
    }
    else {
      selectedEnvironments = _.concat(this.state.selectedEnvironments, id);
    }
    this.setState({ selectedEnvironments });
    this.props.onChange && this.props.onChange({ collections: this.state.selectedCollections, environments: selectedEnvironments });
  }

  handleSelectAllCollection () {
    let selectedCollections = [],
        isAllCollectionSelected = !this.state.isAllCollectionSelected;

    if (isAllCollectionSelected) {
      selectedCollections = this.getCollections(this.state.selectedWorkspace).collectionIds;
    }
    this.setState({ selectedCollections, isAllCollectionSelected });
    this.props.onChange && this.props.onChange({ collections: selectedCollections, environments: this.state.selectedEnvironments });
  }

  handleSelectAllEnvironments () {
    let selectedEnvironments = [],
        isAllEnvironmentSelected = !this.state.isAllEnvironmentSelected;

    if (isAllEnvironmentSelected) {
      selectedEnvironments = this.getEnvironments(this.state.selectedWorkspace).environmentIds;
    }
    this.setState({ selectedEnvironments, isAllEnvironmentSelected });
    this.props.onChange && this.props.onChange({ collections: this.state.selectedCollections, environments: selectedEnvironments });
  }

  getCollections (workspace) {
    if (!workspace) {
      return [];
    }

    let uids = _.find(this.state.workspaces, { id: workspace }).dependencies.collections || [],
        rendered = [],
        collectionIds = [];

    _.forEach(uids, (uid) => {
      let modelId = decomposeUID(uid).modelId,
          collectionStore = getStore('CollectionStore').find(modelId);

      if (!collectionStore) {
        return;
      }
      let name = collectionStore.name;

      collectionIds.push(modelId);

      rendered.push(
        <div
          key={uid}
          className='entity-checkbox-item-container'
          onClick={this.handleCollectionSelect.bind(this, modelId)}
        >
          <Checkbox className='entity-item-checkbox' checked={_.includes(this.state.selectedCollections, modelId)} />
          <span className='entity-checkbox-item-meta'>{name}</span>
        </div>
        );
    });

    return {
      rendered,
      collectionIds
    };
  }

  getEnvironments (workspace) {
    if (!workspace) {
      return [];
    }

    let uids = _.find(this.state.workspaces, { id: workspace }).dependencies.environments || [],
      rendered = [],
      environmentIds = [];

    _.forEach(uids, (uid) => {
      let modelId = decomposeUID(uid).modelId,
          environmentStore = getStore('EnvironmentStore').find(modelId);

      if (!environmentStore) {
        return;
      }
      let name = environmentStore.name;

      environmentIds.push(uid);
      rendered.push(
        <div
          key={uid}
          className='entity-checkbox-item-container'
          onClick={this.handleEnvironmentSelect.bind(this, uid)}
        >
        <Checkbox className='entity-item-checkbox' checked={_.includes(this.state.selectedEnvironments, uid)} />
        <span className='entity-checkbox-item-meta'>{name}</span>
        </div>
      );
    });
    return {
      rendered,
      environmentIds
    };
  }

  getWorkspacesList () {
    return _.map(this.state.workspaces || [], (workspace) => {
      return (
        <MenuItem refKey={workspace.id} key={workspace.id}>
          <span className='dropdown-menu-item__text'>{workspace.name}</span>
        </MenuItem>
      );
    });
  }

  handleTabChange (source, activeTab) {
    this.setState({ activeTab });
  }
  handleWorkspaceSelect (selectedWorkspace) {
    this.setState({ selectedWorkspace });
  }

  getWorkspaceName (workspaceId) {
    if (!workspaceId) {
      return 'Select a workspace';
    }

    let workspace = _.find(this.state.workspaces, { id: workspaceId });

    return workspace && workspace.name;
  }

  render () {
  let workspaceList = this.state.workspaces,
      selectedWorkspace = this.state.selectedWorkspace,
      collections = this.getCollections(selectedWorkspace).rendered;

    return (
      <XPath identifier='shareEntities'>
        <div className='tab-share-content'>
          <span className='tab-share-content-meta-text'>{this.props.metaText}</span>
          <div className='share-collections-content-container'>
            {
              this.state.loading ? <LoadingIndicator /> :
                (workspaceList.length > 0) ?
                  <div className='workspace-selector-container'>
                    <div className='workspace-selector'>
                      <div className='workspace-selector-label'>Share from</div>
                        <div className='workspace-selector-dropdown-container'>
                          <XPath identifier='selectWorkspace'>
                            <div className='workspace-selector-value'>
                              <Dropdown onSelect={this.handleWorkspaceSelect} >
                                <DropdownButton type='secondary' size='small'>
                                  <Button><span>{this.getWorkspaceName(selectedWorkspace)}</span></Button>
                                </DropdownButton>
                                <DropdownMenu fluid>
                                {
                                  this.getWorkspacesList()
                                }
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                          </XPath>
                          <div className='workspace-selector-meta-container'>
                            <div className='workspace-selector-meta'>Select a workspace to share from</div>
                          </div>
                        </div>
                      </div>
                  </div> :
                  <AddToWorkspaceEmpty />
            }
            { (selectedWorkspace) &&
              <div className='select-workspace-entity-container'>
                <Tabs
                  type='primary'
                  defaultActive='collections'
                  activeRef={this.state.activeTab}
                  onChange={this.handleTabChange.bind(this, 'subTab')}
                >
                  <Tab refKey='collections'>Collections</Tab>
                  <Tab refKey='environments'>Environments</Tab>
                </Tabs>
                {
                  (this.state.activeTab === 'collections') &&
                    <div className='tab-share-content--subtab-entity'>
                    <XPath identifier='selectEntities'>
                      <div className='entity-list-container-wrapper'>
                        <div className='entity-list-container'>
                        {
                          (collections.length > 0) ?
                          <div>
                            <div
                              key='all'
                              className='entity-checkbox-item-container'
                              onClick={this.handleSelectAllCollection}
                            >
                              <Checkbox className='entity-item-checkbox' checked={this.state.isAllCollectionSelected} />
                              <span className='entity-checkbox-item-meta'>All collections</span>
                          </div>
                            {collections}
                          </div> :
                          <span className='entity-empty-text'>There is no collections in this workspace</span>
                        }
                        </div>
                      </div>
                    </XPath>
                      {
                        (this.state.selectedCollections.length > 0 || this.state.selectedEnvironments.length > 0) &&
                        <div className='entity-selection-meta-container'>
                          <div className='entity-selection-meta'>{ this.state.selectedCollections.length } collections and { this.state.selectedEnvironments.length} environments selected</div>
                        </div>
                      }
                    </div>
                }
                {
                  (this.state.activeTab === 'environments') &&
                    <div className='tab-share-content--subtab-entity'>
                    <XPath identifier='selectEntities'>
                      <div className='entity-list-container-wrapper'>
                        <div className='entity-list-container'>
                          {
                            (this.getEnvironments(selectedWorkspace).rendered.length > 0) ?
                            <div>
                              <div
                                key='all'
                                className='entity-checkbox-item-container'
                                onClick={this.handleSelectAllEnvironments}
                              >
                                <Checkbox className='entity-item-checkbox' checked={this.state.isAllEnvironmentSelected} />
                                <span className='entity-checkbox-item-meta'>All Environments</span>
                              </div>
                              {this.getEnvironments(selectedWorkspace).rendered}
                            </div>
                            : <span className='entity-empty-text'>There is no environments in this workspace</span>
                          }
                        </div>
                      </div>
                    </XPath>
                      {
                        (this.state.selectedCollections.length > 0 || this.state.selectedEnvironments.length > 0) &&
                        <div className='entity-selection-meta-container'>
                          <div className='entity-selection-meta'>{ this.state.selectedCollections.length } collections and { this.state.selectedEnvironments.length} environments selected</div>
                        </div>
                      }
                    </div>
                }
              </div>
            }
          </div>
          <div className='share-collections-content-container_warning-text'>
              <Alert
                message={this.props.warningMessage}
                type='success'
                isDismissable={false}
                onMessageLinkClick={this.props.onMessageLinkClick}
              />
            </div>
        </div>
      </XPath>
    );
  }
}
