import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import _ from 'lodash';
import ImportCollectionConflictModal from '../../components/import/ImportCollectionConflictModal';

@pureRender
export default class ImportCollectionConflictModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      currentCollectionName: '',
      currentCollectionId: null
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleReplace = this.handleReplace.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.acceptCollection = this.acceptCollection.bind(this);

    this.collectionQueue = [];
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('resolveImportConflict', this.acceptCollection);
  }

  componentWillUnmount () {
    pm.mediator.off('resolveImportConflict', this.acceptCollection);
  }

  acceptCollection (collectionId, collectionName) {
    let collection = {
      id: collectionId,
      name: collectionName
    };

    this.collectionQueue.push(collection);

    if (this.collectionQueue.length > 1 || this.state.isOpen) return;

    this.handleOpen(collection);
  }

  handleOpen (collection) {
    this.setState({
      isOpen: true,
      currentCollectionName: collection.name,
      currentCollectionId: collection.id
    });
  }

  handleClose () {
    this.collectionQueue.shift();

    if (this.collectionQueue.length) {
      this.handleOpen(_.head(this.collectionQueue));
    } else {
      this.setState({
        isOpen: false,
        currentCollectionName: '',
        currentCollectionId: null
      });
    }
  }

  handleReplace () {
    pm.mediator.trigger('handleImportReplace' + _.head(this.collectionQueue).id);
    this.handleClose();
  }

  handleCopy () {
    pm.mediator.trigger('handleImportCopy' + _.head(this.collectionQueue).id);
    this.handleClose();
  }

  render () {

    return (
      <ImportCollectionConflictModal
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
        name={this.state.currentCollectionName}
        onReplace={this.handleReplace}
        onCopy={this.handleCopy}
      />
    );
  }
}
