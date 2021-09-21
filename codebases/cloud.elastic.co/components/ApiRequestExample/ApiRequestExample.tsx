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
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFormHelpText,
  EuiLink,
  EuiPortal,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import { CuiCodeBlock, withErrorBoundary } from '../../cui'

import DocLink from '../DocLink'

type Props = {
  isSupported: boolean
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  body: string | unknown
}

type State = {
  showingExample: boolean
}

class ApiRequestExample extends Component<Props, State> {
  state: State = {
    showingExample: false,
  }

  render() {
    const { isSupported } = this.props

    if (!isSupported) {
      return null
    }

    return (
      <Fragment>
        <EuiFormHelpText>
          <EuiLink onClick={this.showExample}>
            <FormattedMessage
              id='create-deployment-from-template.equivalent-api-request'
              defaultMessage='Equivalent API request'
            />
          </EuiLink>
        </EuiFormHelpText>

        {this.renderExampleModal()}
      </Fragment>
    )
  }

  renderExampleModal() {
    const { showingExample } = this.state

    if (!showingExample) {
      return null
    }

    const { method, endpoint, body } = this.props
    const language = typeof body === `string` ? `text` : `json`
    const payload = typeof body === `string` ? body : JSON.stringify(body, null, 2)

    return (
      <EuiPortal>
        <EuiFlyout onClose={this.hideExample} aria-labelledby='apiRequestExampleFlyoutTitle'>
          <EuiFlyoutHeader hasBorder={true}>
            <EuiTitle size='s'>
              <h2 id='apiRequestExampleFlyoutTitle'>
                <FormattedMessage
                  id='api-request-example.title'
                  defaultMessage='Equivalent API request'
                />
              </h2>
            </EuiTitle>
          </EuiFlyoutHeader>

          <EuiFlyoutBody>
            <EuiText>
              <FormattedMessage
                id='api-request-example.description'
                defaultMessage='Use the REST API with the following JSON object.'
              />
            </EuiText>

            <EuiSpacer />

            <CuiCodeBlock>
              {method} {endpoint}
            </CuiCodeBlock>

            <CuiCodeBlock language={language}>{payload}</CuiCodeBlock>
          </EuiFlyoutBody>

          <EuiFlyoutFooter>
            <EuiFlexGroup gutterSize='m' alignItems='center' justifyContent='spaceBetween'>
              <EuiFlexItem grow={false}>
                <DocLink link='apiReferenceDocLink'>
                  <FormattedMessage
                    id='api-request-example.api-reference'
                    defaultMessage='API reference'
                  />
                </DocLink>
              </EuiFlexItem>

              <EuiFlexItem grow={false}>
                <EuiButton onClick={this.hideExample} fill={true}>
                  <FormattedMessage id='api-request-example.close' defaultMessage='Close' />
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlyoutFooter>
        </EuiFlyout>
      </EuiPortal>
    )
  }

  showExample = () => {
    this.setState({ showingExample: true })
  }

  hideExample = () => {
    this.setState({ showingExample: false })
  }
}

export default withErrorBoundary(ApiRequestExample)
