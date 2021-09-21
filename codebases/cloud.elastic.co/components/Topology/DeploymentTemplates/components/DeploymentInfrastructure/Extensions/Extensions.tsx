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

import { flatMap, get, isEqual, isEmpty, uniqWith, xorBy } from 'lodash'

import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiCheckbox,
  EuiLoadingContent,
  EuiSpacer,
  EuiText,
  EuiTextColor,
  htmlIdGenerator,
} from '@elastic/eui'

import { CuiAlert, CuiTable } from '../../../../../../cui'

import { planPaths } from '../../../../../../config/clusterPaths'

import { convertExtensionToPlanFormat } from '../../../../../../lib/plugins'
import { satisfies } from '../../../../../../lib/semver'
import sanitizeHtml from '../../../../../../lib/sanitizeHtml'

import { AsyncRequestState } from '../../../../../../types'
import {
  Extension,
  ElasticsearchClusterPlan,
  ElasticsearchUserPlugin,
  ElasticsearchUserBundle,
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
} from '../../../../../../lib/api/v1/types'
import { Column } from '../../../../../../cui/Table/types'
import { getEsPlan } from '../../../../../../lib/stackDeployments'

export type Props = {
  fetchExtensions: () => void
  fetchExtensionsRequest: AsyncRequestState
  extensions: Extension[] | null
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  onPluginsChange: (options: {
    plugins: Array<ElasticsearchUserPlugin | ElasticsearchUserBundle>
    path?: string[]
    userInitiated?: boolean
  }) => void
}

interface State {
  htmlId: string
}

const makeId = htmlIdGenerator()

class Extensions extends Component<Props, State> {
  state = {
    htmlId: makeId(),
  }

  componentDidMount(): void {
    this.props.fetchExtensions()
  }

  render(): JSX.Element | null {
    const { extensions, fetchExtensionsRequest } = this.props

    if (fetchExtensionsRequest.error) {
      return (
        <Fragment>
          <CuiAlert type='error'>{fetchExtensionsRequest.error}</CuiAlert>
          <EuiSpacer size='m' />
        </Fragment>
      )
    }

    if (extensions == null) {
      return (
        <Fragment>
          <EuiLoadingContent />
          <EuiSpacer size='m' />
        </Fragment>
      )
    }

    const emptyOptions = isEmpty(this.getExtensionOptions())

    if (emptyOptions) {
      return null
    }

    return (
      <Fragment>
        {this.renderExtensions()}

        <EuiSpacer />
      </Fragment>
    )
  }

  renderExtensions = (): JSX.Element => {
    const options = this.getExtensionOptions()

    const columns: Array<Column<Extension>> = [
      {
        key: `include`,
        label: (
          <FormattedMessage
            id='deploymentInfrastructure-extensions-includeHeader'
            defaultMessage='Include'
          />
        ),
        width: `60px`,
        align: `center`,
        render: (extension) => (
          <EuiCheckbox
            id={`${this.state.htmlId}-${extension}`}
            value={extension.url}
            checked={this.isExtensionSelected(extension)}
            onChange={() => this.toggleExtension(extension)}
          />
        ),
      },
      {
        key: `details`,
        label: (
          <FormattedMessage
            id='deploymentInfrastructure-extensions-extensionHeader'
            defaultMessage='Extension'
          />
        ),
        render: ({ name, description }) => (
          <EuiText size='s'>
            <div>{name}</div>
            {description && (
              <EuiTextColor color='subdued'>{sanitizeHtml(description)}</EuiTextColor>
            )}
          </EuiText>
        ),
      },
    ]

    return (
      <div data-test-subj='deploymentInfrastructure-plugins'>
        <CuiTable rows={options} columns={columns} />
      </div>
    )
  }

  getExtensionOptions = (): Extension[] => {
    const { deployment, extensions } = this.props
    const plan = getEsPlan({ deployment })

    const version = get(plan, [`elasticsearch`, `version`])

    if (!version || !extensions || isEmpty(extensions)) {
      return []
    }

    return extensions.filter(
      (extension) => this.isExtensionSelected(extension) || isAvailableExtension(extension),
    )

    function isAvailableExtension(extension: Extension): boolean {
      if (!extension.version) {
        return false
      }

      if (!extension.url) {
        return false
      }

      return satisfies(version!, extension.version)
    }
  }

  getPlanExtensions(
    plan: ElasticsearchClusterPlan | null | undefined,
    kind: Extension['extension_type'],
  ): Array<ElasticsearchUserPlugin | ElasticsearchUserBundle> {
    const topologyElements = get(plan, [`cluster_topology`], [])

    const path = kind === `bundle` ? planPaths.userBundles : planPaths.userPlugins

    const everyCurrentPlugin = flatMap(topologyElements, (topologyElement) =>
      get(topologyElement, path, []),
    )

    const currentExtensions = uniqWith(everyCurrentPlugin, isEqual)
    return currentExtensions
  }

  isExtensionSelected = (extension: Extension): boolean => {
    const { deployment } = this.props

    const plan = getEsPlan({ deployment })

    const { url } = extension

    if (!plan) {
      return false
    }

    const planExtensions = this.getPlanExtensions(plan, extension.extension_type)

    const selected = planExtensions.some(matchesExtensionByUrl(url))

    return selected
  }

  toggleExtension = (extension: Extension): void => {
    const { deployment, onPluginsChange } = this.props

    const plan = getEsPlan({ deployment })

    if (!plan || !extension) {
      return // sanity
    }

    const path =
      extension.extension_type === `bundle` ? planPaths.userBundles : planPaths.userPlugins

    const planExtension = convertExtensionToPlanFormat(plan, extension)

    const prevExtension = this.getPlanExtensions(plan, extension.extension_type)
    const nextExtensions = xorBy(prevExtension, [planExtension], `url`)

    onPluginsChange({
      plugins: nextExtensions,
      path,
    })
  }
}

export default Extensions

function matchesExtensionByUrl(url: string) {
  return (planExtension: { url: string }) => planExtension.url === url
}
