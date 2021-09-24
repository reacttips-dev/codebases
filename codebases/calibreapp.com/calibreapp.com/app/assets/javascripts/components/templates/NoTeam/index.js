import React from 'react'

import BlankSlate from '../../BlankSlate'
import Feedback from '../Feedback'

import useFeedback from '../../../hooks/useFeedback'

const NoTeam = () => {
  const { feedback, clearFeedback } = useFeedback()
  return (
    <>
      {(feedback.location === 'organisation' && (
        <Feedback
          data-qa="sitesFeedback"
          p={null}
          pt={0}
          pb={4}
          duration={0}
          onDismiss={clearFeedback}
          {...feedback}
        />
      )) ||
        null}
      <BlankSlate id="organisation" offsets={[-66, -66]} />
    </>
  )
}

export default NoTeam
