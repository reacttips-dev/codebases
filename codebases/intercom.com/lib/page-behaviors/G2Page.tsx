import React from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'
import styles from 'marketing-site/src/library/styles/pages/g2-page.scss'

export default function G2Page({ children }: IPageBehaviorComponentProps) {
  return (
    <>
      {children}
      <style jsx>{styles}</style>
    </>
  )
}
