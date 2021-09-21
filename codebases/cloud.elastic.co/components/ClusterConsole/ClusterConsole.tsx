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

import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { isEmpty } from 'lodash'

import { EuiLink, EuiSpacer, EuiText } from '@elastic/eui'

import { hasPermission } from '../../lib/requiresPermission'
import Permission from '../../lib/api/v1/permissions'

import DocLink from '../DocLink'

import RequiresSudo from '../RequiresSudo'

import Request from './Request'
import Output from './Output'
import { ConsoleRequestState } from '../../reducers/clusterConsole'
import { AsyncRequestState, ElasticsearchCluster, EsProxyResponseConsole } from '../../types'

import './clusterConsole.scss'

type Props = {
  cluster?: ElasticsearchCluster | null
  consoleRequest?: ConsoleRequestState | null
  consoleRequestHistory: ConsoleRequestState[]
  consoleResponse: EsProxyResponseConsole | null
  queryClusterProxyRequest: AsyncRequestState
  clearClusterConsoleHistory: () => void
  clearClusterProxyResponse: (regionId: string, clusterId: string) => void
  queryClusterProxyForConsole: (
    cluster: ElasticsearchCluster,
    consoleRequest: ConsoleRequestState,
  ) => void
  setClusterConsoleRequest: (request: ConsoleRequestState, cluster: ElasticsearchCluster) => void
}

class ClusterConsole extends Component<Props> {
  componentDidMount() {
    this.setInitialRequest()
  }

  render() {
    const {
      clearClusterProxyResponse,
      clearClusterConsoleHistory,
      cluster,
      consoleRequest,
      consoleRequestHistory,
      consoleResponse,
      queryClusterProxyRequest,
      queryClusterProxyForConsole,
      setClusterConsoleRequest,
    } = this.props

    if (!cluster) {
      return null
    }

    if (!cluster._raw.plan) {
      return null
    }

    if (consoleRequest == null) {
      return null
    }

    return (
      <div className='clusterConsole'>
        <EuiText>
          <FormattedMessage
            id='cluster-console.overview'
            defaultMessage='Perform operations-related tasks from this console. You can run search queries, review the list of snapshots, check the health of your clusters, and { link }.'
            values={{
              link: (
                <DocLink link='apiConsoleDocLink'>
                  <FormattedMessage id='cluster-console.overview.more' defaultMessage='more' />
                </DocLink>
              ),
            }}
          />
        </EuiText>

        <EuiSpacer size='m' />

        <RequiresSudo
          color='primary'
          buttonType={EuiLink}
          to={
            <FormattedMessage
              id='cluster-console.access-es-console'
              defaultMessage='Access the Elasticsearch console'
            />
          }
          helpText={false}
          actionPrefix={false}
        >
          <Request
            cluster={cluster}
            request={consoleRequest}
            requestHistory={consoleRequestHistory}
            clearClusterProxyResponse={clearClusterProxyResponse}
            clearClusterConsoleHistory={clearClusterConsoleHistory}
            onChange={setClusterConsoleRequest}
            inProgress={queryClusterProxyRequest.inProgress}
            submitQueryToClusterProxy={(request) => {
              queryClusterProxyForConsole(cluster, request)
            }}
          />

          <EuiSpacer size='m' />

          <Output
            requestSettings={consoleRequest}
            request={queryClusterProxyRequest}
            response={consoleResponse}
          />
        </RequiresSudo>
      </div>
    )
  }

  setInitialRequest() {
    const { setClusterConsoleRequest, cluster } = this.props

    if (!cluster) {
      return
    }

    setClusterConsoleRequest(this.getInitialRequest(), cluster)
  }

  getInitialRequest() {
    const { consoleRequestHistory } = this.props

    if (!isEmpty(consoleRequestHistory)) {
      return consoleRequestHistory[0]
    }

    // Use this permission as a proxy for the user's access level to the console.
    // `*_viewer` roles can only call a restricted set of API endpoints, so we
    // default to an endpoint that they can actually call.
    const perm = hasPermission(Permission.postEsProxyRequests)

    const initialRequest: ConsoleRequestState = {
      method: `GET`,
      path: perm ? `/_search` : `/_cat`,
      body: ``,
      advancedMode: false,
      filterBy: `regex`,
      filterRegex: ``,
      filterJq: ``,
      invertFilter: false,
    }

    return initialRequest
  }
}

export default ClusterConsole
