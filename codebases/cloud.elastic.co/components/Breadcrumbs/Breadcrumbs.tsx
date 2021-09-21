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

import React, { FunctionComponent, RefObject, useEffect, useState } from 'react'

import { withSmallErrorBoundary } from '../../cui'

import ContentResetPortal from './ContentResetPortal'
import BreadcrumbsImpl from './BreadcrumbsImpl'

import { RoutableBreadcrumb } from '../../types'

type Props = {
  breadcrumbs?: RoutableBreadcrumb[]
  breadcrumbsRef: RefObject<HTMLDivElement> | null
}

const Breadcrumbs: FunctionComponent<Props> = ({ breadcrumbs, breadcrumbsRef }) => {
  const [breadRef, setBreadRef] = useState(breadcrumbsRef?.current)

  useEffect(() => {
    if (breadcrumbsRef && breadcrumbsRef.current) {
      setBreadRef(breadcrumbsRef?.current)
    }
  }, [breadcrumbsRef, breadcrumbs])

  return (
    <ContentResetPortal container={breadRef}>
      <BreadcrumbsImpl breadcrumbs={breadcrumbs} />
    </ContentResetPortal>
  )
}

export default withSmallErrorBoundary(Breadcrumbs)
