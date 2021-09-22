import React, { Component } from 'react'
import { Fullscreen, Dialog } from '@invisionapp/helios-one-web'

import {
  CREATE_PROJECT_MODAL,
  CREATE_SPACE_MODAL,
  DELETE_PROJECT_MODAL,
  DIALOG_MODALS,
  SPACE_PERMISSIONS_WARNING_MODAL
} from '../../constants/modal-types'
import { APP_CREATE_DIALOG_CLOSED, APP_PROJECT_CREATED } from '../../constants/tracking-events'
import Portal from '../common/Portal'
import CreateProjectModal from '../modals/CreateProjectModal'
import CreateSpaceModal from '../modals/CreateSpaceModal'
import DeleteProjectModal from '../modals/DeleteProjectModal'
import SpacePermissionsWarningModal from '../modals/SpacePermissionsWarning'

import styles from '../sidebar/css/portal-modal.css'

class PortalModal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      willClose: false
    }
  }

  componentDidUpdate (prevProps) {
    const { handleTrackEvent, open, createdProjectData } = this.props
    if (open && !prevProps.open) {
      const context = window.inGlobalContext.appShell.getFeatureContext('sidebar')
      this.setState({
        willClose: false
      })
      setTimeout(() => {
        context.sendCommand('resetModal')
      }, 500)
    }

    if (createdProjectData && createdProjectData !== prevProps.createdProjectData && handleTrackEvent) {
      const { spaceId, id, context: createContext } = createdProjectData

      const trackedEvent = {
        projectID: id,
        spaceID: spaceId,
        method: createContext
      }

      handleTrackEvent(APP_PROJECT_CREATED, trackedEvent)
    }
  }

  render () {
    const {
      account,
      config,
      createdSpaceData,
      error,
      errorCode,
      handleTrackEvent,
      isCreating,
      modalData,
      project,
      type,
      serverActions
    } = this.props

    const isDialog = DIALOG_MODALS.indexOf(type) >= 0
    const Component = isDialog ? Dialog : Fullscreen
    let className = isDialog ? '' : styles.fullscreen

    if (type === CREATE_PROJECT_MODAL) {
      className = styles.wideDialog
    }

    let modalProps = {}
    if (isDialog) {
      if (type === DELETE_PROJECT_MODAL) {
        modalProps.primaryButton = 'Yes, Delete'
        modalProps.secondaryButton = 'Never mind'
        modalProps.title = 'Are you sure?'
        modalProps.order = 'negative'
        modalProps.closeButton = 'Cancel'
        modalProps.onRequestPrimary = () => {
          serverActions.deleteProject.request(project.id, project.spaceId)
        }
      }
    }

    const closeModalHandler = (delayClose) => {
      this.props.handleTrackEvent(APP_CREATE_DIALOG_CLOSED, { action: 'createModalClose' })
      this.setState({
        willClose: true
      })
      if (delayClose) {
        setTimeout(() => this.props.closeModal(), 300)
      } else {
        this.props.closeModal()
      }
    }

    return (
      <Portal>
        <Component
          className={className}
          isOpen={this.props.open}
          closeonesc='true'
          onRequestClose={closeModalHandler}
          {...modalProps}>
          <div className={styles.modal}>
            {
              type === CREATE_PROJECT_MODAL && modalData &&
              modalData.spaceName &&
              modalData.spaceId &&
              account.flags.spaceProjectsEnabled &&
              <CreateProjectModal
                closeModal={closeModalHandler}
                open={this.props.open}
                error={error}
                errorCode={errorCode}
                handleTrackEvent={handleTrackEvent}
                isCreating={isCreating}
                serverActions={serverActions}
                modalData={modalData}
                willClose={this.state.willClose}
              />
            }

            {type === DELETE_PROJECT_MODAL &&
              <DeleteProjectModal
                spaceName={project.spaceName ? project.spaceName : 'its\' parent space'}
              />
            }

            {type === CREATE_SPACE_MODAL &&
              <CreateSpaceModal
                account={account}
                config={config}
                createdSpaceData={createdSpaceData}
                error={error}
                handleTrackEvent={handleTrackEvent}
                isCreating={isCreating}
                open={this.props.open}
                serverActions={serverActions}
                willClose={this.state.willClose}
              />}

            {type === SPACE_PERMISSIONS_WARNING_MODAL &&
              <SpacePermissionsWarningModal {...this.props} />
            }
          </div>
        </Component>
      </Portal>
    )
  }
}

export default PortalModal
