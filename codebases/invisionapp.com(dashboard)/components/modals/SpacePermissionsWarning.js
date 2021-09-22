import React from 'react'

import { Text, Stack, Button, Adjacent } from '@invisionapp/helios-one-web'

import styles from './css/space-permissions-warning.css'

const SpacePermissionsWarningModal = props => {
  const selectedSpace = props.modal.modalData.space
  const moveToProject = props.modal.modalData.moveToProject
  const selectedProjectId = props.modal.modalData.projectId
  const selectedProjectTitle = props.modal.modalData.projectTitle

  const handleSubmit = () => {
    if (!moveToProject) {
      props.serverActions.moveDocumentsToSpace.request(
        props.selected.documents,
        props.modal.modalData.space.id
      )
    } else {
      props.serverActions.moveDocumentsToProject.request(
        props.selected.documents,
        props.modal.modalData.space.id,
        selectedProjectId,
        selectedProjectTitle
      )
    }

    props.actions.closeModal()
  }

  const projectText = selectedSpace.isPublic
    ? `If you add this document to the ${selectedProjectTitle} project in ${selectedSpace.title} space, anyone from ${props.account.team.name} or the space can access it.`
    : `If you add this document to the ${selectedProjectTitle} project in ${selectedSpace.title} space, members of ${props.account.team.name} will only be able to find it if you invite them.`

  const spaceText = selectedSpace.isPublic
    ? `If you add this document to the ${selectedSpace.title} space, anyone from ${props.account.team.name} or the space can access it.`
    : `If you add this document to the ${selectedSpace.title} space, members of ${props.account.team.name} will only be able to find it if you invite them.`

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <Stack spacing='24' justifyContent='center'>
          <Text size='heading-24' color='surface-100'>
            <div>Check your sharing settings</div>
          </Text>

          <Text color='surface-80' size='body-14-long'>
            <p className={styles.warningText}>{moveToProject ? projectText : spaceText}</p>
          </Text>

          <div className={styles.buttonGroup}>
            <Adjacent spacing='24' >
              <Button
                className={styles.button}
                order='secondary'
                type='button'
                as='button'
                onClick={props.actions.closeModal}
                size='48'>
                  Cancel
              </Button>
              <Button
                className={styles.button}
                order='primary'
                type='button'
                as='button'
                onClick={handleSubmit}
                size='48'>
                  Continue
              </Button>
            </Adjacent>
          </div>

        </Stack>
      </div>
    </div>
  )
}

export default SpacePermissionsWarningModal
