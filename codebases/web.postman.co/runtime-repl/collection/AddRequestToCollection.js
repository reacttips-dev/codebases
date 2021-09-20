import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Label, TextInput } from '@postman/aether';
import classnames from 'classnames';
import KeyMaps from '@postman-app-monolith/renderer/js/components/base/keymaps/KeyMaps';
import {
  Modal, ModalHeader, ModalContent, ModalFooter
} from '@postman-app-monolith/renderer/js/components/base/Modals';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import TextEditor from '../../appsdk/components/editors/texteditor/TextEditor';
import { sortCollections } from './CollectionSorter';
import CollectionExplorer from '../_common/components/CollectionExplorer/CollectionExplorer';

@observer
export default class AddRequestToCollection extends Component {
  constructor (props) {
    super(props);

    this.memorizedSortedCollection = _.memoize(sortCollections);

    this.collectionExplorerRef = React.createRef();
    this.handleCreate = this.handleCreate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getCustomStyles () {
    return { margin: 'auto' };
  }

  getKeyMapHandlers () {
    return { submit: pm.shortcuts.handle('submit', this.props.onSubmit) };
  }

  getCollections () {
    const collections = getStore('ActiveWorkspaceStore').editableCollections;

    return this.memorizedSortedCollection(collections);
  }

  handleCreate () {
    this.collectionExplorerRef && this.collectionExplorerRef.current &&
      _.isFunction(this.collectionExplorerRef.current.startCreate) && this.collectionExplorerRef.current.startCreate();
  }

  handleSubmit (e) {
    // Prevents reloading of the page by the submit event triggered on the form
    e.preventDefault();
    this.props.onSubmit();
  }

  getClassNames () {
    return classnames(
      {
        'save-request-modal': this.props.saveSingleRequest,
        'save-multiple-requests-modal': !this.props.saveSingleRequest
      },
      'addrequest-top-container-modal'
    );
  }

  render () {
    const isRequestNameError = this.props.requestNameError && _.isEmpty(this.props.requestName);

    return (
      <Modal
        className={this.getClassNames()}
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        customStyles={this.getCustomStyles()}
      >
        {/*
          Modal children's are unmounted to:
            1. avoid over listening to mobx store (performance improvement)
            2. unmounting the <Modal /> itself creates shortcut problem on newly created requests in
              collection sidebar. Example: click outside the sidebar and then click back on the target
              request in the sidebar which needs to be duplicated.
              This happens because when react-modal is unmounted, it restores focus without triggering onFocus event
              handler on target input. And keyMaps work on focused element.
              Hence onFocus is not triggered and requests aren't duplicated via keyboard shortcut.
              This is an open issue on react-modal: https://github.com/reactjs/react-modal/issues/675.
              The code sandbox to reproduce this behavior: https://codesandbox.io/s/jl6v52ow9w
        */}
        {
          this.props.isOpen && (
            <React.Fragment>
              <ModalHeader>{this.props.saveSingleRequest ? 'SAVE REQUEST' : 'SAVE REQUESTS'}</ModalHeader>
              <ModalContent>
                <KeyMaps keyMap={pm.shortcuts.getShortcuts()} handlers={this.getKeyMapHandlers()}>
                  <div className='addrequest-top-container'>
                    { this.props.saveSingleRequest && (
                      <React.Fragment>
                        <div className='row addrequest-top-container-name-row'>
                          <div className='field-label'>
                            <Label
                              className='field-label'
                              type='primary'
                            >
                            Request name
                            </Label>
                          </div>
                          <form onSubmit={this.handleSubmit}>
                            <TextInput
                              className={`addrequest__request-name ${isRequestNameError ? 'error' : ''}`}
                              ref={this.props.requestNameInput}
                              value={this.props.requestName}
                              onChange={this.props.onRequestNameChange}
                              validationStatus={isRequestNameError ? 'error' : null}
                              validationMessage='Please enter a valid request name'
                            />
                          </form>
                        </div>
                        <div className='row addrequest-description-row'>
                          { this.props.isDescriptionEnabled ?
                            (
                              <React.Fragment>
                                <div className='field-label'>
                                  <Label
                                    className='field-label'
                                    type='primary'
                                  >
                                Description
                                  </Label>
                                </div>
                                <div className='addrequest-request-description-editor text-editor-wrapper'>
                                  <TextEditor
                                    hideLineNumbers
                                    hideCodeFolding
                                    hideCurrentLineHighlight
                                    hideSuggestions
                                    value={this.props.requestDescription}
                                    language='markdown'
                                    placeholder='Use markdown to add a meaningful description.'
                                    onChange={this.props.onRequestDescriptionChange}
                                  />
                                </div>
                              </React.Fragment>
                            ) : (
                              <Button
                                className='add-description-button'
                                onClick={this.props.onEnableDescription}
                                type='monochrome-plain'
                                color='content-color-tertiary'
                                text='Add description'
                              />
                            )}
                        </div>
                      </React.Fragment>
                    )}
                    <div className='row addrequest-collection-selector-row'>
                      <CollectionExplorer
                        ref={this.collectionExplorerRef}
                        origin={this.props.origin}
                        onSelect={this.props.onSelect}
                        initialSelection={this.props.initialSelection}
                        collections={this.getCollections()}
                        folders={getStore('FolderStore').values}
                        requests={getStore('RequestStore').values}
                      />
                    </div>
                  </div>
                </KeyMaps>
              </ModalContent>
              <ModalFooter>
                <Button
                  className='save-button'
                  isDisabled={!(this.props.selected && this.props.selected.id)}
                  type='primary'
                  onClick={this.props.onSubmit}
                  text='Save'
                />
                <Button
                  className='cancel-button'
                  type='secondary'
                  onClick={this.props.onCancel}
                  text='Cancel'
                />
                <Button
                  className='create-button'
                  onClick={this.handleCreate}
                  type='muted-plain'
                  text={(this.props.selected.depth === -1) ? 'New Collection' : 'New Folder'}
                />
              </ModalFooter>
            </React.Fragment>
          )
}
      </Modal>
    );
  }
}
