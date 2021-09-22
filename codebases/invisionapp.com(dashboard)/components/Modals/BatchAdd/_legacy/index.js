import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect, Provider } from 'react-redux'

import { Button, Dialog, Rule, Spaced, Text } from '@invisionapp/helios'

import BatchDocuments from './Documents'
import BatchSelectInput from './SelectInput'

import { storeRef } from '../../../../store/store'

import { filterAllDocuments } from '../../../../selectors/batch'

import styles from '../../../../css/modals/batch-add.css'

export class ModalsBatchAdd extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    documents: PropTypes.array.isRequired,
    filterText: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    selected: PropTypes.array,
    serverActions: PropTypes.object.isRequired,
    spaceID: PropTypes.string.isRequired,
    spaceTitle: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)

    this.selectInputRef = null
  }

  inputRef = (ref) => {
    this.selectInputRef = ref
  }

  onAddClick = () => {
    const {
      selected,
      serverActions,
      spaceID,
      spaceTitle
    } = this.props

    serverActions.addDocumentsToSpace.request(selected, spaceID, spaceTitle)
  }

  onCancelClick = () => {
    this.props.actions.closeModal()
  }

  onSelectAdd = () => {
    if (this.selectInputRef) {
      this.selectInputRef.focus()
      this.selectInputRef.select()
    }
  }

  render () {
    const {
      account,
      actions,
      activeDocument,
      documents,
      filterText,
      isLoading,
      lastDocumentSelected,
      selected,
      spaceTitle
    } = this.props

    return (
      <Dialog
        aria-label='Add Documents'
        className={styles.root}
        closeOnEsc
        closeOnOverlay
        onRequestClose={this.onCancelClick}
        open
        padding={null}
        maxWidth={680}
        style={{ zIndex: 20 }}
      >
        <div className={styles.inner}>
          <Text order='title' size='smaller' className={styles.title}>
            Add documents to {spaceTitle}
          </Text>

          <div className={styles.documentsWrap}>
            <BatchSelectInput
              actions={actions}
              activeDocument={activeDocument}
              documentCount={documents.length}
              inputRef={this.inputRef}
              lastDocumentSelected={lastDocumentSelected}
              onSubmit={this.onAddClick}
              selected={selected}
              selectedDocument={activeDocument >= 0 ? documents[activeDocument] : null}
            />

            <BatchDocuments
              account={account}
              actions={actions}
              activeDocument={activeDocument}
              documents={documents}
              filterText={filterText || ''}
              isLoading={isLoading}
              onSelectAdd={this.onSelectAdd}
              selected={selected}
            />
          </div>
        </div>
        <Rule color='regular' />
        <div className={styles.footerButtons}>
          <Button
            onClick={this.onCancelClick}
            order='secondary'>
            Cancel
          </Button>
          {selected && selected.length > 0 && (
            <Spaced left='s'>
              <Button
                onClick={this.onAddClick}
                order='primary-alt'>
                Add
              </Button>
            </Spaced>
          )}
        </div>
      </Dialog>
    )
  }
}

export const ConnectedComponent = connect(
  (state) => ({
    activeDocument: state.batch.activeDocument,
    documents: filterAllDocuments(state),
    filterText: state.batch.filterText,
    isLoading: state.batch.isLoading,
    lastDocumentSelected: state.batch.lastDocumentSelected,
    selected: state.batch.selected,
    spaceTitle: state.space.title,
    spaceID: state.space.id
  })
)(ModalsBatchAdd)

export default (props) => {
  return <Provider store={storeRef.current}>
    <ConnectedComponent {...props} />
  </Provider>
}
