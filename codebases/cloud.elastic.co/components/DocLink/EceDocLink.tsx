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

import ExternalLink from '../ExternalLink'

import platformVersions from '../../config/platformVersions.json'

interface Props {
  href: string
  hash?: string
  showExternalLinkIcon?: boolean
}

const { eceVersion } = platformVersions

const EceDocLink: FunctionComponent<Props> = ({ href, hash, showExternalLinkIcon, children }) => (
  <ExternalLink
    showExternalLinkIcon={showExternalLinkIcon}
    href={getEceDocLinkUrl({ href, hash })}
    className='docLink'
  >
    {children}
  </ExternalLink>
)

export function getEceDocLinkUrl({ href, hash }: Props) {
  const baseUrl = `https://www.elastic.co/guide/en/cloud-enterprise/${eceVersion}`

  if (href === `index.html`) {
    return `${baseUrl}/${href}`
  }

  const hashToDisplay = hash != null ? `#ece-${hash}` : ``
  return `${baseUrl}/ece-${href}${hashToDisplay}`
}

export default EceDocLink
