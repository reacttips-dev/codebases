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
import { find } from 'lodash'

import { EuiText, EuiSpacer, EuiSelect, EuiCallOut } from '@elastic/eui'

import SpinButton from '../../../SpinButton'

import { migrateAppSearchToEnterpriseSearch } from '../../../../lib/stackDeployments/migrationsToEnterpriseSearch'
import { sanitizeUpdateRequestBeforeSend } from '../../../../lib/stackDeployments/updates'

import { deploymentUrl } from '../../../../lib/urlBuilder'
import history from '../../../../lib/history'

import { DeploymentTemplateInfoV2 } from '../../../../lib/api/v1/types'
import { AllProps, State } from './types'

class CreateDeployment extends React.Component<AllProps, State> {
  state: State = {
    destinationDeploymentTemplateId: null,
  }

  static getDerivedStateFromProps(nextProps: AllProps): Partial<State> | null {
    const { eligibleDeploymentTemplates } = nextProps

    if (eligibleDeploymentTemplates && eligibleDeploymentTemplates.length === 1) {
      // there's only one eligible template. auto-select and avoid showing the `<EuiSelect>`
      return {
        destinationDeploymentTemplateId: eligibleDeploymentTemplates[0].id!,
      }
    }

    return null
  }

  componentDidMount() {
    const { fetchRegion, fetchVersions, regionId } = this.props

    fetchRegion()

    // make sure we have region and all available versions on hand
    fetchVersions(regionId)
  }

  componentDidUpdate() {
    const {
      deploymentTemplates,
      fetchDeploymentTemplates,
      fetchDeploymentTemplatesRequest,
      regionId,
      targetVersion,
    } = this.props

    // get deployment templates once we have a version number
    if (targetVersion && !deploymentTemplates && !fetchDeploymentTemplatesRequest.inProgress) {
      fetchDeploymentTemplates({ regionId, stackVersion: targetVersion })
    }
  }

  render() {
    const { disabled, sourceSnapshotName, createDeploymentRequest, region } = this.props
    const { destinationDeploymentTemplateId } = this.state

    return (
      <div>
        <EuiText>
          <p>
            <FormattedMessage
              id='appSearchToEnterpriseSearchMigration.createDeploymentIntro'
              defaultMessage='Use the snapshot to create a new Enterprise Search deployment, populated with your App Search data. We recommend first testing the new Enterprise Search deployment. Once you complete testing your application, you can take another snapshot, create a new deployment from snapshot, and complete the migration.'
            />
          </p>
        </EuiText>

        {this.renderNoTemplatesFoundMessage()}
        {this.renderTemplateSelector()}

        <EuiSpacer />

        <SpinButton
          data-test-id='migrate-app-search-to-enterprise-search'
          disabled={disabled || !region || !destinationDeploymentTemplateId || !sourceSnapshotName}
          spin={createDeploymentRequest.inProgress}
          onClick={this.create}
        >
          <FormattedMessage
            id='appSearchToEnterpriseSearchMigration.createDeployment'
            defaultMessage='Create deployment'
          />
        </SpinButton>
      </div>
    )
  }

  renderNoTemplatesFoundMessage() {
    const { deploymentTemplates, eligibleDeploymentTemplates } = this.props

    if (!deploymentTemplates) {
      return null
    }

    if (eligibleDeploymentTemplates.length > 0) {
      return null
    }

    const message = (
      <FormattedMessage
        id='appSearchToEnterpriseSearchMigration.noTemplates'
        defaultMessage='No compatible templates could be found.'
      />
    )

    return (
      <Fragment>
        <EuiSpacer size='s' />

        <EuiCallOut color='primary' title={message} />
      </Fragment>
    )
  }

  renderTemplateSelector() {
    const { eligibleDeploymentTemplates } = this.props
    const { destinationDeploymentTemplateId } = this.state

    if (!eligibleDeploymentTemplates) {
      return null
    }

    if (eligibleDeploymentTemplates.length <= 1) {
      return null
    }

    const options = eligibleDeploymentTemplates.map(({ id, name }) => ({
      value: id,
      text: name,
    }))

    return (
      <Fragment>
        <EuiSpacer size='s' />

        <EuiSelect
          options={options}
          value={destinationDeploymentTemplateId || undefined}
          onChange={(e) => {
            this.setState({
              destinationDeploymentTemplateId: e.target.value,
            })
          }}
        />
      </Fragment>
    )
  }

  create = () => {
    const {
      regionId,
      region,
      stackVersions,
      createDeployment,
      sourceDeployment,
      sourceSnapshotName,
      eligibleDeploymentTemplates,
    } = this.props

    const { destinationDeploymentTemplateId } = this.state

    if (!region) {
      return // sanity
    }

    const deploymentTemplate = find(eligibleDeploymentTemplates, {
      id: destinationDeploymentTemplateId,
    })! as DeploymentTemplateInfoV2

    const migratedDeployment = migrateAppSearchToEnterpriseSearch({
      deployment: sourceDeployment,
      deploymentTemplate,
      region,
      snapshotName: sourceSnapshotName,
      stackVersions,
    })

    const deployment = sanitizeUpdateRequestBeforeSend({ deployment: migratedDeployment })

    createDeployment({
      regionId,
      deployment,
    }).then(({ payload }) => {
      history.push(deploymentUrl(payload.id))
    })
  }
}

export default CreateDeployment
