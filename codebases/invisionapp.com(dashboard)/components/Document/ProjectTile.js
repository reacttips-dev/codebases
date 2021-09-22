import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import { Dropdown, IconButton, Text } from '@invisionapp/helios'
import { ChevronRight, More } from '@invisionapp/helios/icons'

import { PROP_TYPE_COLOR } from '../../constants/CustomPropTypes'
import {
  PROJECT_SHAPES
} from '../../constants/ProjectTiles'

import AbbrevTimeAgo from '../Common/AbbrevTimeAgo'
import ProjectShape from './ProjectShape'

import styles from '../../css/tiles/projects.css'
import { trackEvent } from '../../utils/analytics'
import { APP_PROJECT_OPENED } from '../../constants/TrackingEvents'

const ProjectTile = ({
  canDelete,
  color,
  description,
  documentCount,
  id,
  onDeleteProject,
  path,
  shape,
  spaceId,
  spaceName,
  title,
  updatedDate,
  viewedDate
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleFocus = () => {
    setDropdownVisible(true)
  }

  const handleBlur = () => {
    setDropdownVisible(false)
  }

  const handleCustomizeProject = e => {
    e.preventDefault()
    e.stopPropagation()

    window.inGlobalContext.appShell
      .getFeatureContext('sidebar')
      .sendCommand('triggerModal', {
        modalName: 'CREATE_PROJECT_MODAL',
        modalData: {
          projectId: id,
          description,
          spaceName: spaceName,
          spaceId: spaceId
        }
      })
  }

  const handleDeleteProject = e => {
    e.preventDefault()
    e.stopPropagation()

    onDeleteProject()
  }

  const handleDropdownClick = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  const getDropdownVisibility = state => {
    setDropdownVisible(state.OPEN)
  }

  const renderImage = () => {
    return (
      <div className={styles.image}>
        <Text
          className={styles.imageTitle}
          order='title'
          element='div'
          color='text'>
          {title}
        </Text>

        { shape && color &&
          <ProjectShape shape={shape} color={color} />
        }
      </div>
    )
  }

  const renderTimestamp = () => {
    const label = viewedDate ? 'Viewed' : 'Updated'
    const date = viewedDate || updatedDate

    return (
      <>
        {label} <AbbrevTimeAgo date={date} live={false} />
      </>
    )
  }

  return (
    <article
      className={styles.root}
      onFocus={handleFocus}
      onBlur={handleBlur}
      title={title}>
      <Link
        to={path}
        tabIndex={0}
        onClick={() => {
          trackEvent(APP_PROJECT_OPENED, {
            projectContext: 'project_tile',
            projectID: id
          })
        }}
        target='_self'
        aria-label={title}
        className={styles.linkContainer}>
        <figure
          aria-label={title}
          className={styles.imageContainer}>
          {renderImage()}
        </figure>

        <div className={styles.tileInfoWrap}>
          <div className={`${styles.tileInfo}${!canDelete ? ' ' + styles.noMenu : ''}`}>
            <div className={styles.title}>
              <Text order='subtitle' size='smaller' color='text'>
                <span>{spaceName}</span>
                <ChevronRight aria-hidden='true' viewBox={16} size={16} />
                <span>{title}</span>
              </Text>
            </div>
            <Text className={styles.meta} order='body' size='smallest' color='text-lighter'>
              <div className={styles.documentCount}>
                {documentCount} document{documentCount === 1 ? '' : 's'}
              </div>

              <div className={styles.timeStamp}>
                {renderTimestamp()}
              </div>
            </Text>

            {canDelete && (
              <Dropdown
                className={styles.dropdown}
                width={160}
                aria-label={'Project settings menu'}
                items={[
                  {
                    label: 'Customize Project',
                    onClick: handleCustomizeProject,
                    type: 'item'
                  },
                  {
                    destructive: true,
                    label: 'Delete Project',
                    onClick: handleDeleteProject,
                    type: 'item'
                  }
                ]}
                unstyledTrigger
                withTooltip={false}
                placement='top'
                align='right'
                onChangeVisibility={getDropdownVisibility}
                onClick={handleDropdownClick}
                closeOnClick
                isVisible={dropdownVisible}
                trigger={
                  <IconButton withTooltip={false} element='span'>
                    <More aria-label='Project settings menu toggle' fill='text-lighter' />
                  </IconButton>
                }
              />
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

ProjectTile.propTypes = {
  canDelete: PropTypes.bool.isRequired,
  color: PROP_TYPE_COLOR,
  description: PropTypes.string,
  documentCount: PropTypes.number.isRequired,
  onDeleteProject: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  shape: PropTypes.oneOf(PROJECT_SHAPES),
  spaceName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  updatedDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
  viewedDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
}

export default ProjectTile
