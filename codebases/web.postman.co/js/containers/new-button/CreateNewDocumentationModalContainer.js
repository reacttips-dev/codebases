import React, { Component } from 'react';
import classnames from 'classnames';
import { Tabs, Tab } from '../../components/base/Tabs';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/base/Modals';
import { Button } from '../../components/base/Buttons';
import SuccessIcon from '../../components/base/Icons/SuccessIcon';
import util from '../../utils/util';
import CreateNewDocumentationModal from '../../components/new-button/CreateNewDocumentationModal';
import AnalyticsService from '../../modules/services/AnalyticsService';
import NavigationService from '../../services/NavigationService';
import CollectionPermissionService from '@@runtime-repl/collection/CollectionPermissionService';
import { createEvent } from '../../modules/model-event';
import dispatchUserAction from '../../modules/pipelines/user-action';
import UserController from '../../modules/controllers/UserController';
import { getStore } from '../../stores/get-store';
import { observer } from 'mobx-react';
import { TrackedState, bindTrackedStateToComponent } from '../../modules/tracked-state/TrackedState';
import { getEntityUid } from '../../../documentation/utils/utils';
import { DOCUMENTATION_ENTITY } from '../../../documentation/constants';
import { composeUID } from '../../utils/uid-helper';
import { OPEN_CREATE_NEW_IDENTIFIER } from '../../../onboarding/navigation/constants';

let initialState = {
  isOpen: false,
  activeStep: 1,
  activeSource: 'new',
  ownCollections: [],
  ownEnvironments: [],
  selectedOptions: {
    name: '',
    collectionId: '',
    environmentId: '',
    collectionUid: ''
  },
  from: 'create_new_x',
  collectionStatus: {
    loading: true,
    error: false
  },
  userStatus: {},
  saveToActivity: false,
  workspaceId: null
},
initialDescription = '# Introduction\nWhat does your API do?\n\n# Overview\nThings that the developers should know about\n\n# Authentication\nWhat is the preferred way of using the API?\n\n# Error Codes\nWhat errors and status codes can a user expect?\n\n# Rate limit\nIs there a limit to the number of requests an user can send?';

@observer
export default class CreateNewDocumentationModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = initialState;

    this.trackedState = new TrackedState({
      description: initialDescription,
      requests: []
    });

    bindTrackedStateToComponent(this.trackedState, this);

    this.loadWorkspaceCollections = this.loadWorkspaceCollections.bind(this);
    this.loadOwnEnvironments = this.loadOwnEnvironments.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeSource = this.handleChangeSource.bind(this);

    this.handleSelectCollection = this.handleSelectCollection.bind(this);
    this.handleSelectEnvironment = this.handleSelectEnvironment.bind(this);
    this.handleRequestChange = this.handleRequestChange.bind(this);

    this.handleCollectionNameChange = this.handleCollectionNameChange.bind(this);
    this.handleCollectionDescriptionChange = this.handleCollectionDescriptionChange.bind(this);
    this.handleDirtyStateOnClose = this.handleDirtyStateOnClose.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
    this.handleBack = this.handleBack.bind(this);

    this.constructCollection = this.constructCollection.bind(this);
    this.constructDocumentation = this.constructDocumentation.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('openCreateNewDocumentationModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('openCreateNewDocumentationModal', this.handleOpen);
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
    let ownCollections = getStore('ActiveWorkspaceStore').collections,
        accessibleCollections = _.filter(ownCollections, (collection) => {
          return getStore('PermissionStore').can('edit', 'collection', collection.id);
        });

    this.setState({ ownCollections: accessibleCollections });
  }

  loadOwnEnvironments () {
    let ownEnvironments = getStore('ActiveWorkspaceStore').environments,
        sortedEnvironments = _.sortBy(ownEnvironments, (environment) => {
          return environment.name.toLowerCase();
        }),
        allEnvironments = _.concat({ id: null, name: 'No Environment' }, sortedEnvironments);

    this.setState({ ownEnvironments: allEnvironments });
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
      description: initialDescription,
      requests: []
    });
  }

  handleSaveToActivity () {
    if (!this.state.saveToActivity) {
      return;
    }
    let options = _.pick(this.state.selectedOptions, ['name', 'collectionId', 'environmentId']);
    let metaObj = {
      activeSource: this.state.activeSource,
      collectionStatus: this.state.collectionStatus,
      selectedOptions: options
    };
    pm.mediator.trigger('saveXFlowActivity', 'documentation', metaObj);
  }

  handleOpen (openState = {}) {
    let requests = _.get(openState.selectedOptions, 'requests', []);

    this.setState({
      ...initialState,
      ...openState,
      selectedOptions: {
        ...initialState.selectedOptions,
        ...openState.selectedOptions
      },
      isOpen: true
    }, () => {
      AnalyticsService.addEvent('documenter', 'initiate_add', this.state.from);
    });

    this.trackedState.reset({
      description: initialDescription,
      requests: requests
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
            collectionId: collection.id,
            name: collection.name,
            description: _.isEmpty(collection.description) ? this.trackedState.get('description') : collection.description
          }
        };
        if (!_.isEmpty(collection.description)) {
          newState.selectedOptions.description = collection.description;

          this.trackedState.reset({
            description: collection.description
          });
        }
        break;
    }

    this.loadOwnEnvironments();
    this.setState({
      ...newState,
      activeStep: 2
    }, () => {
      this.refs.content.onCollectionSelect && this.refs.content.onCollectionSelect();
    });
  }

  handleSelectEnvironment (environmentId) {
    this.setState((state) => {
      return {
        selectedOptions: {
          ...state.selectedOptions,
          environmentId
        }
      };
    });
  }

  handleRequestChange (requests) {
    this.trackedState.set({ requests: _.map(requests, (request) => {
      return {
        url: request.url,
        method: request.method,
        description: request.description,
        code: request.code,
        response: request.response,
        requestBody: request.requestBody
      };
    })
    });
  }

  handleCollectionNameChange (name) {
    this.setState((state) => {
      return {
        selectedOptions: {
          ...state.selectedOptions,
          name
        }
      };
    });
  }

  handleCollectionDescriptionChange (description) {
    this.trackedState.set({ description: description });
  }

  handleCreate () {
    if (_.isEmpty(this.state.selectedOptions.name)) {
      return;
    }

    if (_.isEmpty(this.state.selectedOptions.collectionId)) {
      this.constructCollection(() => {
        this.constructDocumentation();
      });
    }
    else {
      this.updateCollection(() => {
        this.constructDocumentation();
      });
    }

    this.setState({ activeStep: 3 }, () => {
      // Resetting the initial state to a new state. Now the point of reference is the new state
      this.trackedState.reset({
        description: this.trackedState.get('description'),
        requests: this.trackedState.get('requests')
      });
    });
  }

  handleRetry () {
    if (this.state.collectionStatus.error) {
      this.setState({
        collectionStatus: {
          error: false,
          loading: true
        }
      }, () => {
        this.constructCollection(() => {
          this.constructDocumentation();
        });
      });
    }
  }

  handleBack (activeStep) {
    if (activeStep === 0) {
      this.handleClose();
      return NavigationService.transitionTo(OPEN_CREATE_NEW_IDENTIFIER);
    }

    this.setState({ activeStep });
  }

  async constructCollection (callback) {
    let { id: ownerId } = await UserController.get(),
      collection = {
        id: util.guid(),
        name: this.state.selectedOptions.name,
        description: this.trackedState.get('description'),
        owner: ownerId
      },
      requests = _.map(this.trackedState.get('requests'),
        (request) => {
          let requestObject = {
            url: request.url,
            method: request.method || 'GET',
            data: request.requestBody,
            dataMode: 'raw'
          };
          return {
            ...requestObject,
            id: util.guid(),
            collection: collection.id,
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
            return 'history/document';
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
        pm.logger.error('Error in creating documenter', response.error);
        return;
      }

      this.setState((state) => {
        return {
          selectedOptions: {
            ...state.selectedOptions,
            collectionId: collection.id,
            collectionUid: composeUID(collection.id, collection.owner)
          },
          collectionStatus: {
            ...state.collectionStatus,
            loading: false,
            error: false
          }
        };
      }, () => {
        callback && callback();
      });
    }
    catch (err) {
      pm.logger.error('Error in pipeline for creating documenter', err);
    }
  }

  updateCollection (callback) {
    let updateCollectionEvent = {
      name: 'update',
      namespace: 'collection',
      data: {
        id: _.get(this, 'state.selectedOptions.collectionId'),
        description: this.trackedState.get('description')
      }
    };

    dispatchUserAction(updateCollectionEvent)
    .then((response) => {
      if (!_.isEmpty(_.get(response, 'error'))) {
        pm.logger.error('Error in updataing collection description', response.error);
        return;
      }
      _.isFunction(callback) && callback();
    })
    .catch((err) => {
      _.isFunction(callback) && callback();
      pm.logger.error('Error in pipeline while updataing collection description', err);
    });
  }

  constructDocumentation (callback) {
    try {
      let selectedOptions = this.state.selectedOptions;
      let collectionUid = selectedOptions.collectionUid;
      if (_.isEmpty(collectionUid)) {
        const collectionId = _.get(selectedOptions, 'collectionId');
        collectionUid = getEntityUid(DOCUMENTATION_ENTITY.COLLECTION, collectionId);
      }
        this.setState((state) => {
          return {
            selectedOptions: {
              ...state.selectedOptions,
              collectionUid
            },
            collectionStatus: {
              ...state.collectionStatus,
              loading: false,
              error: false
            },
            saveToActivity: true
          };
        }, () => {
          AnalyticsService.addEvent('documenter', 'confirm_add', this.state.from);

          AnalyticsService.addEventV2({
            category: 'documentation',
            action: 'create_documentation',
            label: 'cnx',
            entityType: 'collection',
            entityId: collectionUid
          });

          pm.mediator.trigger('focusCollectionInSideBar', selectedOptions.collectionId, 'Documentation');
      });
    } catch (error) {
        pm.logger.error('Error in constructing documentation', error);
    }
  }

  getStepClasses (step) {
    return classnames({ 'is-done': this.state.activeStep > step, 'incomplete-tab-steps': this.state.activeStep < step });
  }

  render () {
    let currentUser = getStore('CurrentUserStore'),
        isLoggedIn = currentUser && currentUser.isLoggedIn,
        isSyncEnabled = getStore('GateKeeperStore').isSyncEnabled;

    return (
      <Modal
        className='create-new-documentation-modal'
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
            <Tab className={this.getStepClasses(1)} refKey={1}>{ this.state.activeStep <= 1 ? '1.' : <SuccessIcon size='xs' /> }<span>&nbsp;Select a collection to document</span></Tab>
            <Tab className={this.getStepClasses(2)} refKey={2}>{ this.state.activeStep <= 2 ? '2.' : <SuccessIcon size='xs' /> }<span>&nbsp;Write documentation</span></Tab>
            <Tab className={this.getStepClasses(3)} refKey={3}>{ this.state.activeStep <= 3 ? '3.' : <SuccessIcon size='xs' /> }<span>&nbsp;Next steps</span></Tab>
          </Tabs>
        </ModalHeader>
        <ModalContent className={`step${this.state.activeStep}`}>
          {
            isLoggedIn && isSyncEnabled &&
              <CreateNewDocumentationModal
                ref='content'
                activeStep={this.state.activeStep}
                activeSource={this.state.activeSource}
                collectionDescription={this.trackedState.get('description')}
                onChangeSource={this.handleChangeSource}
                ownCollections={this.state.ownCollections}
                ownEnvironments={this.state.ownEnvironments}
                onSelectCollection={this.handleSelectCollection}
                onSelectEnvironment={this.handleSelectEnvironment}
                selectedOptions={this.state.selectedOptions}

                onRequestChange={this.handleRequestChange}
                onRequestCreate={this.handleRequestCreate}
                onRequestDelete={this.handleRequestDelete}
                onCollectionNameChange={this.handleCollectionNameChange}
                onCollectionDescriptionChange={this.handleCollectionDescriptionChange}
                onCreateCollection={this.handleCreate}
                onRetry={this.handleRetry}
                onClose={this.handleClose}

                collectionStatus={this.state.collectionStatus}
              />
          }
        </ModalContent>
        {
          isLoggedIn &&
            isSyncEnabled &&
            !this.state.collectionStatus.error &&
            (this.state.activeStep === 1 || this.state.activeStep === 2 || this.state.activeStep === 3) &&
              <ModalFooter className={`step${this.state.activeStep}`}>
              {
                this.state.activeStep === 1 &&
                  <div className='create-new-monitor-modal__footer'>
                    <Button
                      type='primary'
                      disabled={_.isEmpty(this.trackedState.get('requests')) || this.state.activeSource !== 'new'}
                      onClick={this.handleSelectCollection}
                    >Next</Button>
                    <Button
                      type='secondary'
                      onClick={this.handleBack.bind(this, 0)}
                    >Back</Button>
                  </div>
              }

              {
                this.state.activeStep === 2 &&
                  <div className='create-new-monitor-modal__footer'>
                    <div>
                      <Button
                        type='secondary'
                        onClick={this.handleBack.bind(this, 1)}
                      >Back</Button>
                      <Button
                        type='primary'
                        disabled={_.isEmpty(this.state.selectedOptions.name)}
                        onClick={this.handleCreate}
                      >Save</Button>
                    </div>
                  </div>
              }

              {
                this.state.activeStep === 3 &&
                  <div className='create-new-monitor-modal__footer'>
                    <Button
                      type='primary'
                      onClick={this.handleClose}
                    >Close</Button>
                  </div>
              }
              </ModalFooter>
        }
      </Modal>
    );
  }
}
