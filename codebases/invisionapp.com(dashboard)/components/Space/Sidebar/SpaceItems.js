import React, { Component, Fragment, memo } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Link } from 'react-router'
import { Text, AvatarStack, Tag } from '@invisionapp/helios'
import { Lock } from '@invisionapp/helios/icons'
import { AutoSizer, WindowScroller } from 'react-virtualized'
import { FixedSizeList, areEqual } from 'react-window'
import 'react-virtualized/styles.css'

import NoResults from '../../Layout/ResponsiveNoResults'
import AbbrevTimeAgo from '../../Common/AbbrevTimeAgo'

import { APP_SPACE_OPENED } from '../../../constants/TrackingEvents'
import { trackEvent } from '../../../utils/analytics'
import { GenerateIDURL } from '../../../utils/urlIDParser'

import styles from '../../../css/space/sidebar/space-items.css'

// TODO: refactor to a selector
const hasJoinedSpace = (members, account) => {
  const { user: { userID } } = account
  if (!members) {
    return false
  }
  return members.reduce((bool, curr) => {
    if (bool === true) {
      return bool
    }
    return userID === curr.userId
  }, false)
}

const handleTracking = (space) => {
  const { id, data: { isPublic } } = space

  const trackedEvent = {
    spaceId: id,
    spaceType: isPublic ? 'team' : 'invite-only',
    spaceContext: 'spaces_index'
  }

  trackEvent(APP_SPACE_OPENED, trackedEvent)
}

const Space = memo(({ style, index, data: props }) => {
  const space = props.spaces[index]
  if (!space) {
    return null
  }

  const dateLabel = space.data.lastViewed ? 'Viewed ' : 'Updated '
  const date = space.data.lastViewed ? space.data.lastViewed : space.data.updatedAt

  return (
    <Link
      style={style}
      className={styles.spaceWrap}
      onClick={handleTracking.bind(this, space)}
      to={`/spaces/${GenerateIDURL(space.id, space.data.title)}`}
    >
      <div className={cx(styles.info, styles.cell)}>
        <div className={styles.spaceName}>
          {!space.data.isPublic && <Lock size={16} />}
          <Text order='subtitle' className={styles.spaceTitle}>{space.data.title}</Text>
          {hasJoinedSpace(space.data.members, props.account) && <Tag className={styles.tag} inert compact>Joined</Tag>}
        </div>
        {space.data.description && <Text order='body' size='smaller' color='text-lighter' className={styles.spaceDescription}>{space.data.description}</Text>}
      </div>
      <div className={cx(styles.avatarStack, styles.cell)}>
        <AvatarStack
          avatars={space.data.members}
          color='dark'
          excessCutoff='10'
          limit='4'
          tooltipPlacement='top'
          tooltipDomNode={document.body}
          totalPeople={space.data.members.length}
          withTooltip
        />
      </div>
      <div className={cx(styles.documentCount, styles.cell)}>
        <Text order='body' size='smaller' color='text-lighter'>{space.data.documents.length} document{space.data.documents.length === 1 ? '' : 's'}</Text>
      </div>
      <div className={cx(styles.updatedAt, styles.cell)}>
        <Text order='body' size='smaller' color='text-lighter'>
          {dateLabel}<AbbrevTimeAgo date={date} live={false} />
        </Text>
      </div>
    </Link>
  )
}, areEqual)

class SpaceItems extends Component {
  static defaultProps = {
    spaces: []
  }

  getRow = ({ index }) => {
    const { spaces } = this.props
    if (!spaces || !spaces.length) {
      return null
    }
    return spaces[index]
  }

  handleScroll = ({ scrollTop }) => {
    if (this.listRef) {
      this.listRef.current.scrollTo(scrollTop)
    }
  }

  listRef = React.createRef()

  render () {
    const { spaces, viewType, documentCount, actions, searchTerm, account, paywall } = this.props

    return (
      <div className={cx(styles.spaceItemsWrap, styles.withSidebar)}>
        { spaces.length > 0 ? (
          <Fragment>
            <WindowScroller onScroll={this.handleScroll} scrollingResetTimeInterval={0}>
              {() => <div />}
            </WindowScroller>
            <AutoSizer className={styles.spaceAutoSizer}>
              {({ height, width }) => (
                <FixedSizeList
                  ref={this.listRef}
                  height={height}
                  itemCount={spaces.length}
                  itemSize={80}
                  width={width}
                  itemData={this.props}
                  className={styles.spaceItemsList}
                >
                  {Space}
                </FixedSizeList>
              )}
            </AutoSizer>
          </Fragment>
        ) : (<NoResults
          account={account}
          location='space'
          isFiltering={searchTerm !== ''}
          actions={actions}
          documentCount={documentCount}
          viewType={viewType}
          paywall={paywall}
        />)}
      </div>
    )
  }
}

SpaceItems.propTypes = {
  account: PropTypes.object,
  actions: PropTypes.object,
  serverActions: PropTypes.object,
  spaceDocuments: PropTypes.object,
  spaces: PropTypes.array,
  tile: PropTypes.object,
  viewType: PropTypes.string,
  paywall: PropTypes.object
}

export default SpaceItems
