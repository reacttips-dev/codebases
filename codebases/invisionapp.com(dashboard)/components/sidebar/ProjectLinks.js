import React, { memo, useState } from 'react'
import cx from 'classnames'

import { Text, Action } from '@invisionapp/helios-one-web'

import styles from './css/spaces.css'
import { GenerateIDURL } from '../../utils/urlIDParser'
import { useRoute } from './hooks/useRoute'

const ProjectLinks = ({
  projects,
  space,
  onProjectClick,
  moveDocumentsToProject,
  isDragging,
  selected,
  projectsPrototypeUIEnabled
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const { pathname } = useRoute()

  if (!projects) {
    return null
  }

  const handleProjectMouseOut = e => {
    if (isDraggingOver) setIsDraggingOver(false)
  }

  const handleProjectMouseOver = e => {
    if (isDragging && !isDraggingOver) setIsDraggingOver(true)
  }

  const handleProjectMouseUp = e => {
    if (!isDragging || !e.target.dataset.projectId || !e.target.dataset.projectTitle) return
    const { projectId, projectTitle } = e.target.dataset

    moveDocumentsToProject(selected, space, projectId, projectTitle)
  }

  return projects.map(project => {
    const projectURL = `/projects/${GenerateIDURL(project.id, project.title)}${projectsPrototypeUIEnabled ? '/new' : ''}`

    return (
      <div key={project.id} className={cx(styles.projectNoAnimation, {
        [styles.active]: pathname.indexOf(projectURL) >= 0
      })}>
        <Action
          as='a'
          href={projectURL}
          onMouseOut={handleProjectMouseOut}
          onMouseOver={handleProjectMouseOver}
          onMouseUp={handleProjectMouseUp}
          onClick={() => { onProjectClick(project) }}
          data-app-shell-behavior='prevent-default'
          data-space-droparea='true'
          data-project-id={project.id}
          data-project-title={project.title}
        >
          <Text
            align='left'
            className={styles.title}
            color='surface-100'
            element='span'
            size='body-14'>
            {project.title}
          </Text>
        </Action>
      </div>
    )
  })
}

export default memo(ProjectLinks)
