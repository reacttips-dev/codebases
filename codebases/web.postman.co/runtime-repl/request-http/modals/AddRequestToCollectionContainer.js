import React, { Component } from 'react';
import uuid from 'uuid/v4';
import { TrackedState, bindTrackedStateToComponent } from '@postman-app-monolith/renderer/js/modules/tracked-state/TrackedState';
import dispatchUserAction from '@postman-app-monolith/renderer/js/modules/pipelines/user-action';
import { createEvent } from '@postman-app-monolith/renderer/js/modules/model-event';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import AddRequestToCollection from '@@runtime-repl/collection/AddRequestToCollection';

const ORIGIN_BUILDER = 'builder/request/save';

/**
 * Returns the default request object
 */
function getDefaultRequestObject () {
  return {
    id: uuid(),
    headerData: [],
    url: '',
    name: '',
    collection: '',
    queryParams: [],
    events: [],
    pathVariableData: [],
    method: 'GET',
    data: null,
    dataMode: null,
    auth: null,
    description: ''
  };
}

export default class AddRequestToCollectionContainer extends Component {
  constructor (props) {
    super(props);

    this._request = null;

    this.state = {
      isOpen: false,
      requestName: '',
      selected: { id: null, depth: -1 },
      target: {},
      createdCollections: [],
      nameError: false,
      origin: null,
      isDescriptionEnabled: false
    };

    this.trackedState = new TrackedState({
      requestDescription: ''
    });

    bindTrackedStateToComponent(this.trackedState, this);

    this.openModal = this.openModal.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleRequestNameChange = this.handleRequestNameChange.bind(this);
    this.handleRequestDescriptionChange = this.handleRequestDescriptionChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDirtyStateOnClose = this.handleDirtyStateOnClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.enableDescription = this.enableDescription.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.attachModelListeners();
  }

  componentWillUnmount () {
    this.detachModelListeners();
  }

  detachModelListeners () {
    pm.mediator.off('showAddToCollectionModal', this.openModal);
  }

  attachModelListeners () {
    pm.mediator.on('showAddToCollectionModal', this.openModal);
  }

  closeModal () {
    this.setState({ isOpen: false });
    this.clearModal();
  }

  clearModal () {
    this.setState({
      requestName: '',
      createdCollections: [],
      selected: { id: null, depth: -1 },
      nameError: false,
      origin: null,
      isDescriptionEnabled: false
    });

    this.trackedState.reset({
      requestDescription: ''
    });

    this._request = null;
    this._callback = null;
  }

  openModal (request, opts, successCb, resetLifecycleCb) {
    this._request = request;
    this._successCb = successCb;
    this._resetLifecycleCb = resetLifecycleCb;

    const target = _.get(opts, 'target') ? opts.target : this.state.target;

    this.trackedState.reset({
      requestDescription: _.get(this._request, 'description') || ''
    });

    this.setState({
      isOpen: true,
      requestName: _.get(this._request, 'name') || _.get(this._request, 'url') || '',
      target,
      origin: (opts && opts.from) || ORIGIN_BUILDER
    }, () => {
      this.requestNameInput && this.requestNameInput.focus();
    });
  }

  // Used to set the target for collection explorer when
  // adding a request from sidebar to a empty collection
  // or folder.
  getInitialSelection () {
    if (_.isEmpty(this.state.target)) {
      return {};
    }

    const collections = getStore('ActiveWorkspaceStore').editableCollections,
      folder = _.get(this.state.target, 'folder'),
      collection = _.get(this.state.target, 'collection');


    if (folder && !_.some(collections, ['id', folder.collection])) {
      return {};
    }

    if (folder && !getStore('FolderStore').find(folder.id)) {
      return {};
    }

    if (collection && !_.some(collections, ['id', collection.id])) {
      return {};
    }

    return this.state.target;
  }

  handleClose () {
    this.closeModal();
    _.isFunction(this._resetLifecycleCb) && this._resetLifecycleCb();
  }

  handleDirtyStateOnClose () {
    if (this.trackedState.isDirty()) {
      pm.mediator.trigger('showConfirmationModal', this.handleClose);
    } else {
      this.handleClose();
    }
  }

  handleSelect (target) {
    let collection = null,
      folder = null;

    switch (target.type) {
      case 'collection':
        collection = target;
        break;

      case 'folder':
        folder = target;
        break;

      default:
    }

    this.setState({
      selected: target,
      target: { collection, folder }
    });
  }

  isNewCollection (collectionId) {
    return _.includes(this.state.createdCollections, collectionId);
  }

  handleRequestNameChange (e) {
    this.setState({ requestName: e.target.value });
  }

  handleRequestDescriptionChange (value) {
    this.trackedState.set({ requestDescription: value });
  }

  handleSubmit () {
    if (_.isEmpty(this.state.requestName)) {
      this.setState({ nameError: true });

      return;
    }

    let collection = {},
      target = 'collection',
      isNewCollection = false;

    if (this.state.selected) {
      if (_.get(this.state, 'selected.type') === 'folder') {
        collection.id = _.get(this.state, 'selected.collection');
        target = 'folder';
      } else {
        collection.id = _.get(this.state, 'selected.id');
        target = 'collection';
        isNewCollection = this.isNewCollection(collection.id);
      }
    } else if (_.isEmpty(this.state.selected)) {
      pm.toasts.error('Select an existing collection or provide a Collection name');

      return false;
    } else {
      pm.toasts.error('Provide a Collection name');

      return false;
    }

    const requestToBeSaved = _.merge(getDefaultRequestObject(), this._request, {
      name: this.state.requestName,
      description: this.trackedState.get('requestDescription'),
      collection: collection.id
    });

    let { origin } = this.state;

    if (!origin) {
      origin = isNewCollection ? 'builder/new_collection' : 'builder/existing_collection';
    }

    const createRequestEvent = createEvent('create_deep',
      'request',
      {
        request: requestToBeSaved,
        target: {
          model: target === 'collection' ? 'collection' : 'folder',
          modelId: _.get(this.state, 'selected.id')
        }
      },
      [],
      { origin });

    dispatchUserAction(createRequestEvent).then((response) => {
      if (!_.isEmpty(_.get(response, 'error'))) {
        pm.logger.error('Error in creating request', response.error);

        return;
      }

      pm.mediator.trigger('scrollToRequest', requestToBeSaved.id);
      pm.mediator.trigger('requestSaved', this._request, requestToBeSaved);
      isNewCollection && this.state.origin !== 'new-x-modal' && pm.mediator.trigger('focusCollectionInSideBar', collection.id, 'Documentation');

      // _successCb for handling the whether to close the editor, or open
      _.isFunction(this._successCb) && this._successCb();

      // Reset the lifecycle back from saving -> idle
      _.isFunction(this._resetLifecycleCb) && this._resetLifecycleCb();

      this.closeModal();
    }).catch((err) => {
      pm.logger.error('Error in pipeline for creating request', err);
      pm.toasts.error('Could not create request');
    });
  }

  enableDescription () {
    this.setState({
      isDescriptionEnabled: true
    });
  }

  render () {
    return (
      <AddRequestToCollection
        isOpen={this.state.isOpen}
        selected={this.state.selected}
        saveSingleRequest
        requestName={this.state.requestName}
        isDescriptionEnabled={this.state.isDescriptionEnabled}
        requestDescription={this.trackedState.get('requestDescription')}
        origin={this.state.origin}
        onRequestNameChange={this.handleRequestNameChange}
        onRequestDescriptionChange={this.handleRequestDescriptionChange}
        onEnableDescription={this.enableDescription}
        onRequestClose={this.handleDirtyStateOnClose}
        onSelect={this.handleSelect}
        onSubmit={this.handleSubmit}
        onCancel={this.handleClose}
        initialSelection={this.getInitialSelection()}
        requestNameInput={(input) => { this.requestNameInput = input; }}
        requestNameError={this.state.nameError}
      />
    );
  }
}
