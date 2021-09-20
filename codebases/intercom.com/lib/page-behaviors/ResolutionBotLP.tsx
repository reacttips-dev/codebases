import React from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'
import styles from 'marketing-site/src/library/styles/pages/resolution-bot-lp.scss'

export default function ResolutionBotLP({ children }: IPageBehaviorComponentProps) {
  return (
    <>
      {children}
      <style jsx>{styles}</style>
    </>
  )
}
