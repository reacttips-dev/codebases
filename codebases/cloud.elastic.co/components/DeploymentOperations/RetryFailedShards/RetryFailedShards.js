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

import jif from 'jif'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFormHelpText, EuiSpacer } from '@elastic/eui'

import { CuiAlert, CuiPermissibleControl } from '../../../cui'
import Permission from '../../../lib/api/v1/permissions'

import SpinButton from '../../SpinButton'
import FormGroup from '../../FormGroup'
import DocLink from '../../DocLink'

import './retryFailedShards.scss'

class RetryFailedShards extends Component {
  componentWillUnmount() {
    this.resetRetryRequest()
  }

  render() {
    const { retryFailedShardAllocationsRequest, canRetryFailedShards } = this.props

    return (
      <FormGroup
        label={<FormattedMessage id='retry-failed-shards.title' defaultMessage='Failed Shards' />}
      >
        <EuiSpacer size='s' />

        <CuiPermissibleControl permissions={Permission.postEsProxyRequests}>
          <SpinButton
            color='primary'
            size='s'
            onClick={() => this.retryFailedShards()}
            disabled={retryFailedShardAllocationsRequest.isDone || !canRetryFailedShards}
            spin={retryFailedShardAllocationsRequest.inProgress}
            requiresSudo={true}
          >
            <FormattedMessage id='retry-failed-shards.retry' defaultMessage='Retry' />
          </SpinButton>
        </CuiPermissibleControl>

        {this.renderHelpText()}
        {jif(retryFailedShardAllocationsRequest.error, () => (
          <CuiAlert type='error' className='retryFailedShards-error'>
            {retryFailedShardAllocationsRequest.error}
          </CuiAlert>
        ))}

        {jif(
          !retryFailedShardAllocationsRequest.error && retryFailedShardAllocationsRequest.isDone,
          () => (
            <CuiAlert className='retryFailedShards-success' type='info'>
              <FormattedMessage
                id='retry-failed-shards.success'
                defaultMessage='Shard reallocation has started. You can view the progress by connecting to your cluster and looking at the cat shards API.'
              />
            </CuiAlert>
          ),
        )}
      </FormGroup>
    )
  }

  renderHelpText() {
    const { canRetryFailedShards } = this.props

    if (canRetryFailedShards) {
      return (
        <EuiFormHelpText>
          <FormattedMessage
            id='retry-failed-shards.description'
            defaultMessage='If you have shards that failed to allocate, you can try to allocate them again. {learnMore} …'
            values={{
              learnMore: (
                <DocLink link='esFailedShards'>
                  <FormattedMessage
                    id='retry-failed-shards.learn-more'
                    defaultMessage='Learn more'
                  />
                </DocLink>
              ),
            }}
          />
        </EuiFormHelpText>
      )
    }

    return (
      <EuiFormHelpText>
        <FormattedMessage
          id='retry-failed-shards.description-old-version'
          defaultMessage='Only available starting with v5.0.0'
        />
      </EuiFormHelpText>
    )
  }

  retryFailedShards() {
    const { retryFailedShardAllocations, cluster } = this.props
    retryFailedShardAllocations(cluster)
  }

  resetRetryRequest() {
    const { resetRetryFailedShardAllocationsRequest, cluster } = this.props
    resetRetryFailedShardAllocationsRequest(cluster.regionId, cluster.id)
  }
}

export default RetryFailedShards
