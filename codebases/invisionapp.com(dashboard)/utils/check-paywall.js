import * as PaywallTypes from '../constants/PaywallTypes'

export default async function checkPaywall (action, Paywall) {
  try {
    let paywallResponse = await Paywall.checkPaywall(action)

    if (paywallResponse) {
      if (paywallResponse.hasPaywall) {
        Paywall.show(action)
        return PaywallTypes.PAYWALL_REDIRECT
      } else if (paywallResponse.message === 'name resolution failed') {
        // paywall doesn't recognize any type of failures, it just returns json formatted response from fetch
        // instead of passing down related info (like status code), so this is an error we captured locally
        return PaywallTypes.PAYWALL_ERROR
      }
    }
  } catch (e) {
    return PaywallTypes.PAYWALL_ERROR
  }

  return PaywallTypes.PAYWALL_SUCCESS
}
