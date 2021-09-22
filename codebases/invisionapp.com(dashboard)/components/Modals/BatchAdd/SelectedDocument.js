import React from 'react'
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
} from '../../../constants/DocumentTypes'

import styles from '../../../css/modals/batch-add/selected-document.css'

const BatchSelectedDocument = ({
  document: doc,
  handleClick,
  index,
  selected
}) => {
  const onClick = () => handleClick(index)

  const renderIcon = type => {
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
        return <Studio {...iconProps} />
      case RHOMBUS:
        return <Rhombus {...iconProps} />
      case SPEC:
        return <Spec {...iconProps} />
      case PRESENTATION:
      case PROTOTYPE:
      default:
        return <Prototype {...iconProps} />
    }
  }

  return (
    <div
      onClick={onClick}
      className={cx(styles.root, { [styles.selected]: selected })}>
      { renderIcon(doc.resourceType) }

      <div className={styles.docName}>
        <Truncate placement='end'>
          { doc.title || UNTITLED }
        </Truncate>
      </div>

      <Close size={18} fill='info' />
    </div>
  )
}

BatchSelectedDocument.propTypes = {
  document: PropTypes.object,
  handleClick: PropTypes.func,
  index: PropTypes.number,
  selected: PropTypes.bool
}

export default BatchSelectedDocument
