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
import { FormattedMessage } from 'react-intl'
import cx from 'classnames'
import { flatMap, flow, isEmpty, intersection } from 'lodash'

import {
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingSpinner,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import { CuiLink, withErrorBoundary } from '../../cui'

import StackDeploymentHealthProblemsTitle from './StackDeploymentHealthProblemsTitle'

import RetryStackDeploymentAttemptButton from '../StackDeployments/RetryStackDeploymentAttemptButton'

import RetryPlanChangeFailed from './RetryPlanChangeFailed'

import { useForceUpdate } from '../../hooks'
import { isFeatureActivated } from '../../store'

import {
  dismissProblem,
  getEuiColor,
  HealthProblemList,
  HealthProblemListDismissed,
  resetProblemDismissions,
} from '../../lib/healthProblems'

import { getDeploymentHealthProblems } from '../../lib/healthProblems/stackDeploymentHealth'

import {
  getVersion,
  hasHealthyResourcePlan,
  isAnyResourcePlanUnhealthy,
  isEsStopping,
} from '../../lib/stackDeployments'

import { getSliderPrettyName, getSupportedSliderInstanceTypes } from '../../lib/sliders'

import { sliderActivityUrl } from '../../lib/urlBuilder'

import Feature from '../../lib/feature'

import {
  AsyncRequestState,
  StackDeployment,
  AnyResourceInfo,
  SliderInstanceType,
  AllocatorSearchResult,
} from '../../types'

import { RemoteResources } from '../../lib/api/v1/types'

import './stackDeploymentHealthProblems.scss'

type Props = {
  deployment: StackDeployment
  updatePlanRequests?: { [sliderInstanceType: string]: AsyncRequestState }
  cancelPlanRequests?: { [sliderInstanceType: string]: AsyncRequestState }
  hideActivityBits?: boolean
  hideLinks?: boolean
  hideHelpText?: boolean
  linkRecentChanges?: boolean
  spacerAfter?: boolean
  spacerBefore?: boolean
  deploymentAllocators?: AllocatorSearchResult[]
  onGettingStartedPage?: boolean
  ccsSettings?: RemoteResources | null
}

const StackDeploymentHealthProblems: FunctionComponent<Props> = ({
  deployment,
  updatePlanRequests,
  cancelPlanRequests,
  spacerBefore,
  spacerAfter,
  linkRecentChanges,
  hideLinks,
  hideHelpText,
  hideActivityBits,
  onGettingStartedPage,
  deploymentAllocators,
  ccsSettings,
}) => {
  const [problems, dismissedProblems] = getDeploymentHealthProblems({
    cancelPlanRequests,
    deployment,
    hideActivityBits,
    hideLinks,
    deploymentAllocators,
    ccsSettings,
  })

  /* we need to force updates because that's the only way to invalidate our UI after
   * changes made against localStorage affect what problems we show (based on dismissals)
   */
  const forceUpdate = useForceUpdate()

  if (isEmpty(problems)) {
    if (isEmpty(dismissedProblems)) {
      return null
    }

    return (
      <Fragment>
        {spacerBefore && <EuiSpacer size='m' />}

        <HealthProblemListDismissed
          dismissedProblems={dismissedProblems}
          resetProblemDismissions={flow(resetProblemDismissions, forceUpdate)}
        />

        {spacerAfter && <EuiSpacer size='m' />}
      </Fragment>
    )
  }

  const { resources } = deployment
  const anyPlanChangeFailed = isAnyResourcePlanUnhealthy({ deployment })
  const isBeingTerminated = isEsStopping({ deployment })
  const euiColor = getEuiColor(problems)
  const hideRetryButtons = isFeatureActivated(Feature.hideAdminReapplyButton)
  const showActivityOrRetryLinks = !hideActivityBits || !hideRetryButtons

  const dataTestSubjs = {
    'deployment-health-problems': true,
    'deployment-health-problems-serious': euiColor !== `primary`,
  }

  const gettingStartedPageDeploymentCreationMessage =
    onGettingStartedPage && !isBeingTerminated
      ? problems.find((problem) => problem.id === `deployment-being-created`)
      : null

  const viewSpecificProblems =
    hideActivityBits || gettingStartedPageDeploymentCreationMessage || isBeingTerminated
      ? problems.filter((problem) => problem.id !== `deployment-being-created`)
      : problems

  /* hidden problems aren't filtered out earlier, because
   * they might affect the title of the DeploymentHealthProblems call out.
   */
  const emptyCallOut =
    isEmpty(viewSpecificProblems.filter(notHidden)) && isEmpty(dismissedProblems.filter(notHidden))

  const sliderInstanceTypes = getSupportedSliderInstanceTypes()
  const resourceTypes = Object.keys(resources)
  const supportedResourceTypes = intersection(resourceTypes, sliderInstanceTypes)

  type TypedResource = {
    resource: AnyResourceInfo
    sliderInstanceType: SliderInstanceType
  }

  const resourcesWithTypes: TypedResource[] = flatMap(
    supportedResourceTypes,
    (sliderInstanceType) =>
      resources[sliderInstanceType].map((resource) => ({
        resource,
        sliderInstanceType,
      })),
  )

  const resourceTypesWithUnhealthyPlan = supportedResourceTypes.filter((sliderInstanceType) => {
    const [resource] = resources[sliderInstanceType]
    return !hasHealthyResourcePlan({ resource })
  })

  const retryMessages = resourceTypesWithUnhealthyPlan
    .filter(
      (sliderInstanceType) =>
        updatePlanRequests &&
        updatePlanRequests[sliderInstanceType] &&
        updatePlanRequests[sliderInstanceType].error,
    )
    .map((sliderInstanceType) => (
      <RetryPlanChangeFailed
        key={sliderInstanceType}
        error={updatePlanRequests![sliderInstanceType].error!}
      />
    ))

  const callOutContents = emptyCallOut ? null : (
    <EuiText color='default' size='s'>
      <HealthProblemList
        problems={viewSpecificProblems}
        dismissedProblems={dismissedProblems}
        dismissProblem={flow(dismissProblem, forceUpdate)}
        resetProblemDismissions={flow(resetProblemDismissions, forceUpdate)}
        hideHelpText={hideHelpText}
      />

      {retryMessages}

      {showActivityOrRetryLinks && linkRecentChanges && anyPlanChangeFailed && (
        <Fragment>
          <EuiSpacer size='s' />

          <EuiFlexGroup gutterSize='m' alignItems='center'>
            {!hideRetryButtons &&
              resourcesWithTypes
                .filter(({ resource }) => !hasHealthyResourcePlan({ resource }))
                .map(({ sliderInstanceType }, i) => (
                  <EuiFlexItem grow={false} key={i}>
                    <RetryStackDeploymentAttemptButton
                      deployment={deployment}
                      color={euiColor}
                      sliderInstanceType={sliderInstanceType}
                      size='s'
                    />
                  </EuiFlexItem>
                ))}

            {hideActivityBits || (
              <EuiFlexItem grow={false}>
                <span>
                  <FormattedMessage
                    id='deployment-health-problems.see-each-activity'
                    defaultMessage='Go to {activityLinks} Activity'
                    values={{
                      activityLinks: getActivityLinks(),
                    }}
                  />
                </span>
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        </Fragment>
      )}
    </EuiText>
  )

  return (
    <Fragment>
      {spacerBefore && <EuiSpacer size='m' />}
      <div data-test-id={cx(dataTestSubjs)}>
        {viewSpecificProblems.length > 0 && (
          <EuiCallOut
            title={<StackDeploymentHealthProblemsTitle problems={viewSpecificProblems} />}
            color={euiColor}
          >
            {callOutContents}
          </EuiCallOut>
        )}

        {gettingStartedPageDeploymentCreationMessage && (
          <EuiFlexGroup
            responsive={false}
            justifyContent='center'
            gutterSize='m'
            alignItems='center'
          >
            <EuiFlexItem grow={false}>
              <EuiLoadingSpinner size='l' className='deploymentHealth-loading' />
            </EuiFlexItem>
            <EuiFlexItem grow={true}>
              <EuiFlexGroup gutterSize='s'>
                <EuiFlexItem>
                  <EuiText
                    data-test-id={gettingStartedPageDeploymentCreationMessage['data-test-id']}
                    size='s'
                  >
                    {gettingStartedPageDeploymentCreationMessage.title}
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiText size='s' color='subdued'>
                    {gettingStartedPageDeploymentCreationMessage.message}
                  </EuiText>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        )}
      </div>
      {spacerAfter && <EuiSpacer size='m' />}
    </Fragment>
  )

  function getActivityLinks() {
    const { id } = deployment
    const version = getVersion({ deployment })

    const links = resourceTypesWithUnhealthyPlan.map((sliderInstanceType) => (
      <CuiLink
        key={sliderInstanceType}
        to={sliderActivityUrl(id, sliderInstanceType)}
        color={euiColor}
      >
        <FormattedMessage {...getSliderPrettyName({ sliderInstanceType, version })} />
      </CuiLink>
    ))

    const activityLinks = links.reduce(
      (
        rest: JSX.Element,
        link: JSX.Element,
        index: number,
        linksReduced: JSX.Element[],
      ): JSX.Element => {
        if (index === 0) {
          return link
        }

        if (index === linksReduced.length - 1) {
          return (
            <FormattedMessage
              id='deployment-health-problems.last-link'
              defaultMessage='{rest} or {link}'
              values={{ rest, link }}
            />
          )
        }

        return (
          <FormattedMessage
            id='deployment-health-problems.middle-link'
            defaultMessage='{rest}, {link}'
            values={{ rest, link }}
          />
        )
      },
      null,
    )

    return <span data-test-id='deployment-health-problems-view-activity-btns'>{activityLinks}</span>
  }
}

export default withErrorBoundary(StackDeploymentHealthProblems)

function notHidden(problem) {
  return problem.hidden !== true
}
