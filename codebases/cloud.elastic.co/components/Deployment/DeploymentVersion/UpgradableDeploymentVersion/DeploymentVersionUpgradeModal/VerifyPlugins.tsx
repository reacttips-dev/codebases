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
import { FormattedMessage } from 'react-intl'
import { isEqual } from 'lodash'

import { EuiCallOut, EuiCheckboxGroup, EuiCheckboxGroupProps, EuiSpacer } from '@elastic/eui'

import { CuiLink } from '../../../../../cui'

import { satisfies } from '../../../../../lib/semver'
import { getCustomPluginsFromPlan } from '../../../../../lib/plugins'
import { deploymentExtensionsUrl } from '../../../../../lib/urlBuilder'

import {
  ElasticsearchClusterPlan,
  ElasticsearchUserPlugin,
  Extension,
} from '../../../../../lib/api/v1/types'

export type Props = {
  plan: ElasticsearchClusterPlan
  extensions: Extension[]
  selectedPluginUrls: string[]
  togglePlugin: (id: string) => void
  unsafeBundles: ElasticsearchUserPlugin[]
  setDisabledUpgradeButton: (value: boolean) => void
}

export default class VerifyPlugins extends Component<Props> {
  componentDidUpdate(prevProps: Props) {
    const {
      plan,
      togglePlugin,
      selectedPluginUrls,
      extensions,
      unsafeBundles,
      setDisabledUpgradeButton,
    } = this.props

    const { plan: prevPlan, selectedPluginUrls: prevPropsSelectedPluginUrls } = prevProps

    const version = plan.elasticsearch.version!
    const prevVersion = prevPlan.elasticsearch.version!

    if (version !== prevVersion) {
      selectedPluginUrls.forEach((url) => {
        if (!extensions.find((extension) => extension.url === url)) {
          togglePlugin(url)
        }
      })

      if (unsafeBundles.length > 0 && selectedPluginUrls.length === 0) {
        setDisabledUpgradeButton(true)
      }
    }

    if (!isEqual(selectedPluginUrls, prevPropsSelectedPluginUrls)) {
      if (selectedPluginUrls.length > 0) {
        setDisabledUpgradeButton(false)
      } else {
        setDisabledUpgradeButton(true)
      }
    }
  }

  render() {
    const { unsafeBundles } = this.props

    if (unsafeBundles.length === 0) {
      return null
    }

    const { selectedPluginUrls, togglePlugin } = this.props

    const options = this.getOptions()
    const pluginIdToSelectedMap: EuiCheckboxGroupProps['idToSelectedMap'] = {}

    selectedPluginUrls.forEach((pluginId) => {
      pluginIdToSelectedMap[pluginId] = true
    })

    return (
      <EuiCallOut
        data-test-id='verify-plugins-call-out'
        color='warning'
        title={
          <FormattedMessage id='verify-plugins.upgrade-warning' defaultMessage='Upgrade warning' />
        }
      >
        <FormattedMessage
          id='verify-plugins.removed-plugins'
          defaultMessage='Upgrading this deployment will result in the following incompatible custom plugins being removed:'
        />

        <ul>
          {unsafeBundles.map((bundle) => (
            <li key={bundle.url}>
              {bundle.name} ({bundle.elasticsearch_version})
            </li>
          ))}
        </ul>

        <FormattedMessage
          id='verify-plugins.replace-plugin'
          defaultMessage='You must replace the above plugins in order to upgrade. To add compatible plugins, go to {customPlugins}.'
          values={{
            customPlugins: (
              <CuiLink to={deploymentExtensionsUrl()}>
                <FormattedMessage
                  id='verify-plugins.custom-plugins'
                  defaultMessage='custom plugins'
                />
              </CuiLink>
            ),
          }}
        />

        {options.length > 0 && (
          <Fragment>
            <EuiSpacer size='s' />

            <FormattedMessage
              id='verify-plugins.compatible-plugins'
              defaultMessage='The following custom plugins are compatible with your new deployment version. Select the ones you would like to add.'
            />

            <EuiCheckboxGroup
              data-test-id='verify-plugins-list'
              className='pluginCheckboxes'
              options={options}
              onChange={(url) => togglePlugin(url)}
              idToSelectedMap={pluginIdToSelectedMap}
            />
          </Fragment>
        )}
      </EuiCallOut>
    )
  }

  getOptions = () => {
    const { plan, extensions } = this.props

    const version = plan.elasticsearch.version!

    const planExtensions = getCustomPluginsFromPlan(plan)

    const existingPluginUrls = planExtensions.map((plugin) => plugin.url)

    return extensions
      .filter((extension) => satisfies(version, extension.version!))
      .filter((extension) => existingPluginUrls.indexOf(extension.url) === -1)
      .map((extension) => ({
        id: extension.url,
        label: `${extension.name} (${extension.version!})`,
      }))
  }
}
