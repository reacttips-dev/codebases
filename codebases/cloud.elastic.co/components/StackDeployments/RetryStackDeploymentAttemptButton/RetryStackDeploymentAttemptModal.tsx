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

import { isEmpty, set } from 'lodash'
import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiAccordion, EuiSpacer, EuiTab, EuiTabs, EuiToolTip } from '@elastic/eui'

import { CuiCodeBlock, CuiLink } from '../../../cui'

import { QuickDeploymentUpdateCustomModalProps } from '../QuickDeploymentUpdateButton'

import StackConfigurationChangeExplain, {
  getPropsToExplainChangeFromAttempt,
} from '../../StackDeploymentConfigurationChange/StackConfigurationChangeExplain'

import StackConfigurationChangeOneLiner from '../../StackDeploymentConfigurationChange/StackConfigurationChangeOneLiner'

import FailoverOptions from '../../StackDeploymentEditor/EditStackDeploymentEditor/FailoverOptions'

import { setAdvancedEditInitialState } from '../../StackDeploymentEditor/EditStackDeploymentAdvanced/carryover'

import { hasJsonDiff, jsonDiff } from '../../../lib/diff'
import { deploymentAdvancedEditUrl } from '../../../lib/urlBuilder'

import {
  getEsPlan,
  getSliderPlanFromGet,
  hasFailedCreatePlan,
  getPlanBeforeAttempt,
} from '../../../lib/stackDeployments'

import { getConfigForKey } from '../../../store'

enum SelectedTab {
  originalDiff,
  diffWithLatest,
}

type Props = QuickDeploymentUpdateCustomModalProps

type State = {
  selectedTab: SelectedTab
}

class RetryStackDeploymentAttemptModal extends Component<Props, State> {
  static defaultProps = {
    size: `s`,
    color: `warning`,
  }

  state: State = {
    selectedTab: SelectedTab.diffWithLatest,
  }

  componentWillUnmount() {
    const { resetUpdateDeployment, deployment } = this.props
    const { id } = deployment
    resetUpdateDeployment(id)
  }

  render() {
    const {
      deployment,
      hideExtraFailoverOptions,
      hidePlanDetails,
      planAttemptUnderRetry,
      regionId,
      showAdvancedEditor,
      sliderInstanceType,
      updatePayload,
    } = this.props

    const { selectedTab } = this.state

    const { id } = deployment

    const isUserConsole = getConfigForKey(`APP_NAME`) === `userconsole`
    const createFailed = hasFailedCreatePlan({ deployment })
    const esPlan = getEsPlan({ deployment: updatePayload })!
    const [resource] = deployment.resources[sliderInstanceType]

    return (
      <div>
        {showAdvancedEditor && (
          <p>
            <FormattedMessage
              id='reapply-plan-button.no-transient-settings'
              defaultMessage='Note that for safety, any parameters that control how the configuration is applied will be removed. To reapply a configuration change and include these settings, go to {advancedEditor}.'
              values={{
                advancedEditor: (
                  <CuiLink
                    to={deploymentAdvancedEditUrl(id)}
                    onClick={() =>
                      setAdvancedEditInitialState({
                        regionId,
                        deploymentId: id,
                        deployment: updatePayload,
                      })
                    }
                  >
                    <FormattedMessage
                      id='reapply-plan-button.advanced-editor'
                      defaultMessage='Advanced Edit'
                    />
                  </CuiLink>
                ),
              }}
            />
          </p>
        )}

        <StackConfigurationChangeOneLiner
          resource={resource}
          sliderInstanceType={sliderInstanceType}
          planAttempt={planAttemptUnderRetry}
          hideAttribution={isUserConsole}
        />

        <EuiSpacer size='m' />

        <EuiTabs>
          <EuiTab
            isSelected={selectedTab === SelectedTab.diffWithLatest}
            onClick={() => this.setState({ selectedTab: SelectedTab.diffWithLatest })}
          >
            <EuiToolTip
              content={
                <FormattedMessage
                  id='reapply-plan-button.today-change-tooltip'
                  defaultMessage='Describes changes that would be made to the cluster if you were to reapply the changes today'
                />
              }
            >
              <FormattedMessage id='reapply-plan-button.changes-today' defaultMessage='Changes' />
            </EuiToolTip>
          </EuiTab>

          {!createFailed && !hidePlanDetails && (
            <EuiTab
              isSelected={selectedTab === SelectedTab.originalDiff}
              onClick={() => this.setState({ selectedTab: SelectedTab.originalDiff })}
            >
              <EuiToolTip
                content={
                  <FormattedMessage
                    id='reapply-plan-button.original-change-tooltip'
                    defaultMessage='Describes changes made to the cluster at the time when the changes were originally applied'
                  />
                }
              >
                <FormattedMessage
                  id='reapply-plan-button.original-change'
                  defaultMessage='Original changes'
                />
              </EuiToolTip>
            </EuiTab>
          )}
        </EuiTabs>

        {this.renderDiffTab()}

        {sliderInstanceType === `elasticsearch` && (
          <Fragment>
            <EuiSpacer size='m' />

            <EuiAccordion
              id='reapply-plan-button-accordion'
              buttonContent={
                <span data-test-id='reapply-plan-advanced-options-toggle-btn'>
                  <FormattedMessage
                    id='reapply-plan-button.advanced-options'
                    defaultMessage='Advanced options'
                  />
                </span>
              }
            >
              <EuiSpacer size='s' />

              <FailoverOptions
                checkboxIdPrefix='retry-modal'
                deployment={deployment}
                plan={esPlan}
                hideExtraFailoverOptions={hideExtraFailoverOptions}
                onChange={this.onChange}
              />
            </EuiAccordion>
          </Fragment>
        )}
      </div>
    )
  }

  renderDiffTab() {
    const {
      regionId,
      deployment,
      planAttemptUnderRetry,
      sliderInstanceType,
      hidePlanDetails,
      updatePayload,
    } = this.props

    const { selectedTab } = this.state

    const [resource] = deployment.resources[sliderInstanceType]

    const prevPlan = getPreviousPlan()
    const explainAttemptProps = getPropsToExplainChangeFromAttempt({
      planAttempt: planAttemptUnderRetry,
      prevPlan,
      sliderInstanceType,
    })

    const nextPlan = planAttemptUnderRetry.plan || {}
    const isDifferent = !isEmpty(prevPlan) && hasJsonDiff(prevPlan!, nextPlan)
    const source = isDifferent ? jsonDiff(prevPlan!, nextPlan) : JSON.stringify(nextPlan, null, 2)
    const language = isDifferent ? `diff` : `json`

    return (
      <Fragment>
        <StackConfigurationChangeExplain
          regionId={regionId}
          elasticsearchClusterId={deployment.id}
          pruneOrphans={updatePayload.prune_orphans}
          spacerBefore={true}
          isPastHistory={false}
          {...explainAttemptProps}
        />

        {hidePlanDetails || (
          <Fragment>
            <EuiSpacer size='m' />

            <CuiCodeBlock language={language} overflowHeight={400}>
              {source}
            </CuiCodeBlock>
          </Fragment>
        )}
      </Fragment>
    )

    function getPreviousPlan() {
      /* we want to highlight the difference between:
       * - the plan being retried ("plan under attempt")
       * - the current plan at the time "plan under attempt" was originally applied
       */
      if (selectedTab === SelectedTab.originalDiff) {
        const planBeforeAttempt = getPlanBeforeAttempt({
          resource,
          planAttempt: planAttemptUnderRetry,
        })
        return planBeforeAttempt
      }

      /* we want to highlight the difference between:
       * - the plan being retried ("plan under attempt")
       * - the current plan we have right now
       */
      const currentPlan = getSliderPlanFromGet({
        deployment,
        sliderInstanceType,
      })
      return currentPlan
    }
  }

  onChange = (path: string[], value: any) => {
    const { onChange } = this.props

    const changes = set({}, path, value)

    onChange({
      resources: {
        elasticsearch: [
          {
            plan: changes,
          },
        ],
      },
    })
  }
}

export default RetryStackDeploymentAttemptModal
