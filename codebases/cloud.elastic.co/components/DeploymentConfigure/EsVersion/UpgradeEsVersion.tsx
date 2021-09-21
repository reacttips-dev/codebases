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

import React, { ReactNode } from 'react'

import EsVersionSelectInput from './EsVersionSelectInput'

import { UnavailableVersionUpgrades, VersionNumber } from '../../../types'

type Props = {
  id: string
  version: VersionNumber
  lastVersion?: VersionNumber | null
  onUpdate: (version: VersionNumber) => void
  availableVersions: VersionNumber[]
  unavailableVersionUpgrades?: UnavailableVersionUpgrades
  checkVersionDisabled?: (version: VersionNumber) => ReactNode
}

export default function UpgradeEsVersion({
  id,
  lastVersion,
  version,
  onUpdate,
  availableVersions,
  unavailableVersionUpgrades,
  checkVersionDisabled,
}: Props) {
  return (
    <div>
      <EsVersionSelectInput
        id={id}
        version={version}
        lastVersion={lastVersion}
        onUpdate={onUpdate}
        availableVersions={availableVersions}
        unavailableVersionUpgrades={unavailableVersionUpgrades}
        checkVersionDisabled={checkVersionDisabled}
      />
    </div>
  )
}
