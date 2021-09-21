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

import React, { Component, Fragment } from 'react'
import { get } from 'lodash'

import {
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
} from '../../../../../../lib/api/v1/types'

import './settings.scss'
import { getEsPlan, getPlugins, getScripting } from '../../../../../../lib/stackDeployments'
import { getNullScripting, findDefaultPlanForVersion } from '../../../../../../lib/deployments/plan'
import { AnyTopologyElement } from '../../../../../../types'
import { gte } from '../../../../../../lib/semver'

import ElasticsearchScripts5x from '../../ConfigureInstance/ElasticsearchSettings/ElasticsearchScripting/ElasticsearchScripts5x'
import ElasticsearchScripts2x from '../../ConfigureInstance/ElasticsearchSettings/ElasticsearchScripting/ElasticsearchScripts2x'

import '../../ConfigureInstance/ElasticsearchSettings/ElasticsearchScripting/elasticsearchScripts.scss'

interface Props {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  onChange: (topologyElement: AnyTopologyElement, path: string[], value: any) => void
  onScriptingChange: (
    scriptingType: 'inline' | 'stored' | 'file',
    value: boolean | 'on' | 'off' | 'sandbox',
  ) => void
}

export default class Settings extends Component<Props> {
  render(): JSX.Element {
    return <Fragment>{this.renderScripting()}</Fragment>
  }

  renderScripting(): JSX.Element | null {
    const { deployment, onChange } = this.props

    const plan = getEsPlan({ deployment })!
    const { version } = plan.elasticsearch

    if (version == null || gte(version, `6.0.0`)) {
      return null // v6+ scripting is not configurable via the UI
    }

    const props = {
      scripting: getScripting({ deployment }),
      originalScripting: getNullScripting(),
      hasWatcher: getPlugins({ deployment }).includes(`watcher`),
      onUpdate: (type: 'inline' | 'stored' | 'file', value: boolean | 'on' | 'off' | 'sandbox') => {
        const path = [`elasticsearch`, `system_settings`, `scripting`]

        for (const topologyElement of plan.cluster_topology) {
          // if necessary, initialize scripting object with version defaults
          if (get(topologyElement, path) == null) {
            const defaultPlanForVersion = findDefaultPlanForVersion(version)
            onChange(topologyElement, path, get(defaultPlanForVersion, path))
          }

          // then do the specific update
          const scriptingValue =
            typeof value === `boolean`
              ? { enabled: value }
              : { enabled: value !== `off`, sandbox_mode: value === `sandbox` }
          onChange(topologyElement, path.concat(type), scriptingValue)
        }
      },
    }

    return (
      <div className='deploymentInfrastructure-flyout-item deploymentInfrastructure-settings-scripting'>
        {gte(version, `5.0.0`) ? (
          <ElasticsearchScripts5x {...props} />
        ) : (
          <ElasticsearchScripts2x {...props} />
        )}
      </div>
    )
  }
}
