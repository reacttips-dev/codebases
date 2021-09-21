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
import { FormattedMessage } from 'react-intl'

import { EuiButton, EuiButtonEmpty, EuiCallOut, EuiSpacer } from '@elastic/eui'

import DocLink from '../../../DocLink'

import LocalStorageKey from '../../../../constants/localStorageKeys'

import { satisfies } from '../../../../lib/semver'
import { getFirstEsClusterFromGet, getVersion, hasSlm } from '../../../../lib/stackDeployments'

import { AsyncRequestState, CloudAppPlatform, StackDeployment } from '../../../../types'

export type Props = {
  appPlatform: CloudAppPlatform
  deployment: StackDeployment
  enableSlm: (deploymentId: string, refId: string) => void
  enableSlmRequest: AsyncRequestState
}

type State = {
  isDismissed: boolean
}

class SlmCallouts extends Component<Props, State> {
  state: State = {
    isDismissed: localStorage.getItem(LocalStorageKey.slmCalloutDismissed) === 'true',
  }

  render() {
    const { appPlatform, deployment, enableSlmRequest } = this.props
    const { isDismissed } = this.state

    // Pre deployment API guard, plus envs without it don't require a callout
    if (!deployment) {
      return null
    }

    const resource = getFirstEsClusterFromGet({ deployment })!
    const version = getVersion({ deployment })!
    const enabled = hasSlm({ resource })

    const isEce = appPlatform === 'ece'
    const isSaas = appPlatform === 'saas'

    if (isEce && enableSlmRequest.error && !isDismissed) {
      return this.renderMigrationFailedCallOut()
    }

    if (isEce && enableSlmRequest.isDone && !isDismissed) {
      return this.renderMigrationSuccessCallOut()
    }

    if (isEce && !enabled && satisfies(version, `>=7.6`)) {
      return this.renderMigrateCallOut()
    }

    if (isEce && enabled && !isDismissed) {
      return this.renderSlmInKibanaEceCallOut()
    }

    if (isSaas && enabled && !isDismissed) {
      return this.renderSlmInKibanaSaasCallOut()
    }

    return null
  }

  renderMigrationFailedCallOut() {
    const { deployment, enableSlm, enableSlmRequest } = this.props
    const resource = getFirstEsClusterFromGet({ deployment })!

    return (
      <Fragment>
        <EuiCallOut
          data-test-id='slm-migration-failed'
          color='danger'
          title={
            <FormattedMessage
              id='cluster-snapshots.slm-ece-migration-failure-title'
              defaultMessage='Migration to snapshot lifecycle management failed'
            />
          }
        >
          <EuiButton
            onClick={() => enableSlm(deployment.id, resource.ref_id)}
            isLoading={enableSlmRequest.inProgress}
            color='danger'
          >
            <FormattedMessage
              id='cluster-snapshots.slm-ece-failure-cta'
              defaultMessage='Try again'
            />
          </EuiButton>
          <EuiButtonEmpty onClick={() => this.dismissCallout()} color='danger'>
            <FormattedMessage id='cluster-snapshots.slm-dismiss' defaultMessage='Dismiss' />
          </EuiButtonEmpty>
        </EuiCallOut>
        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  renderMigrationSuccessCallOut() {
    return (
      <Fragment>
        <EuiCallOut
          data-test-id='slm-migration-successful'
          color='success'
          iconType='check'
          title={
            <FormattedMessage
              id='cluster-snapshots.slm-ece-migration-success-title'
              defaultMessage='Migration successful'
            />
          }
        >
          <p>
            <FormattedMessage
              id='cluster-snapshots.slm-ece-migration-success-body'
              defaultMessage='Manage snapshot configuration settings and restore in Kibana. {docLink}'
              values={{
                docLink: this.renderDocLink(),
              }}
            />
          </p>
          <EuiButton onClick={() => this.dismissCallout()} color='secondary'>
            <FormattedMessage id='cluster-snapshots.slm-dismiss' defaultMessage='Dismiss' />
          </EuiButton>
        </EuiCallOut>
        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  renderMigrateCallOut() {
    const { deployment, enableSlm, enableSlmRequest } = this.props
    const resource = getFirstEsClusterFromGet({ deployment })!

    return (
      <Fragment>
        <EuiCallOut
          data-test-id='slm-migration'
          title={
            <FormattedMessage
              id='cluster-snapshots.slm-ece-migration-title'
              defaultMessage='Migrate to Kibana snapshot lifecycle management (SLM)'
            />
          }
        >
          <p>
            <FormattedMessage
              id='cluster-snapshots.slm-ece-migration-body-1'
              defaultMessage='For deployments upgraded to version 7.6 before ECE 2.5, you must initiate the migration to SLM. Some snapshot settings, such as frequency and adding repositories, have moved to Kibana. Now you can store an unlimited number of snapshots, with any frequency, and create additional repositories for free! {docLink}'
              values={{
                docLink: this.renderDocLink(),
              }}
            />
          </p>
          <p>
            <FormattedMessage
              id='cluster-snapshots.slm-ece-migration-body-2'
              defaultMessage='This operation launches a configuration change, which might take a while depending on the size of the cluster.'
            />
          </p>
          <EuiButton
            data-test-id='slm-migrate-button'
            onClick={() => enableSlm(deployment.id, resource.ref_id)}
            isLoading={enableSlmRequest.inProgress}
          >
            <FormattedMessage
              id='cluster-snapshots.slm-ece-migration-cta'
              defaultMessage='Start migration'
            />
          </EuiButton>
        </EuiCallOut>
        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  renderSlmInKibanaEceCallOut() {
    return (
      <Fragment>
        <EuiCallOut
          data-test-id='slm-config-in-kibana-ece'
          title={
            <FormattedMessage
              id='cluster-snapshots.slm-ece-migrated-title'
              defaultMessage='Snapshot configuration has moved to Kibana snapshot lifecycle management (SLM)'
            />
          }
        >
          <p>
            <FormattedMessage
              id='cluster-snapshots.slm-ece-migrated-body'
              defaultMessage='Starting with ECE 2.5 and version 7.6, some snapshot settings, such as frequency and adding repositories, have moved to Kibana. Now you can store an unlimited number of snapshots, with any frequency, and create additional repositories for free! {docLink}'
              values={{
                docLink: this.renderDocLink(),
              }}
            />
          </p>
          <EuiButton onClick={() => this.dismissCallout()}>
            <FormattedMessage id='cluster-snapshots.slm-dismiss' defaultMessage='Dismiss' />
          </EuiButton>
        </EuiCallOut>
        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  renderSlmInKibanaSaasCallOut() {
    return (
      <Fragment>
        <EuiCallOut
          data-test-id='slm-config-in-kibana-saas'
          title={
            <FormattedMessage
              id='cluster-snapshots.slm-saas-migrated-title'
              defaultMessage='Snapshot configuration has moved to Kibana snapshot lifecycle management (SLM)'
            />
          }
        >
          <p>
            <FormattedMessage
              id='cluster-snapshots.slm-saas-migrated-body'
              defaultMessage='Starting with version 7.6, some snapshot settings, such as frequency and adding repositories, have moved to Kibana. Now you can store an unlimited number of snapshots, with any frequency, and create additional repositories for free! {docLink}'
              values={{
                docLink: this.renderDocLink(),
              }}
            />
          </p>
          <EuiButton onClick={() => this.dismissCallout()}>
            <FormattedMessage id='cluster-snapshots.slm-dismiss' defaultMessage='Dismiss' />
          </EuiButton>
        </EuiCallOut>
        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  renderDocLink() {
    return (
      <DocLink link='snapshotsDocLink'>
        <FormattedMessage id='description.link' defaultMessage='Learn more' />
      </DocLink>
    )
  }

  dismissCallout() {
    localStorage.setItem(LocalStorageKey.slmCalloutDismissed, `true`)
    this.setState({ isDismissed: true })
  }
}

export default SlmCallouts
