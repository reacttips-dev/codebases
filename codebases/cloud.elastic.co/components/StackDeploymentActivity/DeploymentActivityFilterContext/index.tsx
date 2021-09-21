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
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  createQueryExecutor,
  withErrorBoundary,
  ControlledFilterQuery,
  CuiFilterContext,
  ExecuteQuery,
} from '../../../cui'

import { getQueryModel, getSchema } from './schema'
import { getFilters } from './filters'

import { ResourceChangeAttempt } from '../../../types'

import './deploymentActivityFilterContext.scss'

interface Props extends WrappedComponentProps {
  query: ControlledFilterQuery
  planAttempts: ResourceChangeAttempt[]
  onChange: (q: any) => void
  tools: any
}

const messages = defineMessages({
  searchBarPlaceholder: {
    id: `deployment-activity-filter-context.placeholder`,
    defaultMessage: `e.g.: healthy_configuration:y apm`,
  },
})

export const getQueryExecutor = (): ExecuteQuery<ResourceChangeAttempt> => {
  const { defaultFields } = getSchema()

  return createQueryExecutor({
    defaultFields,
    getQueryModel,
  })
}

const DeploymentActivityFilterContext: FunctionComponent<Props> = ({
  intl,
  query,
  onChange,
  planAttempts,
  tools,
}) => {
  const { formatMessage } = intl

  const { schema } = getSchema()
  const executeQuery = getQueryExecutor()

  const filters = getFilters({
    intl,
    planAttempts,
  })

  const placeholder = formatMessage(messages.searchBarPlaceholder)

  return (
    <CuiFilterContext<ResourceChangeAttempt>
      query={query}
      onChange={onChange}
      records={planAttempts}
      schema={schema}
      filters={filters}
      executeQuery={executeQuery}
      placeholder={placeholder}
      tools={tools}
    />
  )
}

export default withErrorBoundary(injectIntl(DeploymentActivityFilterContext))

export { getSchema }
