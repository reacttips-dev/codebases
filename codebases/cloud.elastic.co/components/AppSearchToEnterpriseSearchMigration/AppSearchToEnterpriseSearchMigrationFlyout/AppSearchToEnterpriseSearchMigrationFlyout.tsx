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

import React from 'react'
import { FormattedMessage, injectIntl, defineMessages, WrappedComponentProps } from 'react-intl'

import {
  EuiOverlayMask,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiFlyoutBody,
  EuiText,
  EuiTitle,
  EuiSteps,
  EuiSpacer,
  EuiLoadingContent,
} from '@elastic/eui'

import SetReadOnlyMode from './SetReadOnlyMode'
import TakeSnapshot from './TakeSnapshot'
import CreateDeployment from './CreateDeployment'

import { AllProps } from './types'

const messages = defineMessages({
  readOnlyModeTitle: {
    id: `appSearchToEnterpriseSearchMigration.readOnlyModeTitle`,
    defaultMessage: `Set read-only mode`,
  },
  takeSnapshotTitle: {
    id: `appSearchToEnterpriseSearchMigration.takeSnapshotTitle`,
    defaultMessage: `Take a snapshot`,
  },
  createDeploymentTitle: {
    id: `appSearchToEnterpriseSearchMigration.createDeploymentTitle`,
    defaultMessage: `Create a deployment`,
  },
  migrateApplicationTitle: {
    id: `appSearchToEnterpriseSearchMigration.migrateApplicationTitle`,
    defaultMessage: `Migrate your application`,
  },
})

class AppSearchToEnterpriseSearchMigrationFlyout extends React.Component<
  AllProps & WrappedComponentProps
> {
  componentDidMount() {
    const { deployment, fetchAppSearchReadOnlyMode } = this.props
    fetchAppSearchReadOnlyMode({ deployment })
  }

  render() {
    const { deployment, stopAppSearchToEnterpriseSearchMigration } = this.props

    return (
      <EuiOverlayMask>
        <EuiFlyout
          maxWidth='32rem'
          aria-labelledby='enterpriseSearchMigrationFlyoutTitle'
          onClose={() => stopAppSearchToEnterpriseSearchMigration({ deployment })}
        >
          <EuiFlyoutHeader hasBorder={true}>
            <EuiTitle size='m'>
              <h2 id='enterpriseSearchMigrationFlyoutTitle'>
                <FormattedMessage
                  id='appSearchToEnterpriseSearchMigration.title'
                  defaultMessage='Migrate to Enterprise Search'
                />
              </h2>
            </EuiTitle>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>
            <EuiText>
              <p>
                <FormattedMessage
                  id='appSearchToEnterpriseSearchMigration.intro'
                  defaultMessage='Migrate your App Search deployment to Enterprise Search in three steps. This takes about ten minutes.'
                />
              </p>
            </EuiText>
            <EuiSpacer size='l' />
            {this.renderSteps()}
          </EuiFlyoutBody>
        </EuiFlyout>
      </EuiOverlayMask>
    )
  }

  renderSteps() {
    const {
      intl: { formatMessage },
      deployment,
      progress,
      takeSnapshotRequest,
      resetTakeSnapshotRequest,
      snapshotStatus,
    } = this.props

    if (progress?.readOnlyEnabled === undefined) {
      return <EuiLoadingContent />
    }

    const steps = [
      {
        title: formatMessage(messages.readOnlyModeTitle),
        status: this.getStepStatus(`readOnly`),
        children: (
          <SetReadOnlyMode
            deployment={deployment}
            readOnlyEnabled={progress!.readOnlyEnabled}
            onSet={() => resetTakeSnapshotRequest()}
          />
        ),
      },
      {
        title: formatMessage(messages.takeSnapshotTitle),
        status: this.getStepStatus(`takeSnapshot`),
        children: (
          <TakeSnapshot
            deployment={deployment}
            takeSnapshotRequest={takeSnapshotRequest!}
            onSnapshotTaken={this.onSnapshotTaken}
            snapshotStatus={snapshotStatus}
            disabled={this.getStepStatus(`takeSnapshot`) === `disabled`}
          />
        ),
      },
      {
        title: formatMessage(messages.createDeploymentTitle),
        status: this.getStepStatus(`createDeployment`),
        children: (
          <CreateDeployment
            sourceDeployment={deployment}
            disabled={this.getStepStatus(`createDeployment`) === `disabled`}
          />
        ),
      },
      {
        title: formatMessage(messages.migrateApplicationTitle),
        status: this.getStepStatus(`migrateApplication`),
        children: (
          <EuiText>
            <p>
              <FormattedMessage
                id='appSearchToEnterpriseSearchMigration.migrateApplicationIntro'
                defaultMessage="Once you've tested and completed the migration of your application to the new deployment containing Enterprise Search you can go ahead and delete this deployment."
              />
            </p>
          </EuiText>
        ),
      },
    ]

    return <EuiSteps steps={steps} />
  }

  onSnapshotTaken = ({ snapshotName }: { snapshotName: string }) => {
    const { deployment, watchAppSearchMigrationSnapshot } = this.props

    watchAppSearchMigrationSnapshot({ deployment, snapshotName })
  }

  getStepStatus(step: 'readOnly' | 'takeSnapshot' | 'createDeployment' | 'migrateApplication') {
    const { progress = {} } = this.props

    // returning undefined displays an active number -- we prefer this over the
    // empty circle that is `incomplete`
    switch (step) {
      case `readOnly`:
        if (progress.readOnlyEnabled) {
          return `complete` as const
        }

        return undefined
      case `takeSnapshot`:
        if (this.haveSuccessfulSnapshot()) {
          return `complete` as const
        }

        if (progress.readOnlyEnabled) {
          return undefined
        }

        break
      case `createDeployment`:
        if (this.haveSuccessfulSnapshot()) {
          return undefined
        }

        break
      case `migrateApplication`:
        if (this.haveSuccessfulSnapshot()) {
          return undefined
        }

        break
      default:
        break
    }

    return `disabled` as const
  }

  haveSuccessfulSnapshot = () => this.props.snapshotStatus?.state === `SUCCESS`
}

export default injectIntl(AppSearchToEnterpriseSearchMigrationFlyout)
