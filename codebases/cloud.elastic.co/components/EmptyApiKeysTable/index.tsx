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

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner, EuiEmptyPrompt, EuiText } from '@elastic/eui'
import DocLink from '../DocLink'

type Props = {
  loading: boolean
}

const EmptyApiKeysTable: FunctionComponent<Props> = ({ loading }) => (
  <EuiEmptyPrompt
    style={{ maxWidth: `50em` }}
    title={
      <h3>
        {loading ? (
          <EuiFlexGroup gutterSize='s' alignItems='center'>
            <EuiFlexItem grow={false}>
              <EuiLoadingSpinner size='s' />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <FormattedMessage
                id='empty-api-keys-table.loading-api-keys'
                defaultMessage='Loading API keys …'
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        ) : (
          <FormattedMessage
            id='empty-api-keys-table.no-api-keys'
            defaultMessage='You have no API keys'
          />
        )}
      </h3>
    }
    body={
      loading ? (
        <FormattedMessage id='empty-api-keys-table.stand-by' defaultMessage='Please stand by' />
      ) : (
        <EuiText>
          <p>
            <FormattedMessage
              id='api-keys.overview-description'
              defaultMessage='Authenticate requests when interacting with the RESTful API. The generated API key matches the same permissions and privileges as your role. {learnMore}'
              values={{
                learnMore: (
                  <DocLink link='apiKeysDocLink'>
                    <FormattedMessage
                      id='api-keys.overview.learn-more'
                      defaultMessage='Learn more'
                    />
                  </DocLink>
                ),
              }}
            />
          </p>
        </EuiText>
      )
    }
  />
)

export default EmptyApiKeysTable
