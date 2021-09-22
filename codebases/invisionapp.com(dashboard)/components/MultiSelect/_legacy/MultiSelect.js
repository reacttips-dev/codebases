import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import cx from 'classnames'

import {
  Button,
  Flex,
  Popover,
  Spaced,
  Text
} from '@invisionapp/helios'

import {
  disabledSelectedDocuments,
  hiddenSelectedDocumentCount
} from '../../../selectors/documents'

import styles from '../../../css/multiselect.css'

export class MultiSelect extends PureComponent {
  static propTypes = {
    clearSelectedDocuments: PropTypes.func,
    deselectDocuments: PropTypes.func,
    disabledDocuments: PropTypes.array,
    hiddenCount: PropTypes.number,
    moveSelectedDocuments: PropTypes.func,
    pagingEnabled: PropTypes.bool,
    selected: PropTypes.array
  }

  static defaultProps = {
    disabledDocuments: [],
    hiddenCount: 0,
    pagingEnabled: false
  }

  constructor (props) {
    super(props)

    this.deselectDocuments = this.deselectDocuments.bind(this)
  }

  deselectDocuments () {
    this.props.deselectDocuments(this.props.disabledDocuments)
  }

  renderButton () {
    const { disabledDocuments, pagingEnabled } = this.props

    return (
      <Button
        disabled={!pagingEnabled && disabledDocuments.length > 0}
        element='a'
        onClick={!pagingEnabled && disabledDocuments.length > 0 ? null : this.props.moveSelectedDocuments.bind(this, null)}
        order='primary-alt'
        role='button'>
        Move to space
      </Button>
    )
  }

  render () {
    const { disabledDocuments, hiddenCount, pagingEnabled, selected } = this.props

    return (
      <div className={cx(styles.root, styles.withSidebar, {
        [styles.open]: selected.length > 0
      })}>
        <Flex className={styles.inner} justifyContent='space-between' alignItems='center'>
          <div>
            {selected.length > 0 &&
            <Fragment>
              <Text
                color='text'
                element='span'
                order='body'
                size='larger'>
                <strong>{selected.length}</strong> item{selected.length !== 1 ? 's' : ''} selected
                { !pagingEnabled && hiddenCount > 0 && <span> ({hiddenCount} hidden)</span>}
              </Text>

              <Spaced left='s'>
                <Button
                  className={styles.clearButton}
                  onClick={this.props.clearSelectedDocuments}
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
            { !pagingEnabled && disabledDocuments.length > 0
              ? <Popover
                showOn='click'
                placement='top'
                chevron='end'
                size='larger'
                trigger={(
                  <div>{this.renderButton()}</div>
                )}>
                <div className={styles.popoverInner}>
                  <Spaced bottom='s'>
                    <div>
                      {disabledDocuments.length} of the selected items cannot be moved because you do not have sufficient permissions.
                    </div>
                  </Spaced>

                  <Button
                    onClick={this.deselectDocuments}
                    order='primary-alt'
                    element='a'
                    size='smaller'
                    role='button'>
                    Deselect {disabledDocuments.length} item{disabledDocuments.length !== 1 ? 's' : ''}
                  </Button>
                </div>
              </Popover>
              : this.renderButton() }
          </div>
        </Flex>
      </div>
    )
  }
}

export default connect(state => ({
  disabledDocuments: disabledSelectedDocuments(state),
  hiddenCount: hiddenSelectedDocumentCount(state)
}))(MultiSelect)
