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

import React, { Component, Fragment } from 'react'

import { getFilterQueryString, setFilterQueryString } from '../../cui'

import StackDeploymentActivityFilterableTabs from './StackDeploymentActivityFilterableTabs'
import { ActivityTabId } from './StackDeploymentActivityTabs'

import { getSupportedSliderInstanceTypes, isSliderInstanceType } from '../../lib/sliders'
import { isSliderSupportedForDeployment } from '../../lib/stackDeployments'

import history from '../../lib/history'

import { deploymentActivityUrl, sliderActivityUrl } from '../../lib/urlBuilder'

import { StackDeployment } from '../../types'

import { DeploymentTemplateInfoV2 } from '../../lib/api/v1/types'
import { WithStackDeploymentRouteParamsProps } from '../StackDeploymentEditor'

type Props = WithStackDeploymentRouteParamsProps & {
  stackDeployment: StackDeployment
  deploymentTemplate?: DeploymentTemplateInfoV2 | null
  regionId: string
  selectedTabUrl: string
  downloadActivityFeature: boolean
}

class StackDeploymentActivity extends Component<Props> {
  render() {
    const { stackDeployment, downloadActivityFeature, selectedTabUrl } = this.props

    return (
      <Fragment>
        <StackDeploymentActivityFilterableTabs
          deployment={stackDeployment}
          selectedTab={getActivityTabFromUrl(stackDeployment.id, selectedTabUrl)}
          onTabSelect={setUrlFromActivityTab(stackDeployment.id)}
          initialQuery={getFilterQueryString()}
          onQueryChange={setFilterQueryString}
          showTab={this.showTab}
          downloadActivityFeature={downloadActivityFeature}
        />
      </Fragment>
    )
  }

  showTab = (tab: ActivityTabId): boolean => {
    const { stackDeployment: deployment, deploymentTemplate } = this.props

    if (isSliderInstanceType(tab)) {
      return isSliderSupportedForDeployment({
        deployment,
        deploymentTemplate: deploymentTemplate?.deployment_template,
        sliderInstanceType: tab,
      })
    }

    return true
  }
}

function getActivityTabFromUrl(id: string, url): ActivityTabId {
  const normalizedUrl = normalizeUrl(url)
  const tabs = getSupportedSliderInstanceTypes()

  for (const tab of tabs) {
    if (buildUrl(id, tab) === normalizedUrl) {
      return tab
    }
  }

  return `_all`
}

function setUrlFromActivityTab(id: string) {
  return (tab: ActivityTabId) => {
    history.replace(buildUrl(id, tab))
  }
}

function normalizeUrl(url) {
  const firstIndexOfQuery = url.indexOf(`?`)
  return url.slice(0, firstIndexOfQuery === -1 ? Infinity : firstIndexOfQuery)
}

function buildUrl(id: string, tab: ActivityTabId) {
  if (isSliderInstanceType(tab)) {
    return sliderActivityUrl(id, tab)
  }

  return deploymentActivityUrl(id)
}

export default StackDeploymentActivity
