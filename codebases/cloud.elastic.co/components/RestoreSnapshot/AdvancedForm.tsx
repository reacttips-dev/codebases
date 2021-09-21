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
  EuiBadge,
  EuiCode,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui'

import ExternalLink from '../ExternalLink'

import PrivacySensitiveContainer from '../PrivacySensitiveContainer'

import getValidationErrors from './lib/getValidationErrors'

import messages from './messages'

import { State } from './types'

type Props = {
  matchPattern: string
  onChange: (changes: State) => void
  renamePattern: string
  snapshot: boolean
  specifyIndices: string
}

export default class AdvancedForm extends Component<Props> {
  render() {
    return (
      <Fragment>
        {this.renderSpecifyIndices()}

        <EuiSpacer size='s' />

        {this.renderRenameIndices()}
      </Fragment>
    )
  }

  renderSpecifyIndices() {
    const { specifyIndices } = this.props

    return (
      <PrivacySensitiveContainer>
        <EuiFormRow>
          <EuiFlexGroup gutterSize='m' alignItems='center' justifyContent='spaceBetween'>
            <EuiFlexItem grow={false}>
              <EuiTitle size='xs'>
                <h3>
                  <FormattedMessage {...messages.specifyIndicesTitle} />
                </h3>
              </EuiTitle>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiBadge>
                <FormattedMessage {...messages.optional} />
              </EuiBadge>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFormRow>

        <EuiForm>
          <EuiFormRow
            label={<FormattedMessage {...messages.specifyIndicesLabel} />}
            helpText={
              <FormattedMessage
                {...messages.specifyIndicesHelp}
                values={{
                  multiIndexSyntax: (
                    <ExternalLink href='https://www.elastic.co/guide/en/elasticsearch/reference/6.5/search-search.html#search-multi-index-type'>
                      <FormattedMessage {...messages.multiIndexSyntax} />
                    </ExternalLink>
                  ),
                  example: <EuiCode>index1,index2,index3</EuiCode>,
                }}
              />
            }
          >
            <EuiFieldText
              value={specifyIndices}
              onChange={(e) => this.onChange({ specifyIndices: e.target.value })}
              data-test-id='specify-indices-input'
              placeholder='e.g. index1,index2'
            />
          </EuiFormRow>
        </EuiForm>
      </PrivacySensitiveContainer>
    )
  }

  renderRenameIndices() {
    const { matchPattern, renamePattern, snapshot } = this.props

    const { matchPatternError } = getValidationErrors({
      snapshot,
      matchPattern,
      renamePattern,
    })

    const isInvalid = matchPatternError !== undefined

    return (
      <PrivacySensitiveContainer>
        <EuiFormRow>
          <EuiFlexGroup gutterSize='m' alignItems='center' justifyContent='spaceBetween'>
            <EuiFlexItem grow={false}>
              <EuiTitle size='xs'>
                <h3>
                  <FormattedMessage {...messages.renameIndicesTitle} />
                </h3>
              </EuiTitle>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiBadge>
                <FormattedMessage {...messages.optional} />
              </EuiBadge>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFormRow>

        <EuiForm>
          <EuiFormRow
            label={<FormattedMessage {...messages.matchPatternLabel} />}
            isInvalid={isInvalid}
            error={matchPatternError}
          >
            <EuiFieldText
              data-test-id='match-pattern'
              name='rename_pattern'
              placeholder='index_(.+)'
              value={matchPattern}
              onChange={(e) => this.onChange({ matchPattern: e.target.value })}
              isInvalid={isInvalid}
            />
          </EuiFormRow>

          <EuiFormRow
            label={<FormattedMessage {...messages.replacePatternLabel} />}
            helpText={
              <FormattedMessage
                {...messages.renameIndicesHelp}
                values={{
                  regularExpression: (
                    <ExternalLink href='http://docs.oracle.com/javase/6/docs/api/java/util/regex/Pattern.html'>
                      <FormattedMessage {...messages.regularExpression} />
                    </ExternalLink>
                  ),
                  capturedExpression: (
                    <ExternalLink href='http://docs.oracle.com/javase/6/docs/api/java/util/regex/Pattern.html#cg'>
                      <FormattedMessage {...messages.capturedExpression} />
                    </ExternalLink>
                  ),
                  matchPattern: <EuiCode>index_(.+)</EuiCode>,
                  replacePattern: <EuiCode>restored_index_$1</EuiCode>,
                  originalIndex: <EuiCode>index_logging</EuiCode>,
                  renamedIndex: <EuiCode>restored_index_logging</EuiCode>,
                }}
              />
            }
          >
            <EuiFieldText
              data-test-id='replace-pattern'
              name='rename_replacement'
              placeholder='restored_index_$1'
              value={renamePattern}
              onChange={(e) => this.onChange({ renamePattern: e.target.value })}
            />
          </EuiFormRow>
        </EuiForm>
      </PrivacySensitiveContainer>
    )
  }

  onChange = (
    changes: { renamePattern: string } | { specifyIndices: string } | { matchPattern: string },
  ) => {
    const { matchPattern, renamePattern, specifyIndices, onChange } = this.props

    onChange({
      matchPattern,
      renamePattern,
      specifyIndices,
      ...changes,
    })
  }
}
