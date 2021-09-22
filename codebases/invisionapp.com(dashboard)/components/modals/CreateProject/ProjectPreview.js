import React from 'react'
import PropTypes from 'prop-types'
import { Skeleton, Text } from '@invisionapp/helios-one-web'

import ProjectShape from './ProjectShape'

import { PROP_TYPE_COLOR } from '../../../constants/custom-prop-types'
import { PROJECT_SHAPES } from '../../../constants/project-props'

import styles from '../css/project-preview.css'

const ProjectPreview = ({
  isLoading,
  title,
  color,
  shape
}) => {
  return (
    <figure className={styles.root}>
      { isLoading
        ? <Skeleton className={styles.loader} height={201} style={{ width: 455 }} />
        : <>
          <Text
            align='left'
            className={styles.title}
            size='heading-42'
            color='black'
            as='div'>{title}</Text>

          <div className={styles.shape}>
            <ProjectShape
              shape={shape}
              color={color}
            />
          </div>
        </>
      }
    </figure>
  )
}

ProjectPreview.propTypes = {
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  color: PROP_TYPE_COLOR,
  shape: PropTypes.oneOf(PROJECT_SHAPES)
}

export default ProjectPreview
