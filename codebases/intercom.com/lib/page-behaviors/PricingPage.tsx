import styles from 'marketing-site/src/library/styles/pages/pricing-page.scss'
import React from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'

export default function PricingPage({ children }: IPageBehaviorComponentProps) {
  return (
    <>
      {children}
      <style jsx>{styles}</style>
    </>
  )
}
