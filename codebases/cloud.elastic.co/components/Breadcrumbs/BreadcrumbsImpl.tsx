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

import { EuiHeaderBreadcrumbs, EuiBreadcrumb } from '@elastic/eui'

import { withSmallErrorBoundary } from '../../cui'

import BreadcrumbsWrapper from './BreadcrumbsWrapper'

import history from '../../lib/history'
import { getRootByApp } from '../../lib/crumbBuilder'

import { RoutableBreadcrumb } from '../../types'

type Props = {
  breadcrumbs?: RoutableBreadcrumb[]
  linkAll?: boolean
}

const BreadcrumbsImpl: FunctionComponent<Props> = ({ breadcrumbs = [], linkAll }) => {
  const root = getRootByApp({ linkRoot: breadcrumbs.length > 0 })
  const allRoutableBreadcrumbs = [...root, ...breadcrumbs]

  const euiBreadcrumbs = allRoutableBreadcrumbs.map(
    ({ text, to }: RoutableBreadcrumb, index: number, list: RoutableBreadcrumb[]) => {
      const isLast = index === list.length - 1
      const linkify = linkAll || !isLast

      return getEuiBreadcrumb({ text, href: to, linkify })
    },
  )

  return (
    <BreadcrumbsWrapper>
      <EuiHeaderBreadcrumbs
        arial-label='breadcrumb'
        data-test-id='populated-header-breadcrumbs'
        breadcrumbs={euiBreadcrumbs}
      />
    </BreadcrumbsWrapper>
  )
}

export default withSmallErrorBoundary(BreadcrumbsImpl)

function getEuiBreadcrumb({
  text,
  href,
  linkify,
}: {
  text: RoutableBreadcrumb['text']
  href?: string
  linkify: boolean
}): EuiBreadcrumb {
  const linkProps = linkify
    ? {
        href,
        onClick: href
          ? (e) => {
              history.push(href)
              e.preventDefault()
              e.stopPropagation()
            }
          : undefined,
      }
    : {}

  return {
    text,
    ...linkProps,
  }
}
