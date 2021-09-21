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

import { flatMap, filter, find, orderBy, size } from 'lodash'
import React, { Component, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { CuiTabbedContent } from '../../cui'

import DeploymentActivityTable from './DeploymentActivityTable'
import DeploymentActivityTabTitle from './DeploymentActivityTabTitle'

import {
  getSliderIconType,
  getSliderPrettyName,
  getSupportedSliderInstanceTypes,
} from '../../lib/sliders'

import {
  hasSizedSliderResource,
  hasOngoingResourceTypeConfigurationChange,
  getVersion,
} from '../../lib/stackDeployments'

import {
  ResourceChangeAttempt,
  StackDeployment,
  AnyResourceInfo,
  AnyClusterPlanInfo,
  SliderInstanceType,
} from '../../types'

export type ActivityTabId = '_all' | SliderInstanceType

export type ActivityTab = {
  id: ActivityTabId
  title: ReactNode
  content: ReactNode
}

type Props = {
  deployment: StackDeployment
  planAttempts: ResourceChangeAttempt[]
  showTab?: (tab: ActivityTabId) => boolean
  selectedTab: ActivityTabId
  onTabSelect: (tab: ActivityTabId) => void
  filterByPlanAttempt?: (planAttemptId: string) => void
}

type DefaultProps = {
  showTab: (tab: ActivityTabId) => boolean
}

class StackDeploymentActivityTabs extends Component<Props & DefaultProps> {
  static defaultProps: DefaultProps = {
    showTab: () => true,
  }

  render() {
    const { selectedTab, onTabSelect } = this.props
    const tabs = this.getTabs()

    return (
      <CuiTabbedContent
        tabs={tabs}
        selectedTab={find(tabs, { id: selectedTab })}
        onTabClick={(tab: ActivityTab) => onTabSelect(tab.id)}
      />
    )
  }

  getTabs(): ActivityTab[] {
    const { deployment, showTab, planAttempts, selectedTab, filterByPlanAttempt } = this.props

    const totalChangeCount = size(planAttempts)
    const unfiltered = totalChangeCount === this.countAllPlanAttempts(selectedTab)
    const version = getVersion({ deployment })

    const allTab: ActivityTab = {
      id: `_all`,
      title: (
        <DeploymentActivityTabTitle
          name={<FormattedMessage id='deployment-activity.tab-all-plans' defaultMessage='All' />}
          count={totalChangeCount}
        />
      ),
      content: (
        <DeploymentActivityTable
          planAttempts={sortPlans(planAttempts)}
          totalCount={this.countAllPlanAttempts(`_all`)}
          emptyText={
            unfiltered ? (
              <FormattedMessage
                id='deployment-activity.every-empty'
                defaultMessage='This deployment has no configuration changes'
              />
            ) : (
              <FormattedMessage
                id='deployment-activity.every-unmatched'
                defaultMessage='No configuration changes match your query'
              />
            )
          }
          filterByPlanAttempt={filterByPlanAttempt}
        />
      ),
    }

    const sliderTabs: ActivityTab[] = getSupportedSliderInstanceTypes()
      .filter(showTab)
      .map((sliderInstanceType) => {
        const name = <FormattedMessage {...getSliderPrettyName({ sliderInstanceType, version })} />

        const plans = filter<ResourceChangeAttempt>(planAttempts, {
          resourceType: sliderInstanceType,
        })

        const sized = hasSizedSliderResource({
          deployment,
          resourceType: sliderInstanceType,
        })

        const applyingChanges = hasOngoingResourceTypeConfigurationChange({
          deployment,
          resourceType: sliderInstanceType,
        })

        const notEs = sliderInstanceType !== `elasticsearch`

        const isDeleted = notEs && !sized && !applyingChanges

        return {
          id: sliderInstanceType,
          title: (
            <DeploymentActivityTabTitle
              iconType={getSliderIconType({ sliderInstanceType })}
              name={name}
              count={size(plans)}
              isDeleted={isDeleted}
            />
          ),
          content: (
            <DeploymentActivityTable
              planAttempts={sortPlans(plans)}
              totalCount={this.countAllPlanAttempts(sliderInstanceType)}
              emptyText={
                unfiltered ? (
                  <FormattedMessage
                    id='deployment-activity.slider-empty'
                    defaultMessage='This deployment has no {name} configuration changes'
                    values={{ name }}
                  />
                ) : (
                  <FormattedMessage
                    id='deployment-activity.slider-unmatched'
                    defaultMessage='No {name} configuration changes match your query'
                    values={{ name }}
                  />
                )
              }
              filterByPlanAttempt={filterByPlanAttempt}
            />
          ),
        }
      })

    return [allTab, ...sliderTabs]
  }

  countAllPlanAttempts = (tab: ActivityTabId): number => {
    const { deployment } = this.props
    const planAttempts = getAllPlanAttempts({ deployment })

    if (tab !== `_all`) {
      const filteredPlans = filter(planAttempts, { resourceType: tab })
      return size(filteredPlans)
    }

    return size(planAttempts)
  }
}

function sortPlans(plans: ResourceChangeAttempt[]): ResourceChangeAttempt[] {
  return orderBy<ResourceChangeAttempt>(
    plans,
    [
      ({ planAttempt }) => planAttempt.attempt_end_time,
      ({ planAttempt }) => planAttempt.attempt_start_time,
    ],
    [`desc`, `desc`],
  )
}

export default StackDeploymentActivityTabs

export function getAllPlanAttempts({
  deployment,
  includePending = true,
}: {
  deployment: StackDeployment
  includeCurrent?: boolean
  includePending?: boolean
}): ResourceChangeAttempt[] {
  const sliderInstanceTypes = getSupportedSliderInstanceTypes()

  const planAttempts = flatMap(sliderInstanceTypes, (sliderInstanceType) => {
    const sliderResources = deployment.resources[sliderInstanceType]

    return flatMap(sliderResources, (sliderResource: AnyResourceInfo) => {
      const { pending, history } = sliderResource.info.plan_info
      const everyResourcePlan = [...history]

      if (includePending && pending) {
        everyResourcePlan.unshift(pending)
      }

      return flatMap(everyResourcePlan, (planAttempt: AnyClusterPlanInfo) => ({
        deployment,
        resource: sliderResource,
        resourceType: sliderInstanceType,
        planAttempt,
      }))
    })
  })

  return planAttempts
}
