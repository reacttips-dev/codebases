import React from 'react'

import { App } from 'tribe-api/interfaces'
import { SkeletonCircle, Image } from 'tribe-components'

export type AppIconProps = {
  app?: App | null
  size: string
}
export const AppIcon: React.FC<AppIconProps> = ({ app, size, ...rest }) => {
  if (app?.image) {
    return <Image src={app.image} alt={app?.name} boxSize={size} {...rest} />
  }

  return <SkeletonCircle size={size} bgColor="bg.secondary" {...rest} />
}
