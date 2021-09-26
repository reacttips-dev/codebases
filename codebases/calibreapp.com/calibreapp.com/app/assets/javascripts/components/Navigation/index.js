import React, { useEffect, useState, Suspense } from 'react'
import { useRouteMatch } from 'react-router-dom'

import PrimaryNavigation from './Primary'
import SecondaryNavigation from './Secondary'

const Feedback = React.lazy(() => import('../templates/Feedback'))

const FlashFeedback = ({ feedback }) => {
  const [showFeedback, setShowFeedback] = useState(
    !!(feedback && feedback.type)
  )

  if (!showFeedback) return null

  return (
    <Suspense fallback={<div />}>
      <Feedback onDismiss={() => setShowFeedback(false)} {...feedback} />
    </Suspense>
  )
}

const Navigation = ({ forceRefresh, feedback }) => {
  const {
    params: { orgId }
  } = useRouteMatch('/(organisation|organisations)/:orgId', {
    strict: false
  }) || { params: {} }

  const {
    params: { teamId }
  } = useRouteMatch('/(teams)/:teamId', {
    strict: false
  }) || { params: {} }

  const {
    params: { siteId }
  } = useRouteMatch('/teams/:teamId/:siteId', {
    strict: false
  }) || { params: {} }

  useEffect(() => {
    const pageEl = document.querySelector('#rails')
    if (pageEl) {
      setTimeout(() => {
        pageEl.classList.add('loaded')
      }, 300)
    }
  }, [])

  const parsedOrgId = orgId === 'new' ? null : orgId
  const parsedSiteId = ['sites', 'team'].includes(siteId) ? null : siteId
  const parsedTeamId = teamId === 'new' ? null : teamId

  return (
    <>
      <PrimaryNavigation
        forceRefresh={forceRefresh}
        orgId={parsedOrgId}
        teamId={parsedTeamId}
        siteId={parsedSiteId}
      />
      <SecondaryNavigation
        orgId={parsedOrgId}
        teamId={parsedTeamId}
        siteId={parsedSiteId}
      />
      <FlashFeedback feedback={feedback} />
    </>
  )
}

export default Navigation
