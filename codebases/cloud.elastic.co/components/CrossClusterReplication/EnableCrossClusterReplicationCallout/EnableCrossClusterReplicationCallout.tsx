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

import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiCallOut, EuiSpacer, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import { CuiAlert } from '../../../cui'
import SpinButton from '../../SpinButton'

import { isCrossClusterSearch } from '../../../lib/deployments/ccs'
import {
  getDeploymentTemplateId,
  getFirstEsClusterFromGet,
  hasCrossClusterReplicationEnabled,
  isCrossClusterReplicationEligible,
  isSystemOwned,
} from '../../../lib/stackDeployments'

import { AllProps } from './types'

class EnableCrossClusterReplicationCallout extends React.Component<AllProps> {
  render(): JSX.Element | null {
    const {
      isCrossEnvCcsCcrActivated,
      isEce,
      deployment,
      deploymentTemplate,
      enableCrossClusterReplicationRequest,
    } = this.props

    const systemOwned = isSystemOwned({ deployment })
    const isCrossClusterSearchTemplate = isCrossClusterSearch({
      deploymentTemplate,
      deploymentTemplateId: getDeploymentTemplateId({ deployment }),
      systemOwned,
    })

    if (!isCrossEnvCcsCcrActivated) {
      return null
    }

    if (systemOwned) {
      return null
    }

    if (!isCrossClusterReplicationEligible({ deployment })) {
      return null
    }

    if (hasCrossClusterReplicationEnabled({ deployment })) {
      return null
    }

    // In ECE we have delayed the migration from the CCS template until
    // 3.0, for backwards compatibility reasons with the infrastructure
    if (isCrossClusterSearchTemplate && isEce) {
      return null
    }

    const title = (
      <FormattedMessage
        id='enableCCRCallout.title'
        defaultMessage='Enable cross-cluster replication (CCR) for your deployment'
      />
    )
    const description = (
      <FormattedMessage
        id='enableCCRCallout.description'
        defaultMessage="Enable CCR on your cluster if you plan to replicate data to or from this cluster. This operation launches a configuration change, whose duration depends on the size of the cluster. If you don't enable CCR now, it will be automatically enabled during the next configuration change."
      />
    )

    return (
      <Fragment>
        <EuiCallOut
          data-test-id='enableCCRCallout'
          iconType='iInCircle'
          color='warning'
          title={title}
        >
          <p>{description}</p>

          <EuiFlexGroup gutterSize='m'>
            <EuiFlexItem grow={false}>
              <SpinButton
                data-test-id='enableCCRCallout.enableButton'
                color='warning'
                spin={enableCrossClusterReplicationRequest.inProgress}
                onClick={() => this.enable()}
              >
                <FormattedMessage id='enableCCRCallout.enableButton' defaultMessage='Enable CCR' />
              </SpinButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiCallOut>

        {enableCrossClusterReplicationRequest.error && (
          <Fragment>
            <EuiSpacer />

            <CuiAlert type='error'>{enableCrossClusterReplicationRequest.error}</CuiAlert>
          </Fragment>
        )}

        <EuiSpacer />
      </Fragment>
    )
  }

  enable(): void {
    const { deployment, enableCrossClusterReplication, fetchDeployment } = this.props

    const { id: deploymentId } = deployment
    const esResource = getFirstEsClusterFromGet({ deployment })!
    const { ref_id: refId } = esResource

    enableCrossClusterReplication({ deploymentId, refId }).then(() => {
      fetchDeployment({ deploymentId }) // refresh immediately to get health updates
    })
  }
}

export default EnableCrossClusterReplicationCallout
