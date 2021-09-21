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

import { uniqBy, set } from 'lodash'

import { defineMessages, MessageDescriptor } from 'react-intl'

import { getElasticsearchPayloadFromResource } from './conversions'

import { getFirstEsClusterFromGet, getDeploymentSettingsFromGet } from './selectors'
import { TrustLevel } from './selectors/crossClusterReplication'

import { replaceIn } from '../immutability-helpers'

import { StackDeployment } from '../../types'

import {
  AccountTrustRelationship,
  DeploymentUpdateRequest,
  ExternalTrustRelationship,
  TrustRelationshipGetResponse,
} from '../api/v1/types'

const TRUST_LEVEL_LABELS: Record<string, MessageDescriptor> = defineMessages({
  all: {
    id: `deploymentTrustManagement.trustLevelLabels.all`,
    defaultMessage: `Trust all deployments (including future deployments)`,
  },
  none: {
    id: `deploymentTrustManagement.trustLevelLabels.none`,
    defaultMessage: `Trust no deployment`,
  },
  specific: {
    id: `deploymentTrustManagement.trustLevelLabels.specific`,
    defaultMessage: `Trust specific deployments`,
  },
})

export function getTrustLevelLabel(trustLevel: TrustLevel): MessageDescriptor {
  return TRUST_LEVEL_LABELS[trustLevel]
}

export function getTrustLevelFromRelationship(
  trustRelationship: AccountTrustRelationship | ExternalTrustRelationship,
): TrustLevel {
  if (trustRelationship.trust_allowlist?.length) {
    return `specific`
  }

  return trustRelationship.trust_all ? `all` : `none`
}

export function createUpdateTrustRequestFromGetResponse({
  deployment,
  trustRelationships,
  type = 'external',
  replace = false,
}: {
  deployment: StackDeployment
  trustRelationships: Array<ExternalTrustRelationship | AccountTrustRelationship>
  type?: 'external' | 'accounts'
  replace?: boolean
}): DeploymentUpdateRequest {
  const esResource = getFirstEsClusterFromGet({ deployment })!
  const esPayload = getElasticsearchPayloadFromResource({ resource: esResource })!

  const existingTrustRelationships = esResource.info.settings?.trust || {
    accounts: [],
    external: [],
  }

  set(esPayload, [`settings`, `trust`], existingTrustRelationships)

  const updatedTrustRelationships = uniqBy(
    [...trustRelationships, ...(existingTrustRelationships[type] || [])],
    type === 'external' ? `trust_relationship_id` : `account_id`,
  )

  const updatedEsPayload = replaceIn(
    esPayload,
    [`settings`, `trust`, type],
    replace ? trustRelationships : updatedTrustRelationships,
  )

  const payload: DeploymentUpdateRequest = {
    prune_orphans: false,
    resources: {
      elasticsearch: [updatedEsPayload],
    },
  }

  return payload
}

export function getExternalTrustRelationships({
  deployment,
}: {
  deployment: StackDeployment
}): ExternalTrustRelationship[] {
  const settings = getDeploymentSettingsFromGet({ deployment })
  return settings?.trust?.external || []
}

export function getAccountTrustRelationships({
  deployment,
}: {
  deployment: StackDeployment
}): AccountTrustRelationship[] {
  const settings = getDeploymentSettingsFromGet({ deployment })
  return settings?.trust?.accounts || []
}

export function findTrustRelationshipById(
  trustRelationships: TrustRelationshipGetResponse[],
  trustRelationshipId: string,
): TrustRelationshipGetResponse | null {
  return (
    trustRelationships.find(({ id, installation_id }) =>
      // ID is for external relationships, and the installation_id matches the local env entry
      [id, installation_id?.replace(/\-/g, ``)].includes(trustRelationshipId),
    ) || null
  )
}

export function getTrustRelationshipDisplayName(
  trustRelationships: TrustRelationshipGetResponse[],
  trustRelationshipId: string,
): string {
  const trustRelationship = findTrustRelationshipById(trustRelationships, trustRelationshipId)
  return trustRelationship?.name || trustRelationshipId
}

export function getTrustRelationshipId({
  trustRelationship,
}: {
  trustRelationship: AccountTrustRelationship | ExternalTrustRelationship
}): string {
  return isAccountRelationship(trustRelationship)
    ? trustRelationship.account_id
    : trustRelationship.trust_relationship_id
}

export function isExternalRelationship(
  trustRelationship?: AccountTrustRelationship | ExternalTrustRelationship,
): trustRelationship is ExternalTrustRelationship {
  return Boolean(trustRelationship?.hasOwnProperty(`trust_relationship_id`))
}

export function isAccountRelationship(
  trustRelationship?: AccountTrustRelationship | ExternalTrustRelationship,
): trustRelationship is AccountTrustRelationship {
  return Boolean(trustRelationship?.hasOwnProperty(`account_id`))
}

export function isTrustRelationshipPossiblyDeleted(
  trustRelationships: TrustRelationshipGetResponse[],
  trustRelationshipId: string,
): boolean {
  return !findTrustRelationshipById(trustRelationships, trustRelationshipId)
}
