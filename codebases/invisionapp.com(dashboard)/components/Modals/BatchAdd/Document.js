import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { Text, Truncate, DocumentIcon } from '@invisionapp/helios'

import {
  CheckSmaller
} from '@invisionapp/helios/icons'

import {
  DOCUMENT_TYPES,
  FREEHAND,
  UNTITLED
} from '../../../constants/DocumentTypes'
import AbbrevTimeAgo from '../../Common/AbbrevTimeAgo'

import styles from '../../../css/modals/batch-add/document.css'

const BatchDocument = ({
  active,
  document: doc,
  enableFreehandXFilteringSorting,
  freehandMetadata,
  handleClick,
  handleMouseLeave,
  handleMouseOver,
  index,
  isSelected
}) => {
  const onClick = () => handleClick(doc)
  const onMouseLeave = () => handleMouseLeave(index)
  const onMouseOver = () => handleMouseOver(index)

  const renderIcon = type => {
    if (type === FREEHAND && freehandMetadata?.iconAssetURL && enableFreehandXFilteringSorting) {
      return <img className={styles.freehandCustomIcons} alt='Freehand' src={freehandMetadata.iconAssetURL} />
    }
    return <DocumentIcon size='24' documentType={type} />
  }

  return (
    <div
      className={cx(styles.root, {
        [styles.active]: active,
        [styles.selected]: isSelected
      })}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
      onMouseOver={onMouseOver}>
      <div className={styles.icon} title={DOCUMENT_TYPES[doc.resourceType]?.label}>
        { renderIcon(doc.resourceType) }
      </div>

      <div className={styles.titleWrap}>
        <Text
          color='text'
          element='div'
          order='body'>
          <Truncate placement='end'>
            {doc.title || UNTITLED}
          </Truncate>
        </Text>

        <Text
          color='text-lightest'
          element='div'
          order='body'
          size='smallest'>
          { doc.space && doc.space.title &&
            <>
              <span className={styles.spaceTitleWrap}>
                {doc.space.title}
              </span>
              <span className={styles.separator} />
            </>
          }

          Updated <AbbrevTimeAgo date={doc.contentUpdatedAt} live={false} />

          {doc.userLastAccessedAt !== '' &&
            <>
              <span className={styles.separator} />
              Viewed <AbbrevTimeAgo date={doc.userLastAccessedAt} live={false} />
            </>
          }
        </Text>
      </div>

      <div className={styles.check}>
        <CheckSmaller
          aria-label='selected'
          fill='info'
          size={24} />
      </div>
    </div>
  )
}

BatchDocument.propTypes = {
  active: PropTypes.bool,
  document: PropTypes.object,
  enableFreehandXFilteringSorting: PropTypes.bool,
  freehandMetadata: PropTypes.object,
  handleClick: PropTypes.func,
  handleMouseLeave: PropTypes.func,
  handleMouseOver: PropTypes.func,
  index: PropTypes.number,
  isSelected: PropTypes.bool
}

export default BatchDocument
