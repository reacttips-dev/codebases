import React, { memo } from 'react'
import { Link } from 'react-router'
import { DocumentIcon, Text } from '@invisionapp/helios'
import { Lock } from '@invisionapp/helios/icons'
import AbbrevTimeAgo from '../../Common/AbbrevTimeAgo'
import { GenerateIDURL } from '../../../utils/urlIDParser'
import LoadingSpace from './LoadingSpace'
import styles from '../../../css/space/sidebar/space-items.css'
import cx from 'classnames'
import { areEqual } from 'react-window'
import update from 'immutability-helper'

export const ProjectRow = ({
  project,
  style,
  hiddenTopBorder,
  withIcon
}) => {
  update(project, {
    document: { '$set': project.documents ? project.documents : [] }
  })

  const dateLabel = project.userLastAccessedAt ? 'Viewed ' : 'Updated '
  const date = project.userLastAccessedAt
    ? project.userLastAccessedAt
    : project.contentUpdatedAt

  return (
    <div style={style}>
      <Link
        className={cx(styles.spaceWrap, { [styles.hiddenTopBorder]: hiddenTopBorder })}
        to={`/projects/${GenerateIDURL(project.id, project.title)}`}
        key={`project-item-${project.id}`}
      >
        <div className={cx(styles.projectInfo, styles.info)}>
          <span className={styles.resourceIcon}>
            {withIcon && (
              <DocumentIcon
                documentType='project'
                size='36'
                isDecorative
              />
            )}
          </span>
          <div className={styles.projectInfoText} >
            <div className={styles.spaceName}>
              {project.visibility === 'invite' && <Lock size={16} />}
              <Text order='subtitle' className={styles.spaceTitle}>
                {project.title}
              </Text>
            </div>
            {project && (
              <Text
                order='body'
                size='smaller'
                color='text-lighter'
                className={styles.spaceDescription}
              >
                in {project.space.title}
              </Text>
            )}
          </div>
        </div>
        <div className={cx(styles.avatarStack, styles.cell)} />
        <div className={cx(styles.documentCount, styles.cell)}>
          <Text order='body' size='smaller' color='text-lighter'>
            {`${project.documentCount} document${project.documentCount === 1 ? '' : 's'}`}
          </Text>
        </div>
        <div className={cx(styles.updatedAt, styles.cell)}>
          <Text order='body' size='smaller' color='text-lighter'>
            {dateLabel}
            <AbbrevTimeAgo date={date} live={false} />
          </Text>
        </div>
      </Link>
    </div>
  )
}

const Project = ({ index, data: props, style }) => {
  const searchResource = props.spacesResource.spaces[index]
  const projectsDetail = props.projectsDetail
  const spaceProjectsEnabled = props.spaceProjectsEnabled
  const withIcon = spaceProjectsEnabled && props.withIcon

  if (!searchResource) {
    return <LoadingSpace key={index} />
  }

  const projectId = searchResource.id
  const projectDetail = projectsDetail[projectId] || {}
  const project = {
    ...projectDetail,
    ...searchResource
  }

  return (
    <ProjectRow
      project={project}
      withIcon={withIcon}
      style={style}
      index={index}
    />
  )
}

export default memo(Project, areEqual)
