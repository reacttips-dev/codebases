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

import React, { Fragment, FunctionComponent } from 'react'
import { defineMessages, IntlShape, injectIntl } from 'react-intl'

import { EuiListGroup, EuiListGroupItem, EuiText } from '@elastic/eui'

import { getSliderPrettyName } from '../../../lib/sliders'

import { SliderInstanceType, VersionNumber } from '../../../types'
import { ExternalHyperlink } from '../../../lib/api/v1/types'
import ExternalLink from '../../ExternalLink'

import './externalLinksList.scss'

type AllocatorExternalLinksListProps = {
  intl: IntlShape
  links: ExternalHyperlink[]
}

type ResourceExternalLinksListProps = {
  intl: IntlShape
  links: ExternalHyperlink[]
  sliderInstanceType?: SliderInstanceType | null
  version: VersionNumber | null
}

// These mirror the IDs and labels that the API returns, but we wrap them in
// a `defineMessages` so that they can be localized. It's possible that the API
// could return a new link for which we have no localization, but in that case
// the label returned by the API will be used instead.
const messages = defineMessages({
  // ECE
  'cluster-logs': {
    id: `cluster-external-links.cluster-logs`,
    defaultMessage: `{sliderPrettyName} logs`,
  },
  metricbeat: {
    id: `cluster-external-links.metricbeat`,
    defaultMessage: `{sliderPrettyName} metrics`,
  },
  'proxy-logs': {
    id: `cluster-external-links.proxy-logs`,
    defaultMessage: `Proxy logs`,
  },

  // SaaS
  'cluster-logs-es-saas': {
    id: `cluster-external-links.cluster-logs-es-saas`,
    defaultMessage: `Legacy Elasticsearch logs`,
  },
  'proxy-logs-es-saas': {
    id: `cluster-external-links.proxy-logs-es-saas`,
    defaultMessage: `Legacy Elasticsearch proxy logs`,
  },
  'metrics-gc-es-saas': {
    id: `cluster-external-links.metrics-gc-es-saas`,
    defaultMessage: `Legacy Elasticsearch GC metrics`,
  },
  'kopf-saas': {
    id: `cluster-external-links.kopf-saas`,
    defaultMessage: `Kopf`,
  },
  'metrics-overview-es-saas': {
    id: `cluster-external-links.metrics-overview-es-saas`,
    defaultMessage: `Legacy Elasticsearch metrics`,
  },
  'cluster-logs-beta-es-saas': {
    id: `cluster-external-links.cluster-logs-beta-es-saas`,
    defaultMessage: `Beta Elasticsearch logs`,
  },
  'service-cluster-beats': {
    id: `cluster-external-links.cluster-logs-metrics-delivery-logs`,
    defaultMessage: `Logs and Metrics delivery logs`,
  },

  // Allocators
  'allocator-logs': {
    id: `allocator-external-links.logs`,
    defaultMessage: `Allocator logs`,
  },
  'allocator-metrics': {
    id: `allocator-external-links.metrics`,
    defaultMessage: `Allocator metrics`,
  },
  'metrics-vm-utilization': {
    id: `allocator-external-links.vm-utilization`,
    defaultMessage: `VM Utilization and Saturation`,
  },
})

function internationalizeLinks({
  intl: { formatMessage, locale },
  links,
  values,
}: {
  intl: IntlShape
  links: ExternalHyperlink[]
  values?: Record<string, string>
}): ExternalHyperlink[] {
  const translated = links.map((link) => ({
    ...link,
    label: messages[link.id] ? formatMessage(messages[link.id], values) : link.label,
  }))

  const locales = locale === `en-US` ? locale : [locale, `en-US`]

  translated.sort((a, b) => a.label.localeCompare(b.label, locales))

  return translated
}

const AllocatorExternalLinksList: FunctionComponent<AllocatorExternalLinksListProps> = ({
  intl,
  links,
}) => {
  const internationalizedLinks = internationalizeLinks({ links, intl })

  return (
    <EuiListGroup className='allocator-external-links-list' gutterSize='none'>
      {internationalizedLinks.map(({ id, label, uri }) => (
        <EuiListGroupItem
          key={id}
          label={
            <EuiText size='s'>
              <p>
                <ExternalLink href={uri}>{label}</ExternalLink>
              </p>
            </EuiText>
          }
        />
      ))}
    </EuiListGroup>
  )
}

const DeploymentAllocatorExternalLinksList: FunctionComponent<AllocatorExternalLinksListProps> = ({
  intl,
  links,
}) => {
  const internationalizedLinks = internationalizeLinks({ links, intl })

  const externalLinks = internationalizedLinks.map(({ id, label, uri }) => (
    <ExternalLink href={uri} key={id} showExternalLinkIcon={false}>
      {label}
    </ExternalLink>
  ))

  const externalLinksWithPipes = externalLinks.reduce(
    (acc, curr) => [...acc, acc.length > 0 ? ' | ' : '', curr],
    [],
  )

  return <Fragment>({externalLinksWithPipes})</Fragment>
}

const ResourceExternalLinksList: FunctionComponent<ResourceExternalLinksListProps> = ({
  intl,
  links,
  sliderInstanceType,
  version,
}) => {
  const { formatMessage } = intl
  const slider = sliderInstanceType || 'elasticsearch'

  const values = {
    sliderPrettyName: formatMessage(getSliderPrettyName({ sliderInstanceType: slider, version })),
  }

  const internationalizedLinks = internationalizeLinks({ links, intl, values })

  return (
    <EuiListGroup size='m' gutterSize='none'>
      {internationalizedLinks.map(({ id, label, uri }) => (
        <EuiListGroupItem href={uri} key={id} label={label} target='_blank' iconType='popout' />
      ))}
    </EuiListGroup>
  )
}

const AllocatorExternalLinksListWithIntl = injectIntl(AllocatorExternalLinksList)

const DeploymentAllocatorExternalLinksListWithIntl = injectIntl(
  DeploymentAllocatorExternalLinksList,
)

const ResourceExternalLinksListWithIntl = injectIntl(ResourceExternalLinksList)

export {
  AllocatorExternalLinksListWithIntl as AllocatorExternalLinksList,
  DeploymentAllocatorExternalLinksListWithIntl as DeploymentAllocatorExternalLinksList,
  ResourceExternalLinksListWithIntl as ResourceExternalLinksList,
}
