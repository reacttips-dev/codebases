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

import {
  EuiFlexItem,
  EuiButton,
  EuiCode,
  EuiFormHelpText,
  EuiFormLabel,
  EuiSpacer,
} from '@elastic/eui'

import { ResourceExternalLinksList } from './ExternalLinksList'

import DocLink from '../../DocLink'

import { ExternalHyperlink } from '../../../lib/api/v1/types'
import { AnyResourceInfo, SliderInstanceType } from '../../../types'

import './resourceExternalLinks.scss'
import { getResourceVersion } from '../../../lib/stackDeployments'

type Props = {
  resource: AnyResourceInfo
  sliderInstanceType: SliderInstanceType
  hideExternalLinks: boolean
  saasClusterMetrics: boolean
  wrapWithFlexItem?: boolean
}

type State = {
  showingLinks: boolean
}

export default class ResourceExternalLinks extends Component<Props, State> {
  state: State = {
    showingLinks: false,
  }

  render() {
    const { resource, hideExternalLinks, wrapWithFlexItem } = this.props

    if (hideExternalLinks) {
      return null
    }

    const links = getExternalLinks({ resource })

    if (links.length === 0) {
      return null
    }

    const linkList = this.renderExternalLinks()

    if (wrapWithFlexItem) {
      return <EuiFlexItem grow={false}>{linkList}</EuiFlexItem>
    }

    return linkList
  }

  renderExternalLinks() {
    const { resource, sliderInstanceType, saasClusterMetrics } = this.props
    const { showingLinks } = this.state

    const links = getExternalLinks({ resource })
    const version = getResourceVersion({ resource })

    const fewLinks = links.length <= 5
    const showLinks = fewLinks || showingLinks

    return (
      <div>
        {externalLinksTitle(saasClusterMetrics)}

        <EuiSpacer size='xs' />

        {showLinks ? (
          <div>
            {fewLinks ? null : (
              <Fragment>
                <EuiSpacer size='xs' />
                {this.renderToggleButton()}
              </Fragment>
            )}

            <ResourceExternalLinksList
              links={links}
              sliderInstanceType={sliderInstanceType}
              version={version}
            />
          </div>
        ) : (
          <div>{this.renderToggleButton()}</div>
        )}
      </div>
    )
  }

  renderToggleButton() {
    const { showingLinks } = this.state

    return (
      <EuiButton size='s' onClick={() => this.setState({ showingLinks: !showingLinks })}>
        {showingLinks ? (
          <FormattedMessage
            id='resource-endpoints.hide-external'
            defaultMessage='Hide dashboard links'
          />
        ) : (
          <FormattedMessage
            id='resource-endpoints.show-external'
            defaultMessage='Show dashboard links'
          />
        )}
      </EuiButton>
    )
  }
}

function externalLinksTitle(saasClusterMetrics?: boolean) {
  return (
    <EuiFormLabel>
      <FormattedMessage
        id='resource-endpoints.external-links'
        defaultMessage='External Links {link}'
        values={{
          link: (
            <div className='resourceExternalLinks-instructions'>
              {saasClusterMetrics ? null : (
                <EuiFormHelpText>
                  {' - '}

                  <FormattedMessage
                    id='cluster-logging-endpoint.description'
                    defaultMessage='Log in with {elastic} user. {dontKnowPassword}'
                    values={{
                      elastic: <EuiCode>elastic</EuiCode>,
                      dontKnowPassword: (
                        <DocLink link='monitoringEceDocLink'>
                          <FormattedMessage
                            id='cluster-logging-endpoint.dont-know-password'
                            defaultMessage='Forgot the password?'
                          />
                        </DocLink>
                      ),
                    }}
                  />
                </EuiFormHelpText>
              )}
            </div>
          ),
        }}
      />
    </EuiFormLabel>
  )
}

function getExternalLinks({ resource }: { resource?: AnyResourceInfo }): ExternalHyperlink[] {
  if (!resource) {
    return []
  }

  return resource.info.external_links
}
