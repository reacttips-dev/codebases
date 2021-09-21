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

import React, { Component, Fragment, ReactNode } from 'react'
import { FormattedMessage, WrappedComponentProps, defineMessages, injectIntl } from 'react-intl'

import {
  EuiCallOut,
  EuiLoadingSpinner,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiToolTip,
} from '@elastic/eui'
import { executeScript } from '@elastic/micro-jq'

import { CuiCodeBlock } from '../../cui'
import CopyButton from '../CopyButton'

import { ConsoleRequestState } from '../../reducers/clusterConsole'
import { AjaxRequestErrorType, AsyncRequestState, EsProxyResponseConsole } from '../../types'
import PrivacySensitiveContainer from '../PrivacySensitiveContainer'

type Props = WrappedComponentProps & {
  requestSettings: ConsoleRequestState
  request: AsyncRequestState
  response?: EsProxyResponseConsole | null
}

const messages = defineMessages({
  rawOutput: {
    id: `cluster-console-output.raw-output`,
    defaultMessage: `Raw output`,
  },
})

export class ClusterConsoleOutput extends Component<Props> {
  render() {
    const { request, response } = this.props

    if (request.inProgress) {
      return <EuiLoadingSpinner />
    }

    if (!request.error && !response) {
      return null
    }

    return (
      <section>
        {this.renderError()}
        {this.renderResponse()}
      </section>
    )
  }

  renderError() {
    const { request } = this.props

    if (!request.error) {
      return null
    }

    const {
      body,
      response: { status, statusText },
    } = request.error as AjaxRequestErrorType

    const responseText = indent(body)

    let error: ReactNode

    if (status === 449) {
      error = (
        <EuiCallOut
          data-test-id='cluster-console-output.request-permissions-error'
          iconType='alert'
          color='danger'
          title={
            <FormattedMessage
              id='cluster-console-output.permissions-error.title'
              defaultMessage='Additional permissions needed to perform this operation'
            />
          }
        >
          <FormattedMessage
            id='cluster-console-output.permissions-error.body'
            defaultMessage='Contact your administrator about your role.'
          />
        </EuiCallOut>
      )
    } else {
      error = (
        <EuiCallOut
          data-test-id='cluster-console-output.request-error'
          color={classifyStatus(status)}
          title={
            <FormattedMessage
              id='cluster-console-output.request-status'
              defaultMessage='{ status } — { statusText }'
              values={{
                status,
                statusText,
              }}
            />
          }
        />
      )
    }

    return (
      <div>
        {error}

        <CuiCodeBlock overflowHeight={500} language='json' className='clusterConsole--outputBody'>
          {responseText}
        </CuiCodeBlock>
      </div>
    )
  }

  renderResponse() {
    const {
      request,
      response,
      requestSettings,
      intl: { formatMessage },
    } = this.props

    if (!response || request.error) {
      return null
    }

    const { body, contentType = ``, status, statusText, requestDuration } = response

    const isJson = contentType.includes(`json`)
    const language = isJson ? `json` : `text`
    let responseText = isJson ? indent(body) : body

    if (requestSettings.advancedMode) {
      switch (requestSettings.filterBy) {
        case 'jq':
          if (!isJson || !requestSettings.filterJq) {
            break
          }

          try {
            const filtered = executeScript(body, requestSettings.filterJq)
            responseText = indent(filtered)
          } catch (e) {
            // invalid expression, leave response alone
          }

          break

        case 'regex':
          if (!requestSettings.filterRegex) {
            break
          }

          try {
            const regex = new RegExp(requestSettings.filterRegex)
            const lineFilter = requestSettings.invertFilter
              ? (line) => !regex.test(line)
              : (line) => regex.test(line)
            responseText = responseText.split(/\n/).filter(lineFilter).join('\n')
          } catch (e) {
            // invalid regex, leave response alone
          }

          break

        default:
          console.error(`Unknown filter mode: ${requestSettings.filterBy}`)
          break
      }
    }

    return (
      <Fragment>
        <EuiCallOut
          data-test-id='cluster-console-output.response-status'
          color={classifyStatus(status)}
          title={
            <FormattedMessage
              id='cluster-console-output.response-status'
              defaultMessage='{ status } — { statusText } { duration }'
              values={{
                status,
                statusText,
                duration: requestDuration ? `(${requestDuration} ms)` : ``,
              }}
            />
          }
        />
        <PrivacySensitiveContainer>
          <CuiCodeBlock
            overflowHeight={500}
            language={language}
            className='clusterConsole--outputBody'
          >
            {responseText}
          </CuiCodeBlock>
        </PrivacySensitiveContainer>

        <EuiSpacer size='xs' />
        <EuiFlexGroup justifyContent='flexEnd' gutterSize='s'>
          <EuiFlexItem grow={false}>
            <EuiToolTip position='top' content={formatMessage(messages.rawOutput)}>
              <EuiButtonIcon
                iconType='popout'
                href={this.getBlob(responseText)}
                aria-label={formatMessage(messages.rawOutput)}
                target='_blank'
              />
            </EuiToolTip>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <CopyButton value={responseText} />
          </EuiFlexItem>
        </EuiFlexGroup>
      </Fragment>
    )
  }

  getBlob = (responseText: string) => {
    const blob: Blob = new window.Blob([responseText], {
      type: `application/json;charset=utf-8`,
    })

    const blobUrl: string = window.URL.createObjectURL(blob)

    return blobUrl
  }
}

function indent(json) {
  try {
    return JSON.stringify(json, null, 2)
  } catch (err) {
    return json // failed to indent, just use raw output
  }
}

function classifyStatus(status) {
  switch (Math.floor(status / 100)) {
    case 1:
      return `success`
    case 2:
      return `success`
    case 3:
      return `primary`
    default:
      return `danger`
  }
}

export default injectIntl(ClusterConsoleOutput)
