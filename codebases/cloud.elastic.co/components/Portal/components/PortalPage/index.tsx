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

import React, { Fragment, PureComponent, ReactElement, ReactNode } from 'react'

import classNames from 'classnames'

import {
  EuiPage,
  EuiPageBody,
  EuiPageHeader,
  EuiPageContentBody,
  EuiPageContent,
  EuiPageContentHeaderSection,
  EuiSpacer,
  EuiTabbedContent,
  EuiTabbedContentTab,
  EuiTitle,
} from '@elastic/eui'

import ChromeHeader from '../../../ChromeHeader'
import Breadcrumbs, { BreadcrumbsContext } from '../../../Breadcrumbs'
import NotificationBanner from '../../../../apps/userconsole/components/NotificationBanner'

import history from '../../../../lib/history'

import { RoutableBreadcrumb } from '../../../../types'

import './portalPage.scss'

interface TabbedContent {
  initialSelectedTab: EuiTabbedContentTab
  tabs: EuiTabbedContentTab[]
}

interface Props {
  breadcrumbs?: RoutableBreadcrumb[]
  className?: string
  contentHeader?: React.ReactChild
  tabbedContent?: TabbedContent
}

class PortalPage extends PureComponent<Props> {
  render(): ReactElement {
    const { breadcrumbs = [], className, contentHeader, tabbedContent } = this.props

    return (
      <Fragment>
        <BreadcrumbsContext.Consumer>
          {({ breadcrumbsRef }) => (
            <Fragment>
              <ChromeHeader ref={breadcrumbsRef} hideTrialIndicator={true} showHelp={true} />

              <Breadcrumbs breadcrumbsRef={breadcrumbsRef} breadcrumbs={breadcrumbs} />

              <NotificationBanner />
            </Fragment>
          )}
        </BreadcrumbsContext.Consumer>

        <EuiPage className={classNames(`cloudContent cloud-portal`, className)}>
          <EuiPageBody id='cloudPortalPage' className='cloud-portal-page-body'>
            {contentHeader && (
              <EuiPageHeader className='cloud-portal-header'>
                <EuiPageContentHeaderSection>
                  <EuiSpacer size='s' />
                  <EuiTitle size='l'>
                    <h2 data-test-id='cloud-page-title'>{contentHeader}</h2>
                  </EuiTitle>
                  <EuiSpacer size='s' />
                </EuiPageContentHeaderSection>
              </EuiPageHeader>
            )}

            <EuiPageContent
              className={classNames('cloud-portal-page-content', {
                'cloud-page-tabbed-content': !!tabbedContent,
              })}
            >
              <EuiPageContentBody
                data-app='appContentBody'
                className='cloud-portal-page-content-body'
              >
                {this.renderContent()}
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      </Fragment>
    )
  }

  renderContent(): React.ReactChild | ReactNode {
    const { children, tabbedContent } = this.props

    if (tabbedContent) {
      const { tabs, initialSelectedTab } = tabbedContent
      return (
        <EuiTabbedContent
          className='cloud-page-tab-panel'
          tabs={tabs}
          initialSelectedTab={initialSelectedTab}
          autoFocus='selected'
          onTabClick={(tab) => {
            history.push(`${tab.id}`)
          }}
        />
      )
    }

    return children
  }
}

export default PortalPage
