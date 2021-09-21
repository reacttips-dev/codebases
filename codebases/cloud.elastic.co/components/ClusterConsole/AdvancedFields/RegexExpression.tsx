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
  EuiSwitch,
  EuiText,
  EuiToolTip,
} from '@elastic/eui'

import DebouncedInput from './DebouncedInput'

import ExternalLink from '../../ExternalLink'
import DocLink from '../../DocLink'

import lightTheme from '../../../lib/theme/light'

import { ConsoleRequestState } from '../../../reducers/clusterConsole'
import { ElasticsearchCluster } from '../../../types'

import '../clusterConsole.scss'

const { euiBreakpoints } = lightTheme

const messages = defineMessages({
  regularExpression: {
    id: 'cluster-console-request.filter-by.regular-expression',
    defaultMessage: 'Regular expression',
  },
  invertMatch: {
    id: 'cluster-console-request.filter.invert-match',
    defaultMessage: 'Invert match',
  },
  helpTitle: {
    id: 'cluster-console-request.filter-by.regex.help-title',
    defaultMessage: 'Filtering with regular expressions',
  },
  close: {
    id: 'cluster-console-request.filter-by.regex.close-help',
    defaultMessage: 'Close',
  },
  aboutRegex: {
    id: 'cluster-console-request.filter-by.regex.about-regex',
    defaultMessage: 'About regular expressions ...',
  },
  showHelp: {
    id: 'cluster-console-request.filter-by.regex.show-help',
    defaultMessage: 'Show regular expressions help',
  },
  regexHelp: {
    id: 'cluster-console-request.filter-by.regex.help-text',
    defaultMessage:
      "You can filter responses using {regularExpressions} to select only lines that match (or don't match) a given pattern.",
  },
  regexLinkText: {
    id: 'cluster-console-request.filter-by.regex.link-text',
    defaultMessage: 'regular expressions',
  },
  regexExamples: {
    id: 'cluster-console-request.filter-by.regex.examples',
    defaultMessage:
      'The examples below assume the following text response from a {catApi}, but note that you can filter JSON responses too.',
  },
  catApiText: {
    id: 'cluster-console-request.filter-by.regex.cat-api-link-text',
    defaultMessage: '_cat API',

    // https://www.elastic.co/guide/en/elasticsearch/reference/current/cat-indices.html
  },
  exampleResult: {
    id: 'cluster-console-request.filter-by.regex.example-result',
    defaultMessage: 'Result:',
  },
})

const exampleDescriptions = defineMessages({
  simple: {
    id: 'cluster-console-request.filter-by.regex.example.simple',
    defaultMessage: 'The simplest expression is just a basic text match:',
  },
  inverted: {
    id: 'cluster-console-request.filter-by.regex.example.inverted',
    defaultMessage: "You can also choose lines that don't match:",
  },
  pattern: {
    id: 'cluster-console-request.filter-by.regex.example.pattern',
    defaultMessage:
      'You can be quite specific about what lines to pick, using regular expression syntax. This pattern selects only time-based indices from 2018 and 2019:',
  },
})

interface Props extends WrappedComponentProps {
  request: ConsoleRequestState
  onChange: (request: ConsoleRequestState, cluster: ElasticsearchCluster) => void
  cluster: ElasticsearchCluster
}

interface State {
  showHelp: boolean
}

function isValidRegex(regex: string) {
  try {
    if (regex.trim().length > 0) {
      // eslint-disable-next-line no-new
      new RegExp(regex)
    }
  } catch (e) {
    return false
  }

  return true
}

function matchLines(text, regexStr, invert = false) {
  const regex = new RegExp(regexStr)
  const lines = text.split(/\n/)

  const filter = invert ? (line) => !regex.test(line) : (line) => regex.test(line)

  return lines.filter(filter).join('\n')
}

class RegexExpression extends Component<Props, State> {
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

    const isInvalid = !isValidRegex(request.filterRegex)

    return (
      <Fragment>
        <EuiFlexItem>
          <div data-test-id='filterRegex-row'>
            <EuiFormRow
              fullWidth={true}
              isInvalid={isInvalid}
              error={isInvalid ? 'Invalid expression' : undefined}
              hasEmptyLabelSpace={true}
            >
              <DebouncedInput
                debounceTimeout={50}
                fullWidth={true}
                aria-label={formatMessage(messages.regularExpression)}
                data-test-id='filterRegex'
                value={request.filterRegex}
                onChange={(value) => onChange({ ...request, filterRegex: value }, cluster)}
              />
            </EuiFormRow>
          </div>
        </EuiFlexItem>

        <EuiFlexItem grow={false} style={{ marginLeft: 0, marginRight: 0 }}>
          <EuiFormRow hasEmptyLabelSpace={true}>
            <EuiToolTip content={formatMessage(messages.aboutRegex)}>
              <EuiButtonIcon
                onClick={this.openHelp}
                aria-label={formatMessage(messages.showHelp)}
                iconType='questionInCircle'
              />
            </EuiToolTip>
          </EuiFormRow>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiFormRow hasEmptyLabelSpace={true}>
            <EuiSwitch
              checked={request.invertFilter || false}
              data-test-id='invertFilter'
              label={formatMessage(messages.invertMatch)}
              onChange={() =>
                onChange({ ...request, invertFilter: !request.invertFilter }, cluster)
              }
            />
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

    const exampleResponse = `health status index                         pri rep
green  open   .watches                        1   0
green  open   .watcher-history-7-2019.01.16   1   0
green  open   .kibana                         1   0
green  open   .watcher-history-7-2019.01.18   1   0
green  open   .triggered_watches              1   0
yellow open   metricbeat-6.3.2-2018.10.15     1   1
green  open   .watcher-history-7-2019.01.17   1   0
`

    const examples = [
      {
        description: formatMessage(exampleDescriptions.simple),
        regex: 'watcher',
      },
      {
        description: formatMessage(exampleDescriptions.inverted),
        regex: 'green',
        invert: true,
      },
      {
        description: formatMessage(exampleDescriptions.pattern),
        regex: '-201[89]',
      },
    ]

    return (
      <Fragment>
        <EuiText>
          <FormattedMessage
            tagName='p'
            {...messages.regexHelp}
            values={{
              regularExpressions: (
                <ExternalLink href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Writing_a_regular_expression_pattern'>
                  {formatMessage(messages.regexLinkText)}
                </ExternalLink>
              ),
            }}
          />

          <FormattedMessage
            tagName='p'
            {...messages.regexExamples}
            values={{
              catApi: <DocLink link='esCatIndices'>{formatMessage(messages.catApiText)}</DocLink>,
            }}
          />
        </EuiText>

        <EuiSpacer size='s' />

        <EuiCodeBlock paddingSize='m'>{exampleResponse}</EuiCodeBlock>

        <EuiSpacer size='m' />

        {examples.map(({ description, regex, invert = false }, index) => (
          <Fragment key={index}>
            <EuiHorizontalRule />

            <p>{description}</p>
            <p>
              <EuiCode>{regex}</EuiCode>
            </p>
            <p>{formatMessage(messages.exampleResult)}</p>

            <EuiCodeBlock paddingSize='s'>
              {matchLines(exampleResponse, regex, invert)}
            </EuiCodeBlock>
          </Fragment>
        ))}
      </Fragment>
    )
  }
}

export default injectIntl(RegexExpression)
