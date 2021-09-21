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
import { defineMessages, FormattedMessage, IntlShape, injectIntl } from 'react-intl'
import { get } from 'lodash'

import { EuiLoadingContent } from '@elastic/eui'

import { CuiAlert } from '../../../cui'

import ShardTable from './ShardTable'

import Sunburst from '../../Sunburst'

import { buildHierarchy } from '../../Sunburst/hierarchy'

import { AsyncRequestState, PlainHashMap, ClusterHealth } from '../../../types'
import { DeploymentGetResponse } from '../../../lib/api/v1/types'

import './clusterShards.scss'

type Props = {
  intl: IntlShape
  deployment: DeploymentGetResponse
  clusterHealth?: ClusterHealth | null
  fetchShardCountsRequest: AsyncRequestState
}

type State = {
  locale: string
  translations: PlainHashMap<string>
  translatedSegmentClasses: PlainHashMap<string>
}

const messages = defineMessages({
  STARTED: {
    id: `cluster-shards.started`,
    defaultMessage: `Started`,
  },
  RELOCATING: {
    id: `cluster-shards.relocating`,
    defaultMessage: `Relocating`,
  },
  INITIALIZING: {
    id: `cluster-shards.initializing`,
    defaultMessage: `Initializing`,
  },
  UNASSIGNED: {
    id: `cluster-shards.unassigned`,
    defaultMessage: `Unassigned`,
  },
  UNASSIGNED_INDEX_CREATED: {
    id: `cluster-shards.index-created`,
    defaultMessage: `Index created`,
  },
  UNASSIGNED_NEW_INDEX_RESTORED: {
    id: `cluster-shards.new-index-restored`,
    defaultMessage: `New index restored`,
  },
  UNASSIGNED_ALLOCATION_FAILED: {
    id: `cluster-shards.allocation-failed`,
    defaultMessage: `Allocation failed`,
  },
  UNASSIGNED_CLUSTER_RECOVERED: {
    id: `cluster-shards.cluster-recovered`,
    defaultMessage: `Cluster recovered`,
  },
  UNASSIGNED_PRIMARY_FAILED: {
    id: `cluster-shards.primary-failed`,
    defaultMessage: `Primary failed`,
  },
  UNASSIGNED_NODE_LEFT: {
    id: `cluster-shards.node-left`,
    defaultMessage: `Node left`,
  },
  NONE: {
    id: `cluster-shards.none`,
    defaultMessage: `No shards yet`,
  },
})

/* When no shards exist yet, we have to provide a non-zero value for the viz to draw.
 * This gets rounded down when we display the values.
 */
const noShardsYetFakeShardDetails = { NONE: 0.1 }

class ClusterShards extends Component<Props, State> {
  state: State = deriveTranslationState(this.props)

  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    const { locale } = prevState

    if (locale !== nextProps.intl.locale) {
      return deriveTranslationState(nextProps)
    }

    return null
  }

  render() {
    const { fetchShardCountsRequest, clusterHealth } = this.props
    const { translations, translatedSegmentClasses } = this.state

    if (
      fetchShardCountsRequest.error &&
      get(fetchShardCountsRequest, [`error`, `response`, `status`]) !== 404
    ) {
      const messagePrefix = (
        <FormattedMessage
          id='configure-shards.failed-to-fetch-shards'
          defaultMessage='Failed to fetch shard information from cluster'
        />
      )

      return (
        <div data-test-id='fetch-shards-error'>
          <CuiAlert type='error' details={fetchShardCountsRequest.error}>
            {messagePrefix}
          </CuiAlert>
        </div>
      )
    }

    // This check works better than fetchShardCountsRequest.inProgress, since we don't show the spinner
    // every time we refresh the data.
    if (clusterHealth == null) {
      return (
        <div data-test-id='loading-cluster-health'>
          <EuiLoadingContent />
        </div>
      )
    }

    const shardDetail: ClusterHealth['shardDetail'] =
      clusterHealth.shardDetail != null ? clusterHealth.shardDetail : noShardsYetFakeShardDetails

    if (Object.keys(shardDetail).length === 0) {
      return (
        <div data-test-id='no-shards-found'>
          <FormattedMessage id='configure-shards.no-shards' defaultMessage='No shards found.' />
        </div>
      )
    }

    const sunburstProps = {
      width: 250,
      height: 250,
      data: buildHierarchy(translations, shardDetail),
      segmentClasses: translatedSegmentClasses,
    }

    return (
      <div className='col-xs-12 col-sm-6 col-sm-offset-3 clusterShardsSunburst'>
        <ShardTable translations={translations} shards={shardDetail} />
        <Sunburst {...sunburstProps} />
      </div>
    )
  }
}

export default injectIntl(ClusterShards)

function deriveTranslationState(props: Props): State {
  const {
    intl: { formatMessage, locale },
  } = props

  const translations = {}
  const translatedSegmentClasses = {}

  for (const key of Object.keys(messages)) {
    translations[key] = formatMessage(messages[key])

    if (key.match(/^[A-Z_]+$/)) {
      translatedSegmentClasses[translations[key]] = `segment--${key.toLowerCase()}`
    }
  }

  return {
    locale,
    translations,
    translatedSegmentClasses,
  }
}
