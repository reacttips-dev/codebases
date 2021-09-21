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
import { defineMessages, FormattedMessage } from 'react-intl'

import { flatten } from '../../../lib/flatten'

import { PlainHashMap, ClusterHealth } from '../../../types'

type ShardDetail = ClusterHealth['shardDetail']

type Props = {
  translations: PlainHashMap<string>
  shards: ShardDetail
}

type TabularDatum = {
  name: string
  value: number
}

const messages = defineMessages({
  tableHeaderShardStatus: {
    id: `cluster-shards.table.shard-status`,
    defaultMessage: `Shard Status`,
  },
  tableHeaderCount: {
    id: `cluster-shards.table.count`,
    defaultMessage: `Count`,
  },
})

const ShardTable: FunctionComponent<Props> = ({ translations, shards }) => {
  const data = tabulateData(shards)

  return (
    <table className='sr-only'>
      <thead>
        <tr>
          <th>
            <FormattedMessage {...messages.tableHeaderShardStatus} />
          </th>
          <th>
            <FormattedMessage {...messages.tableHeaderCount} />
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((each) => (
          <tr key={each.name}>
            <td>{translations[each.name]}</td>
            <td>{each.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ShardTable

function tabulateData(shards: ShardDetail): TabularDatum[] {
  const flattened = flatten(shards, `_`) as { [path: string]: string }

  const data: TabularDatum[] = Object.keys(flattened).map((key) => ({
    name: key,
    value: parseInt(flattened[key], 10),
  }))

  data.sort((a, b) => b.value - a.value)

  return data
}
