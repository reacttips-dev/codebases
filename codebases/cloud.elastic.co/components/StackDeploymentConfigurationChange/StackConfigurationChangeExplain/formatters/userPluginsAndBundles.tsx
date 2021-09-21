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
import { FormattedMessage } from 'react-intl'
import { EuiCode } from '@elastic/eui'
import { Difference } from '../../../../lib/stackDeployments/planDiffs/types'
import { DifferenceFormatter, DifferenceFormatFunction } from '../types'

type DifferenceType = `bundle` | `plugin`

function buildAddedFormatter(type: DifferenceType): DifferenceFormatFunction {
  return ({ difference }) => {
    const { target, meta } = difference as Difference<{ id: string; name: string }>
    const { id, name } = meta || {}

    return {
      id: `${target}-add-user-${type}-${id}`,
      type: target,
      message: (
        <FormattedMessage
          id='explain-changes.user-bundle-plugin.add'
          defaultMessage='Add {name} user {type}'
          values={{
            name: <EuiCode>{name}</EuiCode>,
            type,
          }}
        />
      ),
    }
  }
}

function buildRemovedFormatter(type: DifferenceType): DifferenceFormatFunction {
  return ({ difference }) => {
    const { target, meta } = difference as Difference<{ id: string; name: string }>
    const { id, name } = meta || {}

    return {
      id: `${target}-remove-user-${type}-${id}`,
      type: target,
      message: (
        <FormattedMessage
          id='explain-changes.user-bundle-plugin.remove'
          defaultMessage='Remove {name} user {type}'
          values={{
            name: <EuiCode>{name}</EuiCode>,
            type,
          }}
        />
      ),
    }
  }
}

function buildUpdatedFormatter(type: DifferenceType): DifferenceFormatFunction {
  return ({ difference }) => {
    const { target, meta } = difference as Difference<{ id: string; name: string }>
    const { id, name } = meta || {}

    return {
      id: `${target}-update-user-${type}-${id}`,
      type: target,
      message: (
        <FormattedMessage
          id='explain-changes.user-bundle-plugin.update'
          defaultMessage='Update {name} user {type}'
          values={{
            name: <EuiCode>{name}</EuiCode>,
            type,
          }}
        />
      ),
    }
  }
}

function buildChangedFormatter(type: DifferenceType): DifferenceFormatFunction {
  return ({ difference }) => {
    const { target, meta } = difference as Difference<{ id: string; current: string; next: string }>
    const { id, current, next } = meta || {}

    return {
      id: `${target}-change-user-${type}-${id}`,
      type: target,
      message: (
        <FormattedMessage
          id='explain-changes.user-bundle-plugin.change'
          defaultMessage='Change {current} user {type} to {next}'
          values={{
            current: <EuiCode>{current}</EuiCode>,
            next: <EuiCode>{next}</EuiCode>,
            type,
          }}
        />
      ),
    }
  }
}

export const userPluginAddedFormatter: DifferenceFormatter = {
  handles: `user-plugin-added`,
  formatter: buildAddedFormatter(`plugin`),
}

export const userBundleAddedFormatter: DifferenceFormatter = {
  handles: `user-bundle-added`,
  formatter: buildAddedFormatter(`bundle`),
}

export const userPluginRemovedFormatter: DifferenceFormatter = {
  handles: `user-plugin-removed`,
  formatter: buildRemovedFormatter(`plugin`),
}

export const userBundleRemovedFormatter: DifferenceFormatter = {
  handles: `user-bundle-removed`,
  formatter: buildRemovedFormatter(`bundle`),
}

export const userPluginChangedFormatter: DifferenceFormatter = {
  handles: `user-plugin-changed`,
  formatter: buildChangedFormatter(`plugin`),
}

export const userBundleChangedFormatter: DifferenceFormatter = {
  handles: `user-bundle-changed`,
  formatter: buildChangedFormatter(`bundle`),
}

export const userPluginUpdatedFormatter: DifferenceFormatter = {
  handles: `user-plugin-updated`,
  formatter: buildUpdatedFormatter(`plugin`),
}

export const userBundleUpdatedFormatter: DifferenceFormatter = {
  handles: `user-bundle-updated`,
  formatter: buildUpdatedFormatter(`bundle`),
}
