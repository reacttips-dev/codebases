import React, { Component } from 'react';
import _ from 'lodash';

import ForkRecommendationModal from '../../components/collections/ForkRecommendationModal';
import { getStore } from '../../stores/get-store';
import { SAVE_AS, CREATE_FORK } from '../../constants/ForkRecommendationConstants';
import { collectionActions } from '@@runtime-repl/collection/_api/CollectionInterface';
import { ACTION_TYPE_FORK } from '@@runtime-repl/collection/CollectionActionsConstants';
import EditorService from '../../services/EditorService';
import { sanitizeRequest } from '../../modules/sync-helpers/sanitize-collection-model-for-sync';

let requestOptionMap = {};

requestOptionMap[SAVE_AS] = 'Save as';
requestOptionMap[CREATE_FORK] = 'Create Fork';

export default class RecommendForkModalContainer extends Component {

  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      requestOption: SAVE_AS
    };

    this.openModal = this.openModal.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRequestOptionChange = this.handleRequestOptionChange.bind(this);
    this.handleRequestOptionSubmit = this.handleRequestOptionSubmit.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showForkRecommendationModal', this.openModal);
  }

  componentWillUnmount () {
    pm.mediator.off('showForkRecommendationModal', this.openModal);
  }

  /**
   * Handles opening of modal.
   *
   * @param {Object} options - contains current editor id and collection id
   * @param {String} options.editorId - id of the opened tab
   * @param {String} options.collectionId - id of collection to which the request belongs
   */
  openModal (options) {
    const isLoggedIn = getStore('CurrentUserStore').isLoggedIn,
      activeWorkspaceId = getStore('ActiveWorkspaceStore').id,
      canJoinWorkspace = isLoggedIn && getStore('PermissionStore').can('join', 'workspace', activeWorkspaceId);

    this._options = options;

    this.setState({
      isOpen: true,
      requestOption: canJoinWorkspace ? SAVE_AS : CREATE_FORK
    });
  }

  handleClose () {
    this._options = null;

    this.setState({
      isOpen: false,
      requestOption: SAVE_AS
    });
  }

  handleRequestOptionChange (requestOption) {
    this.setState({
      requestOption: requestOption
    });
  }

  /**
   * Sets data to be updated in the new fork by taking the changes that are not saved and existing
   * model details.
   *
   * @param {Object} updates - details of all the models that are going to be updated in fork
   * @param {String} model - model which is to be updated, e.g request, folder etc.
   * @param {String} action - action which updates the model, e.g create, update, delete
   * @param {String} modelId - id of model
   * @param {Object} data - information of the model
   * @param {Object} changes - changes made to a model which are not yet saved
   */
  _createForkUpdates (updates, model, action, modelId, data, changes) {
    let dataTobeUpdated = { ...data, ...changes };

    if (model === 'request') {
      sanitizeRequest(dataTobeUpdated);
    }

    _.set(updates, [model, action, modelId], dataTobeUpdated);
  }

  handleRequestOptionSubmit () {
    if (this.state.requestOption === SAVE_AS) {
      // open save request as modal
      EditorService.requestSave({ id: this._options && this._options.editorId });
    }
    else {
      // open fork modal
      const editorId = this._options && this._options.editorId,
        editor = getStore('EditorStore').find(editorId),
        requestId = editor.model.requestId,
        request = getStore('RequestStore').find(requestId),
        requestChanges = editor.model.resourceToSave();

      let forkUpdates = {};

      this._createForkUpdates(forkUpdates, 'request', 'update', requestId, request, requestChanges);

      collectionActions(_.get(this._options, 'collectionId'),
        ACTION_TYPE_FORK,
        null,
        { forkUpdates, origin: 'recommendation-modal' }
      );
    }

    this.handleClose();
  }

  render () {
    const collectionId = _.get(this._options, 'collectionId', ''),
      collectionName = _.get(getStore('CollectionStore').find(collectionId), 'name'),

      isLoggedIn = getStore('CurrentUserStore').isLoggedIn,
      activeWorkspaceId = getStore('ActiveWorkspaceStore').id,
      canJoinWorkspace = isLoggedIn && getStore('PermissionStore').can('join', 'workspace', activeWorkspaceId);

    return (
      <ForkRecommendationModal
        enableSaveAs={canJoinWorkspace}
        isOpen={this.state.isOpen}
        onClose={this.handleClose}
        onRequestOptionChange={this.handleRequestOptionChange}
        requestOptionButtonText={requestOptionMap[this.state.requestOption]}
        onRequestOptionSubmit={this.handleRequestOptionSubmit}
        defaultSelectedValue={this.state.requestOption}
        collectionName={collectionName}
      />
    );
  }
}
