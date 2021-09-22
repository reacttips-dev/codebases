import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { Text, Icon, Action } from '@invisionapp/helios-one-web'

import styles from './css/spaces.css'
import generateSpaceURL from '../../utils/generate-space-url'
import { useRoute } from './hooks/useRoute'

const SpaceLink = props => {
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const {
    isDragging,
    moveDocumentsToSpace,
    onClick,
    selected,
    space
  } = props
  const spaceURL = generateSpaceURL(space.id, space.title)
  const { pathname } = useRoute()

  const handleMouseOut = e => {
    if (isDraggingOver) setIsDraggingOver(false)
  }

  const handleMouseOver = e => {
    if (isDragging && !isDraggingOver) setIsDraggingOver(true)
  }

  const handleMouseUp = e => {
    if (!isDragging) return
    moveDocumentsToSpace(selected, space)
  }

  const hasPrivateIcon = space.visibility === 'invite'

  return (
    <Action
      as='a'
      className={cx(styles.space, styles.noProjects, {
        [styles.active]: pathname.indexOf(spaceURL) >= 0,
        [styles.hovered]: isDraggingOver,
        [styles.withIcon]: hasPrivateIcon
      })}
      href={spaceURL}
      onClick={() => { onClick(space) }}
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseOver}
      onMouseUp={handleMouseUp}
      title={space.title}
      data-app-shell-behavior='prevent-default'
      data-space-droparea='true'
    >
      {hasPrivateIcon && (
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
        size='heading-14'>{space.title}
      </Text>
    </Action>)
}

SpaceLink.propTypes = {
  isDragging: PropTypes.bool.isRequired,
  moveDocumentsToSpace: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  space: PropTypes.object.isRequired,
  transitionDelay: PropTypes.string
}

export default SpaceLink
