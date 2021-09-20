import React, { Component } from 'react';
import { observer } from 'mobx-react';

import ForkCollectionModal from '../../components/collections/ForkCollectionModal';
import { Button } from '../../components/base/Buttons';
import LoadingIndicator from '../../components/base/LoadingIndicator';
import { Modal, ModalHeader, ModalContent } from '../../components/base/Modals';
import Alert from '../../components/messaging/Alert';
import { getStore } from '../../stores/get-store';
import dispatchUserAction from '../../modules/pipelines/user-action';
import { createEvent } from '../../modules/model-event';
import WorkspaceSwitchService from '../../services/WorkspaceSwitchService';
import AnalyticsService from '../../modules/services/AnalyticsService';
import XPath from '../../components/base/XPaths/XPath';
import EditorService from '../../services/EditorService';
import { requestResourceId } from '../../utils/EditorUtils';
import { reaction, when } from 'mobx';
import NavigationService from '../../services/NavigationService';
import { WORKFLOW_IDENTIFIER } from '@@runtime-repl/_common/NavigationConstants';
import { getRequestUIDFromRequestID } from '../../utils/uid-helper';
import { checkContextAndNavigate } from '../../../appsdk/utils/NavigationUtils';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong while forking collection, please try again',
  defaultState = {
    isLoading: false,
    isOpen: false,
    hasError: false,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    forkLabel: '',
    collectionUid: null,
    selectedWorkspace: ''
  },
  updatedModelConfig = {
    request: {
      canOpenInTab: true,
      store: 'RequestStore'
    }
  },
  REQUEST = 'request';

@observer
export default class ForkCollectionModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = defaultState;

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleForkLabelChange = this.handleForkLabelChange.bind(this);
    this.handleSelectedWorkspaceChange = this.handleSelectedWorkspaceChange.bind(this);
    this.handleForkCollection = this.handleForkCollection.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showForkCollectionModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showForkCollectionModal', this.handleOpen);
  }

  handleClose () {
    this.setState(defaultState);

    this._options = null;

    this._workspaceChangeReactionDisposer && this._workspaceChangeReactionDisposer();
    this._modelReactionDisposer && this._modelReactionDisposer();
  }

  /**
   * Handles opening of fork modal.
   *
   * @param {String} uid - id of collection which would be forked
   * @param {Object} options - options
   * @param {Object} options.forkUpdates - data to be updated in the forked collection
   */
  handleOpen (uid, options) {
    if (!getStore('CurrentUserStore').isLoggedIn) {
      pm.mediator.trigger('showSignInModal', {
        type: 'fork',
        origin: 'fork_collection_modal'
      });
      return;
    }

    this._options = options;

    this.setState({
      isOpen: true,
      selectedWorkspace: getStore('ActiveWorkspaceStore').id,
      collectionUid: uid
    });
  }

  handleError (errorMessage) {
    this.setState({
      hasError: true,
      isLoading: false,
      errorMessage: errorMessage || DEFAULT_ERROR_MESSAGE
    });
  }

  handleSelectedWorkspaceChange (selectedWorkspace) {
    this.setState({ selectedWorkspace });
  }

  handleForkLabelChange (value) {
    this.setState({
      forkLabel: value
    });
  }

  /**
   * Get the new id of updated models in the forked collection from the meta of sync server's
   * response.
   *
   * @param {Object} responseObj - contains meta fetched from sync server
   */
  _getUpdatedModelIds (responseObj) {
    const responseMeta = _.get(responseObj, ['response', 'events', '0', 'meta'], {}),

      /**
       * Structure of `transformations` object:
       *
       * {
       *  request: {
       *    update: {
       *      1234: { id: 1234 },
       *      7890: { id: 7890 }
       *    },
       *    create: {
       *      2345: { id: 2345 },
       *      3456: { id: 3456 }
       *    }
       *  }
       * }
       */
      transformations = _.get(responseMeta, 'transformations');

    let updatedModelIds = {};

    // Iterate through each model (request, response, folder)
    _.forEach(transformations, (actions, model) => {
      if (!updatedModelIds[model]) {
        _.set(updatedModelIds, model, []);
      }

      // Iterate through each action (update, create) of the model
      _.forEach(Object.values(actions || {}), (modelDetails) => {
        updatedModelIds[model].push(...(_.map(modelDetails, 'id')));
      });
    });

    return updatedModelIds;
  }

  handleForkCollection (selectedWorkspaceId, selectedWorkspaceVisibility) {
    this.setState({
      isLoading: true,
      hasError: false,
      selectedWorkspace: selectedWorkspaceId
    });

    const eventData = {
      forkModel: 'forkedcollection',
      forkedcollection: {
        id: this.state.collectionUid,
        forkLabel: this.state.forkLabel
      },
      model: 'collection',
      workspace: selectedWorkspaceId
    };

    if (this._options && this._options.forkUpdates) {
      // creating payload to be sent to sync server, forkUpdates object contains data that is to be
      // updated in the forked collection.
      eventData.forkedcollection.forkUpdates = this._options.forkUpdates;
    }

    const forkCollectionEvent = createEvent('createOnSync', 'forkedcollection', eventData);

    return dispatchUserAction(forkCollectionEvent)
      .then((response) => {
        if (!_.isEmpty(_.get(response, 'error'))) {
          this.handleError();
          pm.logger.warn('ForkCollectionModalContainer~handleForkCollection: Error in forking collection', response.error);

          return;
        }

        const forkedCollectionId = _.get(response, ['response', 'events', 0, 'data', 'uid']);

        // Add analytics event to show that fork is successful
        AnalyticsService.addEventV2({
          category: 'collection',
          action: 'successful_fork',
          label: 'collection_sidebar'
        });

        // flow in which collection is forked and model(request, reponse etc.) is updated
        // @todo to be replaced by NavigationService.transitionTo('build.request') when supported
        if (this._options && this._options.forkUpdates) {
          const activeWorkspaceSessionStore = getStore('ActiveWorkspaceSessionStore'),
            activeWorkspaceStore = getStore('ActiveWorkspaceStore'),
            currentWorkspaceId = activeWorkspaceStore.id,
            currentWorkspaceVisibility = activeWorkspaceStore.visibilityStatus,
            currentEditorId = activeWorkspaceSessionStore.activeEditor,
            updatedModelIds = this._getUpdatedModelIds(response),

            // for now, only request is being updated
            modelId = _.get(updatedModelIds, [REQUEST, '0'], ''),
            modelConfig = updatedModelConfig[REQUEST];

          // full page refresh so reactions will be lost
          // @todo use NavigationService.transitionTo('build.request') when supported
          if (currentWorkspaceVisibility === 'public' && selectedWorkspaceVisibility !== 'public') {
            checkContextAndNavigate(`${pm.artemisUrl}/workspace/${selectedWorkspaceId}/request/${modelId}`);

            return;
          }

          // unitl the updated request has been populated in db
          this._modelReactionDisposer = reaction(
            () => getStore(modelConfig.store).find(modelId),
            (model) => {
              if (currentWorkspaceId === selectedWorkspaceId) {
                if (modelConfig.canOpenInTab) {
                  getRequestUIDFromRequestID(modelId)
                    .then((requestUid) => {
                      NavigationService.transitionTo(WORKFLOW_IDENTIFIER.OPEN_REQUEST, { rid: requestUid }, {}, { tabOptions: { openIn: currentEditorId } });
                    });
                }

                this.handleClose();
              }
              else {
                WorkspaceSwitchService.switchWorkspace(selectedWorkspaceId)
                  .then(() => {
                    // close the existing tab
                    EditorService.close({ id: currentEditorId }, { force: true });

                    // While trying to switch workspace the promise is resolved in
                    // WorkspaceSwitcherService.switchWorkspace, but there is a time lag in switched
                    // workspace becoming active workspace after the promise has been resolved.
                    // This reaction is added to wait till the actual workspace switching happens.
                    // Once, the workspace is switched, the updated request is opened in the
                    // switched workspace.
                    this._workspaceChangeReactionDisposer = when(
                      () => getStore('ActiveWorkspaceStore').id === selectedWorkspaceId,
                      () => {
                        if (modelConfig.canOpenInTab) {
                          getRequestUIDFromRequestID(modelId)
                            .then((requestUid) => {
                              NavigationService.transitionTo(WORKFLOW_IDENTIFIER.OPEN_REQUEST, { rid: requestUid }, {}, { tabOptions: { forceNew: true } });
                            });
                        }

                        this.handleClose();
                      }
                    );
                  });
              }
            }
          );
        }

        // If there is nothing to be updated in the forked collection
        // or no request has to be opened, then normal fork flow,
        // just a collection is forked
        else {

          // IMPORTANT: Close the active modal first
          // and then initiate navigation to the new route
          // Because closing the modal tries to update the URL of the active tab
          // doing it in the middle of another transition can cause odd side effects
          // and race conditions
          // TODO: This ordering dependency should be eliminated by making
          // the modals have proper support for URLs and removing URL side effects
          this.handleClose();

          // Base URL for redirection
          let redirectURL = `${pm.artemisUrl}/workspace/${selectedWorkspaceId}`;

          // If forked collection can be found then append the collection slug
          if (forkedCollectionId) {
            redirectURL = `${redirectURL}/collection/${forkedCollectionId}`;
          }

          // Open the URL
          NavigationService.openURL(redirectURL);
        }
      })
      .catch((err) => {
        this.handleError(err.message);
        pm.logger.warn('ForkCollectionModalContainer~handleForkCollection: Error in pipeline for forking collection', err);
        return;
      });
  }

  render () {
    const invalidInput = !this.state.forkLabel || !this.state.selectedWorkspace || this.state.isLoading || !this.state.forkLabel.trim();

    return (
      <XPath identifier='createForkModal' isVisible={this.state.isOpen}>
        <Modal
          className='fork-collection-modal'
          isOpen={this.state.isOpen}
          onRequestClose={this.handleClose}
        >
          <ModalHeader>FORK COLLECTION</ModalHeader>
          <ModalContent className='fork-collection-modal__contents'>
            <ForkCollectionModal
              isLoading={this.state.isLoading}
              loading={this.state.loadingWorkspaces}
              disableForkButton={invalidInput}
              handleClose={this.handleClose}
              handleForkCollection={this.handleForkCollection}
              selectedWorkspaceId={this.state.selectedWorkspace}
              onChangeWorkspace={this.handleSelectedWorkspaceChange}
              onForkCollection={this.handleForkCollection}
              onForkLabelChange={this.handleForkLabelChange}
            />
            {this.state.hasError &&
              <Alert
                message={this.state.errorMessage}
                type='error'
                isDismissable={false}
              />
            }
          </ModalContent>
        </Modal>
      </XPath>
    );
  }
}
