import React from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'
import styles from 'marketing-site/src/library/styles/pages/chatbot-survey-page.scss'

export default function ChatbotSurveyPage({ children }: IPageBehaviorComponentProps) {
  return (
    <>
      {children}
      <style jsx>{styles}</style>
    </>
  )
}
