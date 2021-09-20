import React, { Component } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Tabs, Tab } from '../../components/base/Tabs';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/base/Modals';
import { Button } from '../../components/base/Buttons';
import AnalyticsService from '../../modules/services/AnalyticsService';
import { fetchAllTags } from './services/VersionTagService';
import uuid from 'uuid/v4';

import util from '../../utils/util';
import CreateNewMockModal from '../../components/new-button/CreateNewMockModal';
import { createEvent, findEvents, getEventData } from '../../modules/model-event';
import dispatchUserAction from '../../modules/pipelines/user-action';
import { getStore } from '../../stores/get-store';
import { onChangesetResponse } from '../../modules/services/SyncChangesetEventService';
import CollectionController from '@@runtime-repl/collection/datastores/controllers/CollectionController';
import SuccessIcon from '../../components/base/Icons/SuccessIcon';
import XPath from '../../components/base/XPaths/XPath';
import UserController from '../../modules/controllers/UserController';
import { TrackedState, bindTrackedStateToComponent } from '../../modules/tracked-state/TrackedState';
import { fetchPermissions } from '../../modules/services/PermissionsService';
import { getMockConfigOptions, createMock } from '../../../mocks/services/MockService';
import NavigationService from '../../services/NavigationService';
import { OPEN_CREATE_NEW_IDENTIFIER } from '../../../onboarding/navigation/constants';

let initialState = {
  isOpen: false,
  isLoading: false,
  activeStep: 1,
  activeSource: 'new',
  errorFetchingVersions: false,
  ownCollections: [],
  ownEnvironments: [],
  ownVersions: [],
  selectedOptions: {
    name: '',
    isPrivate: false,
    collectionId: '',
    ownerId: '',
    environmentId: '',
    mockUrl: '',
    versionId: '',
    createEnvironment: true,
    delay: null
  },
  from: 'create_new_x',
  mockStatus: {
    loading: true,
    error: false
  },
  collectionStatus: {
    loading: true,
    error: false
  },
  environmentStatus: {
    loading: true,
    error: false
  },
  userStatus: { },
  saveToActivity: false,
  workspaceId: null,
  startStep: 1,
  permissions: {},
  permissionsLoading: true,
  configStatus: {
    loading: false,
    error: false
  },
  delayDurationError: false,
  isNameEmpty: false
};

@observer
export default class CreateNewMockModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = initialState;

    this.trackedState = new TrackedState({
      requests: []
    });

    bindTrackedStateToComponent(this.trackedState, this);

    this.loadWorkspaceCollections = this.loadWorkspaceCollections.bind(this);
    this.loadOwnEnvironments = this.loadOwnEnvironments.bind(this);
    this.loadOwnVersions = this.loadOwnVersions.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeSource = this.handleChangeSource.bind(this);
    this.fetchAndSetConfigOptions = this.fetchAndSetConfigOptions.bind(this);

    this.handleSelectCollection = this.handleSelectCollection.bind(this);
    this.handleSelectEnvironment = this.handleSelectEnvironment.bind(this);
    this.handleSelectVersion = this.handleSelectVersion.bind(this);
    this.handleRequestChange = this.handleRequestChange.bind(this);
    this.handleMockNameChange = this.handleMockNameChange.bind(this);
    this.handlePrivateChange = this.handlePrivateChange.bind(this);
    this.handleDelayChange = this.handleDelayChange.bind(this);
    this.handleCreateEnvironmentChange = this.handleCreateEnvironmentChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
    this.handleVersionFetchRetry = this.handleVersionFetchRetry.bind(this);
    this.handleOfflineRetry = this.handleOfflineRetry.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleDirtyStateOnClose = this.handleDirtyStateOnClose.bind(this);

    this.constructCollection = this.constructCollection.bind(this);
    this.constructMock = this.constructMock.bind(this);
    this.constructEnvironment = this.constructEnvironment.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('openCreateNewMockModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('openCreateNewMockModal', this.handleOpen);
  }

  getStyles () {
    return {
      marginTop: '10vh',
      height: '75vh',
      minWidth: '900px',
      width: '80vw'
    };
  }

  loadWorkspaceCollections () {
    let editableCollections = getStore('ActiveWorkspaceStore').editableCollections;
    this.setState({ ownCollections: editableCollections });
  }

  loadOwnEnvironments () {
     let ownEnvironments = getStore('ActiveWorkspaceStore').environments,
        sortedEnvironments = _.sortBy(ownEnvironments, (environment) => {
          return environment.name.toLowerCase();
        }),
        allEnvironments = _.concat({ id: null, name: 'No Environment' }, sortedEnvironments);

    this.setState({ ownEnvironments: allEnvironments });
  }

  loadOwnVersions (criteria) {
    return fetchAllTags(criteria);
  }

  fetchAndSetConfigOptions () {
    this.setState((state) => {
      return {
        configStatus: {
          loading: true,
          error: false
        }
      };
    });

    return getMockConfigOptions()
      .then((configOptions) => {
        this.setState((state) => {
          return {
            configStatus: {
              ...this.state.configStatus,
              loading: false
            },
            configOptions
          };
        });
      })
      .catch((err) => {
        this.setState({
          configStatus: {
            loading: false,
            error: true
          }
        });
      });
  }

  handleDirtyStateOnClose () {
    if (this.trackedState.isDirty()) {
      pm.mediator.trigger('showConfirmationModal', this.handleClose);
    }
    else {
      this.handleClose();
    }
  }

  handleClose () {
    this.handleSaveToActivity();
    this.setState({
      ...initialState,
      isOpen: false
    });
    this.trackedState.reset({
      requests: []
    });
    this.onSuccess = null;
    this.disposer && this.disposer();
  }

  handleSaveToActivity () {
    if (!this.state.saveToActivity) {
      return;
    }
    let metaObj = _.pick(this.state,
      [
        'activeSource',
        'selectedOptions',
        'mockStatus',
        'collectionStatus',
        'environmentStatus'
      ]
    );
    pm.mediator.trigger('saveXFlowActivity', 'mock', metaObj);
  }

  handleOpen (openState = {}, onSuccess) {
    if (this.state.isOpen) {
      return;
    }

    let shouldLoadVersions = _.get(openState, 'selectedOptions.collectionId'),
      requests = _.get(openState, 'selectedOptions.requests', []);

    this.trackedState.reset({
      requests: requests
    });

    this.setState({
      ...initialState,
      ...openState,
      selectedOptions: {
        ...initialState.selectedOptions,
        ...openState.selectedOptions
      },
      isOpen: true,
      isLoading: shouldLoadVersions,
      startStep: _.get(openState, 'activeStep', 1),
      traceId: uuid()
    }, () => {
      AnalyticsService.addEventV2({
        category: 'mock',
        action: 'initiate_create',
        label: this.state.from,
        traceId: this.state.traceId
      });
    });

    if (shouldLoadVersions) {
      this.loadOwnVersions({
          collectionUid: `${_.get(openState, 'selectedOptions.ownerId')}-${_.get(openState, 'selectedOptions.collectionId')}`
        })
        .then((versions) => {
          this.setState({
            ownVersions: versions,
            isLoading: false,
            selectedOptions: {
              ...this.state.selectedOptions,
              versionId: _.get(versions, '0.id')
            }
          });
        })
        .then(this.fetchAndSetConfigOptions())
        .catch((err) => {
          this.setState({ isLoading: false, errorFetchingVersions: true });
        });
    }

    this.fetchBillingPermissions();
    this.fetchAndSetConfigOptions();

    this.onSuccess = onSuccess;
  }

  async fetchBillingPermissions () {
    let permissions = await fetchPermissions(['managePayment']);

    this.setState({
      permissions: permissions,
      permissionsLoading: false
    });
  }

  handleChangeSource (activeSource) {
    this.setState({ activeSource }, () => {
      if (this.state.activeSource === 'workspace') {
        this.loadWorkspaceCollections();
      }
    });
  }

  handleSelectCollection (collection) {
    let newState = {};

    switch (this.state.activeSource) {
      case 'new':
        newState = {
          selectedOptions: {
            ...this.state.selectedOptions,
            collectionId: ''
          }
        };
        break;
      case 'workspace':
        newState = {
          selectedOptions: {
            ...this.state.selectedOptions,
            name: collection.name,
            collectionId: collection.id,
            ownerId: collection.owner,
            createEnvironment: false
          }
        };
        break;
    }

    this.loadOwnEnvironments();

    /**
     * If block is run if we choose a collection to create a mock
     * else block is run if we use requests to create a mock
     */
    if (collection.uid) {
      this.setState({
        activeStep: 2,
        isLoading: true,
        ...newState
      });
      this.loadOwnVersions({ collectionUid: collection.uid })
        .then((versions) => {
          this.setState({
            selectedOptions: {
              ...this.state.selectedOptions,
              versionId: _.get(versions, '0.id')
            },
            isLoading: false,
            ownVersions: versions
          }, () => {
            this.refs.content.onCollectionSelect && this.refs.content.onCollectionSelect();
          });
        })
        .catch((err) => {
          this.setState({ isLoading: false, errorFetchingVersions: true });
        });
    }
    else {
      this.setState({
        ...newState,
        activeStep: 2,
        isLoading: false
      }, () => {
        this.refs.content.onCollectionSelect && this.refs.content.onCollectionSelect();
      });
    }
  }

  handleSelectEnvironment (environmentId) {
    this.setState((state) => {
      return {
        selectedOptions: {
          ...state.selectedOptions,
          environmentId: _.isEqual(environmentId, 'no-environment') ? '' : environmentId
        }
      };
    });
  }

  handleSelectVersion (versionId) {
    this.setState((state) => {
      return {
        selectedOptions: {
          ...state.selectedOptions,
          versionId
        }
      };
    });
  }

  handleRequestChange (requests) {
    this.trackedState.set({
      requests: _.map(requests, (request) => {
        return {
          method: request.method,
          url: request.url,
          code: parseInt(request.code),
          response: request.response,
          description: request.description,
          requestBody: request.requestBody
        };
      })
    });
  }

  handleMockNameChange (name) {
    this.setState((state) => {
      return {
        selectedOptions: {
          ...state.selectedOptions,
          name
        },
        isNameEmpty: _.isEmpty(name)
      };
    });
  }

  handlePrivateChange (isPrivate) {
    this.setState((state) => {
      return {
        selectedOptions: {
          ...state.selectedOptions,
          isPrivate
        }
      };
    });
  }

  handleDelayChange (delay) {
    let maximumDelay = 0,
      delayDurationError = false;

    if (!_.isNull(delay)) {
      if (delay.duration && _.isNaN(parseInt(delay.duration))) {
        delay.duration = '';
      }

      maximumDelay = _.get(this.state, `configOptions.delay.${delay.type || this.state.selectedOptions.delay.type}.max`);
      delayDurationError = !delay.preset && !(parseInt(delay.duration) <= maximumDelay);
      delay.duration = delay.duration ? parseInt(delay.duration) : delay.duration;
    }

    this.setState((state) => {
      return {
        selectedOptions: {
          ...state.selectedOptions,
          delay: _.isNull(delay) ? delay : {
            ...state.selectedOptions.delay,
            ...delay
          }
        },
        delayDurationError,
        maximumDelay
      };
    });
  }

  handleCreateEnvironmentChange (createEnvironment) {
    this.setState((prevState) => {
      return {
        selectedOptions: {
          ...prevState.selectedOptions,
          createEnvironment
        }
      };
    });
  }

  handleCreate () {
    if (!getStore('SyncStatusStore').isSocketConnected) {
      pm.toasts.error('Unable to create mock');
      return;
    }

    if (this.state.activeSource === 'new' && _.isEmpty(this.state.selectedOptions.name)) {
      return;
    }

    if (_.isEmpty(this.state.selectedOptions.collectionId)) {
      this.constructCollection((collectionId) => {
        this.disposer = onChangesetResponse({
          model: 'collection',
          action: 'import',
          modelId: collectionId
        }, (err) => {
          this.disposer();
          if (err) {
            return;
          }

          this.constructMock((error) => {
            !error && this.state.selectedOptions.createEnvironment && this.constructEnvironment();
          });
        });
      });
    }
    else {
      this.constructMock((err) => {
        !err && this.state.selectedOptions.createEnvironment && this.constructEnvironment();
      });
    }

    this.setState({ activeStep: 3 }, () => {
      this.trackedState.reset({
        requests: this.trackedState.get('requests')
      });
    });
  }

  handleVersionFetchRetry () {
    this.setState({ isLoading: true, errorFetchingVersions: false }, () => {
      this.loadOwnVersions({
        collectionUid: `${_.get(this.state, 'selectedOptions.ownerId')}-${_.get(this.state, 'selectedOptions.collectionId')}`
      })
      .then((versions) => {
        this.setState({
          ownVersions: versions,
          isLoading: false,
          selectedOptions: {
            ...this.state.selectedOptions,
            versionId: _.get(versions, '0.id')
          }
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false, errorFetchingVersions: true });
      });
    });
  }

  handleRetry () {
    if (!getStore('SyncStatusStore').isSocketConnected) {
      return;
    }

    if (this.state.collectionStatus.error) {
      this.setState({
        collectionStatus: {
          error: false,
          loading: true
        },
        mockStatus: {
          error: false,
          loading: true
        }
      }, () => {
        this.constructCollection((collectionId) => {
          this.disposer = onChangesetResponse({
            model: 'collection',
            action: 'import',
            modelId: collectionId
          }, (err) => {
            this.disposer();
            if (err) {
              return;
            }

            this.constructMock();
          });
        });
      });
    }
    else if (this.state.mockStatus.error) {
      this.setState({
        mockStatus: {
          error: false,
          loading: true
        }
      }, () => {
        this.constructMock();
      });
    }
  }

  handleBack (activeStep) {
    if (activeStep === 0) {
      this.handleDirtyStateOnClose();
      return NavigationService.transitionTo(OPEN_CREATE_NEW_IDENTIFIER);
    }

    this.setState({
      activeStep,
      startStep: activeStep,
      selectedOptions: {
        ...this.state.selectedOptions,
        createEnvironment: true,
        name: ''
      }
    });
  }

  handleOfflineRetry () {
    if (!getStore('SyncStatusStore').isSocketConnected) {
      return;
    }

    if (this.state.activeStep === 2) {
      this.handleCreate();
    }
  }

  async constructCollection (callback) {
    let { id: ownerId } = await UserController.get(),
      collection = {
        name: this.state.selectedOptions.name.trim(),
        id: util.guid(),
        owner: ownerId
      },
      isOriginRequests = this.state.startStep === 1,
      requests = _.map(this.trackedState.get('requests'),
        (request) => {
          let requestObject = {
            url: isOriginRequests ? '{{url}}/' + request.url : request.url,
            method: request.method || 'GET',
            data: request.requestBody,
            dataMode: 'raw'
          };
          return {
            ...requestObject,
            id: util.guid(),
            collectionId: collection.id,
            name: request.url,
            isFromCollection: true,
            time: new Date().getTime(),
            description: request.description || '',
            responses: [
              {
                id: util.guid(),
                name: 'Default',
                status: request.code,
                text: request.response,
                responseCode: {
                  code: parseInt(request.code),
                  name: _.join(_.drop(_.split(request.code, ' '), 1), ' ')
                },
                requestObject
              }
            ]
          };
      }),
      order = _.map(requests, 'id');

    _.assign(collection, { requests, order });

    let getOriginMeta = (from) => {
          if (from.startsWith('history')) {
            return 'history/mock';
          }

          return from === 'create_new_x' ? 'cnx' : from;
        },
        collectionEvent = createEvent(
          'create_deep',
          'collection',
          { collection },
          null,
          { origin: getOriginMeta(this.state.from) }
        );

    try {
      let response = await dispatchUserAction(collectionEvent);
      if (!_.isEmpty(_.get(response, 'error'))) {
        pm.logger.error('Error in creating mock', response.error);
        return;
      }

      this.setState((state) => {
        return {
          selectedOptions: {
            ...state.selectedOptions,
            collectionId: collection.id,
            ownerId: collection.owner
          },
          collectionStatus: {
            ...state.collectionStatus,
            loading: false,
            error: false
          }
        };
      }, () => {
        callback && callback(collection.id);
      });
    }
    catch (err) {
      pm.logger.error('Error in pipeline for creating mock', err);
    }
  }

  constructMock (callback) {
    let selectedOptions = this.state.selectedOptions,
        selectedEnvironment = null;

    return CollectionController.getCollection({ id: selectedOptions.collectionId })
      .then(({ id, owner }) => {
        let uuid = `${owner}-${id}`,
          mockData;

        if (!_.isEmpty(selectedOptions.environmentId)) {
          let environment = getStore('EnvironmentStore').find(selectedOptions.environmentId);
            selectedEnvironment = environment.uid;
        }

        mockData = {
          collection: uuid,
          private: selectedOptions.isPrivate,
          name: selectedOptions.name,
          versionTag: selectedOptions.versionId
        };

        if (selectedEnvironment) {
          mockData.environment = selectedEnvironment;
        }

        if (!_.isEmpty(selectedOptions.delay)) {
          mockData.config = { delay: selectedOptions.delay };
        }

        const currentWorkspaceId = getStore('ActiveWorkspaceStore').id;

        createMock(currentWorkspaceId, mockData)
        .then((mockData) => {
          this.setState((state) => {
            return {
              selectedOptions: {
                ...state.selectedOptions,
                mockUrl: mockData && mockData.url
              },
              mockStatus: {
                ...state.mockStatus,
                loading: false,
                error: false
              },
              saveToActivity: true,
              mockId: mockData && mockData.id
            };
          }, () => {
            AnalyticsService.addEventV2({
              category: 'mock',
              action: 'confirm_create',
              label: this.state.from,
              entityId: mockData && mockData.id,
              traceId: this.state.traceId
            });

            this.onSuccess && this.onSuccess();

            NavigationService.transitionTo(
              'build.mock',
              { mockId: mockData.id },
              {},
              { additionalContext: { origin: 'history_create_modal_redirect', traceId: this.state.traceId } }
            );

            _.isFunction(callback) && callback();
          });
        })
        .catch(() => {
          this.setState((state) => {
            return {
              mockStatus: {
                ...state.mockStatus,
                loading: false,
                error: true
              }
            };
          }, () => {
            _.isFunction(callback) && callback(true);
          });
        });
      });
  }

  constructEnvironment (callback) {
    let id = util.guid(),
        currentUser = getStore('CurrentUserStore');
    let createEnvironmentEvent = {
      name: 'create',
      namespace: 'environment',
      data: {
        id: id,
        name: this.state.selectedOptions.name.trim(),
        values: [{
          enabled: true,
          key: 'url',
          value: this.state.selectedOptions.mockUrl,
          type: 'text'
        }],
        owner: currentUser.id
      }
    };

    dispatchUserAction(createEnvironmentEvent);
    this.setState((state) => {
      return {
        selectedOptions: {
          ...state.selectedOptions,
          environmentId: id
        },
        environmentStatus: {
          ...state.environmentStatus,
          loading: false,
          error: false
        }
      };
    }, () => {
      _.isFunction(callback) && callback();
    });
  }

  getStepClasses (step) {
    return classnames({ 'is-done': this.state.activeStep > step, 'incomplete-tab-steps': this.state.activeStep < step });
  }

  render () {
    let currentUser = getStore('CurrentUserStore'),
      isLoggedIn = currentUser && currentUser.isLoggedIn,
      isSyncEnabled = getStore('GateKeeperStore').isSyncEnabled,
      isOffline = !getStore('SyncStatusStore').isSocketConnected,
      isUserBilling = _.get(this.state, 'permissions.managePayment', false),
      isUserDelinquent = currentUser.isUserDelinquent;

    return (
      <XPath identifier='createMockModal' isVisible={this.state.isOpen}>
        <Modal
          className='create-new-mock-modal'
          isOpen={this.state.isOpen}
          onRequestClose={this.handleDirtyStateOnClose}
          customStyles={this.getStyles()}
        >
          <ModalHeader>
            <Tabs
              type='primary'
              defaultActive={1}
              activeRef={this.state.activeStep}
            >
              <Tab
                className={this.getStepClasses(1)}
                refKey={1}
              >
                { this.state.activeStep <= 1 ? '1.' : <SuccessIcon size='xs' /> }
                <span>&nbsp;Select a collection to mock</span>
              </Tab>
              <Tab
                className={this.getStepClasses(2)}
                refKey={2}
              >
                { this.state.activeStep <= 2 ? '2.' : <SuccessIcon size='xs' /> }
                <span>&nbsp;Set up the mock server</span>
              </Tab>
              <Tab
                className={this.getStepClasses(3)}
                refKey={3}
              >
                { this.state.activeStep <= 3 ? '3.' : <SuccessIcon size='xs' /> }
                <span>&nbsp;Next steps</span>
              </Tab>
            </Tabs>
          </ModalHeader>
          <ModalContent className={`step${this.state.activeStep}`}>
            {
              isLoggedIn &&
                <CreateNewMockModal
                  ref='content'
                  activeStep={this.state.activeStep}
                  activeSource={this.state.activeSource}
                  errorFetchingVersions={this.state.errorFetchingVersions}
                  isOffline={isOffline}
                  isSyncEnabled={isSyncEnabled}
                  isUserBilling={isUserBilling}
                  isUserDelinquent={isUserDelinquent}
                  isLoading={this.state.isLoading}
                  mockId={this.state.mockId}
                  permissionsLoading={this.state.permissionsLoading}
                  onChangeSource={this.handleChangeSource}
                  onOfflineRetry={this.handleOfflineRetry}
                  ownCollections={this.state.ownCollections}
                  ownEnvironments={this.state.ownEnvironments}
                  ownVersions={this.state.ownVersions}
                  onSelectCollection={this.handleSelectCollection}
                  onSelectEnvironment={this.handleSelectEnvironment}
                  onSelectVersion={this.handleSelectVersion}
                  selectedOptions={this.state.selectedOptions}

                  onRequestChange={this.handleRequestChange}
                  onMockNameChange={this.handleMockNameChange}
                  onMockPrivateChange={this.handlePrivateChange}
                  onMockDelayChange={this.handleDelayChange}
                  onCreateMock={this.handleCreate}
                  onRetry={this.handleRetry}
                  onVersionFetchRetry={this.handleVersionFetchRetry}
                  onConfigFetchRetry={this.fetchAndSetConfigOptions}
                  onClose={this.handleClose}
                  onCreateEnvironmentChange={this.handleCreateEnvironmentChange}

                  mockStatus={this.state.mockStatus}
                  collectionStatus={this.state.collectionStatus}
                  environmentStatus={this.state.environmentStatus}
                  configStatus={this.state.configStatus}

                  configOptions={this.state.configOptions}
                  delayDurationError={this.state.delayDurationError}
                  maximumDelay={this.state.maximumDelay}
                  isNameEmpty={this.state.isNameEmpty}
                />
            }
          </ModalContent>
          {
            isLoggedIn &&
              isSyncEnabled &&
              !this.state.isLoading &&
              !this.state.errorFetchingVersions &&
              !this.state.collectionStatus.error &&
              !this.state.mockStatus.error &&
              !this.state.configStatus.error &&
              !this.state.configStatus.loading &&
              !isOffline &&
              (this.state.activeStep === 1 || this.state.activeStep === 2 || this.state.activeStep === 3) &&
                <ModalFooter className={`step${this.state.activeStep}`}>
                {
                  this.state.activeStep === 1 &&
                    <div className='create-new-mock-modal__footer'>
                      <XPath identifier='next'>
                        <Button
                          type='primary'
                          disabled={_.isEmpty(this.trackedState.get('requests')) || this.state.activeSource !== 'new'}
                          onClick={this.handleSelectCollection}
                        >Next</Button>
                      </XPath>
                      <XPath identifier='back'>
                        <Button
                          type='secondary'
                          onClick={this.handleBack.bind(this, 0)}
                        >Back</Button>
                      </XPath>
                    </div>
                }

                {
                  this.state.activeStep === 2 &&
                    <div className='create-new-mock-modal__footer'>

                      <div>
                        <XPath identifier='back'>
                          <Button
                            type='secondary'
                            onClick={this.handleBack.bind(this, 1)}
                          >Back</Button>
                        </XPath>
                        <XPath identifier='create'>
                          <Button
                            type='primary'
                            disabled={!this.state.selectedOptions.name || this.state.delayDurationError}
                            onClick={this.handleCreate}
                          >
                            Create Mock Server
                          </Button>
                        </XPath>
                      </div>
                    </div>
                }

                {
                  this.state.activeStep === 3 &&
                    <div className='create-new-mock-modal__footer'>
                      <XPath identifier='close'>
                        <Button
                          type='primary'
                          onClick={this.handleClose}
                        >
                          Close
                        </Button>
                      </XPath>
                    </div>
                }
                </ModalFooter>
          }
        </Modal>
      </XPath>
    );
  }
}
