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

import React, { Component } from 'react'
import { find, without } from 'lodash'
import { FormattedMessage } from 'react-intl'

import { EuiText, EuiTextColor, EuiCheckbox, htmlIdGenerator } from '@elastic/eui'

import { CuiTable } from '../../../../../../cui'
import { getPlugins } from '../../../../../../lib/stackDeployments'
import sanitizeHtml from '../../../../../../lib/sanitizeHtml'
import pluginDetails from '../../../../../../config/plugins.json'

import {
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
  StackVersionConfig,
} from '../../../../../../lib/api/v1/types'
import { Column } from '../../../../../../cui/Table/types'

interface Props {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  versionConfig: StackVersionConfig | undefined
  onPluginsChange: (options: {
    plugins: string[]
    path?: string[]
    userInitiated?: boolean
  }) => void
}

interface State {
  htmlId: string
}

const makeId = htmlIdGenerator()

export default class Plugins extends Component<Props, State> {
  state = {
    htmlId: makeId(),
  }

  render(): JSX.Element {
    const { deployment, versionConfig, onPluginsChange } = this.props
    const availablePlugins = versionConfig!.elasticsearch.plugins
    const selectedPlugins = getPlugins({ deployment })

    function onChange(plugin: string) {
      if (selectedPlugins.includes(plugin)) {
        onPluginsChange({ plugins: without(selectedPlugins, plugin) })
      } else {
        onPluginsChange({ plugins: selectedPlugins.concat(plugin) })
      }
    }

    const columns: Array<Column<string>> = [
      {
        key: `include`,
        label: (
          <FormattedMessage
            id='deploymentInfrastructure-plugins-includeHeader'
            defaultMessage='Include'
          />
        ),
        width: `60px`,
        align: `center`,
        render: (plugin) => (
          <EuiCheckbox
            id={`${this.state.htmlId}-${plugin}`}
            value={plugin}
            checked={selectedPlugins.includes(plugin)}
            onChange={() => onChange(plugin)}
          />
        ),
      },
      {
        key: `details`,
        label: (
          <FormattedMessage
            id='deploymentInfrastructure-plugins-pluginHeader'
            defaultMessage='Plugin'
          />
        ),
        render: (plugin) => {
          const pluginDetail = find(pluginDetails, { id: plugin })
          const { description = `` } = pluginDetail || {}

          return (
            <EuiText size='s'>
              <div>{plugin}</div>
              <EuiTextColor color='subdued'>{sanitizeHtml(description)}</EuiTextColor>
            </EuiText>
          )
        },
      },
    ]

    return (
      <div data-test-subj='deploymentInfrastructure-plugins'>
        <CuiTable rows={availablePlugins} columns={columns} />
      </div>
    )
  }
}
