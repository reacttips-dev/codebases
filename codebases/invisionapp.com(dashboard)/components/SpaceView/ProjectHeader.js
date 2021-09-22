import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { Link, Spaced, Text, Dropdown, IconButton } from '@invisionapp/helios'
import { Back, More } from '@invisionapp/helios/icons'

import Title from './Title'

import styles from '../../css/space/sidebar/header.css'
import { trackEvent } from '../../utils/analytics'
import { APP_PROJECT_CONTEXTUAL_MENU_CLICKED, APP_PROJECT_CONTEXTUAL_MENU_OPENED, APP_PROJECT_NAME_FOCUSED, APP_PROJECT_NAME_UPDATE } from '../../constants/TrackingEvents'

const ProjectHeader = ({
  actions,
  project,
  serverActions
}) => {
  const deleteProject = () => {
    trackEvent(APP_PROJECT_CONTEXTUAL_MENU_CLICKED, { projectID: project.id, option: 'delete' })
    actions.toggleDeleteModal({
      type: 'project',
      id: project.id,
      cuid: project.spaceId,
      spaceName: project.spaceName
    })
  }

  const updateTitle = (value = 'Default title') => {
    trackEvent(APP_PROJECT_NAME_UPDATE, { projectID: project.id })
    serverActions.updateProject.request(project.id, project.spaceId, {
      title: value,
      description: project.description,
      shape: project.shape,
      color: project.color
    })
  }

  return (
    <div className={styles.spaceInfo}>
      <div className={styles.spaceLink}>
        { project.isLoading
          ? <div className={styles.spaceLinkLoading} />
          : <Link href={project.spaceUrl}>
            <Back
              aria-label='Back to space'
              fill='text-lighter'
              size={24}
              strokeWidth='1'
              viewBox='24'
            />
            <Text color='text-lighter'>
              {project.spaceName + ' '}
            </Text>
          </Link>
        }
      </div>

      <div className={styles.titleWrap}>
        { project.isLoading
          ? <div className={styles.titleLeftLoading} />
          : <Text order='title' color='text-darker' className={cx(styles.title, styles.projectTitle)}>
            <Title
              allowEdit={project.permissions.edit}
              charLimit={100}
              className={cx(styles.title, styles.titleLeft, styles.projectTitle, {
                [styles.readonly]: !project.permissions.edit
              })}
              isLoading={project.isLoading && !project.title}
              onFocus={() => {
                trackEvent(APP_PROJECT_NAME_FOCUSED, { projectID: project.id })
              }}
              onSubmit={updateTitle}
              placeholder='Name your project'
              title={project.title}
              error={project.error}
            />
          </Text>
        }

        { project.permissions.edit &&
          <Spaced left='s'>
            <Dropdown
              aria-label='Project settings menu'
              className={styles.projectDropdown}
              closeOnClick
              items={[{
                destructive: true,
                label: 'Delete Project',
                onClick: deleteProject,
                type: 'item'
              }]}
              placement='bottom'
              align='left'
              trigger={(
                <IconButton withTooltip={false} onClick={() => {
                  trackEvent(APP_PROJECT_CONTEXTUAL_MENU_OPENED, { projectID: project.id })
                }}>
                  <More size='24' />
                </IconButton>
              )}
              unstyledTrigger
            />
          </Spaced>
        }
      </div>
    </div>
  )
}

ProjectHeader.propTypes = {
  actions: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  serverActions: PropTypes.object.isRequired
}

export default ProjectHeader
