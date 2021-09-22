import React from 'react'
import PropTypes from 'prop-types'

import { Color, Padded, Spaced, Text } from '@invisionapp/helios'

import {
  DOCUMENT_TYPES,
  FIGMA,
  FREEHAND,
  PROJECT,
  PROTOTYPE,
  SPACE,
  SPEC
} from '../../../constants/DocumentTypes'
import {
  MODAL_BACKDROP_ENTER_TIME,
  MODAL_ZOOM_TIME
} from '../../../constants/ModalConstants'

import Button from '../../Form/Button'

import styles from '../../../css/modals/delete.css'

class Delete extends React.Component {
  constructor (props) {
    super(props)

    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount () {
    setTimeout(() => {
      this.props.animateInComponents(this.props.getRefs(this, 'delete'), 0)
    }, MODAL_ZOOM_TIME + MODAL_BACKDROP_ENTER_TIME)
  }

  componentWillReceiveProps (nextProps) {
    const components = this.props.getRefs(this, 'delete')

    if (nextProps.willUnmount) {
      this.props.animateOutComponents(components, components.length - 1)
    }
  }

  handleDelete () {
    const { type, cuid, id } = this.props.document
    if (type === SPACE) {
      this.props.serverActions.deleteSpace.request(cuid)
    } else if (type === PROJECT) {
      this.props.serverActions.deleteProject.request(id, cuid)
    } else if (type === FREEHAND || type === PROTOTYPE || type === SPEC || type === FIGMA) {
      this.props.serverActions.deleteDocument.request(type, id)
    } else {
      this.props.serverActions.deleteDocument.request(type, cuid)
    }
  }

  render () {
    const { account } = this.props
    const { type, spaceName, title } = this.props.document

    const spaceProjectsEnabled = account && account.userV2 && account.userV2.flags.spaceProjectsEnabled
    const docType = DOCUMENT_TYPES[type] ? DOCUMENT_TYPES[type] : DOCUMENT_TYPES.external

    const deleteMessage = (
      spaceProjectsEnabled && type === SPACE
        ? docType.deleteModal.textWithProject
        : docType.deleteModal.text).replace('{spaceName}', ' ')

    return (
      <Padded vertical='xxl' horizontal='l'>
        <div className={`${styles.root}`}>
          <div
            ref={'delete-hero-image'}
            data-animation={'fade'}
            style={{ opacity: 0 }}
          >
            <div className={`${styles.image} ${type === SPACE ? styles.deleteSpaceIcon : styles.deleteDocumentIcon}`} />
            <Text order='title' size='smaller'>
              <Spaced top='m' bottom='s'>
                <h1>
                  {docType.deleteModal.title.replace('{title}', title)}
                </h1>
              </Spaced>
            </Text>
          </div>
          <div className={styles.wrap}
            ref='delete-subtitle'
            data-animation={'slide'}
            style={{ opacity: 0 }}>
            <Text order='body'>
              <Spaced vertical='s'>
                <Color shade='lighter'>
                  <p>
                    {deleteMessage}
                    { spaceName && <strong>{spaceName}</strong> }
                  </p>
                </Color>
              </Spaced>
            </Text>
          </div>
          <Spaced top='l'>
            <div
              ref='delete-actions'
              data-animation={'slide'}
              style={{ opacity: 0 }}
            >
              <Spaced right='s'>
                <Button
                  disabled={this.props.isDeleting}
                  size='larger'
                  order='secondary'
                  onClick={this.props.handleCloseModal}>
                  {docType.deleteModal.cancelButton}
                </Button>
              </Spaced>
              {this.props.isDeleting ? (
                <Button
                  size='larger'
                  order='secondary'
                  className={styles.working}>
                Deleting...
                </Button>
              ) : (
                <Button
                  size='larger'
                  order='primary'
                  onClick={this.handleDelete}>
                  {docType.deleteModal.deleteButton}
                </Button>
              )}
            </div>
          </Spaced>
        </div>
      </Padded>
    )
  }
}

Delete.propTypes = {
  actions: PropTypes.object,
  config: PropTypes.object,
  handleCloseModal: PropTypes.func,
  isDeleting: PropTypes.bool,
  serverActions: PropTypes.object,
  document: PropTypes.object,
  animateInComponents: PropTypes.func,
  animateOutComponents: PropTypes.func,
  getRefs: PropTypes.func,
  startUnmounting: PropTypes.func,
  willUnmount: PropTypes.bool
}

export default Delete
