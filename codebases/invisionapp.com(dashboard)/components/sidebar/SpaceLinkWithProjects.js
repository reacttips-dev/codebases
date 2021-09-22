import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { IconButton, Text, Icon, Action } from '@invisionapp/helios-one-web'

import styles from './css/spaces.css'
import { GenerateIDURL } from '../../utils/urlIDParser'

import { APP_SPACE_PROJECTS_EXPANDED, APP_SPACE_PROJECTS_COLLAPSED } from '../../constants/tracking-events'

import { useRoute } from './hooks/useRoute'
import AddProjectActionButton from './AddProjectActionButton'
import ProjectLinks from './ProjectLinks'

const SpaceLinkWithProjects = props => {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const [isCreateProjectButtonHover, setIsCreateProjectButtonHover] = useState(false)

  const {
    canCreateSpaces,
    handleTrackEvent,
    getProjects,
    index,
    isDragging,
    moveDocumentsToSpace,
    moveDocumentsToProject,
    onProjectClick,
    onSpaceClick,
    transitionDelay,
    selected,
    projects,
    space,
    isProjectsOpened,
    showProjectInSpace,
    showCreateProjectModal,
    setActiveSpaceIndex,
    projectsPrototypeUIEnabled
  } = props

  const spaceURL = `/spaces/${GenerateIDURL(space.id, space.title)}`

  const { pathname } = useRoute()

  const handleMouseOut = e => {
    if (isDraggingOver) setIsDraggingOver(false)
    if (isHover) setIsHover(false)
  }

  const handleMouseOver = e => {
    if (isDragging && !isDraggingOver) setIsDraggingOver(true)
    if (!isHover) setIsHover(true)
  }

  const handleCreateButtonMouseOver = e => {
    if (!isCreateProjectButtonHover) setIsCreateProjectButtonHover(true)
  }

  const handleCreateButtonMouseOut = e => {
    if (isCreateProjectButtonHover) setIsCreateProjectButtonHover(false)
  }

  const handleMouseUp = e => {
    if (!isDragging) return
    moveDocumentsToSpace(selected, space)
  }

  const toggleProjectsOpened = e => {
    e.preventDefault()
    e.stopPropagation()

    if (!isProjectsOpened && !projects) {
      getProjects(space.id)
    }

    if (handleTrackEvent) {
      handleTrackEvent(isProjectsOpened ? APP_SPACE_PROJECTS_COLLAPSED : APP_SPACE_PROJECTS_EXPANDED, {
        context: 'sidebar'
      })
    }

    setActiveSpaceIndex()
    showProjectInSpace(space.id, !isProjectsOpened)
  }

  return (
    <>
      <div className={cx(styles.spaceWrap, {
        [styles.wrapActive]: pathname.indexOf(spaceURL) >= 0,
        [styles.wrapHovered]: isHover && !isCreateProjectButtonHover
      })}>
        {space.hasContainers &&
        <span className={styles.projectCaret}>
          <IconButton
            aria-label={isProjectsOpened ? `Close projects list for ${space.title}` : `Open projects list for ${space.title}`}
            className={cx(styles.spaceLinkIconButton, { [styles.caretIsOpen]: isProjectsOpened })}
            as='button'
            data-app-shell-behavior='prevent-default'
            onClick={toggleProjectsOpened}
            size='24'
          >
            <Icon
              name='ArrowRight'
              color='surface-100'
              size='20'
            />
          </IconButton>
        </span>
        }
        <Action
          as='a'
          className={cx(styles.space, styles.spaceLinkWithProjects, {
            [styles.spaceLinkHasProjects]: space.hasContainers,
            [styles.active]: pathname.indexOf(spaceURL) >= 0,
            [styles.hovered]: isHover && !isCreateProjectButtonHover
          })}
          href={spaceURL}
          onClick={() => {
            setActiveSpaceIndex && setActiveSpaceIndex(index)
            onSpaceClick(space)
          }}
          onMouseOut={handleMouseOut}
          onMouseOver={handleMouseOver}
          onMouseUp={handleMouseUp}
          style={{
            transitionDelay: transitionDelay && `0s, ${transitionDelay}s, ${transitionDelay}s`
          }}
          title={space.title}
          data-app-shell-behavior='prevent-default'
          data-space-droparea='true'>

          <div className={styles.spaceLink}>
            {space.visibility === 'invite' && (
              <span className={styles.icon}>
                <Icon name='Lock'
                  color='surface-100'
                  size='16'
                />
              </span>
            )}

            <Text
              align='left'
              className={styles.title}
              color='surface-100'
              element='span'
              size='heading-14'>
              {space.title}
            </Text>

          </div>
        </Action>
        <span
          className={styles.addProjectWrap}
          onMouseOver={handleCreateButtonMouseOver}
          onMouseOut={handleCreateButtonMouseOut}
        >
          {canCreateSpaces && (
            <AddProjectActionButton
              handleTrackEvent={handleTrackEvent}
              setActiveSpaceIndex={setActiveSpaceIndex}
              showCreateProjectModal={showCreateProjectModal}
              space={space}
            />
          )}
        </span>
      </div>

      <div className={cx(styles.projects, { [styles.projectsOpened]: isProjectsOpened })}>
        <ProjectLinks
          projects={projects}
          space={space}
          onProjectClick={onProjectClick}
          moveDocumentsToProject={moveDocumentsToProject}
          isDragging={isDragging}
          selected={selected}
          projectsPrototypeUIEnabled={projectsPrototypeUIEnabled}
        />
      </div>
  </>
  )
}

SpaceLinkWithProjects.propTypes = {
  canCreateSpaces: PropTypes.bool,
  handleTrackEvent: PropTypes.func,
  getProjects: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  moveDocumentsToSpace: PropTypes.func.isRequired,
  moveDocumentsToProject: PropTypes.func.isRequired,
  onSpaceClick: PropTypes.func.isRequired,
  onProjectClick: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  space: PropTypes.object.isRequired,
  projects: PropTypes.array,
  transitionDelay: PropTypes.string,
  projectsOpened: PropTypes.bool,
  showProjectInSpace: PropTypes.func,
  showCreateProjectModal: PropTypes.func,
  index: PropTypes.number,
  setActiveSpaceIndex: PropTypes.func,
  projectsPrototypeUIEnabled: PropTypes.bool
}

export default memo(SpaceLinkWithProjects)
