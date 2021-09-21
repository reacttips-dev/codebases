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
import { defineMessages, FormattedMessage, IntlShape, injectIntl } from 'react-intl'
import { find, get, intersection, keyBy, mapValues } from 'lodash'
import jif from 'jif'

import { EuiCallOut, EuiCheckboxGroup, EuiIcon, EuiIconTip, EuiTitle } from '@elastic/eui'

import ExternalLink from '../ExternalLink'
import { CompositeField } from '../Field'
import { CuiAlert } from '../../cui'

import { planPaths } from '../../config/clusterPaths'

import { getAllowedPluginsForVersions, getPluginsConsideringIngest } from '../../lib/plugins'

import toggle from '../../lib/arrayToggle'
import sanitizeHtml from '../../lib/sanitizeHtml'

import { ElasticsearchClusterPlan, StackVersionConfig } from '../../lib/api/v1/types'
import { Url } from '../../types'

import './plugins.scss'

const messages = defineMessages({
  addedPlugin: {
    id: `deployment-configure-plugins.newly-added-plugin`,
    defaultMessage: `This is a newly added plugin`,
  },
  removePlugin: {
    id: `deployment-configure-plugins.newly-removed-plugin`,
    defaultMessage: `This is a newly removed plugin`,
  },
})

type Props = {
  intl: IntlShape
  plan: ElasticsearchClusterPlan
  lastSuccessfulPlan?: ElasticsearchClusterPlan | null
  showDefaultExtraPlugins?: boolean
  updatePlan: (path: string[], plugins: string[]) => void
  versions: StackVersionConfig[]
  pluginDescriptions: Array<{ id: string; url: Url; description: string }>
}

type State = {
  userChangedPlugins: boolean
}

class Plugins extends Component<Props, State> {
  state: State = {
    userChangedPlugins: false,
  }

  componentDidMount() {
    this.ensureOnlyAllowedPlugins()
    this.checkAndAddDefaultExtraPlugins()
  }

  componentDidUpdate(prevProps: Props) {
    const { plan } = this.props
    const prevVersion = get(prevProps.plan, planPaths.version)
    const nextVersion = get(plan, planPaths.version)
    const prevCapacity = get(prevProps.plan, planPaths.instanceCapacity)
    const nextCapacity = get(plan, planPaths.instanceCapacity)

    if (prevVersion !== nextVersion) {
      this.ensureOnlyAllowedPlugins(this.props)
      this.checkAndAddDefaultExtraPlugins(this.props)
    }

    if (prevCapacity !== nextCapacity) {
      this.checkAndAddDefaultExtraPlugins(this.props)
    }
  }

  render() {
    return (
      <Fragment>
        <EuiTitle size='xs'>
          <h3>
            <FormattedMessage id='deployment-configure-plugins.plugins' defaultMessage='Plugins' />
          </h3>
        </EuiTitle>

        <CompositeField>{this.renderPlugins()}</CompositeField>
      </Fragment>
    )
  }

  renderPlugins() {
    const { plan } = this.props
    const version = get(plan, planPaths.version)

    if (!version) {
      return (
        <CuiAlert type='warning'>
          <FormattedMessage
            id='deployment-configure-plugins.pick-version-before-plugins'
            defaultMessage='You need to pick a version before plugins'
          />
        </CuiAlert>
      )
    }

    const { versions } = this.props
    const currentPlugins = get(plan, planPaths.plugins, [])
    const plugins = get(
      find(versions, (v) => v.version === version),
      [`elasticsearch`, `plugins`],
    )

    if (plugins == null || plugins.length === 0) {
      return (
        <EuiCallOut>
          <FormattedMessage
            id='deployment-configure-plugins.no-plugins-available-for-this-elasticsearch-version'
            defaultMessage='No plugins available for this Elasticsearch version'
          />
        </EuiCallOut>
      )
    }

    const options = plugins.map((pluginId) => ({
      id: pluginId,
      label: this.renderPluginLabel(pluginId),
    }))
    const optionMap = mapValues(keyBy(currentPlugins), () => true)

    return (
      <EuiCheckboxGroup
        className='pluginCheckboxes'
        options={options}
        onChange={(id) => this.togglePlugin(id)}
        idToSelectedMap={optionMap}
      />
    )
  }

  renderPluginLabel(pluginId) {
    const pluginDescriptionsById = keyBy(this.props.pluginDescriptions, `id`)

    const description = get(pluginDescriptionsById, [pluginId, `description`])
    const url = get(pluginDescriptionsById, [pluginId, `url`])

    return (
      <span>
        <span>{pluginId}</span>

        {jif(description, () => (
          <span>
            {` `}
            &mdash;
            {` `}
            {sanitizeHtml(description)}
          </span>
        ))}

        {jif(url, () => (
          <span>
            {` `}
            <ExternalLink href={url}>
              <EuiIcon type='link' size='s' />
            </ExternalLink>
          </span>
        ))}

        {this.renderPluginTooltips(pluginId)}
      </span>
    )
  }

  renderPluginTooltips(pluginId) {
    const {
      intl: { formatMessage },
      plan,
      lastSuccessfulPlan,
    } = this.props
    const currentPlugins = get(plan, planPaths.plugins, [])
    const lastPlugins = get(lastSuccessfulPlan, planPaths.plugins, [])
    const containsPlugin = (id) => currentPlugins.includes(id)

    const added = lastSuccessfulPlan && containsPlugin(pluginId) && !lastPlugins.includes(pluginId)

    const removed =
      lastSuccessfulPlan && !containsPlugin(pluginId) && lastPlugins.includes(pluginId)

    if (!added && !removed) {
      return null
    }

    let tooltipContent

    if (added) {
      tooltipContent = formatMessage(messages.addedPlugin)
    } else if (removed) {
      tooltipContent = formatMessage(messages.removePlugin)
    }

    return (
      <Fragment>
        {` `}
        <EuiIconTip aria-label='More information' content={tooltipContent} type='iInCircle' />
      </Fragment>
    )
  }

  togglePlugin(id) {
    const { plan, updatePlan } = this.props
    const currentPlugins = get(plan, planPaths.plugins, [])

    this.setState({ userChangedPlugins: true })
    updatePlan(planPaths.plugins, toggle(currentPlugins, id))
  }

  checkAndAddDefaultExtraPlugins(props: Props = this.props) {
    const { plan, versions, updatePlan, showDefaultExtraPlugins } = props
    const { userChangedPlugins } = this.state

    if (!showDefaultExtraPlugins || userChangedPlugins) {
      return
    }

    const nextPlugins = getPluginsConsideringIngest({ plan, versions })

    updatePlan(planPaths.plugins, nextPlugins)
  }

  // Different versions can have different plugins, so we need to
  // remove all plugins which are not allowed for the given version
  ensureOnlyAllowedPlugins(props: Props = this.props) {
    const { plan, versions, updatePlan } = props
    const allowedPlugins = getAllowedPluginsForVersions({ plan, versions })
    const currentPlugins = get(plan, planPaths.plugins, [])
    const nextPlugins: string[] = intersection(allowedPlugins, currentPlugins)

    updatePlan(planPaths.plugins, nextPlugins)
  }
}

export default injectIntl(Plugins)
