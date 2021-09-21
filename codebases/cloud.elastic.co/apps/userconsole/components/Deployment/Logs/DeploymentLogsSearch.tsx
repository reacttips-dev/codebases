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

import React, { Component, FormEvent } from 'react'
import { defineMessages, FormattedMessage, IntlShape, injectIntl } from 'react-intl'

import {
  EuiButton,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiTitle,
  EuiText,
} from '@elastic/eui'

import PrivacySensitiveContainer from '../../../../../components/PrivacySensitiveContainer'

const messages = defineMessages({
  search: {
    id: `deployment-logs.search-placeholder`,
    defaultMessage: `Search...`,
  },
})

type Props = {
  query: string
  onSearch: (query: string) => void
  intl: IntlShape
}

type State = {
  searchText?: string
}

const initialState: State = {
  searchText: undefined,
}

class DeploymentLogsSearch extends Component<Props, State> {
  state: State = initialState

  render() {
    const {
      intl: { formatMessage },
      query,
    } = this.props

    const { searchText } = this.state

    return (
      <form onSubmit={this.onSearch}>
        <EuiFlexGroup direction='column' gutterSize='s'>
          <EuiFlexItem>
            <EuiTitle size='s'>
              <h2>
                <FormattedMessage
                  id='deployment-logs.search-message-title'
                  defaultMessage='View last 24 hours standard logs'
                />
              </h2>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiText color='subdued' grow={false}>
              <FormattedMessage
                id='deployment-logs.search-message-description'
                defaultMessage='For more configuration options, including search, retention periods, and visualizations, ship your logs and metrics to a dedicated deployment.'
              />
            </EuiText>
            <EuiSpacer size='m' />
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem>
            <PrivacySensitiveContainer>
              <EuiFieldSearch
                placeholder={formatMessage(messages.search)}
                fullWidth={true}
                value={typeof searchText !== 'undefined' ? searchText : query}
                onChange={(e) => this.setState({ searchText: e.target.value })}
              />
            </PrivacySensitiveContainer>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton type='submit'>
              <FormattedMessage id='deployment-logs.search' defaultMessage='Search' />
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </form>
    )
  }

  onSearch = (e: FormEvent<any>) => {
    e.preventDefault()

    const { searchText } = this.state

    this.props.onSearch(searchText || '')
  }
}

export default injectIntl(DeploymentLogsSearch)
