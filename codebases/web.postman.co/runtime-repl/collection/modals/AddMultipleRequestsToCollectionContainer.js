import React, { Component } from 'react';
import series from 'async/series';
import { createEvent } from '@postman-app-monolith/renderer/js/modules/model-event';
import dispatchUserAction from '@postman-app-monolith/renderer/js/modules/pipelines/user-action';
import AddRequestToCollection from '@@runtime-repl/collection/AddRequestToCollection';

export default class AddMultipleRequestsToCollectionContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      selected: { id: null, depth: -1 },
      createdCollections: []
    };

    this.openModal = this.openModal.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.attachModelListeners();
  }

  componentWillUnmount () {
    this.detachModelListeners();
  }

  attachModelListeners () {
    pm.mediator.on('addRequestsToCollection', this.openModal);
  }

  detachModelListeners () {
    pm.mediator.off('addRequestsToCollection', this.openModal);
  }

  closeModal () {
    this.setState({ isOpen: false }, () => {
      this.clearModal();
    });
  }

  clearModal () {
    this._requests = null;
    this.setState({
      selected: { id: null, depth: -1 },
      createdCollections: []
    });
  }

  openModal (requests, opts) {
    this._requests = requests;

    this.setState({
      isOpen: true,
      origin: opts && opts.from
    }, () => {
      this.modal && this.modal.focus();
    });
  }

  handleClose () {
    this.closeModal();
  }

  handleSelect (target) {
    this.setState({ selected: target });
  }

  handleSubmit () {
    let collection = {},
      target = 'collection';

    if (this.state.selected) {
      if (_.get(this.state, 'selected.type') === 'folder') {
        collection.id = _.get(this.state, 'selected.collection');
        target = 'folder';
      } else {
        collection.id = _.get(this.state, 'selected.id');
        target = 'collection';
      }
    } else if (_.isEmpty(this.state.selected)) {
      pm.toasts.error('Select an existing collection or provide a Collection name');

      return false;
    } else {
      pm.toasts.error('Please select an existing collection');

      return false;
    }

    series(
      _.map(this._requests, (request) => (callback) => {
        const value = _.size(this._requests),
          reqCreateEvent = createEvent(
            'create_deep',
            'request',
            {
              request,
              target: {
                model: target === 'collection' ? 'collection' : 'folder',
                modelId: _.get(this.state, 'selected.id')
              }
            },
            null,
            { origin: 'existing_collection', value }
          );

        dispatchUserAction(reqCreateEvent).then((response) => {
          if (!_.isEmpty(_.get(response, 'error'))) {
            pm.logger.error('Error in pipeline while adding request to collection', _.get(response, 'error'));
          }

          callback(null);
        }).catch((error) => {
          pm.logger.error('Error in pipeline while adding request to collection', error);
          callback(null);
        });
      }),
      (err) => {
        if (err) {
          this.closeModal();
          pm.logger.error('Error in pipeline while creating multiple requests', err);

          return;
        }

        this.closeModal();
      }
    );
  }

  render () {
    return (
      <AddRequestToCollection
        isOpen={this.state.isOpen}
        selected={this.state.selected}
        onCancel={this.handleClose}
        onSelect={this.handleSelect}
        onSubmit={this.handleSubmit}
        modal={(modal) => { this.modal = modal; }}
        origin={this.state.origin}
      />
    );
  }
}
