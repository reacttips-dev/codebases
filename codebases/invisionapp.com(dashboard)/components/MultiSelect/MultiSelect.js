import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import {
  Button,
  Flex,
  Spaced,
  Text
} from '@invisionapp/helios'

import styles from '../../css/multiselect.css'

const MultiSelect = ({ clearSelectedDocuments, moveSelectedDocuments, selectedCount }) => {
  return (
    <div className={cx(styles.root, styles.withSidebar, {
      [styles.open]: selectedCount > 0
    })}>
      <Flex className={styles.inner} justifyContent='space-between' alignItems='center'>
        <div>
          {selectedCount > 0 &&
          <Fragment>
            <Text
              color='text'
              element='span'
              order='body'
              size='larger'>
              <strong>{selectedCount}</strong> item{selectedCount !== 1 ? 's' : ''} selected
            </Text>

            <Spaced left='s'>
              <Button
                className={styles.clearButton}
                onClick={clearSelectedDocuments}
                order='secondary'
                element='a'
                role='button'>
                Clear all
              </Button>
            </Spaced>
          </Fragment>
          }
        </div>

        <div className={styles.buttons}>
          <Button
            disabled={selectedCount === 0}
            element='a'
            onClick={selectedCount > 0 ? moveSelectedDocuments : null}
            order='primary-alt'
            role='button'>
            Move to space
          </Button>
        </div>
      </Flex>
    </div>
  )
}

MultiSelect.propTypes = {
  clearSelectedDocuments: PropTypes.func,
  moveSelectedDocuments: PropTypes.func,
  selectedCount: PropTypes.number
}

MultiSelect.defaultProps = {
  selectedCount: 0
}

export default MultiSelect
