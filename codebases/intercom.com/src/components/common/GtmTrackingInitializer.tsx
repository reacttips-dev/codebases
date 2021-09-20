import Cookies from 'js-cookie'
import { addGlobalContext } from 'marketing-site/lib/datadog'
import { getCurrentLocaleCode, getGtmClient } from 'marketing-site/lib/gtm'
import { captureException } from 'marketing-site/lib/sentry'
import { useAssignedVariations } from 'marketing-site/src/components/context/AssignedVariationsContext'
import React, { useEffect } from 'react'

let gtmCookieRecorded = false

const GtmTrackingInitializer: React.FC = () => {
  const assignedVariations = useAssignedVariations()

  useEffect(() => {
    let cancelled = false

    async function sendPageviewEvents() {
      const gtmClient = await getGtmClient()
      const gtmCookieIdentifier = Cookies.get('gtm_id')

      addGlobalContext('gtm_id', gtmCookieIdentifier)

      if (!gtmClient.blocked && !cancelled) {
        const localeCode = getCurrentLocaleCode()

        try {
          await gtmClient.recordPageView({
            /* eslint-disable @typescript-eslint/camelcase */
            locale_rendered: localeCode || undefined,
            metadata: {
              screen_size: gtmClient.device,
              platform: 'marketing-site-node',
              is_admin: !!Cookies.get('intercom-is-admin'),
            },
            experiment_impressions: Object.entries(assignedVariations).map(
              ([experimentKey, assignment]) => ({
                experiment: experimentKey,
                variation: assignment.variationKey,
                experiment_source: assignment.source,
              }),
            ),
            /* eslint-enable @typescript-eslint/camelcase */
          })
        } catch (error) {
          captureException(error)
        }

        if (gtmCookieIdentifier && !gtmCookieRecorded) {
          window.Intercom('update', { gtm_cookie_identifier: gtmCookieIdentifier }) // eslint-disable-line @typescript-eslint/camelcase
          gtmCookieRecorded = true
        }

        try {
          await gtmClient.recordOnPageviewEvent(window)
        } catch (error) {
          captureException(error)
        }
      }
    }

    sendPageviewEvents()
    return () => {
      cancelled = true
    }
  }, [assignedVariations])

  return null
}

export default GtmTrackingInitializer
