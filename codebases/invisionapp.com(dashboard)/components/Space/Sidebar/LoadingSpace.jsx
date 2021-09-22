import React from 'react'
import cx from 'classnames'
import { AvatarStack, Skeleton } from '@invisionapp/helios'
import PropTypes from 'prop-types'
import styles from '../../../css/space/sidebar/space-items.css'

const LoadingSpace = ({ width, members, mockJoinTag }) => {
  const mockMembers = Array(members).fill({ name: '' })
  return (<div className={styles.spaceWrapLoadingSkeleton}>
    <div className={cx(styles.info, styles.cell)}>
      <span className={styles.spaceTitleSkeleton} style={{ width: `${width / 600 * 100}%` }}>
        <Skeleton height={16} isDarker />
      </span>
      {mockJoinTag && (<span className={styles.spaceJoinTagSkeleton}>
        <Skeleton height={16} isDarker />
      </span>)}
    </div>
    <div className={cx(styles.avatarStack, styles.cell)}>
      <div>
        <AvatarStack
          color='light'
          avatars={mockMembers}
          limit='4'
        />
      </div>
    </div>
    <div className={cx(styles.documentCount, styles.cell)}>
      <div className={styles.spaceDocumentCountSkeleton}>
        <Skeleton height={12} isDarker />
      </div>
    </div>
    <div className={cx(styles.updatedAt, styles.cell)}>
      <Skeleton height={12} isDarker />
    </div>
  </div>)
}

LoadingSpace.defaultProps = {
  width: 200,
  members: 2,
  mockJoinTag: true
}

LoadingSpace.propTypes = {
  width: PropTypes.number,
  members: PropTypes.number,
  mockJoinTag: PropTypes.bool
}

export default LoadingSpace
