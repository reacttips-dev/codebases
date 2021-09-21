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

import { isEmpty, isEqual } from 'lodash'

import React, { Component, Fragment, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiCallOut, EuiListGroup, EuiLoadingContent, EuiSpacer } from '@elastic/eui'

import { CuiAlert } from '../../cui'

import { getValidationWarnings, decorateWarningsWithSliderType } from '../../lib/dryRunWarnings'
import { getStatus } from '../../lib/error'
import { getSliderPrettyName, isSliderInstanceTypeSupportedInPlatform } from '../../lib/sliders'

import { AsyncRequestState } from '../../types'

import { DeploymentUpdateRequest } from '../../lib/api/v1/types'
import { getUpsertVersion } from '../../lib/stackDeployments'

type Props = {
  deploymentId: string
  deployment: DeploymentUpdateRequest
  updateDeploymentDryRun: () => void
  resetUpdateDeploymentDryRun: () => void
  updateDeploymentDryRunRequest: AsyncRequestState
  ignoreSecurityRealmWarnings?: boolean
  spacerBefore?: boolean
  spacerAfter?: boolean
}

class StackDeploymentUpdateDryRunWarnings extends Component<Props> {
  componentDidMount() {
    const { updateDeploymentDryRun, resetUpdateDeploymentDryRun } = this.props

    resetUpdateDeploymentDryRun()
    updateDeploymentDryRun()
  }

  componentDidUpdate(prevProps: Props) {
    const { deployment, updateDeploymentDryRun, resetUpdateDeploymentDryRun } = this.props

    if (isEqual(deployment, prevProps.deployment)) {
      return
    }

    resetUpdateDeploymentDryRun()
    updateDeploymentDryRun()
  }

  render() {
    const { deployment, updateDeploymentDryRunRequest, ignoreSecurityRealmWarnings } = this.props

    if (
      updateDeploymentDryRunRequest.error &&
      getStatus(updateDeploymentDryRunRequest.error) !== 400
    ) {
      return this.renderBetweenSpacers(
        <CuiAlert type='warning'>{updateDeploymentDryRunRequest.error}</CuiAlert>,
      )
    }

    /* In this particular case, we *do* want to render a spinner whenever we're fetching,
     * because the response changes based on the user-provided plan input
     */
    if (updateDeploymentDryRunRequest.inProgress) {
      return this.renderBetweenSpacers(<EuiLoadingContent lines={2} />)
    }

    const warnings = getValidationWarnings({
      updateDeploymentDryRunRequest,
      ignoreSecurityRealmWarnings,
    })

    if (isEmpty(warnings)) {
      return null
    }

    const warningsWithSliderType = decorateWarningsWithSliderType(warnings)

    return this.renderBetweenSpacers(
      <EuiCallOut
        title={
          <FormattedMessage
            id='stack-deployment-update-warnings.callout-bad-request-title'
            defaultMessage='Your changes cannot be applied'
          />
        }
        color='warning'
      >
        <EuiListGroup
          maxWidth={false}
          wrapText={true}
          size='s'
          style={{ margin: 0, padding: 0 }}
          listItems={warningsWithSliderType.map(({ message, sliderInstanceType }) => {
            const useSliderInstanceType =
              sliderInstanceType && isSliderInstanceTypeSupportedInPlatform(sliderInstanceType)
            return {
              label: (
                <FormattedMessage
                  id='stack-deployment-update-warnings.warning'
                  defaultMessage='{sliderPrettyName}{separator}{message}'
                  values={{
                    message,
                    separator: useSliderInstanceType ? ` - ` : undefined,
                    sliderPrettyName: useSliderInstanceType ? (
                      <FormattedMessage
                        {...getSliderPrettyName({
                          sliderInstanceType: sliderInstanceType!,
                          version: getUpsertVersion({ deployment }),
                        })}
                      />
                    ) : undefined,
                  }}
                />
              ),
            }
          })}
        />
      </EuiCallOut>,
    )
  }

  renderBetweenSpacers(children: ReactElement) {
    const { spacerBefore, spacerAfter } = this.props

    return (
      <Fragment>
        {spacerBefore && <EuiSpacer size='m' />}

        {children}

        {spacerAfter && <EuiSpacer size='m' />}
      </Fragment>
    )
  }
}

export default StackDeploymentUpdateDryRunWarnings
