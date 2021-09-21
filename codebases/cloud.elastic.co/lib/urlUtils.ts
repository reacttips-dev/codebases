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

import { parse, stringify } from 'query-string'
import { find, omit, pick } from 'lodash'

import { RegistrationSource } from '../actions/auth/auth'
import { createDeploymentUrl, loginUrl, portalUrl, registerUrl } from './urlBuilder'

export type MarketoParamsType = {
  ultron?: string
  blade?: string
  hulk?: string
  gambit?: string
  thor?: string
  camp?: string
  src?: string
  mdm?: string
  cnt?: string
  trm?: string
  baymax?: string
  storm?: string
  rogue?: string
  elektra?: string
  tech?: string
  plcmt?: string
  cta?: string
  pg?: string
}

export type WelcomeImageIdentifier = NonNullable<RegistrationSource> | '' | 'login' | 'registration'

type SignInQueryData = {
  fromURI?: string
  redirectTo?: string
  settings?: string
  source?: RegistrationSource
  marketo: MarketoParamsType
}

export type SignInQueryParams = MarketoParamsType & {
  fromURI?: string
  redirectTo?: string
  referrer?: string
  source?: RegistrationSource
}

const marketoParams = [
  'ultron',
  'blade',
  'hulk',
  'gambit',
  'thor',
  'camp',
  'src',
  'mdm',
  'cnt',
  'trm',
  'baymax',
  'storm',
  'rogue',
  'elektra',
  'tech',
  'plcmt',
  'cta',
  'pg',
]

export const sourceParamValues: RegistrationSource[] = [
  'training',
  'training-checkout',
  'training-courses',
  'cloud',
  'community-contributions',
  'community-events',
  'support',
  'partners',
]

export function buildSignInQuery({
  search,
  withReferrer,
}: {
  search: string
  withReferrer?: boolean
}): SignInQueryParams {
  const { fromURI, marketo, redirectTo, source } = getSignInQueryData(search)
  const queryParams = getAuthQueryParams({ fromURI, marketo, redirectTo, source })

  return withReferrer ? queryParams : omit(queryParams, 'referrer')
}

export function buildLoginUrl({ locationQueryString }: { locationQueryString: string }): string {
  const url = loginUrl()

  if (locationQueryString.length === 0) {
    return url
  }

  const query = buildSignInQuery({ search: locationQueryString })
  const queryString = stringify(query)

  return `${url}?${queryString}`
}

export function buildRegisterUrl({ search }: { search: string }): string {
  const url = registerUrl()

  if (search.length === 0) {
    return url
  }

  const query = buildSignInQuery({ search })
  const queryString = stringify(query)

  return `${url}?${queryString}`
}

export function buildFirstSignInRedirectUrl(search: string): string | string[] {
  const { fromURI } = getSignInQueryData(search)

  if (!fromURI || fromURI === portalUrl()) {
    return createDeploymentUrl()
  }

  return fromURI
}

export function buildOpenIdSignUpQuery(search: string): SignInQueryParams {
  const { fromURI, marketo, redirectTo, source, settings } = getSignInQueryData(search)
  const queryParams = getAuthQueryParams({ fromURI, marketo, redirectTo, source, settings })

  if (fromURI === portalUrl()) {
    return { ...queryParams, fromURI: createDeploymentUrl() }
  }

  return queryParams
}

export function filterSourceParam(source: string): WelcomeImageIdentifier {
  if (!source) {
    return ''
  }

  const sourceValue = find(sourceParamValues, (key) => source === key)

  if (!sourceValue) {
    return ''
  }

  return sourceValue
}

export function getRegistrationSource(queryString: string) {
  const source = getSourceParam(queryString)

  if (source === `training` || source === `training-checkout` || source === `training-courses`) {
    return `training`
  }

  if (source === `community-contributions` || source === `community-events`) {
    return `community`
  }

  if (source === `support`) {
    return `support`
  }

  return
}

export function getSourceParam(queryString: string): WelcomeImageIdentifier {
  if (queryString.length === 0) {
    return ''
  }

  const { source } = parse(queryString.slice(1))

  if (typeof source !== 'string') {
    return ''
  }

  return filterSourceParam(source)
}

function getAuthQueryParams({
  fromURI,
  marketo,
  redirectTo,
  source,
  settings,
}: SignInQueryData): SignInQueryParams {
  return {
    ...marketo,
    referrer: window.location.href,
    ...(typeof fromURI === 'string' ? { fromURI } : {}),
    ...(typeof redirectTo === 'string' ? { fromURI: redirectTo } : {}),
    ...(typeof source === 'string' ? { source } : {}),
    ...(typeof settings === 'string' ? { settings } : {}),
  }
}

function getSignInQueryData(search: string): SignInQueryData {
  const query = parse(search.slice(1))
  const marketo = pick(query, marketoParams)

  const { fromURI, redirectTo, settings } = query
  const source = find(sourceParamValues, (key) => key === query.source)

  return {
    fromURI: typeof fromURI === `string` ? fromURI : undefined,
    redirectTo: typeof redirectTo === `string` ? redirectTo : undefined,
    settings: typeof settings === `string` ? settings : undefined,
    marketo,
    source,
  }
}
