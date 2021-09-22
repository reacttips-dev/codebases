import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import debounce from 'lodash/debounce'

import { Search } from '@invisionapp/helios/icons'

import BatchSelectedDocument from './SelectedDocument'

import styles from '../../../css/modals/batch-add/select-input.css'

class BatchSelectInput extends Component {
  static propTypes = {
    actions: PropTypes.object,
    activeDocument: PropTypes.number,
    documents: PropTypes.array,
    filterText: PropTypes.string,
    inputRef: PropTypes.object,
    lastDocumentSelected: PropTypes.bool,
    onSubmit: PropTypes.func,
    selected: PropTypes.array,
    selectedDocument: PropTypes.object,
    setInputRef: PropTypes.func
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

  findNewActiveIndex = direction => {
    const {
      activeDocument,
      documents,
      selected
    } = this.props

    const newActiveIndex = direction === 'up' ? Math.max(0, activeDocument - 1) : Math.min(activeDocument + 1, documents.length - 1)
    const doc = documents[newActiveIndex] || null

    const isDocSelected = doc => selected.findIndex(s => s.resourceType === doc.resourceType && s.id === doc.id) >= 0

    if (doc && !isDocSelected(doc)) {
      return newActiveIndex
    }

    if (!doc || isDocSelected(doc)) {
      let i
      if (direction === 'up') {
        for (i = newActiveIndex; i >= 0; i--) {
          if (documents[i] && !isDocSelected(documents[i])) {
            return i
          }
        }
      } else {
        for (i = newActiveIndex; i < documents.length; i++) {
          if (documents[i] && !isDocSelected(documents[i])) {
            return i
          }
        }
      }
    }

    return -1
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

  handleChange = e => {
    e.persist()

    if (!this.debouncedSearch) {
      this.debouncedSearch = debounce(() => {
        this.props.actions.updateBatchFilterText(e.target.value, false)
      }, 300)
    }

    this.debouncedSearch()
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
        selectActiveDocument,
        setActiveDocument,
        updateBatchFilterText
      },
      activeDocument,
      documents,
      filterText,
      onSubmit,
      selected,
      selectedDocument
    } = this.props

    if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].indexOf(e.key) >= 0) {
      e.preventDefault()
      e.stopPropagation()

      switch (e.key) {
        case 'ArrowDown':
          setActiveDocument(this.findNewActiveIndex('down'))
          break
        case 'ArrowUp':
          setActiveDocument(this.findNewActiveIndex('up'))
          break
        case 'Escape':
          updateBatchFilterText('')
          if (this.input) {
            this.input.value = ''
            this.input.focus()
          }
          break
        case 'Enter':
          if (
            selectedDocument &&
            selectedDocument.id &&
            selected.findIndex(s => s.id === selectedDocument.id && s.resourceType === selectedDocument.resourceType) === -1
          ) {
            analyticsSetContext({ documentType: selectedDocument.resourceType })
            selectActiveDocument(selectedDocument)

            if (activeDocument < documents.length - 1) setActiveDocument(this.findNewActiveIndex('down'))

            if (filterText !== '') updateBatchFilterText('')

            // this does the same thing the parent does with onSelectAdd
            this.input.focus()
            this.input.select()
            this.input.scrollIntoView()
          } else if (!selectedDocument) {
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
    this.props.setInputRef(input)
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
      <div className={styles.outer}>
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
              defaultValue={filterText}
              onBlur={this.handleBlur}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.handleKeyUp}
              placeholder={selected.length > 0 ? '' : 'Type to search documents...'}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default BatchSelectInput
