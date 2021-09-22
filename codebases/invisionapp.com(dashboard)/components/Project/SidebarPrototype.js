/**
 * This is a prototype for UI testing.  This should never be seen
 * by customers :)
 */
import React from 'react'

import Header from './Header'
import Documents from './SidebarDocuments'
import Settings from './Settings'

import styles from '../../css/project-prototype.css'

const SidebarPrototype = ({
  project,
  selectedUrl,
  setSelectedUrl,
  toggleDeleteModal,
  updateProject
}) => {
  const updateTitle = (value = 'Default title') => {
    updateProject(project.id, project.spaceId, { title: value })
  }

  const deleteProject = () => {
    toggleDeleteModal({
      type: 'project',
      id: project.id,
      cuid: project.spaceId,
      spaceName: project.spaceName
    })
  }

  return (
    <section className={styles.sidebar}>
      <Header
        isLoading={project.isLoading}
        description={project.description}
        title={project.title}
        canEdit={project.permissions.edit}
        spaceName={project.spaceName}
        spaceUrl={project.spaceUrl}
        updateTitle={updateTitle}
        projectId={project.id}
        setSelectedUrl={setSelectedUrl}
      />

      <Documents
        isLoading={project.isLoading}
        projectId={project.id}
        selectedUrl={selectedUrl}
        setSelectedUrl={setSelectedUrl}
      />

      {project.permissions.edit &&
        <Settings deleteProject={deleteProject} />
      }
    </section>
  )
}

export default SidebarPrototype
