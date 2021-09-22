import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { Text, Action, Icon } from '@invisionapp/helios-one-web'

import { APP_SIDEBAR_LINK_CLICKED, APP_SPACE_OPENED } from '../../constants/tracking-events'

import styles from './css/spaces.css'
import SpaceLink from './SpaceLink'

import generateSpaceURL from '../../utils/generate-space-url'

export class SpacesList extends Component {
  static propTypes = {
    canCreateSpaces: PropTypes.bool.isRequired,
    closeSidebar: PropTypes.func.isRequired,
    handleTrackEvent: PropTypes.func.isRequired,
    linkClicked: PropTypes.func.isRequired,
    linkCount: PropTypes.number.isRequired,
    moveDocumentsToSpace: PropTypes.func.isRequired,
    sortedSpaces: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired
  }

  handleCreateSpace = () => {
    this.props.handleTrackEvent(APP_SIDEBAR_LINK_CLICKED, {
      link_clicked: 'create_space_emptystate'
    })
  }

  handleSpaceClick = (space, e) => {
    this.props.handleTrackEvent(APP_SPACE_OPENED, {
      spaceId: space.id,
      spaceType: space.isPublic ? 'team' : 'invite-only',
      spaceContext: 'sidebar'
    })

    this.props.linkClicked(generateSpaceURL(space.id, space.title))
    this.props.closeSidebar()
  }

  render () {
    const {
      canCreateSpaces,
      linkCount,
      moveDocumentsToSpace,
      open,
      selected,
      sortedSpaces
    } = this.props

    const MIGRATED_SPACE_TITLE = 'Migrated Documents'

    return (
      <div className={styles.list}>
        { sortedSpaces.length > 0 && sortedSpaces.map((space, i) => {
          const transitionDelay = (0.1 + (0.05 * (linkCount + 1)) + (0.05 * i)).toFixed(2)
          return <SpaceLink
            key={`space-item-${i}`}
            isDragging={selected.isDragging}
            moveDocumentsToSpace={moveDocumentsToSpace}
            transitionDelay={transitionDelay}
            selected={selected.documents}
            space={space}
            onClick={this.handleSpaceClick}
            open={open}
          />
        })
        }

        { (sortedSpaces.length === 0 || (sortedSpaces.length === 1 && sortedSpaces[0].title === MIGRATED_SPACE_TITLE)) && canCreateSpaces && (
          <Action
            as='a'
            href={`/docs?modal=createSpace`}
            onClick={this.handleCreateSpace}
            className={cx(styles.space, styles.createLink)}
            data-app-shell-behavior='prevent-default'>
            <span className={styles.icon}>
              <Icon name='Add' color='surface-100'
                size={16}
              />
            </span>

            <Text
              align='left'
              className={styles.title}
              color='surface-100'
              as='span'
              size='body-14'>
                Create your first space
            </Text>
          </Action>
        )}
      </div>
    )
  }
}

export default SpacesList
