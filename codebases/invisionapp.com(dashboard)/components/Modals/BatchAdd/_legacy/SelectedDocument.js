import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import {
  Boards,
  Close,
  Freehand,
  Prototype,
  Rhombus,
  Spec,
  Studio
} from '@invisionapp/helios/icons'

import { Truncate } from '@invisionapp/helios'

import {
  BOARD,
  FREEHAND,
  HARMONY,
  PRESENTATION,
  PROTOTYPE,
  RHOMBUS,
  SPEC,
  UNTITLED
} from '../../../../constants/DocumentTypes'

import styles from '../../../../css/modals/batch-add/selected-document.css'

class BatchSelectedDocument extends Component {
  static propTypes = {
    document: PropTypes.object,
    handleClick: PropTypes.func,
    index: PropTypes.number,
    selected: PropTypes.bool
  }

  handleClick = () => {
    this.props.handleClick(this.props.index)
  }

  renderIcon = (type) => {
    const iconProps = {
      category: 'feature',
      fill: 'text',
      size: 24
    }

    switch (type) {
      case BOARD:
        return <Boards {...iconProps} />
      case FREEHAND:
        return <Freehand {...iconProps} />
      case HARMONY:
      case PRESENTATION:
        return <Studio {...iconProps} />
      case SPEC:
        return <Spec {...iconProps} />
      case RHOMBUS:
        return <Rhombus {...iconProps} />
      case PROTOTYPE:
      default:
        return <Prototype {...iconProps} />
    }
  }

  render () {
    const { document: doc, selected } = this.props

    return (
      <div
        onClick={this.handleClick}
        className={cx(styles.root, { [styles.selected]: selected })}>
        { this.renderIcon(doc.type) }

        <div className={styles.docName}>
          <Truncate placement='end'>
            { doc.data.name || UNTITLED }
          </Truncate>
        </div>

        <Close size={18} fill='info' />
      </div>
    )
  }
}

export default BatchSelectedDocument
