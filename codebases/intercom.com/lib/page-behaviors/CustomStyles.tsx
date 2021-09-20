import React from 'react'
import jsonToCss from 'marketing-site/lib/jsonToCss'
import { IPageBehaviorComponentProps } from './PageBehaviors'

export default function CustomStyles({ children, data }: IPageBehaviorComponentProps) {
  return (
    <>
      <style>{jsonToCss(data.configuration)}</style>
      {children}
    </>
  )
}
