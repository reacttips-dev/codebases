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

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiTextColor, EuiBadge, EuiToolTip } from '@elastic/eui'

import { gt, diff } from '../../../../lib/semver'
import { getProductName } from '../polyglotTopology'

import { SliderInstanceType } from '../../../../types'

type Props = {
  type: SliderInstanceType
  oldVersion?: string
  currentVersion: string
  isPastHistory: boolean
}

const ClusterVersionChange: FunctionComponent<Props> = ({
  type,
  oldVersion,
  currentVersion,
  isPastHistory,
}) => {
  const productName = getProductName({ type, version: currentVersion })

  if (!oldVersion) {
    return (
      <FormattedMessage
        id='explain-changes.cluster-set-version'
        defaultMessage='Set {productName} to {current}'
        values={{
          current: <EuiBadge>v{currentVersion}</EuiBadge>,
          productName,
        }}
      />
    )
  }

  const isDowngrade = gt(oldVersion, currentVersion)

  const versionChangeType = isDowngrade ? (
    <FormattedMessage id='explain-changes.downgrade' defaultMessage='Downgrade' />
  ) : (
    <FormattedMessage id='explain-changes.upgrade' defaultMessage='Upgrade' />
  )

  const majorUpgrade = !isDowngrade && diff(oldVersion, currentVersion) === `major`

  const oldVersionBadge = (
    <EuiBadge>
      <del>v{oldVersion}</del>
    </EuiBadge>
  )

  const currentVersionBadge = majorUpgrade ? (
    <EuiToolTip
      content={
        <FormattedMessage
          id='explain-changes.major-upgrade'
          defaultMessage='This is a major version upgrade'
        />
      }
    >
      <EuiBadge color='secondary'>v{currentVersion}</EuiBadge>
    </EuiToolTip>
  ) : (
    <EuiBadge>v{currentVersion}</EuiBadge>
  )

  const versionChangeText = getVersionChangeText()

  const explainedVersionChange = (
    <FormattedMessage
      id='explain-changes.cluster-upgrade'
      defaultMessage='{versionChangeText} from {oldVersionBadge} to {currentVersionBadge}'
      values={{
        oldVersionBadge,
        currentVersionBadge,
        productName,
        versionChangeText,
      }}
    />
  )

  return explainedVersionChange

  function getVersionChangeText() {
    const versionChange = (
      <FormattedMessage
        id='explain-changes.version-change'
        defaultMessage='{versionChangeType} {productName}'
        values={{
          productName,
          versionChangeType,
        }}
      />
    )

    if (!isDowngrade) {
      return versionChange
    }

    if (isPastHistory) {
      return versionChange // warnings in past history become noise
    }

    return (
      <EuiToolTip
        content={
          <FormattedMessage
            id='explain-changes.downgrade-unsupported'
            defaultMessage='Your changes are likely to fail: version downgrades are unsupported.'
          />
        }
      >
        <EuiTextColor color='danger'>
          <span style={{ borderBottom: `1px dotted` }}>{versionChange}</span>
        </EuiTextColor>
      </EuiToolTip>
    )
  }
}

export default ClusterVersionChange
