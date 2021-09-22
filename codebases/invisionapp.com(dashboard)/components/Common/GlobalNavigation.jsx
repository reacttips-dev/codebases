import React from 'react'
// @ts-ignore
import OriginalGlobalNavigation from '@invisionapp/global-navigation'

import styles from '../../css/global-navigation.css'

export const GlobalNavigation = (props) => {
  return (
    <div className={styles.globalNavigation} >
      <OriginalGlobalNavigation
        {...props}
      />
    </div>
  )
}
