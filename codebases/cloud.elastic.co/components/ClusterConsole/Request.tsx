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
import { isString } from 'lodash'

import { EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui'

import Method from './Method'
import Path from './Path'
import Body from './Body'
import SpinButton from '../SpinButton'
import AdvancedFields from './AdvancedFields'
import AdvancedModeSwitch from './AdvancedModeSwitch'
import RecentHistoryButton from './RecentHistoryButton'
import CrossTabHistoryReplication from './CrossTabHistoryReplication'

import { ConsoleRequestState } from '../../reducers/clusterConsole'
import { ElasticsearchCluster } from '../../types'

type Props = {
  inProgress: boolean
  request: ConsoleRequestState
  requestHistory: ConsoleRequestState[]
  clearClusterProxyResponse: (regionId: string, clusterId: string) => void
  clearClusterConsoleHistory: () => void
  onChange: (request: ConsoleRequestState, cluster: ElasticsearchCluster) => void
  submitQueryToClusterProxy: (request: ConsoleRequestState) => void
  cluster: ElasticsearchCluster
}

class ClusterConsoleRequest extends Component<Props> {
  render() {
    const { inProgress, request, requestHistory, clearClusterConsoleHistory, onChange, cluster } =
      this.props

    return (
      <section>
        <form
          onSubmit={this.onSubmit}
          className='clusterConsole--request'
          data-test-id='console-request-form'
        >
          <EuiFlexGroup alignItems='center' gutterSize='m'>
            <EuiFlexItem grow={false}>
              <Method
                value={request.method}
                disabled={inProgress}
                onChange={this.onFieldChange(`method`)}
              />
            </EuiFlexItem>

            <EuiFlexItem>
              <Path
                value={request.path}
                disabled={inProgress}
                onChange={this.onFieldChange(`path`)}
                append={
                  <RecentHistoryButton
                    history={requestHistory}
                    clearHistory={clearClusterConsoleHistory}
                    onItemClick={this.onHistoryItemClick}
                  />
                }
              />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <SpinButton
                type='submit'
                fill={true}
                spin={inProgress}
                data-test-id='api-console-submit-request'
              >
                <FormattedMessage id='cluster-console-request.submit' defaultMessage='Submit' />
              </SpinButton>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <AdvancedModeSwitch
                checked={request.advancedMode}
                onChange={(isChecked) => onChange({ ...request, advancedMode: isChecked }, cluster)}
              />
            </EuiFlexItem>
          </EuiFlexGroup>

          {request.advancedMode && (
            <Fragment>
              <EuiSpacer size='m' />
              <AdvancedFields request={request} onChange={onChange} cluster={cluster} />
            </Fragment>
          )}

          {request.method !== `GET` && (
            <div className='clusterConsole--requestBody'>
              <Body
                value={request.body || ``}
                disabled={inProgress}
                onChange={this.onFieldChange(`body`)}
              />
            </div>
          )}
        </form>

        <CrossTabHistoryReplication />
      </section>
    )
  }

  onSubmit = (event) => {
    const { submitQueryToClusterProxy, request } = this.props
    event.preventDefault()
    submitQueryToClusterProxy(request)
  }

  onFieldChange = (field: string) => {
    const { request, onChange, cluster } = this.props

    return (event: React.FormEvent<HTMLInputElement>) => {
      const value = isString(event) ? event : (event.target as HTMLInputElement).value
      onChange({ ...request, [field]: value }, cluster)
    }
  }

  onHistoryItemClick = (historyItem: ConsoleRequestState) => {
    const { clearClusterProxyResponse, onChange, cluster } = this.props
    const { regionId, id } = cluster

    clearClusterProxyResponse(regionId, id)
    onChange(historyItem, cluster)
  }
}

export default ClusterConsoleRequest
