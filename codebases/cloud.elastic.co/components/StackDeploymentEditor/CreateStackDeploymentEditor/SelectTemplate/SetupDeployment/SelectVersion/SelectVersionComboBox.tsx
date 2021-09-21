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
import { injectIntl, WrappedComponentProps } from 'react-intl'
import { flatten, flatMap } from 'lodash'

import { EuiComboBox, EuiLoadingSpinner } from '@elastic/eui'

import groupVersions from '../../../../../DeploymentConfigure/EsVersion/groupVersions'

import { VersionNumber } from '../../../../../../types'

interface Props extends WrappedComponentProps {
  version: VersionNumber
  onUpdate: (version: VersionNumber, lastVersion: VersionNumber | null) => void
  availableVersions: VersionNumber[] | null
  whitelistedVersions?: VersionNumber[]
  lastVersion?: VersionNumber
  id: string
  checkVersionDisabled: (version: VersionNumber) => boolean
  disabled?: boolean
}

interface VersionOption {
  label: string
  disabled?: boolean
  'data-test-id': string
  value: string
}

interface VersionOptionGroup {
  label: string
  options: VersionOption[]
}

const SelectVersionComboBox: FunctionComponent<Props> = ({
  version,
  onUpdate,
  availableVersions,
  lastVersion,
  checkVersionDisabled,
  disabled,
  intl: { formatMessage },
}) => {
  if (availableVersions == null) {
    return <EuiLoadingSpinner />
  }

  const groupedVersions = groupVersions(availableVersions)

  const labels = {
    prerelease: {
      id: 'esVersions.pre-release-versions',
      defaultMessage: 'Pre-release versions',
    },
    stable: {
      id: 'esVersions.stable-versions',
      defaultMessage: 'Generally available versions',
    },
    latest: {
      id: 'esVersions.latest-stable-version',
      defaultMessage: 'latest',
    },
  }

  const optionGroups: VersionOptionGroup[] = []

  if (groupedVersions.prerelease != null) {
    const prereleaseVersionsByMajorDescending = flatten(
      groupedVersions.prerelease.slice().reverse(),
    )

    const prereleaseOptions = prereleaseVersionsByMajorDescending!.map(
      (prereleaseVersion: VersionNumber): VersionOption => {
        const isDisabled = checkVersionDisabled(prereleaseVersion)

        return {
          label: prereleaseVersion,
          value: prereleaseVersion,
          disabled: isDisabled,
          'data-test-id': `version-${prereleaseVersion}`,
        }
      },
    )

    const prereleaseOptionGroup: VersionOptionGroup = {
      label: formatMessage(labels.prerelease),
      options: prereleaseOptions,
    }

    optionGroups.push(prereleaseOptionGroup)
  }

  if (groupedVersions.stable != null) {
    const stableVersionsByMajorDescending = flatten(groupedVersions.stable.slice().reverse())

    const stableOptions = stableVersionsByMajorDescending!.map(
      (stableVersion: VersionNumber, i): VersionOption => {
        const isDisabled = checkVersionDisabled(stableVersion)
        const latestMessage = formatMessage(labels.latest)

        return {
          label: i === 0 ? `${stableVersion} (${latestMessage})` : stableVersion,
          disabled: isDisabled,
          'data-test-id': `version-${stableVersion}`,
          value: stableVersion,
        }
      },
    )

    const stableOptionGroup: VersionOptionGroup = {
      label: formatMessage(labels.stable),
      options: stableOptions,
    }

    optionGroups.push(stableOptionGroup)
  }

  const options = flatMap(optionGroups, ({ options }) => options) // Reduce all options into one array
  const selectedVersion = options.find((option) => option.value === version) // Get selected version details to ensure correct label

  return (
    <EuiComboBox
      fullWidth={true}
      options={optionGroups}
      selectedOptions={selectedVersion ? [{ label: selectedVersion.label }] : []}
      onChange={(newVersion) => onUpdate(newVersion[0].value!, lastVersion!)}
      singleSelection={{ asPlainText: true }}
      isDisabled={disabled}
      isClearable={false}
      data-test-id='version-combobox'
    />
  )
}

export default injectIntl(SelectVersionComboBox)
