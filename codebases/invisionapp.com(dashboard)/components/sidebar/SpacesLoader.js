import React, { PureComponent } from 'react'

import { Skeleton } from '@invisionapp/helios-one-web'

import styles from './css/spaces-loader.css'

export default class SpacesLoader extends PureComponent {
  render () {
    const loaders = [200, 160, 120, 160, 200, 160, 120, 160]

    return (
      <div className={styles.root}>
        {loaders.map((width, i) => {
          return (
            <div key={`loader-line-${i}`} className={styles.skeletonWrap} style={{ width }}>
              <Skeleton
                className={styles.skeleton}
                height={16}
              />
            </div>
          )
        })}
      </div>
    )
  }
}
