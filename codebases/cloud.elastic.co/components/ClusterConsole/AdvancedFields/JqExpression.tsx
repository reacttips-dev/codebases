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
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiButton,
  EuiButtonIcon,
  EuiCode,
  EuiCodeBlock,
  EuiFlexItem,
  EuiFormRow,
  EuiHorizontalRule,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSpacer,
  EuiText,
  EuiToolTip,
} from '@elastic/eui'

import { checkScript, executeScript } from '@elastic/micro-jq'
import DebouncedInput from './DebouncedInput'

import ExternalLink from '../../ExternalLink'

import lightTheme from '../../../lib/theme/light'

import { ConsoleRequestState } from '../../../reducers/clusterConsole'
import { ElasticsearchCluster } from '../../../types'

import '../clusterConsole.scss'

const { euiBreakpoints } = lightTheme

const messages = defineMessages({
  jqExpression: {
    id: 'cluster-console-request.filter-by.jq-expression',
    defaultMessage: 'JQ expression',
  },
  helpTitle: {
    id: 'cluster-console-request.filter-by.jq-expression.help-title',
    defaultMessage: 'Filtering with JQ expressions',
  },
  close: {
    id: 'cluster-console-request.filter-by.jq-expression.close-help',
    defaultMessage: 'Close',
  },
  invalidExpression: {
    id: 'cluster-console-request.filter-by.jq-expression.invalid-expression',
    defaultMessage: 'Invalid expression - only a subset of the JQ language is supported',
  },
  aboutJqExpressions: {
    id: 'cluster-console-request.filter-by.jq-expression.about-jq-expression',
    defaultMessage: 'About JQ expressions ...',
  },
  showHelp: {
    id: 'cluster-console-request.filter-by.jq-expression.show-help',
    defaultMessage: 'Show JQ expression help',
  },
  jqExpressionsHelp: {
    id: 'cluster-console-request.filter-by.jq-expression.help-text',
    defaultMessage:
      'You can filter and transform JSON responses using {jqLink}. The console supports a subset of the full JQ language.',
  },
  jqLinkText: {
    id: 'cluster-console-request.filter-by.jq-expression.link-text',
    defaultMessage: 'JQ expressions',
  },
  jqExamples: {
    id: 'cluster-console-request.filter-by.jq-expression.jq-examples',
    defaultMessage: 'The examples below assume the following JSON response:',
  },
  exampleResult: {
    id: 'cluster-console-request.filter-by.jq-expression.example-result',
    defaultMessage: 'Result:',
  },
})

const exampleDescriptions = defineMessages({
  simple: {
    id: 'cluster-console-request.filter-by.jq-expression.example.simple',
    defaultMessage:
      'The most basic useful filter selects the value at a particular key, "_shards" in this example:',
  },
  compound: {
    id: 'cluster-console-request.filter-by.jq-expression.example.compound',
    defaultMessage:
      'To select a value deeper in the JSON object, you can simply add filters together:',
  },
  indexed: {
    id: 'cluster-console-request.filter-by.jq-expression.example.indexed',
    defaultMessage: 'You can index into arrays to pick a specific value:',
  },
  createArray: {
    id: 'cluster-console-request.filter-by.jq-expression.example.createArray',
    defaultMessage:
      'You can create a new array from the specified values. This example uses a pipe ("|") to feed the result of the filter on the left into the input of the one on the right, much like a Unix shell command:',
  },
  createObject: {
    id: 'cluster-console-request.filter-by.jq-expression.example.createObject',
    defaultMessage: 'You can even create a new object:',
  },
})

interface Props extends WrappedComponentProps {
  onChange: (request: ConsoleRequestState, cluster: ElasticsearchCluster) => void
  request: ConsoleRequestState
  cluster: ElasticsearchCluster
}

interface State {
  showHelp: boolean
}

class JqExpression extends Component<Props, State> {
  state: State = {
    showHelp: false,
  }

  render() {
    const {
      intl: { formatMessage },
      onChange,
      request,
      cluster,
    } = this.props

    const { filterJq } = request
    const isInvalid = filterJq.trim().length > 0 && !checkScript(filterJq)
    const error = isInvalid ? formatMessage(messages.invalidExpression) : undefined

    return (
      <Fragment>
        <EuiFlexItem>
          <div data-test-id='filterJq-row'>
            <EuiFormRow
              fullWidth={true}
              isInvalid={isInvalid}
              error={error}
              hasEmptyLabelSpace={true}
            >
              <DebouncedInput
                fullWidth={true}
                aria-label={formatMessage(messages.jqExpression)}
                data-test-id='filterJq'
                value={filterJq}
                onChange={(value) => onChange({ ...request, filterJq: value }, cluster)}
              />
            </EuiFormRow>
          </div>
        </EuiFlexItem>

        <EuiFlexItem grow={false} style={{ marginLeft: 0 }}>
          <EuiFormRow hasEmptyLabelSpace={true}>
            <EuiToolTip content={formatMessage(messages.aboutJqExpressions)}>
              <EuiButtonIcon
                onClick={this.openHelp}
                aria-label={formatMessage(messages.showHelp)}
                iconType='questionInCircle'
              />
            </EuiToolTip>
          </EuiFormRow>
        </EuiFlexItem>

        {this.state.showHelp && (
          <EuiOverlayMask>
            <EuiModal onClose={this.closeHelp} style={{ width: euiBreakpoints.m }}>
              <EuiModalHeader>
                <EuiModalHeaderTitle>{formatMessage(messages.helpTitle)}</EuiModalHeaderTitle>
              </EuiModalHeader>

              <EuiModalBody>{this.getHelpBody()}</EuiModalBody>

              <EuiModalFooter>
                <EuiButton onClick={this.closeHelp}>{formatMessage(messages.close)}</EuiButton>
              </EuiModalFooter>
            </EuiModal>
          </EuiOverlayMask>
        )}
      </Fragment>
    )
  }

  openHelp = () => {
    this.setState({ showHelp: true })
  }

  closeHelp = () => {
    this.setState({ showHelp: false })
  }

  getHelpBody = () => {
    const {
      intl: { formatMessage },
    } = this.props

    const exampleResponse = {
      took: 4,
      timed_out: false,
      _shards: {
        total: 1,
        successful: 1,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: 3,
        max_score: 1,
        hits: [
          {
            _index: 'corp_logs',
            _type: 'doc',
            _id: 'AWhhvRVRBeUzWe4u17Z0',
            _score: 1,
            _source: {
              uuid: '3FAE5A9E-2225-4641-9B36-1A1BECDCB66F',
              timestamp: '2019-01-18T16:13:28.264Z',
              type: 'access',
              principal: '123141232',
            },
          },
          {
            _index: 'corp_logs',
            _type: 'doc',
            _id: 'AWhhvRVRBeUzWe4u17Z6',
            _score: 1,
            _source: {
              uuid: '4D2BA794-2D5B-46BF-90A2-E7A531089FEC',
              timestamp: '2019-01-18T17:13:28.264Z',
              type: 'access',
              principal: '9231091232',
            },
          },
          {
            _index: 'corp_logs',
            _type: 'doc',
            _id: 'AWhhvRVRBeUzWe4u17Z3',
            _score: 1,
            _source: {
              uuid: '37FD4455-37D7-4ACC-A2FB-90228F97F6A7',
              timestamp: '2019-01-18T16:13:28.264Z',
              type: 'access',
              principal: '8713791823',
            },
          },
        ],
      },
    }

    const examples = [
      {
        description: formatMessage(exampleDescriptions.simple),
        script: '._shards',
      },
      {
        description: formatMessage(exampleDescriptions.compound),
        script: '.hits.total',
      },
      {
        description: formatMessage(exampleDescriptions.indexed),
        script: '.hits.hits[0]',
      },
      {
        description: formatMessage(exampleDescriptions.createArray),
        script: '.hits.hits[0] | [ ._source.uuid, ._source.principal ]',
      },
      {
        description: formatMessage(exampleDescriptions.createObject),
        script: '{ total: .hits.total, first: .hits.hits[0] }',
      },
    ]

    return (
      <Fragment>
        <EuiText>
          <p>
            <FormattedMessage
              {...messages.jqExpressionsHelp}
              values={{
                jqLink: (
                  <ExternalLink href='https://stedolan.github.io/jq/'>
                    {formatMessage(messages.jqLinkText)}
                  </ExternalLink>
                ),
              }}
            />
          </p>

          <p>{formatMessage(messages.jqExamples)}</p>
        </EuiText>

        <EuiSpacer size='s' />

        <EuiCodeBlock paddingSize='m' language='json'>
          {JSON.stringify(exampleResponse, null, 2)}
        </EuiCodeBlock>

        <EuiSpacer size='m' />

        {examples.map(({ description, script }, index) => (
          <Fragment key={index}>
            <EuiHorizontalRule />

            <p>{description}</p>
            <p>
              <EuiCode>{script}</EuiCode>
            </p>

            <p>{formatMessage(messages.exampleResult)}</p>

            <EuiCodeBlock paddingSize='s' language='json'>
              {JSON.stringify(executeScript(exampleResponse, script), null, 2)}
            </EuiCodeBlock>
          </Fragment>
        ))}
      </Fragment>
    )
  }
}

export default injectIntl(JqExpression)
