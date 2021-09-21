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

import React, { Fragment, ReactNode } from 'react'

import { EuiFlexGroup, EuiSpacer } from '@elastic/eui'

import VersionRadio from './VersionRadio'

import { gte } from '../../../lib/semver'
import { VersionNumber } from '../../../types'

type VersionRadiosProps = {
  versionsByMajor: VersionNumber[][]
  whitelistedVersions?: VersionNumber[]
  lastVersion?: VersionNumber | null
  onUpdate: (version: VersionNumber, lastVersion?: VersionNumber | null) => void
  value: VersionNumber
  id: string
  stability: 'prerelease' | 'stable'
  checkVersionDisabled?: (version: VersionNumber) => ReactNode
}

export default function VersionRadios({
  versionsByMajor,
  whitelistedVersions,
  lastVersion,
  onUpdate,
  value,
  id,
  stability,
  checkVersionDisabled = () => null,
}: VersionRadiosProps) {
  const versionsByMajorDescending = versionsByMajor.slice().reverse()

  return (
    <div>
      {versionsByMajorDescending.map((versions, i) => (
        <Fragment key={i}>
          {i === 0 ? null : <EuiSpacer size='m' />}
          <EuiFlexGroup wrap={true} gutterSize='m'>
            {versions.map((version) => {
              const disabledReason = checkVersionDisabled(version)
              const isDisabled = disabledReason != null
              const isWhitelisted = whitelistedVersions
                ? whitelistedVersions.includes(version)
                : true

              return (
                <VersionRadio
                  key={version}
                  stability={stability}
                  id={`${id}-${stability}-${version}`}
                  name={id}
                  label={version}
                  value={version}
                  checked={version === value}
                  disabled={isDisabled && gte(version, `7.0.0`)}
                  disabledReason={disabledReason}
                  onChange={() => onUpdate(version, lastVersion)}
                  isWhitelisted={isWhitelisted}
                />
              )
            })}
          </EuiFlexGroup>
        </Fragment>
      ))}
    </div>
  )
}
