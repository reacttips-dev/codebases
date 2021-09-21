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

import React, { Fragment, Component } from 'react'
import { FormattedMessage, injectIntl, defineMessages, IntlShape } from 'react-intl'

import {
  EuiBadge,
  EuiButtonIcon,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import {
  CuiAlert,
  CuiLink,
  CuiRouterLinkButton,
  CuiRouterLinkButtonIcon,
  CuiTable,
  CuiTableColumn,
} from '../../cui'

import Header from '../../components/Header'
import DocLink from '../../components/DocLink'
import DangerButton from '../../components/DangerButton'

import { deploymentExtensionCreateUrl, deploymentExtensionUrl } from '../../lib/urlBuilder'

import { deploymentExtensionsCrumbs } from '../../lib/crumbBuilder'

import { AsyncRequestState } from '../../types'
import { Extension } from '../../lib/api/v1/types'

type Props = {
  intl: IntlShape
  extensions: Extension[] | null
  fetchExtensionsRequest: AsyncRequestState
  fetchExtensions: () => void
  deleteExtension: ({ extensionId }: { extensionId: string }) => void
  deleteExtensionRequest: (extensionId: string) => AsyncRequestState
}

const messages = defineMessages({
  editExtension: {
    id: `deployment-extensions.edit`,
    defaultMessage: `Edit extension`,
  },
  removeExtension: {
    id: `deployment-extensions.remove`,
    defaultMessage: `Remove extension`,
  },
  removeExtensionConfirmTitle: {
    id: `deployment-extensions.remove-extension-confirm-title`,
    defaultMessage: `Delete extension {name}?`,
  },
  removeExtensionConfirmBody: {
    id: `deployment-extensions.remove-extension-confirm-body`,
    defaultMessage: `Once you delete this extension, the action cannot be undone.`,
  },
  removeExtensionConfirmButtonText: {
    id: `deployment-extensions.remove-extension-confirm-button-text`,
    defaultMessage: `Delete {type}`,
  },
})

class DeploymentExtensions extends Component<Props> {
  render() {
    return (
      <Fragment>
        <Header
          name={<FormattedMessage id='deployment-extensions.heading' defaultMessage='Extensions' />}
          breadcrumbs={deploymentExtensionsCrumbs()}
        />

        <EuiSpacer size='m' />

        {this.renderContent()}
      </Fragment>
    )
  }

  renderContent() {
    const {
      intl: { formatMessage },
      extensions,
      deleteExtension,
      deleteExtensionRequest,
    } = this.props

    if (extensions && extensions.length === 0) {
      return (
        <EuiEmptyPrompt
          style={{ maxWidth: `50em` }}
          title={
            <h2>
              <FormattedMessage
                id='deployment-extensions.empty'
                defaultMessage='You have no extensions'
              />
            </h2>
          }
          body={
            <Fragment>
              {this.renderDescription()}
              <EuiSpacer size='xl' />

              {this.renderCreateButton()}
            </Fragment>
          }
        />
      )
    }

    const columns: Array<CuiTableColumn<Extension>> = [
      {
        label: <FormattedMessage id='deployment-extensions.name' defaultMessage='Name' />,
        render: (extension) => (
          <CuiLink to={deploymentExtensionUrl(extension.id)}>{extension.name}</CuiLink>
        ),
        sortKey: `name`,
      },

      {
        label: <FormattedMessage id='deployment-extensions.type' defaultMessage='Type' />,
        render: (extension) =>
          extension.extension_type === `bundle` ? (
            <FormattedMessage id='deployment-extensions.type-bundle' defaultMessage='Bundle' />
          ) : (
            <FormattedMessage id='deployment-extensions.type-plugin' defaultMessage='Plugin' />
          ),
        sortKey: `extension_type`,
      },

      {
        label: <FormattedMessage id='deployment-extensions.version' defaultMessage='Version' />,
        render: (extension) => <EuiBadge>{extension.version}</EuiBadge>,
        sortKey: `version`,
      },

      {
        mobile: {
          label: <FormattedMessage id='deployment-extensions.actions' defaultMessage='Actions' />,
        },
        render: (extension) => (
          <EuiFlexGroup gutterSize='s'>
            <EuiFlexItem grow={false}>
              <CuiRouterLinkButtonIcon
                iconType='pencil'
                aria-label={formatMessage(messages.editExtension)}
                to={() => deploymentExtensionUrl(extension.id)}
              />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <DangerButton
                buttonType={EuiButtonIcon}
                iconType='trash'
                aria-label={formatMessage(messages.removeExtension)}
                onConfirm={() => deleteExtension({ extensionId: extension.id })}
                modal={{
                  title: formatMessage(messages.removeExtensionConfirmTitle, {
                    name: extension.name,
                  }),
                  body: formatMessage(messages.removeExtensionConfirmBody),
                  confirmButtonText: formatMessage(messages.removeExtensionConfirmButtonText, {
                    type: extension.extension_type,
                  }),
                }}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        ),
        actions: true,
        width: `70px`,
      },
    ]

    return (
      <Fragment>
        <EuiFlexGroup justifyContent='flexEnd'>
          <EuiFlexItem grow={false}>{this.renderDescription()}</EuiFlexItem>

          {(extensions && extensions.length === 0) || (
            <EuiFlexItem grow={false}>{this.renderCreateButton()}</EuiFlexItem>
          )}
        </EuiFlexGroup>

        <EuiSpacer size='m' />

        <CuiTable<Extension>
          columns={columns}
          rows={extensions}
          getRowId={(extension) => extension.id}
          hasExpandedDetailRow={({ id }) => Boolean(deleteExtensionRequest(id).error)}
          renderDetailRow={({ id }) =>
            deleteExtensionRequest(id).error ? (
              <CuiAlert type='error'>{deleteExtensionRequest(id).error}</CuiAlert>
            ) : null
          }
          initialLoading={!extensions}
        />
      </Fragment>
    )
  }

  renderDescription = () => (
    <EuiText>
      <FormattedMessage
        id='deployment-extensions.description'
        defaultMessage='Upload an extension to use plugins, scripts, or dictionaries to enhance the core functionality of Elasticsearch. Before you install an extension, be sure to check out the supported and official {officialPlugins} already available. {learnMore}'
        values={{
          officialPlugins: (
            <DocLink link='officialPluginsDocLink'>
              <FormattedMessage
                id='deployment-extensions.official-plugins'
                defaultMessage='Elasticsearch plugins'
              />
            </DocLink>
          ),
          learnMore: (
            <DocLink link='officialPluginsAuthorHelpDocLink'>
              <FormattedMessage
                id='deployment-extensions.official-plugins-learnmore'
                defaultMessage='Learn more'
              />
            </DocLink>
          ),
        }}
      />
    </EuiText>
  )

  renderCreateButton = () => (
    <CuiRouterLinkButton fill={true} to={deploymentExtensionCreateUrl()}>
      <FormattedMessage
        id='deployment-extensions.create-extension'
        defaultMessage='Upload extension'
      />
    </CuiRouterLinkButton>
  )
}

export default injectIntl(DeploymentExtensions)
