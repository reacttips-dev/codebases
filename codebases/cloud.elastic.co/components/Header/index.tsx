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

import React, { FunctionComponent, Fragment, ReactNode } from 'react'

import {
  EuiHorizontalRule,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiSpacer,
  EuiText,
  EuiTitle,
  PropsOf,
} from '@elastic/eui'

import Breadcrumbs, { BreadcrumbsContext } from '../Breadcrumbs'

type Breadcrumb = {
  to?: string
  text: NonNullable<ReactNode>
}

type Props = {
  name?: ReactNode
  children?: ReactNode
  breadcrumbs?: Breadcrumb[]
  size?: PropsOf<typeof EuiTitle>['size']
  className?: string
  subHeading?: ReactNode
}

const Header: FunctionComponent<Props> = ({
  name,
  children,
  breadcrumbs,
  className,
  size = 'l',
  subHeading,
}: Props) => (
  <Fragment>
    <BreadcrumbsContext.Consumer>
      {({ breadcrumbsRef }) => (
        <Breadcrumbs breadcrumbsRef={breadcrumbsRef} breadcrumbs={breadcrumbs} />
      )}
    </BreadcrumbsContext.Consumer>

    {name && (
      <Fragment>
        <EuiPageContentHeader className={className}>
          <EuiPageContentHeaderSection>
            <EuiTitle size={size} data-test-id='deployment-title'>
              <h1 data-test-id='cloud-page-title'>{name}</h1>
            </EuiTitle>

            {subHeading && (
              <Fragment>
                <EuiSpacer size='s' />
                <EuiText>{subHeading}</EuiText>
              </Fragment>
            )}
          </EuiPageContentHeaderSection>

          {children && <EuiPageContentHeaderSection>{children}</EuiPageContentHeaderSection>}
        </EuiPageContentHeader>

        <EuiHorizontalRule margin='m' />
        <EuiSpacer size='m' />
      </Fragment>
    )}
  </Fragment>
)

export default Header
