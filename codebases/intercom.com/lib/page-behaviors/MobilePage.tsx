import React from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'
import styles from 'marketing-site/src/library/styles/pages/mobile-page.scss'

export default function MobilePage({ children }: IPageBehaviorComponentProps) {
  return (
    <>
      {children}
      <style jsx>{styles}</style>
    </>
  )
}
