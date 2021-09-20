import React, { useEffect } from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'

export default function CdaUpdater({ data, children }: IPageBehaviorComponentProps) {
  useEffect(() => {
    window.Intercom('update', data.configuration)
  }, [data.configuration])

  return <>{children}</>
}
