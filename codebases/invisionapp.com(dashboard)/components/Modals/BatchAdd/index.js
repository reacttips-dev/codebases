import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { Button, Dialog, Rule, Spaced, Text } from '@invisionapp/helios'

import Documents from './Documents'
import SelectInput from './SelectInput'

import styles from '../../../css/modals/batch-add.css'

const ModalsBatchAdd = ({
  account,
  serverActions,
  actions,
  config,
  metadata,
  project,
  space,
  enableFreehandXFilteringSorting
}) => {
  const inputRef = useRef(null)

  const [documents, setDocuments] = useState([])

  const activeDocument = useSelector(state => state.batch.activeDocument)
  const filterText = useSelector(state => state.batch.filterText)
  const lastDocumentSelected = useSelector(state => state.batch.lastDocumentSelected)
  const selected = useSelector(state => state.batch.selected)

  const setInputRef = node => {
    inputRef.current = node
  }

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
      inputRef.current.scrollIntoView()
    }
  }

  const onSubmit = () => {
    const container = project && project.id ? 'project' : 'space'
    const containerId = container === 'project' ? project.id : space.id
    const containerTitle = container === 'project' ? project.title : space.title

    serverActions.moveDocumentsToContainer.request(
      container,
      containerId,
      containerTitle,
      selected,
      true
    )
  }

  return (
    <Dialog
      aria-label='Add Documents'
      className={styles.root}
      closeOnEsc
      closeOnOverlay
      onRequestClose={actions.closeModal}
      open
      padding={null}
      maxWidth={680}
      style={{ zIndex: 20 }}
    >
      <div className={`${styles.inner} ${styles.innerFlex}`}>
        <Text order='title' size='smaller' className={styles.title}>
          Add documents to {project ? project.title : space.title}
        </Text>

        <SelectInput
          actions={actions}
          activeDocument={activeDocument}
          documents={documents}
          filterText={filterText}
          lastDocumentSelected={lastDocumentSelected}
          onSubmit={onSubmit}
          selected={selected}
          selectedDocument={activeDocument >= 0 ? documents[activeDocument] : null}
          setInputRef={setInputRef}
        />

        <Documents
          account={account}
          actions={actions}
          serverActions={serverActions}
          activeDocument={activeDocument}
          documents={documents}
          enableFreehandXFilteringSorting={enableFreehandXFilteringSorting}
          filterText={filterText || ''}
          freehandMetadata={metadata.freehands}
          onSelectAdd={focusInput}
          selected={selected}
          setDocuments={setDocuments}
          spaceId={space.id}
          projectId={project.id || ''}
        />
      </div>
      <Rule color='regular' />
      <div className={styles.footerButtons}>
        <Button
          onClick={actions.closeModal}
          order='secondary'>
          Cancel
        </Button>
        {selected && selected.length > 0 && (
          <Spaced left='s'>
            <Button
              onClick={onSubmit}
              order='primary-alt'>
              Add
            </Button>
          </Spaced>
        )}
      </div>
    </Dialog>
  )
}

ModalsBatchAdd.propTypes = {
  account: PropTypes.object.isRequired,
  serverActions: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  metadata: PropTypes.object.isRequired,
  space: PropTypes.object.isRequired,
  project: PropTypes.object
}

export default ModalsBatchAdd
