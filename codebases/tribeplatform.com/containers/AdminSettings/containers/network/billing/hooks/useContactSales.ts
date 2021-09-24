import { useCallback } from 'react'

import { useIntercom } from 'react-use-intercom'

import { PlanName } from 'tribe-api/interfaces'

export const useContactSales = () => {
  const { showNewMessages } = useIntercom()

  const openChat = useCallback(
    async (planName: PlanName | null = PlanName.ENTERPRISE) => {
      if ((window as any).Intercom) {
        showNewMessages(
          `I want to know more about the ${planName?.toLowerCase()} plan.`,
        )
      } else {
        window.open('mailto:sales@tribe.so', '_blank')
      }
    },
    [showNewMessages],
  )

  return {
    openChat,
  }
}
