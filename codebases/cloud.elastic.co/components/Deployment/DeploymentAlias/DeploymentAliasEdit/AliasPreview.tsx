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

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiHealth } from '@elastic/eui'

import { withSmallErrorBoundary } from '../../../../cui'

import ExternalLink from '../../../ExternalLink'

import { getFirstSliderClusterFromGet } from '../../../../lib/stackDeployments'
import { appSubdomainDefinitions } from '../../../../lib/sliders/sliders'

import { LinkInfo, StackDeployment } from '../../../../types'

export type Props = {
  deployment: StackDeployment
  link: LinkInfo
  currentAlias: string
}

const AliasPreview: FunctionComponent<Props> = ({ deployment, link, currentAlias }) => {
  const href = getApplicationEndpointLivePreview({ deployment, link, currentAlias })

  if (!href) {
    return (
      <EuiHealth color='danger' data-test-id='alias-preview-unhealthy'>
        <FormattedMessage id='alias-preview.unhealthy' defaultMessage='Unhealthy' />
      </EuiHealth>
    )
  }

  const displayHref = href.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <ExternalLink href={href} data-test-id='alias-preview-link'>
      <span data-test-id='alias-preview-link-text'>{displayHref}</span>
    </ExternalLink>
  )
}

export default withSmallErrorBoundary(AliasPreview, { forInlineText: true })

function getApplicationEndpointLivePreview({
  deployment,
  link,
  currentAlias,
}: {
  deployment: StackDeployment
  link: LinkInfo
  currentAlias: string
}): string {
  const { appKey, apiUri } = link

  if (!apiUri) {
    return '' // unhealthy deployments
  }

  const { unaliased, aliased } = appSubdomainDefinitions[appKey]

  const apiUriParts = new URL(apiUri)

  const [existingAliasOrUuid, maybeApplicationSubdomain, ...remainder] =
    apiUriParts.hostname.split('.')

  const slider = getFirstSliderClusterFromGet({ deployment, sliderInstanceType: appKey })
  const sliderId = slider?.id
  const nextAliasOrUuid = currentAlias || sliderId || existingAliasOrUuid

  // then we add the subdomain that corresponds with our expectation for whether we have  an alias next orn ot
  const nextApplicationSubdomain = getNextApplicationSubdomainPart()

  // in order to confidently make changes here, we drop the existing subdomain when it matches what we expect
  const dropApplicationSubdomainPart = shouldDropApplicationSubdomainPart()

  // not dropping basically means we have the wrong capture here, and we shouldn't drop random stuff from the hostname
  // This might be the region ID!
  const bitIfItWasntAppSubdomain = dropApplicationSubdomainPart ? null : maybeApplicationSubdomain

  /* armed with this knowledge, we finally rebuild the hostname
   * - the alias the user is entering, falling back to the existing UUID
   * - the next subdomain, which is either the "aliased" subdomain, or nothing, depending on input
   * - whatever was in the subdomain position, removing it if it was the existing application subdomain part
   * - the rest of the existing hostname
   */
  apiUriParts.hostname = [
    nextAliasOrUuid,
    nextApplicationSubdomain,
    bitIfItWasntAppSubdomain,
    ...remainder,
  ]
    .filter(Boolean)
    .join('.')

  const livePreview = apiUriParts.toString()

  return livePreview

  function shouldDropApplicationSubdomainPart(): boolean {
    if (deployment.alias) {
      return maybeApplicationSubdomain === aliased
    }

    return maybeApplicationSubdomain === unaliased
  }

  function getNextApplicationSubdomainPart(): string | null {
    if (currentAlias) {
      return aliased
    }

    return unaliased
  }
}
