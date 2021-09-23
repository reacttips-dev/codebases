import { MouseEventHandler, useCallback, useMemo } from 'react'

import { PlanName } from 'tribe-api'

import { useContactSales } from 'containers/AdminSettings/containers/network/billing/hooks'
import {
  availableInNetworkPlan,
  calculateUpgradePlan,
} from 'containers/AdminSettings/containers/network/billing/utils/plan.utils'
import useGetNetwork from 'containers/Network/useGetNetwork'

import tracker from 'lib/snowplow'

type UseUpgradeTouchpointResult = {
  isUpperPlan: (plan?: PlanName) => boolean
  upgradeLink: string
  onUpgradeClick: MouseEventHandler
}
export const useUpgradeTouchpoint = (
  requiredPlan?: PlanName | null,
): UseUpgradeTouchpointResult => {
  const { network } = useGetNetwork()
  const { openChat } = useContactSales()

  const isUpperPlan = useCallback(
    plan => !availableInNetworkPlan(network, plan),
    [network],
  )

  const upgradeLink = useMemo(() => {
    const plan = network?.subscriptionPlan

    if (!plan) {
      return `/admin/network/billing/purchase`
    }

    const upgradePlanName = requiredPlan || calculateUpgradePlan(plan.name)

    return `/admin/network/billing/purchase?renewal=${plan.renewalType?.toLowerCase()}&plan=${upgradePlanName?.toLowerCase()}`
  }, [network, requiredPlan])

  const onUpgradeClick = useCallback(
    e => {
      const noun = e.currentTarget?.attributes?.['data-tracker-noun']
      tracker.track(noun || 'Upgrade Touchpoint', 'Click', {})

      const plan = network?.subscriptionPlan

      if (!plan) {
        return
      }

      const upgradePlanName = requiredPlan || calculateUpgradePlan(plan.name)
      if (upgradePlanName === PlanName.ENTERPRISE) {
        openChat(upgradePlanName)

        e.preventDefault()
      }
    },
    [network, openChat, requiredPlan],
  )

  return { isUpperPlan, upgradeLink, onUpgradeClick }
}
