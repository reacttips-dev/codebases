import React, { Component } from 'react';
import { observer } from 'mobx-react';
import AnalyticsService from '@postman-app-monolith/renderer/js/modules/services/AnalyticsService';
import RemoteSyncRequestService from '@postman-app-monolith/renderer/js/modules/services/RemoteSyncRequestService';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import DeleteConfirmationModal from '@postman-app-monolith/renderer/js/components/collections/DeleteConfirmationModal';


@observer
export default class DeleteCollectionModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      meta: null,
      isDisabled: false,
      exceedsMaxSize: null,
      loadingCollectionSize: false,
      errorFetchingCollectionSize: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.fetchCollectionSize = this.fetchCollectionSize.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showCollectionDeleteModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showCollectionDeleteModal', this.handleOpen);
  }

  fetchCollectionSize (collectionId) {
    if (!collectionId) {
      pm.logger.error('Invalid collectionId provided');
    }

    this.setState({
      loadingCollectionSize: true,
      exceedsMaxSize: null,
      errorFetchingCollectionSize: false
    });

    return RemoteSyncRequestService.request(`/collection/${collectionId}/size`, {
      method: 'get'
    })
      .then((responseObj) => {
        if (!_.isEmpty(_.get(responseObj, 'body.error'))) {
          pm.logger.error('Error in fetching collection size', responseObj.body.error);

          this.setState({
            loadingCollectionSize: false,
            errorFetchingCollectionSize: true
          });

          return;
        }

        this.setState({
          loadingCollectionSize: false
        });

        const result = _.get(responseObj, 'body.data') || {};

        if (result.size > result.limit) {
          this.setState({
            exceedsMaxSize: true
          });
        } else {
          this.setState({
            exceedsMaxSize: false
          });
        }
      })
      .catch(({ error }) => {
        this.setState({
          loadingCollectionSize: false,
          errorFetchingCollectionSize: true
        });

        pm.logger.error('Error in pipeline for fetching collection size', error);
      });
  }

  handleOpen (collectionUid, { origin, name }, callback) {
    this.fetchCollectionSize(collectionUid);

    this.callback = callback;
    if (name) {
      const displayLength = pm.isScratchpad ? 13 : 18,
        maxChars = pm.isScratchpad ? 30 : 40;

      this.collectionDisplayName = name.length <= maxChars ? name : `${name.slice(0, displayLength)}...${name.slice(-displayLength)}`;
    } else {
      this.collectionDisplayName = 'Collection';
    }

    this.setState({
      isOpen: true,
      meta: {
        name
      }
    }, () => {
      AnalyticsService.addEvent('collection', 'initiate_delete', origin);

      _.invoke(this, 'keymapRef.focus');
    });
  }

  handleClose () {
    this.callback(null, false);
    this.clean();
  }

  clean () {
    this.callback = _.noop;
    this.setState({
      isOpen: false,
      meta: null,
      isDisabled: false
    });
  }

  async handleConfirm () {
    this.setState({ isDisabled: true });
    try {
      await this.callback(null, true);
      this.clean();
    } catch (err) {
      pm.logger.error('DeleteCollectionModalContainer~handleConfirm', err);

      this.setState({ isDisabled: false });
    }
  }

  render () {
    const isOffline = !getStore('SyncStatusStore').isSocketConnected,
      { isLoggedIn } = getStore('CurrentUserStore');

    return (
      <DeleteConfirmationModal
        preventFocusReset
        exceedsMaxSize={this.state.exceedsMaxSize}
        loadingCollectionSize={this.state.loadingCollectionSize}
        isOffline={isOffline}
        isLoggedIn={isLoggedIn}
        errorFetchingCollectionSize={this.state.errorFetchingCollectionSize}
        isDisabled={this.state.isDisabled}
        primaryAction={this.state.isDisabled ? 'Deleting' :
          !isOffline && this.state.exceedsMaxSize ? 'Delete Permanently' : 'Delete'}
        className='delete-collection-confirmation-modal'
        entity='COLLECTION'
        isOpen={this.state.isOpen}
        keymapRef={(ref) => { this.keymapRef = ref; }}
        meta={this.state.meta}
        title={pm.isScratchpad ? `Delete "${this.collectionDisplayName}" from scratchpad?` : `Delete "${this.collectionDisplayName}"?`}
        onConfirm={this.handleConfirm}
        onRequestClose={this.handleClose}
      />
    );
  }
}
