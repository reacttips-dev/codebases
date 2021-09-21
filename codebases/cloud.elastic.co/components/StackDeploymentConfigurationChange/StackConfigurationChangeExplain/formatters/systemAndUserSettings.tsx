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

import { DifferenceFormatter, DifferenceFormatFunction } from '../types'
import { Difference } from '../../../../lib/stackDeployments/planDiffs/types'

interface SettingsDifferenceMeta {
  key?: string
  nextValue?: string
  currentValue?: string
}

type SettingType = 'system' | 'user'

function buildSettingAddedFormatter(settingType: SettingType): DifferenceFormatFunction {
  return ({ difference }) => {
    const { target, meta } = difference as Difference<SettingsDifferenceMeta>
    const { key, nextValue } = meta || {}

    return {
      id: `${target}-add-${settingType}-setting-${key}`,
      type: target,
      message: (
        <FormattedMessage
          id='explain-changes.settings-add'
          defaultMessage='Set {key} to {value}'
          values={{
            key: <EuiCode>{key || ``}</EuiCode>,
            value: <EuiCode>{nextValue || ``}</EuiCode>,
          }}
        />
      ),
    }
  }
}

function buildSettingChangedFormatter(settingType: SettingType): DifferenceFormatFunction {
  return ({ difference }) => {
    const { target, meta } = difference as Difference<SettingsDifferenceMeta>
    const { key, nextValue, currentValue } = meta || {}

    return {
      id: `${target}-change-${settingType}-setting-${key}`,
      type: target,
      message: (
        <FormattedMessage
          id='explain-changes.settings-edit'
          defaultMessage='Change {key} from {fromValue} to {toValue}'
          values={{
            key: <EuiCode>{key || ``}</EuiCode>,
            fromValue: <EuiCode>{currentValue || ``}</EuiCode>,
            toValue: <EuiCode>{nextValue || ``}</EuiCode>,
          }}
        />
      ),
    }
  }
}

function buildSettingRemovedFormatter(settingType: SettingType): DifferenceFormatFunction {
  return ({ difference }) => {
    const { target, meta } = difference as Difference<SettingsDifferenceMeta>
    const { key } = meta || {}

    return {
      id: `${target}-remove-${settingType}-setting-${key}`,
      type: target,
      message: (
        <FormattedMessage
          id='explain-changes.settings-remove'
          defaultMessage='Remove {key}'
          values={{
            key: <EuiCode>{key || ``}</EuiCode>,
          }}
        />
      ),
    }
  }
}

export const systemSettingAddedFormatter: DifferenceFormatter = {
  handles: `system-setting-added`,
  formatter: buildSettingAddedFormatter('system'),
}

export const userSettingAddedFormatter: DifferenceFormatter = {
  handles: `user-setting-added`,
  formatter: buildSettingAddedFormatter('user'),
}

export const systemSettingChangedFormatter: DifferenceFormatter = {
  handles: `system-setting-changed`,
  formatter: buildSettingChangedFormatter('system'),
}

export const userSettingChangedFormatter: DifferenceFormatter = {
  handles: `user-setting-changed`,
  formatter: buildSettingChangedFormatter('user'),
}

export const systemSettingRemovedFormatter: DifferenceFormatter = {
  handles: `system-setting-removed`,
  formatter: buildSettingRemovedFormatter('system'),
}

export const userSettingRemovedFormatter: DifferenceFormatter = {
  handles: `user-setting-removed`,
  formatter: buildSettingRemovedFormatter('user'),
}
