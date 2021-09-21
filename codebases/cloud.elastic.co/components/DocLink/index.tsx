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

import { CuiSmallErrorBoundary } from '../../cui/SmallErrorBoundary'

import EceDocLink, { getEceDocLinkUrl } from './EceDocLink'
import EssDocLink, { getEssDocLinkUrl } from './EssDocLink'
import EssHerokuDocLink, { getEssHerokuDocLinkUrl } from './EssHerokuDocLink'
import StackDocLink, { getStackDocLinkUrl } from './StackDocLink'

import { getConfigForKey } from '../../store'

import docLinks from '../../constants/docLinks'

import { CloudDocKind, DocLinkKind, DocLink as DocLinkType } from '../../types'

interface Props {
  link: string
  showExternalLinkIcon?: boolean
}

interface DocLinkProps {
  href: string
  hash?: string
  showExternalLinkIcon?: boolean
}

type DocLinkComponents = { [key in DocLinkKind]: FunctionComponent<DocLinkProps> }

const cloudDocLinkComponents: DocLinkComponents = {
  ess: EssDocLink,
  ess_heroku: EssHerokuDocLink,
  ece: EceDocLink,
  stack: StackDocLink,
}

const DocLink: FunctionComponent<Props> = ({ link, showExternalLinkIcon = false, children }) => (
  <CuiSmallErrorBoundary forInlineText={true}>
    <DocLinkImpl link={link} showExternalLinkIcon={showExternalLinkIcon}>
      {children}
    </DocLinkImpl>
  </CuiSmallErrorBoundary>
)

const DocLinkImpl: FunctionComponent<Props> = ({ link, children, showExternalLinkIcon }) => {
  const docLinkKind = getConfigForKey<CloudDocKind>(`DOCUMENTATION_KIND`)

  if (docLinkKind === null) {
    throw TypeError(`Expected "DOCUMENTATION_KIND" to be configured, but got: ${docLinkKind}`)
  }

  const DocLinkEl = getDocLinkClass(link, docLinkKind)
  const docLink = getDocLinkOrMaybeFailSilently(link, docLinkKind)
  const { href, hash } = docLink

  return (
    <DocLinkEl href={href} hash={hash} showExternalLinkIcon={showExternalLinkIcon}>
      {children}
    </DocLinkEl>
  )
}

function getDocLinkOrMaybeFailSilently(link, docLinkKind): DocLinkType {
  try {
    return getDocLink(link, docLinkKind)
  } catch (_err) {
    console.warn(_err)

    /*
     * we don't want missing links to show up as error boundaries
     * so instead, we fail silently by linking to the root of our ESS/ECE documentation,
     * and let the user look up whatever documentation they're looking for themselves
     */
    return { href: 'index.html' }
  }
}

export function getDocLink(link: string, docLinkKind: DocLinkKind): DocLinkType {
  const docLinkDef = docLinks[link]

  if (docLinkDef == null) {
    throw TypeError(`Expected "${link}" to be defined in constants/docLinks (${docLinkKind})`)
  }

  // external Stack documentation takes precedence over Cloud docs
  const kind = docLinkDef.stack ? `stack` : docLinkKind

  if (docLinkDef[kind]) {
    return docLinkDef[kind]!
  }

  throw new Error(`Unexpected doc link kind: ${link}, ${docLinkKind}`)
}

export function docLinkAsString(
  link: string,
  {
    docLinkKind = getConfigForKey<DocLinkKind>(`DOCUMENTATION_KIND`),
  }: {
    docLinkKind?: DocLinkKind | null
  } = {},
) {
  if (docLinkKind === null) {
    throw TypeError(`Expected "docLinkKind" to be configured, but got: ${docLinkKind}`)
  }

  const docLink = getDocLink(link, docLinkKind)
  const { href, hash } = docLink

  if (docLinkKind === `stack`) {
    return getStackDocLinkUrl({ href, hash })
  }

  if (docLinkKind === `ess`) {
    return getEssDocLinkUrl({ href, hash })
  }

  if (docLinkKind === `ess_heroku`) {
    return getEssHerokuDocLinkUrl({ href, hash })
  }

  if (docLinkKind === `ece`) {
    return getEceDocLinkUrl({ href, hash })
  }

  throw new Error(`Unexpected doc link kind: ${link}, ${docLinkKind}`)
}

export default DocLink

function getDocLinkClass(link: string, kind: DocLinkKind) {
  const docLinkDef = docLinks[link]

  return cloudDocLinkComponents[docLinkDef.stack ? `stack` : kind]
}
