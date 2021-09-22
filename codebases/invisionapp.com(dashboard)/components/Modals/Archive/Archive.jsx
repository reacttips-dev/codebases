import React from 'react'
import PropTypes from 'prop-types'

import { Button, Text, Padded, Spaced } from '@invisionapp/helios'

import {
  MODAL_BACKDROP_ENTER_TIME,
  MODAL_ZOOM_TIME
} from '../../../constants/ModalConstants'
import { getDocumentName } from '../../../utils/getDocumentName'

import styles from '../../../css/modals/archive.css'

class Archive extends React.Component {
  constructor (props) {
    super(props)

    this.handleArchiveDocument = this.handleArchiveDocument.bind(this)

    this.state = {
      processing: false
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.props.animateInComponents(this.props.getRefs(this, 'archive'), 0)
    }, MODAL_ZOOM_TIME + MODAL_BACKDROP_ENTER_TIME)
  }

  componentWillReceiveProps (nextProps) {
    const components = this.props.getRefs(this, 'archive')

    if (nextProps.willUnmount) {
      this.props.animateOutComponents(components, components.length - 1)
    }
  }

  handleArchiveDocument () {
    const { type, id, isArchived } = this.props.document
    if (isArchived) {
      this.props.serverActions.activateDocument.request(
        type,
        id
      )
    } else {
      this.props.serverActions.archiveDocument.request(
        type,
        id
      )
    }
  }

  render () {
    const { type, isArchived } = this.props.document

    const typeName = getDocumentName(type)

    const titleText = isArchived ? `This ${typeName} is archived` : 'Are you sure?'
    const descriptionText = isArchived
      ? `If you restore it, it will count toward your plan’s document limit`
      : `If you archive this ${typeName}, nobody will be able to access it until it’s restored`
    const buttonText = isArchived ? 'Restore' : 'Archive'

    return (
      <div className={styles.root}>
        <div ref='archive-hero' className={styles.image} data-animation='fade' />

        <div ref='archive-inner' data-animation='fade' className={styles.inner}>
          <Padded top='l' bottom='s'>
            <Text
              align='center'
              color='text'
              order='title'
              size='smaller'
              element='h1'>
              {titleText}
            </Text>
          </Padded>

          <Padded bottom='m'>
            <Text
              align='center'
              color='text-lighter'
              order='body'
              size='larger'
              prose>
              {descriptionText}
            </Text>
          </Padded>

          <Padded bottom='l'>
            <div className={styles.buttons}>
              <Button onClick={this.props.handleCloseModal} size='larger' order='secondary'>
                Never Mind
              </Button>

              <Spaced left='xs'>
                <Button
                  disabled={this.state.processing}
                  onClick={this.handleArchiveDocument}
                  size='larger'
                  order='primary'>
                  {buttonText}
                </Button>
              </Spaced>
            </div>
          </Padded>
        </div>
      </div>
    )
  }
}

Archive.propTypes = {
  actions: PropTypes.object,
  document: PropTypes.object,
  handleCloseModal: PropTypes.func,
  serverActions: PropTypes.object
}

export default Archive
