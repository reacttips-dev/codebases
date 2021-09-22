import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { Search } from '@invisionapp/helios/icons'

import BatchSelectedDocument from './SelectedDocument'

import styles from '../../../../css/modals/batch-add/select-input.css'

class BatchSelectInput extends Component {
  static propTypes = {
    actions: PropTypes.object,
    activeDocument: PropTypes.number,
    documentCount: PropTypes.number,
    filterText: PropTypes.string,
    inputRef: PropTypes.func,
    lastDocumentSelected: PropTypes.bool,
    onSubmit: PropTypes.func,
    selected: PropTypes.array,
    selectedDocument: PropTypes.object
  }

  state = {
    isScrolling: false,
    focused: false
  }

  constructor (props) {
    super(props)

    // this.input cannot use createRef, since we need to pass it up
    this.input = null
    this.node = createRef()
  }

  componentDidUpdate () {
    const { isScrolling } = this.state

    if (this.node && this.node.clientHeight) {
      if (isScrolling && this.node.clientHeight <= 108) {
        this.setState({ isScrolling: false })
      } else if (!isScrolling && this.node.clientHeight > 108) {
        this.setState({ isScrolling: true })
      }
    }
  }

  focusInput = () => {
    if (this.input) this.input.focus()
  }

  handleBlur = () => {
    this.setState({ focused: false })
  }

  handleFocus = () => {
    this.setState({ focused: true })
  }

  handleKeyDown = (e) => {
    const {
      actions: {
        analyticsSetContext,
        removeSelectedDocument,
        selectLastDocument
      },
      lastDocumentSelected,
      selected
    } = this.props

    if (e.key === 'Backspace') {
      if (this.input && this.input.value === '') {
        e.preventDefault()

        if (lastDocumentSelected && selected.length > 0) {
          analyticsSetContext({ documentType: selected[selected.length - 1].type })
          removeSelectedDocument(selected.length - 1, selected[selected.length - 1].type)
        } else if (!lastDocumentSelected && selected.length > 0) {
          selectLastDocument()
        }
      }
    } else if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].indexOf(e.key) >= 0) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  handleKeyUp = (e) => {
    const {
      actions: {
        analyticsSetContext,
        navigateActiveDocument,
        selectActiveDocument,
        updateBatchFilterText
      },
      activeDocument,
      documentCount,
      onSubmit,
      selectedDocument
    } = this.props

    if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].indexOf(e.key) === -1) {
      updateBatchFilterText(e.target.value)
    } else {
      e.preventDefault()
      e.stopPropagation()

      switch (e.key) {
        case 'ArrowDown':
          if (activeDocument < documentCount - 1) navigateActiveDocument('down')
          break
        case 'ArrowUp':
          navigateActiveDocument('up')
          break
        case 'Escape':
          updateBatchFilterText('')
          if (this.input) {
            this.input.value = ''
            this.input.focus()
          }
          break
        case 'Enter':
          if (selectedDocument && selectedDocument.id) {
            analyticsSetContext({ documentType: selectedDocument.type })
            selectActiveDocument(selectedDocument)
            updateBatchFilterText('')

            // this does the same thing the parent does with onSelectAdd
            this.input.focus()
            this.input.select()
          } else {
            onSubmit()
          }
          break
      }
    }
  }

  handleSelectedClick = (index) => {
    this.props.actions.analyticsSetContext({ documentType: this.props.selected[index].type })
    this.props.actions.removeSelectedDocument(index, this.props.selected[index].type)
  }

  setInput = (input) => {
    this.input = input
    this.props.inputRef(input)
  }

  renderSelected = (selected) => {
    if (selected.length === 0) return null

    const { lastDocumentSelected } = this.props

    return (
      <div className={styles.selectedInner}>
        {selected.map((doc, idx) => {
          const isSelected = lastDocumentSelected && idx === selected.length - 1

          return (
            <BatchSelectedDocument
              key={`selected-document-${idx}`}
              document={doc}
              index={idx}
              handleClick={this.handleSelectedClick}
              selected={isSelected}
            />
          )
        })}
      </div>
    )
  }

  render () {
    const { filterText, selected } = this.props
    const { focused, isScrolling } = this.state

    return (
      <div
        className={cx(styles.root, {
          [styles.active]: focused,
          [styles.scrolling]: isScrolling
        })}
        onClick={this.focusInput}>
        <div
          ref={this.node}
          className={styles.inner}>
          { selected.length === 0 && <Search className={styles.icon} /> }

          { this.renderSelected(selected) }

          <input
            autoFocus
            ref={this.setInput}
            type='text'
            value={filterText}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onKeyDown={this.handleKeyDown}
            onKeyUp={this.handleKeyUp}
            placeholder={selected.length > 0 ? '' : 'Type to search documents...'}
          />
        </div>
      </div>
    )
  }
}

export default BatchSelectInput
