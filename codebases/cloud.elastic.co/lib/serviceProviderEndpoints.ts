/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { parse, format } from 'url'
import { get } from 'lodash'

import { defaultHttpsPort } from '../constants/ports'

import { AnyResourceInfo, SliderInstanceType } from '../types'

export type GetDeepLinkFn = (context: { sso: boolean }) => string | null

export function getEndpointForResource({
  resource,
  getDeepLink = getDefaultDeepLink,
  acceptSsoUrl = true,
  ignoreAlias = false,
}: {
  resource: AnyResourceInfo | null
  resourceType: SliderInstanceType
  getDeepLink?: GetDeepLinkFn
  acceptSsoUrl?: boolean
  ignoreAlias?: boolean
}) {
  const metadata = resource ? resource.info.metadata : undefined

  if (!metadata) {
    return ``
  }

  if (!acceptSsoUrl) {
    return fallbackToServiceUrl()
  }

  return considerUsingSsoUrl()

  function considerUsingSsoUrl() {
    /*
     *  The following table explains what's going on. Depending on the Kibana version we might:
     *  - be able to always use the SSO url and add a deep link to it
     *  - be able to use the SSO url as long as we don't need to deep link
     *  - be unable to use the SSO url, so we need to use plain links
     *
     *  |-----------------------|-----|----------------|-----|
     *  | Kibana                | SSO | SSO deep links | Ref |
     *  |-----------------------|-----|----------------|-----|
     *  | 6.8.11+, 7.8.1+, 7.9+ | yes | yes            | A   |
     *  | 7.7.0, 7.8.0          | yes | no             | B   |
     *  | Others                | no  | no             | F   |
     *  |-----------------------|-----|----------------|
     *
     *  See also: https://github.com/elastic/cloud/issues/60895#issue-644367481
     */

    const { sso_url, sso_deep_linking_supported } = metadata!

    if (!sso_url) {
      return fallbackToServiceUrl() // [F]
    }

    const ssoDeepLink = getContextualDeepLink({ sso: true })

    if (ssoDeepLink === null) {
      return sso_url // [A] or [B] — we can use the SSO link as-is because we're not deep linking
    }

    if (!sso_deep_linking_supported) {
      return fallbackToServiceUrl() // [B] — SSO url doesn't support deep linking
    }

    const { protocol, host, query, pathname } = parse(sso_url, true)

    query.RelayState = ssoDeepLink

    const deepLinkedSsoUrl = format({ protocol, host, query, pathname })

    return deepLinkedSsoUrl // [A] — SSO url supports deep linking through RelayState
  }

  function fallbackToServiceUrl() {
    const serviceUrl = getServiceUrl()
    const nonSsoDeepLink = getContextualDeepLink({ sso: false })

    if (nonSsoDeepLink !== null) {
      return `${serviceUrl}${nonSsoDeepLink}`
    }

    return serviceUrl
  }

  function getServiceUrl() {
    const { aliased_url, service_url, endpoint, ports } = metadata!

    if (aliased_url && !ignoreAlias) {
      return aliased_url
    }

    if (service_url) {
      return service_url
    }

    if (!endpoint) {
      return ``
    }

    const actualPort = get(ports, ['https'], defaultHttpsPort)

    const port = actualPort === defaultHttpsPort ? `` : `:${actualPort}`

    const clusterEndpoint = `https://${endpoint}${port}`

    return clusterEndpoint
  }

  function getContextualDeepLink({ sso }: { sso: boolean }): string | null {
    const deepLink = getDeepLink({ sso })
    const deepLinking = deepLink !== null && deepLink !== '/'

    if (!deepLinking) {
      return null
    }

    return deepLink
  }
}

function getDefaultDeepLink(): null {
  return null
}
