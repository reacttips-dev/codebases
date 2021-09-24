import { useEffect, useMemo } from 'react'

import { AuthToken } from 'tribe-api'

import tracker, { actorDataContext, targetDataContext } from 'lib/snowplow'

function getLang() {
  if (typeof window === 'undefined') return
  if (Array.isArray(navigator?.languages)) return navigator.languages[0]
  return navigator?.language
}

const useSnowplowTracker = ({
  authToken,
  pageTitle,
}: {
  authToken: AuthToken
  pageTitle: string
}): void => {
  const { network, member } = authToken || {}

  const { id: networkId, organizationId } = network || {}
  const target: targetDataContext = useMemo(
    () => ({
      organizationId: organizationId || '',
      networkId,
    }),
    [networkId, organizationId],
  )

  const actor: actorDataContext = {
    id: member?.id || '',
    roleId: member?.role?.id || '',
    roleType: member?.role?.type || '',
    locale: member?.attributes?.locale || getLang(),
  }

  const pageView = () => {
    tracker.setActor(actor)
    tracker.setTarget(target)
    tracker.trackPageView(pageTitle)
  }

  useEffect(() => {
    pageView()
  }, [])
}

export default useSnowplowTracker
