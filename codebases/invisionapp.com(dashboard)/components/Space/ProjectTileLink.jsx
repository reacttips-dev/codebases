import React from 'react'

import { Link, Text } from '@invisionapp/helios'

import { APP_PROJECT_OPENED } from '../../constants/TrackingEvents'
import { trackEvent } from '../../utils/analytics'

import styles from '../../css/tiles/tile.css'

const handleTracking = (project, space, path) => {
  const event = {
    projectId: project.id,
    spaceId: space.id,
    spaceType: space && !space.isPublic ? 'invite-only' : 'team',
    destination: path,
    projectContext: 'space_index'
  }

  trackEvent(APP_PROJECT_OPENED, event)
}

const ProjectTitleLink = ({ project, space }) => (
  <Text
    className={styles.spaceName}
    color='text-lighter'
    order='body'
    size='smallest'
  >
    <Link
      href={project ? project.path : ''}
      data-app-shell-behavior='prevent-default'
      order='secondary'
      onClick={() => { handleTracking(project, space, project.path) }}
    >
      {project ? project.title : ''}
    </Link>
  </Text>
)

export default ProjectTitleLink
