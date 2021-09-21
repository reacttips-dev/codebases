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

import React, { Component, ReactNode } from 'react'

import { htmlIdGenerator } from '@elastic/eui'

import UpgradeEsVersion from './UpgradeEsVersion'
import CreateEsVersion from './CreateEsVersion'

import { withErrorBoundary } from '../../../cui'

import { rcompare } from '../../../lib/semver'

import { UnavailableVersionUpgrades, VersionNumber } from '../../../types'

type Props = {
  availableVersions: VersionNumber[]
  unavailableVersionUpgrades?: UnavailableVersionUpgrades
  version: string
  lastVersion?: string | null
  onUpdate: (newVersion: string, lastVersion?: string | null) => void
  isCreate?: boolean
  checkVersionDisabled?: (version: VersionNumber) => ReactNode
}

type State = {
  id: string
}

const makeId = htmlIdGenerator()

class EsVersion extends Component<Props, State> {
  state: State = {
    id: makeId(),
  }

  componentDidMount() {
    const { onUpdate, version, availableVersions, lastVersion } = this.props

    if (version == null && availableVersions.length) {
      onUpdate(defaultVersion(availableVersions), lastVersion)
    }
  }

  componentDidUpdate() {
    const { onUpdate, version, availableVersions, lastVersion } = this.props

    if (version == null && availableVersions.length) {
      onUpdate(defaultVersion(availableVersions), lastVersion)
    }
  }

  render() {
    const {
      version,
      lastVersion,
      onUpdate,
      availableVersions,
      unavailableVersionUpgrades,
      isCreate,
      checkVersionDisabled,
    } = this.props

    if (isCreate) {
      return (
        <CreateEsVersion
          id={this.state.id}
          version={version}
          onUpdate={onUpdate}
          availableVersions={availableVersions}
        />
      )
    }

    return (
      <UpgradeEsVersion
        id={this.state.id}
        lastVersion={lastVersion}
        version={version}
        onUpdate={onUpdate}
        availableVersions={availableVersions}
        unavailableVersionUpgrades={unavailableVersionUpgrades}
        checkVersionDisabled={checkVersionDisabled}
      />
    )
  }
}

export default withErrorBoundary(EsVersion)

function sortVersions(versions) {
  return versions.slice().sort(rcompare)
}

function defaultVersion(versions) {
  return sortVersions(versions)[0]
}
