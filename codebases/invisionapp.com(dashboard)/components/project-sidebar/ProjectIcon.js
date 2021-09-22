import React from 'react'
import cx from 'classnames'
import { Skeleton } from '@invisionapp/helios-one-web'

import {
  PROJECT_SHAPE_NONE,
  PROJECT_SHAPE_SQUARE_UP,
  PROJECT_SHAPE_SQUARE_DOWN,
  PROJECT_SHAPE_CIRCLE_UP,
  PROJECT_SHAPE_CIRCLE_DOWN,
  PROJECT_SHAPE_ARCH_UP,
  PROJECT_SHAPE_ARCH_DOWN
} from '../../constants/project-props'

import styles from './css/project-icon.css'

const ProjectIcon = ({
  color,
  isLoading,
  shape
}) => {
  return (
    <div aria-hidden='true' className={styles.root}>
      { isLoading &&
        <Skeleton className={styles.loader} />
      }

      { !isLoading &&
        <div className={cx(styles.outer, {
          [styles.arch]: [PROJECT_SHAPE_ARCH_UP, PROJECT_SHAPE_ARCH_DOWN].indexOf(shape) >= 0,
          [styles.circle]: [PROJECT_SHAPE_CIRCLE_UP, PROJECT_SHAPE_CIRCLE_DOWN].indexOf(shape) >= 0,
          [styles.square]: [PROJECT_SHAPE_SQUARE_UP, PROJECT_SHAPE_SQUARE_DOWN, PROJECT_SHAPE_NONE].indexOf(shape) >= 0
        })} style={{ backgroundColor: color }}>
          <div className={styles.inner} />
        </div>
      }
    </div>
  )
}

export default ProjectIcon
