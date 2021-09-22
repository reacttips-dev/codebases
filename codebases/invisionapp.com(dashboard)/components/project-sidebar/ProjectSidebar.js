import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Header from './Header'
import Documents from './Documents'
import Settings from './Settings'

import styles from './css/sidebar.css'

const ProjectSidebar = ({
  actions,
  enableProjectOverviewPages,
  project,
  serverActions,
  sidebarCondensed,
  sidebarOpen
}) => {
  const updateTitle = title => {
    serverActions.updateProjectSidebar.request(
      project.spaceId,
      project.id,
      title,
      '',
      project.shape,
      project.color
    )
  }

  return (
    <div className={cx(styles.root, {
      [styles.sidebarExpanded]: !sidebarCondensed,
      [styles.open]: sidebarOpen
    })}>
      <Header
        isLoading={project.isLoading}
        title={project.title}
        canEdit={project.permissions.edit}
        color={project.color}
        overviewPageUrl={enableProjectOverviewPages ? project.overviewPageUrl : ''}
        path={project.path}
        shape={project.shape}
        spaceName={project.spaceName}
        spaceUrl={project.spaceUrl}
        updateTitle={updateTitle}
        projectId={project.id}
      />

      <Documents />

      <Settings
        canEdit={project.permissions.edit}
        deleteProject={actions.showDeleteProjectModal}
      />
    </div>
  )
}

ProjectSidebar.propTypes = {
  actions: PropTypes.object,
  project: PropTypes.object,
  serverActions: PropTypes.object
}

export default ProjectSidebar
