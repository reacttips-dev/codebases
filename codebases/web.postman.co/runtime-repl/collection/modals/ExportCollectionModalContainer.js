import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import CollectionController from '@@runtime-repl/collection/datastores/controllers/CollectionController';
import conversion from '@postman-app-monolith/renderer/js/services/conversion/promisifiedConverter';
import { decomposeUID } from '@postman-app-monolith/renderer/js/utils/uid-helper';
import ExportCollectionModal from '@@runtime-repl/collection/modals/ExportCollectionModal';
import TransientCollectionStore from '@@runtime-repl/transient-collection/datastores/stores/TransientCollectionStore';
import { fetchAndSyncCollection } from '../_api/CollectionInterface';

const COLLECTION_EXPORT_FORMAT = 'collectionExportFormat';

@pureRender
export default class ExportCollectionModalContainer extends Component {
  constructor (props) {
    super(props);

    let collectionExportFormatSetting = pm.settings.getSetting(COLLECTION_EXPORT_FORMAT);

    if (!collectionExportFormatSetting || collectionExportFormatSetting === 'v1') {
      collectionExportFormatSetting = 'v2.1';
      pm.settings.setSetting(COLLECTION_EXPORT_FORMAT, 'v2.1');
    }

    this.state = {
      isOpen: false,
      id: null,
      name: '',
      format: collectionExportFormatSetting
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormatChange = this.handleFormatChange.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showExportCollectionModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showExportCollectionModal', this.handleOpen);
  }

  async handleOpen (uid, isTransient = false) {
    if (!uid) {
      return;
    }

    const id = decomposeUID(uid).modelId;

    this.isTransient = isTransient;

    this.setState({ isLoading: true, isOpen: true });

    try {
      if (!isTransient) {
        // Fetch collection from sync if it's not present in the DB already
        await fetchAndSyncCollection(uid);

        const collection = await CollectionController.getCollection({ id });

        if (!collection) {
          throw new Error(`ExportCollectionModalContainer~handleOpen: Failed to fetch collection '${uid}'`);
        }

        this.setState({
          id,
          name: collection.name,
          format: pm.settings.getSetting('collectionExportFormat') || 'v2.1',
          isLoading: false
        }, () => {
          this.keymapRef && this.keymapRef.focus();
        });
      } else {
        const transientCollection = TransientCollectionStore.find(id).model;

        this.setState({
          id,
          name: transientCollection.name,
          format: pm.settings.getSetting('collectionExportFormat') || 'v2.1',
          isLoading: false
        }, () => {
          this.keymapRef && this.keymapRef.focus();
        });
      }
    } catch (e) {
      this.setState({
        loadingError: e,
        isLoading: false
      });
    }
  }

  handleClose () {
    this.setState({
      isOpen: false,
      id: null,
      name: '',
      format: 'v2.1'
    });
  }

  handleFormatChange (format) {
    pm.settings.setSetting(COLLECTION_EXPORT_FORMAT, format || 'v2.1');
    this.setState({ format });
  }

  async handleSubmit () {
    const converter = await conversion(),
      criteria = { id: this.state.id };

    if (this.state.format === 'v2') {
      converter.saveEntity(criteria, {
        type: this.isTransient ? 'transientCollection' : 'collection',
        inputVersion: '1.0.0',
        outputVersion: '2.0.0'
      });
    } else if (this.state.format === 'v2.1') {
      converter.saveEntity(criteria, {
        type: this.isTransient ? 'transientCollection' : 'collection',
        inputVersion: '1.0.0',
        outputVersion: '2.1.0'
      });
    }

    this.handleClose();
  }

  render () {
    return (
      <ExportCollectionModal
        isOpen={this.state.isOpen}
        name={this.state.name}
        format={this.state.format}
        onFormatChange={this.handleFormatChange}
        onRequestClose={this.handleClose}
        onSubmit={this.handleSubmit}
        keymapRef={(ref) => { this.keymapRef = ref; }}
        isLoading={this.state.isLoading}
        loadingError={this.state.loadingError}
      />
    );
  }
}
