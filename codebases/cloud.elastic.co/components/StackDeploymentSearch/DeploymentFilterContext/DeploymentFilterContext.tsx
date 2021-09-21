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

import React, { FunctionComponent, ReactNode, ReactElement } from 'react'
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'

import {
  CuiFilterContext,
  nullQueryExecutor,
  getFilterEsQuery,
  OnFilterChangeParams,
} from '../../../cui'

import { getSchema } from './schema'
import { getFilters } from './filters'

import DeploymentFilterContextHelp, { helpTitle } from './DeploymentFilterContextHelp'

import { Region } from '../../../types'
import { DeploymentSearchResponse } from '../../../lib/api/v1/types'

export type OnChangeParams = {
  query: string | null
  queryText: string | null
  queryResults: DeploymentSearchResponse[]
}

interface StateProps {}

type DispatchProps = {
  fetchRegionList: () => void
  fetchVersions: (region: Region) => void
  fetchInstanceConfigurations: (regionId: string) => void
}

type ConsumerProps = {
  query: string | null
  onChange: (params: OnFilterChangeParams<DeploymentSearchResponse>) => void
  isLoading: boolean
  deployments: DeploymentSearchResponse[]
  actions?: ReactElement | null
  tools?: ReactNode[] | null
  toolsLeft?: ReactNode[] | null
}

type Props = StateProps & DispatchProps & ConsumerProps & WrappedComponentProps

const messages = defineMessages({
  searchBarPlaceholder: {
    id: `deployment-filter-context.placeholder`,
    defaultMessage: `e.g.: healthy:y us-east`,
  },
  emptyMessage: {
    id: `deployment-filter-context.no-matches`,
    defaultMessage: `No deployments match your query`,
  },
})

export function getEsQuery(query) {
  const { schema } = getSchema()
  return getFilterEsQuery({ query, schema })
}

const DeploymentFilterContext: FunctionComponent<Props> = ({
  intl,
  query,
  onChange,
  isLoading,
  deployments,
  fetchRegionList,
  fetchVersions,
  fetchInstanceConfigurations,
  actions,
  tools,
  toolsLeft,
}) => {
  const { formatMessage } = intl
  const filters = getFilters({
    intl,
    fetchRegionList,
    fetchVersions,
    fetchInstanceConfigurations,
  })
  const placeholder = formatMessage(messages.searchBarPlaceholder)
  const emptyMessage = formatMessage(messages.emptyMessage)

  return (
    <CuiFilterContext<DeploymentSearchResponse>
      query={query}
      onChange={onChange}
      records={deployments}
      schema={getSchema().schema}
      filters={filters}
      executeQuery={nullQueryExecutor}
      placeholder={placeholder}
      emptyMessage={emptyMessage}
      isLoading={isLoading}
      incremental={false}
      helpTitle={formatMessage(helpTitle)}
      help={<DeploymentFilterContextHelp />}
      actions={actions}
      tools={tools}
      toolsLeft={toolsLeft}
    />
  )
}

export default injectIntl(DeploymentFilterContext)
