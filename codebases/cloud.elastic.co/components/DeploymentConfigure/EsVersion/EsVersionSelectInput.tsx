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

import React, { Fragment, FunctionComponent, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import { isEmpty, map, noop } from 'lodash'

import { EuiFlexGroup, EuiFormRow, EuiLoadingSpinner } from '@elastic/eui'

import VersionRadios from './VersionRadios'
import VersionRadio from './VersionRadio'

import groupVersions from './groupVersions'

import { VersionNumber, UnavailableVersionUpgrades } from '../../../types'

import './EsVersionInput.scss'

type Props = {
  version: VersionNumber
  onUpdate: (version: VersionNumber, lastVersion: VersionNumber | null) => void
  availableVersions: VersionNumber[] | null
  whitelistedVersions?: VersionNumber[]
  unavailableVersionUpgrades?: UnavailableVersionUpgrades
  lastVersion?: VersionNumber | null
  id: string
  checkVersionDisabled?: (version: VersionNumber) => ReactNode
}

const EsVersionSelectInput: FunctionComponent<Props> = ({
  version,
  onUpdate,
  availableVersions,
  whitelistedVersions,
  unavailableVersionUpgrades,
  lastVersion,
  id,
  checkVersionDisabled,
}) => {
  if (availableVersions == null) {
    return <EuiLoadingSpinner />
  }

  const groupedVersions = groupVersions(availableVersions)

  const labels = {
    prerelease: (
      <FormattedMessage
        id='esVersions.pre-release-versions'
        defaultMessage='Pre-release versions'
      />
    ),
    stable: (
      <FormattedMessage
        id='esVersions.stable-versions'
        defaultMessage='Generally available versions'
      />
    ),
  }

  return (
    <div data-test-id='elastic-stack-version-edit'>
      {renderUnavailableVersionUpgrades(id, unavailableVersionUpgrades)}

      {groupedVersions.prerelease == null ? null : (
        <EuiFormRow id={id} label={labels.prerelease} className='esVersionInput-row'>
          <VersionRadios
            id={id}
            stability='prerelease'
            value={version}
            versionsByMajor={groupedVersions.prerelease}
            whitelistedVersions={whitelistedVersions}
            lastVersion={lastVersion}
            onUpdate={onUpdate}
            checkVersionDisabled={checkVersionDisabled}
          />
        </EuiFormRow>
      )}

      {groupedVersions.stable == null ? null : (
        <EuiFormRow id={id} label={labels.stable} className='esVersionInput-row'>
          <VersionRadios
            id={id}
            stability='stable'
            value={version}
            versionsByMajor={groupedVersions.stable}
            whitelistedVersions={whitelistedVersions}
            lastVersion={lastVersion}
            onUpdate={onUpdate}
            checkVersionDisabled={checkVersionDisabled}
          />
        </EuiFormRow>
      )}
    </div>
  )
}

function renderUnavailableVersionUpgrades(
  id,
  unavailableVersionUpgrades?: UnavailableVersionUpgrades,
) {
  if (isEmpty(unavailableVersionUpgrades)) {
    return null
  }

  return (
    <Fragment>
      {map(unavailableVersionUpgrades, (unavailableVersions, minUpgradableFrom) => (
        <EuiFormRow
          key={minUpgradableFrom}
          label={
            <FormattedMessage
              id='esVersions.unavailable-versions'
              defaultMessage='Versions available at {minUpgradableFrom} and later'
              values={{ minUpgradableFrom }}
            />
          }
          className='esVersionInput-row'
        >
          <EuiFlexGroup wrap={true} gutterSize='m'>
            {unavailableVersions.map((version) => (
              <VersionRadio
                key={version}
                stability='unavailable'
                id={`${id}-unavailable-${version}`}
                name={id}
                label={version}
                value={version}
                checked={false}
                disabled={true}
                onChange={noop}
              />
            ))}
          </EuiFlexGroup>
        </EuiFormRow>
      )).reverse()}
    </Fragment>
  )
}

// @ts-ignore we'll throw this away eventually
EsVersionSelectInput.formRole = `control`

export default EsVersionSelectInput
