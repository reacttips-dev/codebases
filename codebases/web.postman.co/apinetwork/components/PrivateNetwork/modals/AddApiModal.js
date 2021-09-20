import React, { createRef } from 'react';

import UIEventService from '../../../../js/services/UIEventService';
import { Modal, ModalHeader, ModalContent, ModalFooter, Button, Flex, Heading, Text, TextArea, Label, Breadcrumb, BreadcrumbItem } from '@postman/aether';
import { Input } from '../../../../js/components/base/Inputs';
import LoadingIndicator from '../../../../js/components/base/LoadingIndicator';
import PublishingService from '../../../../js/modules/services/PublishingService';
import { getStore } from '../../../../js/stores/get-store';
import { getFoldersById, getPath, insertEntity } from '../../../utils/folder-utils';
import ApiItem from '../common/ApiItem';
import FolderItem from '../common/FolderItem';
import CreateFolder from '../common/CreateFolder';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import Link from '../../../../appsdk/components/link/Link';
import AddMultipleAPIsDropDown from './AddMultipleAPIsDropDown';
import classnames from 'classnames';
import AnalyticsService from '../../../../js/modules/services/AnalyticsService';

import { OPEN_PRIVATE_NETWORK_BULK_ADD_ENTITY_MODAL } from '../../../../js/constants/UIEventConstants';
import { PRIVATE_NETWORK_MODE } from '../../../constants';

const defaultState = {
  isModalOpen: false,
  folderSearchText: '',
  activeFolder: null,
  isLoading: false,
  folders: [],
  isCreateMode: false,
  mode: PRIVATE_NETWORK_MODE,
  apiStatus: {},
  selectedAPIs: [],
  isBulkAPILoading: false,
  activeNetworkEntityId: null,
  apiSummary: '',
  initialActiveFolder: null,
  isAddButtonLoading: false,
  isCreatingFolder: false
},
  FOLDER = 'folder',
  API_TYPE = 'api',
  ALREADY_PUBLISHED = 'alreadyPublished',
  NO_PERMISSION = 'noPermission',
  CAN_PUBLISH = 'canPublish',
  API_CALLS_PER_BATCH = 25;

const folderExplorerHeight = '264px',
 StyledCurrentLevelEntitiesContainer = styled.div`
  overflow-y: auto;
  border: 1px solid var(--border-color-default);
  height: ${folderExplorerHeight};
`,
 StyledModalFolderSearch = styled.div`
  .input-search-group {
    border: 1px solid var(--border-color-strong);
    background-color: var(--background-color-primary);
    border-radius: 4px 4px 0px 0px;
  }

  &:hover .input-search-group {
    border: 1px solid var(--border-color-default);
    background-color: var(--background-color-primary);
  }
  `,
  StyledEmptyState = styled(Flex)`
    height: ${folderExplorerHeight};
  `,
  StyledBreadcrumbContainer = styled.div`
    max-width: 388px;
    padding-bottom: var(--spacing-s);
    padding-top: var(--spacing-xs);
  `,
  StyledModal = styled(Modal)`
    .no-folders {
      overflow-y: visible;
    }
  `,
  TextAreaContainer = styled.div`
    padding-bottom: var(--spacing-l);
  `,
  StyledSubHeader = styled(Flex)`
    padding-bottom: var(--spacing-s);
    padding-top: var(--spacing-xs);
  `,
  StyledVersionTextContainer = styled.div`
    margin-bottom: var(--spacing-l);
  `;

@observer
export default class AddApiModal extends React.Component {
  constructor (props) {
    super(props);

    this.folderExplorerRef = createRef();
    this.unsubscribeHandler = null;
    this.cb = null;
    this.src = '';
    this.state = defaultState;
  }

  componentDidMount () {
    this.unsubscribeHandler = UIEventService.subscribe(OPEN_PRIVATE_NETWORK_BULK_ADD_ENTITY_MODAL, this.handleOpen);
  }

  componentWillUnmount () {
    this.unsubscribeHandler && this.unsubscribeHandler();
  }

  handleOpen = (props) => {
    this.setState({
      ...defaultState,
      ...(props.activeApi && { selectedAPIs: [{ value: props.activeApi }] }),
      ...(props.activeFolder && { activeFolder: props.activeFolder, initialActiveFolder: props.activeFolder }),
      ...(props.activeNetworkEntityId && { activeNetworkEntityId: props.activeNetworkEntityId }),
      ...(props.mode && { mode: props.mode }),
      isModalOpen: true,
      isLoading: true,
      isBulkAPILoading: true
    });

    if (props.cb && typeof props.cb === 'function') {
      this.cb = props.cb;
    }

    this.src = props.src;

    this.fetchEntities();
    !props.activeNetworkEntityId && this.fetchBulkAPIs();
  }

  async getPublishedStatusOfAPI (entities) {
    try {
       return await PublishingService.bulkEntityStatus(entities);
    }
    catch (err) {
      pm.logger.error('AddAPIModal~getStatus', err);
    }
  }

  getApiSummary = async (activeNetworkEntityId) => {
    if (!activeNetworkEntityId) {
      return null;
    }

    return _.get(await PublishingService.getNetworkEntity(activeNetworkEntityId), 'summary', '');
  }

  fetchEntities = async () => {
    try {
      const folders = await PublishingService.fetchFolders(getStore('CurrentUserStore').teamId),
       apiSummary = await this.getApiSummary(this.state.activeNetworkEntityId);

      this.setState({ isLoading: false, folders, ...(apiSummary && { apiSummary }) });
    } catch (e) {
      this.setState({ isLoading: false });
    }
  }

  fetchBulkAPIs = async () => {
    PublishingService.getAllTeamAPIs()
    .then((allAPIs) => {
      const multiSelectDropDownOptions = _.reduce(allAPIs, (result, api) => {
        if (_.get(api.data, 'id')) {
          result[_.get(api.data, 'id')] = { name: _.get(api.data, 'name') };
        }
       return result;
      }, {}),
      getStatusReqData = _.map(multiSelectDropDownOptions, (key, val) => {
        return { type: 'internal', entityType: 'api', entityId: val };
      });

      let startInd = 0,
        promises = [];

      while (startInd < getStatusReqData.length) {
        promises.push(this.getPublishedStatusOfAPI(getStatusReqData.slice(startInd, Math.min(getStatusReqData.length, startInd + API_CALLS_PER_BATCH))));
        startInd += API_CALLS_PER_BATCH;
      }

      Promise.all(promises)
        .then((promiseAPIResponse) => {
          let totalGetStatusAPISResponse = [...new Set(promiseAPIResponse.flat())];

          // add the type for multi select dropdown options
          _.forEach(totalGetStatusAPISResponse, (value) => {
            if (value.entityId) {
              if (value.published) {
                multiSelectDropDownOptions[value.entityId].type = ALREADY_PUBLISHED;
              }
              else if (!value.canPublish) {
                multiSelectDropDownOptions[value.entityId].type = NO_PERMISSION;
              }
              else {
                multiSelectDropDownOptions[value.entityId].type = CAN_PUBLISH;
              }
            }
          });

          this.setState({ apiStatus: multiSelectDropDownOptions, isBulkAPILoading: false });
        })
        .catch((err) => {
          pm.logger.error('AddAPIModal~getStatusAPIs', err);
        });
    })
    .catch((err) => {
      pm.logger.error('AddAPIModal~fetchBulkAPIs', err);
    });
  }

  handleFolderClick = (folderId) => {
    this.setState({ activeFolder: folderId, isCreateMode: false });
  }

  filterEntities = (entities) => {
    return _.filter(entities, (entity) => entity.name.toLowerCase().includes(this.state.folderSearchText));
  }

  renderCurrentLevelTree = (foldersById) => {
    const { activeFolder, folders, isCreateMode } = this.state,
      currentLevelEntities = !activeFolder ? folders : _.get(foldersById, `${[activeFolder]}.entities`, []),
      filteredEntities = this.filterEntities(currentLevelEntities);

      if (!isCreateMode && (currentLevelEntities.length === 0 || filteredEntities.length === 0)) {
        return (
          <StyledEmptyState alignItems='center' justifyContent='center'>
            <Text color='content-color-tertiary'>
              {currentLevelEntities.length === 0 ? 'Folder is empty' : 'No folders found'}
            </Text>
          </StyledEmptyState>
        );
      }

      return _.map(filteredEntities, (entity) => {
        if (entity.entityType === 'api') {
          return <ApiItem name={entity.name} />;
        }

        return <FolderItem name={entity.name} id={entity.id} onFolderClick={this.handleFolderClick} />;
      });
  }

  handleBulkPublishApis = (folderName) => {
    const { selectedAPIs, activeFolder, mode } = this.state,
      entitiesToBeAdded = _.reduce(selectedAPIs, (result, data) => {
        result.push({
          entityId: data.value,
          type: 'internal',
          entityType: API_TYPE,
          ...(activeFolder && { parent: activeFolder })
        });

        return result;
      }, []);

    this.setState({ isAddButtonLoading: true }, () => {
      PublishingService.bulkPublishEntities(entitiesToBeAdded).then((data) => {
        pm.toasts.success(`${selectedAPIs.length === 1 ? '1 API' : `${selectedAPIs.length} APIs`} added`);
        this.setState({ isModalOpen: false, isAddButtonLoading: false });

        // In private network mode, store is updated for APIs to reflect in Private network listing page, In Build mode, we update the
        // entity status which acts like a notifier mechanism for 'Add to network' CTA component to change it's render state to 'Already published'
        mode === PRIVATE_NETWORK_MODE ? getStore('PrivateNetworkStore').notifyToPublishAPIs(this.state.activeFolder, data) :
          getStore('PrivateNetworkStore').addAPIStatus(selectedAPIs[0].value, folderName);

        this.cb && this.cb();

        AnalyticsService.addEventV2AndPublish({
          category: 'private-api-network',
          action: 'add-api',
          label: this.src,
          value: selectedAPIs.length,
          userId: getStore('CurrentUserStore').id,
          teamId: getStore('CurrentUserStore').teamId
        });
      }).catch((err) => pm.toasts.error('Something went wrong while publishing the apis'));
    });
  }

  handleCreateFolder = (folderName, foldersById) => {
    const { activeFolder, folders } = this.state,
      currentLevelFolders = _.filter(activeFolder ? foldersById[activeFolder].entities : folders, (entity) => entity.entityType !== 'api'),
      firstFolderId = _.get(currentLevelFolders[0], 'id', null);

    this.setState({ isCreateMode: false, isCreatingFolder: true }, () => {
      PublishingService.createFolder({
        name: folderName,
        ...(this.state.activeFolder && { parent: this.state.activeFolder }),
        ...(firstFolderId && { order: { before: firstFolderId } })
      }).then((folder) => {
        const { activeFolder, folders, mode } = this.state;

        let newFolders = folders;

        folder.entities = [];
        activeFolder ? insertEntity(newFolders, activeFolder, folder, FOLDER) : newFolders.unshift(folder);

        this.setState({
          folders: newFolders,
          activeFolder: folder.id,
          isCreatingFolder: false
        });

        // Store is updated for folders to reflect on the Private network listing page
        mode === PRIVATE_NETWORK_MODE && getStore('PrivateNetworkStore').notifyToUpdateFolders(newFolders);

        AnalyticsService.addEventV2AndPublish({
          category: 'private-api-network',
          action: 'create-folder',
          label: this.src,
          entityId: folder.id,
          value: 1,
          userId: getStore('CurrentUserStore').id,
          teamId: getStore('CurrentUserStore').teamId
        });
      }).catch((err) => pm.toasts.error('Something went wrong while creating the folder'));
    });


  }

  handleCreateFolderClose = () => {
    this.setState({ isCreateMode: false });
  }

  handleActiveFolderChange = (folder) => {
    folder.id !== this.state.activeFolder && this.setState({ activeFolder: folder.id, isCreateMode: false });
  }

  renderCreateFolderCTA = () => {
    return (
      <Flex gap='spacing-l' direction='column'>
        {this.state.mode !== PRIVATE_NETWORK_MODE && <StyledVersionTextContainer><Text color='content-color-secondary'>Only versions of this API that are visible to consumers will be discoverable on the Private API Network</Text></StyledVersionTextContainer>}
        <Flex alignItems='center' gap='spacing-xs'>
          <Link onClick={() => this.setState({ isCreateMode: true })}>
            <Text type='link-default'><Text>Create and add to folder</Text></Text>
          </Link>
          <Text color='content-color-secondary'>(optional)</Text>
        </Flex>
      </Flex>
    );
  }

  handleSelectedAPIS = (selectedEntities) => {
    this.setState({ selectedAPIs: selectedEntities });
  }

  handleUpdateSummary = () => {
    const { activeFolder, initialActiveFolder, activeNetworkEntityId, apiSummary } = this.state;

    this.setState({ isAddButtonLoading: true }, () => {
      PublishingService.updateEntity(activeNetworkEntityId, {
        summary: apiSummary,
        ...(activeFolder !== initialActiveFolder && { parent: activeFolder })
      })
      .then(() => {
        // @TODO Can be notified to update Store instead of fetching
        getStore('PrivateNetworkStore').fetchFolders({ fetchEntities: true });
        pm.toasts.success('API listing updated');
        this.setState({ isModalOpen: false, isAddButtonLoading: false });

        AnalyticsService.addEventV2AndPublish({
          category: 'private-api-network',
          action: 'modify-api',
          label: 'sidebar',
          entityId: activeNetworkEntityId,
          value: 1,
          userId: getStore('CurrentUserStore').id,
          teamId: getStore('CurrentUserStore').teamId
        });
      })
      .catch((err) => pm.toasts.error('Something went wrong while updating API summary'));
    });
  }

  render () {
    const { isModalOpen, folderSearchText, isLoading, folders, activeFolder, isCreateMode, isBulkAPILoading, selectedAPIs, mode, activeNetworkEntityId, apiSummary, initialActiveFolder, isAddButtonLoading, isCreatingFolder } = this.state,
      foldersById = getFoldersById(folders),
      isFolderExist = (folders || []).find((node) => {
        return node.entities;
      }),
      path = _.reduce(getPath(folders, activeFolder) || [], (result, folderId) => {
        result.push({
          name: foldersById[folderId].name,
          id: folderId
        });

        return result;
      }, [{ name: 'Private API Network', id: null }]);

    activeFolder && !_.isEmpty(foldersById) && path.push({ id: activeFolder, name: foldersById[activeFolder].name });

    return (
      <StyledModal
        isOpen={isModalOpen}
        size='small'
        onClose={() => this.setState({ isModalOpen: false })}
      >
        <ModalHeader heading={activeNetworkEntityId ? 'Edit API listing' : 'Add APIs to Private API Network'} />

        <ModalContent gap='spacing-l' className={classnames({ 'no-folders': !isCreateMode && !activeFolder && !isLoading && folders.length === 0 })}>
          {isLoading && <Flex padding='spacing-xxl' justifyContent='center' alignItems='center'><LoadingIndicator /></Flex>}
          {!isLoading && mode === PRIVATE_NETWORK_MODE && !activeNetworkEntityId &&
            <div>
              <Heading text='Select APIs' type='h6' />
              <AddMultipleAPIsDropDown
                APIData={this.state.apiStatus}
                onAPISelect={this.handleSelectedAPIS}
                isLoading={isBulkAPILoading}
              />
            </div>
          }
          { !isLoading && (!isCreateMode && !activeFolder && !isFolderExist ? this.renderCreateFolderCTA() :
              <div>
                {activeNetworkEntityId &&
                  <TextAreaContainer>
                    <TextArea
                      placeholder='Write a brief summary about this API'
                      label={<Label text='Summary' />}
                      value={apiSummary}
                      onChange={(e) => this.setState({ apiSummary: e.target.value })}
                    />
                  </TextAreaContainer>}
                {this.state.mode !== PRIVATE_NETWORK_MODE && <StyledVersionTextContainer><Text color='content-color-secondary'>Only versions of this API that are visible to consumers will be discoverable on the Private API Network</Text></StyledVersionTextContainer>}
                <Flex gap='spacing-xs'>
                  <Heading text='Select folder' type='h6' />
                  <Text type='body-small'>(optional)</Text>
                </Flex>
                {!activeFolder ? <StyledSubHeader><Text type='body-small' color='content-color-secondary'>Organize your APIs in folders</Text></StyledSubHeader> :
                  <StyledBreadcrumbContainer>
                    <Breadcrumb onItemClick={this.handleActiveFolderChange}>
                      {_.map(path, (data) => <BreadcrumbItem itemData={data} key={data.id}>{data.name}</BreadcrumbItem>)}
                    </Breadcrumb>
                  </StyledBreadcrumbContainer>
                }
                <StyledModalFolderSearch>
                  <Input
                    inputStyle='search'
                    placeholder='Search folders'
                    query={folderSearchText}
                    onChange={(query) => this.setState({ folderSearchText: query })}
                    icon='icon-action-filter-stroke'
                  />
                </StyledModalFolderSearch>
                <StyledCurrentLevelEntitiesContainer ref={this.folderExplorerRef}>
                  {isCreateMode &&
                    <CreateFolder
                      handleCreateFolder={(folderName) => this.handleCreateFolder(folderName, foldersById)}
                      onCreateFolderClose={this.handleCreateFolderClose}
                    />}
                  {this.renderCurrentLevelTree(foldersById)}
                </StyledCurrentLevelEntitiesContainer>
              </div>)
            }
      </ModalContent>

        <ModalFooter>
          <Flex grow={1} justifyContent='space-between'>
            <div>
              {!isLoading && isFolderExist && !(!isCreateMode && !activeFolder && folders.length === 0) &&
                <Button
                  onClick={() => {
                  this.setState({ isCreateMode: true });
                  if (this.folderExplorerRef) {
                    this.folderExplorerRef.current.scrollTop = 0;
                  }
                }}
                  type='tertiary'
                  text='Create Folder'
                  icon='icon-action-newFolder-stroke'
                  isLoading={isCreatingFolder}
                />}
            </div>
            <Flex gap='spacing-s'>
              <Button type='secondary' text='Cancel' onClick={() => this.setState({ isModalOpen: false })} />
              <Button
                type='primary'
                text={activeNetworkEntityId ? 'Update' : selectedAPIs.length <= 1 ? 'Add API' : 'Add APIs'}
                isDisabled={isLoading || (!activeNetworkEntityId && selectedAPIs.length === 0)}
                isLoading={isAddButtonLoading}
                onClick={activeNetworkEntityId ? this.handleUpdateSummary : () => this.handleBulkPublishApis(_.get(foldersById, `${[this.state.activeFolder]}.name`, null))}
              />
            </Flex>
          </Flex>
        </ModalFooter>
      </StyledModal>
    );
  }
}
