import { CustomCodePosition } from 'tribe-api'

import useGetNetwork from 'containers/Network/useGetNetwork'

type UseNetworkCustomCodesResult = {
  headCustomCodes: string[]
  bodyCustomCodes: string[]
}

const useNetworkCustomCodes = (
  anonymize: boolean,
): UseNetworkCustomCodesResult => {
  const headCustomCodes: string[] = []
  const bodyCustomCodes: string[] = []

  const { network } = useGetNetwork({ anonymize })
  const { customCodes } = network || {}
  if (Array.isArray(customCodes) && customCodes.length > 0) {
    customCodes.forEach(customCode => {
      if (customCode?.position === CustomCodePosition.HEAD) {
        headCustomCodes.push(customCode.code)
      } else if (customCode?.position === CustomCodePosition.BODY) {
        bodyCustomCodes.push(customCode.code)
      }
    })
  }
  return {
    headCustomCodes,
    bodyCustomCodes,
  }
}

export default useNetworkCustomCodes
