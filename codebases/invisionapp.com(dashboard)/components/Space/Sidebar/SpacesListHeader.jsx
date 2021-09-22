import React from 'react'
import cx from 'classnames'

import styles from '../../../css/space/sidebar/space-items.css'

const SpacesListHeader = ({ spaceProjectsEnabled }) => (
  <div className={cx(styles.spaceWrap, styles.spaceHeader, styles.hiddenTopBorder)}>
    <div className={cx(styles.info, styles.cell, { [styles.cellNoPadding]: spaceProjectsEnabled })}>Name</div>
    <div className={cx(styles.avatarStack, styles.cell)}>Members</div>
    <div className={cx(styles.documentCount, styles.cell)}>Document count</div>
    <div className={cx(styles.updatedAt, styles.cell)}>Last Accessed</div>
  </div>
)

export default SpacesListHeader
