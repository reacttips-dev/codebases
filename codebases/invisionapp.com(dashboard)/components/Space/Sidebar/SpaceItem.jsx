import React, { useState, useCallback, useEffect, memo } from 'react'
import { Link } from 'react-router'
import { DocumentIcon, IconButton, Text, AvatarStack, Tag } from '@invisionapp/helios'
import { DirectRight, Lock } from '@invisionapp/helios/icons'
import AbbrevTimeAgo from '../../Common/AbbrevTimeAgo'
import { GenerateIDURL } from '../../../utils/urlIDParser'
import {
  APP_SPACE_OPENED,
  APP_SPACE_PROJECTS_EXPANDED,
  APP_SPACE_PROJECTS_COLLAPSED,
  APP_PROJECT_OPENED
} from '../../../constants/TrackingEvents'
import LoadingSpace from './LoadingSpace'
import styles from '../../../css/space/sidebar/space-items.css'
import cx from 'classnames'
import { trackEvent } from '../../../utils/analytics'
import { areEqual } from 'react-window'
import update from 'immutability-helper'

const handleTracking = (space, spaceContext = 'spaces_index') => {
  const {
    id,
    data,
    visibility
  } = space

  const trackedEvent = {
    spaceId: id,
    spaceType: visibility === 'team' || (data && data.isPublic) ? 'team' : 'invite-only',
    spaceContext
  }

  trackEvent(APP_SPACE_OPENED, trackedEvent)
}

// TODO: to be removed - isMember is now returned for list/search
const hasJoinedSpace = (members, account) => {
  if (!account || !members || members.length === 0) {
    return false
  }

  const {
    user: { userID }
  } = account

  return members.reduce((bool, curr) => {
    if (bool === true) {
      return bool
    }
    return userID === curr.userId
  }, false)
}

export const SpaceRow = ({
  index,
  space,
  style,
  account,
  handleGetExtraMembers,
  hiddenTopBorder,
  members,
  getProjects,
  showProjectInSpace,
  projects,
  projectsDetail,
  spaceProjectsEnabled,
  spaceContext,
  withIcon
}) => {
  update(space, {
    members: { '$set': space.members ? space.members : [] },
    document: { '$set': space.documents ? space.documents : [] }
  })

  const dateLabel = space.userLastAccessedAt ? 'Viewed ' : 'Updated '
  const date = space.userLastAccessedAt
    ? space.userLastAccessedAt
    : space.contentUpdatedAt

  const toggleProjectsOpened = (e) => {
    e.stopPropagation()
    e.preventDefault()

    showProjectInSpace(index, !space.isOpen)

    trackEvent(space.isOpen ? APP_SPACE_PROJECTS_COLLAPSED : APP_SPACE_PROJECTS_EXPANDED, {
      context: 'spaces_index_page'
    })

    if (!space.isOpen) {
      // fetch projects
      const MAX_PROJECTS_TO_FETCH = 50
      getProjects(space.id, MAX_PROJECTS_TO_FETCH, true)
    }
  }

  const Project = ({ project }) => {
    const projectDateLabel = project.userLastAccessedAt ? 'Viewed ' : 'Updated '
    const projectDate = project.userLastAccessedAt
      ? project.userLastAccessedAt
      : project.contentUpdatedAt

    const projectDetail = projectsDetail[project.id]

    return (
      <Link
        onClick={() => {
          trackEvent(APP_PROJECT_OPENED, { projectContext: 'spaces_index', projectID: project.id })
        }}
        className={cx(styles.project)}
        key={`project-item-${project.id}`}
        to={`/projects/${GenerateIDURL(project.id, project.title)}`}
      >
        <div className={cx(styles.info, styles.cell)}>
          <div className={styles.spaceName}>
            <Text order='subtitle' className={styles.spaceTitle}>
              {project.title}
            </Text>
          </div>
        </div>
        <div className={cx(styles.avatarStack, styles.cell)} />
        <div className={cx(styles.documentCount, styles.cell)}>
          <Text order='body' size='smaller' color='text-lighter'>
            {projectDetail && `${projectDetail.documentCount} document${projectDetail.documentCount === 1 ? '' : 's'}`}
          </Text>
        </div>
        <div className={cx(styles.updatedAt, styles.cell)}>
          <Text order='body' size='smaller' color='text-lighter'>
            {projectDateLabel}
            <AbbrevTimeAgo date={projectDate} live={false} />
          </Text>
        </div>
      </Link>
    )
  }

  return (
    <div style={{ ...style,
      maxHeight: style.height,
      height: 'auto'
    }}>
      <Link
        className={cx(styles.spaceWrap, { [styles.hiddenTopBorder]: hiddenTopBorder })}
        onClick={handleTracking.bind(this, space, spaceContext)}
        to={`/spaces/${GenerateIDURL(space.id, space.title)}`}
        key={`space-item-${space.id}`}
      >
        {spaceProjectsEnabled && space.hasProjects && (
          <div className={cx(styles.projectCaret)} data-testid={`space-project-toggle-${space.id}`}
          >
            <IconButton
              className={cx({ [styles.caretIsOpen]: space.isOpen })}
              element='button'
              data-app-shell-behavior='prevent-default'
              onClick={toggleProjectsOpened}
              withTooltip={false}
              withBackground
              size='smaller'
            >
              <DirectRight
                size={20}
              />
            </IconButton>
          </div>
        )}
        <div className={cx(styles.info, { [styles.cell]: !spaceProjectsEnabled, [styles.cellNoPadding]: spaceProjectsEnabled })}>
          <div className={styles.spaceName}>
            {withIcon && (
              <div className={styles.resourceIcon}>
                <DocumentIcon
                  documentType='space'
                  size='36'
                  isDecorative
                />
              </div>
            )}
            {space.visibility === 'invite' && <Lock size={16} />}
            <Text order='subtitle' className={styles.spaceTitle}>
              {space.title}
            </Text>
            {(space.isMember || hasJoinedSpace(space.members, account)) && (
              <Tag className={styles.tag} inert compact>
                Joined
              </Tag>
            )}
          </div>
          {!spaceProjectsEnabled && space.description && (
            <Text
              order='body'
              size='smaller'
              color='text-lighter'
              className={styles.spaceDescription}
            >
              {space.description}
            </Text>
          )}
        </div>
        <div className={cx(styles.avatarStack, styles.cell)} onMouseEnter={space.memberCount > 4 ? handleGetExtraMembers : null}>
          <AvatarStack
            avatars={members || space.members}
            color='dark'
            excessCutoff='10'
            limit='4'
            tooltipPlacement='top'
            tooltipDomNode={document.body}
            totalPeople={space.memberCount}
            withTooltip
          />
        </div>
        <div className={cx(styles.documentCount, styles.cell)}>
          <Text order='body' size='smaller' color='text-lighter'>
            {`${space.documentCount} document${space.documentCount === 1 ? '' : 's'}`}
          </Text>
        </div>
        <div className={cx(styles.updatedAt, styles.cell)}>
          <Text order='body' size='smaller' color='text-lighter'>
            {dateLabel}
            <AbbrevTimeAgo date={date} live={false} />
          </Text>
        </div>
      </Link>

      {spaceProjectsEnabled && (
        <div
          className={space.isOpen ? styles.projectListExpanded : styles.projectListCollapsed}
        >
          {projects && projects.map((project) => (<Project project={project} />))}
        </div>
      )}

    </div>
  )
}

const Space = ({ index, data: props, style }) => {
  const spaceResource = props.spacesResource.spaces[index]
  const serverActions = props.serverActions
  const actions = props.actions
  const spacesMembers = props.spacesMembers
  const projects = props.projects
  const spaceProjectsEnabled = props.spaceProjectsEnabled
  const account = props.account
  const withIcon = account && account.userV2 && account.userV2.flags.spaceProjectsEnabled && props.withIcon

  if (!spaceResource) {
    return <LoadingSpace key={index} />
  }

  const spaceDetail = props.spacesDetail[spaceResource.id]

  if (!spaceDetail) {
    return <LoadingSpace key={index} />
  }
  const space = {
    members: spaceDetail.members ? spaceDetail.members.map(member => ({
      userId: member.userId,
      name: member.name,
      tooltip: `${member.name}`,
      src: member.avatarURL
    })) : spaceDetail.members,
    hasProjects: spaceResource.hasContainers,
    memberCount: spaceDetail.memberCount,
    documentCount: spaceDetail.documentCount,
    description: spaceDetail.description,
    ...spaceResource
  }

  const [members, setMembers] = useState(space.members ? space.members : [])

  useEffect(() => {
    if (spacesMembers[space.id]) {
      setMembers(space.members.concat(spacesMembers[space.id].members))
    }
  }, [props.spacesMembers])

  const handleGetExtraMembers = useCallback(() => {
    if (!spacesMembers[space.id]) {
      serverActions.getSpaceMembersDetail.request(space.id)
    }
  }, [])

  return (
    <SpaceRow
      space={space}
      withIcon={withIcon}
      projects={projects ? projects.projects[space.id] : null}
      projectsDetail={projects ? projects.projectsDetail : null}
      members={members}
      account={account}
      style={style}
      handleGetExtraMembers={handleGetExtraMembers}
      showProjectInSpace={actions ? actions.showProjectInSpace : null}
      getProjects={serverActions.getProjects.request}
      spaceProjectsEnabled={spaceProjectsEnabled}
      index={index}
    />
  )
}

export default memo(Space, areEqual)
