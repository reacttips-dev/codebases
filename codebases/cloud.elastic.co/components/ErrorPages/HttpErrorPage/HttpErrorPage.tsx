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

import { EuiPage, EuiPageBody, EuiPageContent, EuiPageContentBody } from '@elastic/eui'

import ChromeHeader from '../../ChromeHeader'
import { BreadcrumbsContext } from '../../Breadcrumbs'

import { portalCrumbs } from '../../../lib/portalCrumbBuilder'

import '../errorPages.scss'

type Props = {
  isPortalEnabled: boolean
  children: ReactNode
}

const HttpErrorPage: FunctionComponent<Props> = ({ isPortalEnabled, children }) => (
  <Fragment>
    <BreadcrumbsContext.Consumer>
      {({ breadcrumbsRef }) =>
        isPortalEnabled ? (
          <ChromeHeader
            ref={breadcrumbsRef}
            breadcrumbs={portalCrumbs()}
            hideTrialIndicator={true}
            showHelp={true}
          />
        ) : (
          <ChromeHeader ref={breadcrumbsRef} showBreadcrumbs={false} />
        )
      }
    </BreadcrumbsContext.Consumer>

    <EuiPage className='http-error-pages' style={{ height: '90vh' }}>
      <EuiPageBody>
        <EuiPageContent paddingSize='m' verticalPosition='center' horizontalPosition='center'>
          <EuiPageContentBody>{children}</EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  </Fragment>
)

export default HttpErrorPage
