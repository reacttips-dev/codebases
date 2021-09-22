import React from 'react'
import { IconButton, Icon } from '@invisionapp/helios-one-web'

import { APP_SIDEBAR_LINK_CLICKED } from '../../constants/tracking-events'
import styles from './css/add-space-action-button.css'

const AddProjectActionButton = ({ handleTrackEvent, showCreateProjectModal, setActiveSpaceIndex, space }) => {
  const handleCreateProject = (e) => {
    e.preventDefault()
    e.stopPropagation()
    handleTrackEvent(APP_SIDEBAR_LINK_CLICKED, {
      link_clicked: 'create_project'
    })

    if (setActiveSpaceIndex) {
      setActiveSpaceIndex()
    }

    if (showCreateProjectModal) {
      showCreateProjectModal({ spaceName: space.title, spaceId: space.id })
    }
  }

  return (
    <IconButton
      aria-label={`Create a Project in ${space.title}`}
      className={styles.addProjectButton}
      as='button'
      data-app-shell-behavior='prevent-default'
      onClick={handleCreateProject}
      size='24'
    >
      <Icon name='Add' color='surface-100' size='16' />
    </IconButton>
  )
}

export default AddProjectActionButton
