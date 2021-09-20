import React from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'
import styles from 'marketing-site/src/library/styles/pages/homepage-dis.scss'

export default function HomepageDIS({ children }: IPageBehaviorComponentProps) {
  return (
    <>
      {children}
      <style jsx>{styles}</style>
    </>
  )
}
