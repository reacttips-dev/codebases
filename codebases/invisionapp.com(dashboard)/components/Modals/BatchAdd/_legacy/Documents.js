import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import BatchDocument from './Document'
import Loading from '../../../Layout/Loading'
import NoDocuments from '../NoDocuments'

import styles from '../../../../css/modals/batch-add/documents.css'

class BatchDocuments extends Component {
  static propTypes = {
    account: PropTypes.object,
    actions: PropTypes.object,
    activeDocument: PropTypes.number,
    documents: PropTypes.array,
    filterText: PropTypes.string,
    isLoading: PropTypes.bool,
    onSelectAdd: PropTypes.func,
    selected: PropTypes.array
  }

  handleDocumentClick = (doc) => {
    this.props.actions.analyticsSetContext({ documentType: doc.type })
    this.props.actions.selectActiveDocument(doc)
    this.props.onSelectAdd()
  }

  handleMouseOver = (index) => {
    this.props.actions.setActiveDocument(index)
  }

  handleMouseLeave = (index) => {
    this.props.actions.setActiveDocument(-1)
  }

  renderDocumentList = () => {
    const {
      account,
      activeDocument,
      documents,
      filterText,
      isLoading,
      selected
    } = this.props

    if (!isLoading && documents.length === 0) {
      return (
        <NoDocuments empty={selected.length === 0 || filterText !== ''} />
      )
    }

    return (
      <div className={styles.documentsList}>
        { isLoading
          ? <Loading top={16} type='batchDocuments' />
          : documents.map((doc, idx) => {
            return (
              <BatchDocument
                key={`doc${idx}`}
                account={account}
                active={idx === activeDocument}
                document={doc}
                handleClick={this.handleDocumentClick}
                handleMouseOver={this.handleMouseOver}
                handleMouseLeave={this.handleMouseLeave}
                index={idx}
              />
            )
          })
        }
      </div>
    )
  }

  render () {
    const {
      documents,
      isLoading
    } = this.props

    return (
      <div className={
        cx(styles.root, {
          [styles.loading]: isLoading,
          [styles.noDocuments]: documents.length === 0
        })}>
        { this.renderDocumentList() }
      </div>
    )
  }
}

export default BatchDocuments
