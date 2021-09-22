import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { Text } from '@invisionapp/helios'

import {
  Boards,
  Freehand,
  Prototype,
  Rhombus,
  Studio,
  Spec
} from '@invisionapp/helios/icons'

import {
  DOCUMENT_TYPES,
  BOARD,
  FREEHAND,
  HARMONY,
  PRESENTATION,
  PROTOTYPE,
  RHOMBUS,
  SPEC,
  UNTITLED
} from '../../../../constants/DocumentTypes'
import AbbrevTimeAgo from '../../../Common/AbbrevTimeAgo'

import styles from '../../../../css/modals/batch-add/document.css'

class BatchDocument extends Component {
  static propTypes = {
    account: PropTypes.object,
    active: PropTypes.bool,
    document: PropTypes.object,
    handleClick: PropTypes.func,
    handleMouseLeave: PropTypes.func,
    handleMouseOver: PropTypes.func,
    index: PropTypes.number
  }

  constructor (props) {
    super(props)

    this.docRef = createRef()
  }

  componentDidUpdate (prevProps) {
    // is this document now active?
    if (this.docRef && this.props.active && prevProps.active !== this.props.active) {
      this.docRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }

  handleClick = () => {
    this.props.handleClick(this.props.document)
  }

  handleMouseLeave = () => {
    this.props.handleMouseLeave(this.props.index)
  }

  handleMouseOver = () => {
    this.props.handleMouseOver(this.props.index)
  }

  renderCreatorName = (userID, data) => {
    if (data.userID !== userID) {
      return null
    }

    return (
      <React.Fragment>
        <span className={styles.separator} />
        Created by you
      </React.Fragment>
    )
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
      case PROTOTYPE:
        return <Prototype {...iconProps} />
      case SPEC:
        return <Spec {...iconProps} />
      case RHOMBUS:
        return <Rhombus {...iconProps} />
      default:
        return null
    }
  }

  render () {
    const {
      account: {
        user: {
          userID
        }
      },
      active,
      document: {
        type,
        data
      }
    } = this.props

    return (
      <div
        ref={this.docRef}
        className={cx(styles.root, { [styles.active]: active })}
        onClick={this.handleClick}
        onMouseLeave={this.handleMouseLeave}
        onMouseOver={this.handleMouseOver}>
        <div className={styles.icon}>
          { this.renderIcon(type) }
        </div>

        <div className={styles.titleWrap}>
          <Text
            color='text'
            element='div'
            order='body'>
            {data.name || UNTITLED}
          </Text>

          <Text
            color='text-lightest'
            element='div'
            order='body'
            size='smallest'>
            { DOCUMENT_TYPES[type].label }
            { this.renderCreatorName(userID, data) }
            <span className={styles.separator} />
            Last updated <AbbrevTimeAgo date={data.updatedAt} live={false} />
          </Text>
        </div>
      </div>
    )
  }
}

export default BatchDocument
