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

import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFormHelpText } from '@elastic/eui'

import { addToast } from '../../cui'

import { isEnabledConfiguration } from './conversion'
import { isDedicatedMaster } from '../stackDeployments'

import {
  ApmTopologyElement,
  ElasticsearchClusterTopologyElement,
  KibanaClusterTopologyElement,
} from '../api/v1/types'

type NodeConfiguration =
  | ElasticsearchClusterTopologyElement
  | KibanaClusterTopologyElement
  | ApmTopologyElement

interface HasAutoEnabledDedicatedMasterArgs {
  nodeConfiguration: NodeConfiguration
  dedicatedMasterThreshold?: number | null
}

export function getAutoEnabledDedicatedMastersNotifier(): (
  props: HasAutoEnabledDedicatedMasterArgs,
) => void {
  let hasInitialized = false
  let wasEnabled: boolean | null = null

  return (props: HasAutoEnabledDedicatedMasterArgs) => {
    const isEnabled = hasAutoEnabledDedicatedMaster(props)

    if (wasEnabled === isEnabled) {
      return
    }

    wasEnabled = isEnabled

    if (!hasInitialized) {
      hasInitialized = true
      return
    }

    const baseToast = {
      family: `automatically-enabled-dedicated-masters`,
      color: `primary`,
      iconType: `node`,
      title: (
        <FormattedMessage
          id='configure-instance.dedicated-masters-toast-label'
          defaultMessage='Dedicated masters'
        />
      ),
    }

    if (isEnabled) {
      addToast({
        ...baseToast,
        text: (
          <Fragment>
            <FormattedMessage
              id='configure-instance.dedicated-masters-toast-added-description'
              defaultMessage='Your deployment has reached a size that requires dedicated masters.'
            />

            <EuiFormHelpText>
              <FormattedMessage
                id='configure-instance.dedicated-masters-toast-added-note'
                defaultMessage='They have been automatically added to the configuration.'
              />
            </EuiFormHelpText>
          </Fragment>
        ),
      })

      return
    }

    addToast({
      ...baseToast,
      text: (
        <Fragment>
          <FormattedMessage
            id='configure-instance.dedicated-masters-toast-removed-description'
            defaultMessage='Your deployment no longer requires dedicated masters.'
          />

          <EuiFormHelpText>
            <FormattedMessage
              id='configure-instance.dedicated-masters-toast-removed-note'
              defaultMessage='They have been automatically removed from the configuration.'
            />
          </EuiFormHelpText>
        </Fragment>
      ),
    })
  }
}

function hasAutoEnabledDedicatedMaster({
  nodeConfiguration,
  dedicatedMasterThreshold,
}: HasAutoEnabledDedicatedMasterArgs) {
  const dedicatedMaster = isDedicatedMaster({ topologyElement: nodeConfiguration })
  const dedicatedMasterWithoutThreshold = dedicatedMaster && !dedicatedMasterThreshold

  if (dedicatedMasterWithoutThreshold) {
    return false
  }

  if (!dedicatedMaster) {
    return false
  }

  const enabled = isEnabledConfiguration(nodeConfiguration)

  return enabled
}
