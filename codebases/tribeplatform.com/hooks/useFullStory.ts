import { useCallback, useEffect, useRef } from 'react'

import { AuthToken, Network, RoleType } from 'tribe-api/interfaces'

import useAuthToken from 'hooks/useAuthToken'

import { getRuntimeConfigVariable } from 'utils/config'

interface InitFullStoryArgs {
  memberId: AuthToken['member']['id']
  orgId: string
  network: Network
}

const useFullStory = (): void => {
  const isClient = typeof window !== 'undefined'
  const isFullStoryInitialized = useRef<boolean>(false)
  const orgId = getRuntimeConfigVariable('SHARED_FULL_STORY_ORGANIZATION_ID')
  const { authToken } = useAuthToken()
  const network = authToken?.network
  const isDevMode = process.env.NODE_ENV === 'development'

  const initFullStory = useCallback(
    async ({ memberId, orgId, network }: InitFullStoryArgs) => {
      const FullStory = await import('@fullstory/browser')

      FullStory.init({
        debug:
          getRuntimeConfigVariable('SHARED_FULL_STORY_DEBUG_MODE') === 'true',
        devMode: isDevMode,
        orgId,
      })

      FullStory.identify(memberId, {
        networkId: network?.id,
        networkName: network?.name,
        networkDomain: network?.domain,
        networkIndustry: network?.industry,
        isTrial: network?.subscriptionPlan?.trial,
        networkPlan: network?.subscriptionPlan?.name,
      })

      isFullStoryInitialized.current = true
    },
    [],
  )

  useEffect(() => {
    if (
      !isFullStoryInitialized?.current &&
      authToken?.role?.type === RoleType.ADMIN &&
      authToken?.member?.id &&
      network &&
      isClient &&
      orgId &&
      !isDevMode
    ) {
      initFullStory({
        memberId: authToken?.member?.id,
        orgId,
        network: network as Network,
      })
    }
  }, [
    authToken?.member?.id,
    authToken?.role?.type,
    initFullStory,
    isClient,
    isDevMode,
    network,
    orgId,
  ])
}

export default useFullStory
