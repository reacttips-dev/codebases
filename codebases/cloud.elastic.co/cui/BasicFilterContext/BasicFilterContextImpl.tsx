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

import React, { ReactNode, ReactElement } from 'react'

import { SearchFilterConfig } from '@elastic/eui'

import {
  ControlledFilterQuery,
  createQueryExecutor,
  CuiFilterContext,
  FilterSchema,
  GetQueryModel,
  QueryModel,
  excludeSchemalessFields,
} from '../FilterContext'

import BasicFilterContextIntlProvider from './BasicFilterContextIntlProvider'

import { FieldDefinition, ParsedFieldDefinition, RowKey } from './types'

type Props<TModel> = {
  query: ControlledFilterQuery
  onChange: (q: any) => void
  rows?: TModel[]
  isLoading?: boolean
  schemaFields: Array<FieldDefinition<TModel>>
  schemaDefaultFields?: string[]
  filters?: SearchFilterConfig[]
  actions?: ReactElement | null
  tools?: ReactNode[] | null
  toolsLeft?: ReactNode[] | null
}

/* The generics part of this component is pretty awkward, and it's the reason why we
 * don't use the more widespread `const C: FunctionComponent<Props> = () => { … }` approach.
 * A second hack is the `BasicFilterContextIntlProvider` component, whose sole purpose
 * is to shove `injectIntl` out of the way.
 * Doing this looks extremely odd, but is necessary to drill around the generic `TModel` type.
 */
function BasicFilterContextImpl<TModel>({
  query,
  onChange,
  rows,
  isLoading = false,
  schemaFields,
  schemaDefaultFields = [],
  filters,
  actions = null,
  tools = null,
  toolsLeft = null,
}: Props<TModel>) {
  const schema: FilterSchema = {
    strict: true,
    fields: parseSchemaFields<TModel>(schemaFields),
  }

  const getQueryModel = getQueryModelForSchema(schemaFields)

  const defaultFields = getDefaultSchemaFields({
    schemaFields,
    schemaDefaultFields,
  })

  const executeQuery = createQueryExecutor<TModel>({
    defaultFields,
    getQueryModel,
  })

  return (
    <BasicFilterContextIntlProvider>
      {({ placeholder, emptyMessage }) => (
        <CuiFilterContext<TModel>
          query={query}
          onChange={onChange}
          records={rows}
          schema={schema}
          filters={filters && excludeSchemalessFields({ filters, schema })}
          executeQuery={executeQuery}
          placeholder={placeholder}
          emptyMessage={emptyMessage}
          isLoading={isLoading}
          actions={actions}
          tools={tools}
          toolsLeft={toolsLeft}
        />
      )}
    </BasicFilterContextIntlProvider>
  )
}

export default BasicFilterContextImpl

function getDefaultSchemaFields<TModel>({
  schemaFields,
  schemaDefaultFields,
}: {
  schemaFields: Array<FieldDefinition<TModel>>
  schemaDefaultFields: string[]
}) {
  return schemaDefaultFields.filter(isSchemaField)

  function isSchemaField(defaultField: string): boolean {
    return schemaFields.some(matchesDefaultField)

    function matchesDefaultField(schemaField: FieldDefinition<TModel>): boolean {
      if (typeof schemaField === 'string') {
        return schemaField === defaultField
      }

      return schemaField.id === defaultField
    }
  }
}

function parseFieldDefinition<TModel>(
  field: FieldDefinition<TModel>,
): ParsedFieldDefinition<TModel> {
  if (typeof field === `string`) {
    return parseFieldDefinition({ id: field })
  }

  const { id, aliasOf, type = `string` } = field

  if (aliasOf === undefined) {
    // when no `aliasOf`, `id` must be `RowKey<TModel>`
    return { id, aliasOf: id as RowKey<TModel>, type }
  }

  return { id, aliasOf, type }
}

function parseSchemaFields<TModel>(fields: Array<FieldDefinition<TModel>>): FilterSchema['fields'] {
  const schema: FilterSchema['fields'] = {}

  for (const field of fields) {
    const definition = parseFieldDefinition<TModel>(field)

    const { id, type = `string` } = definition

    if (type === `boolean`) {
      schema[id] = {
        type: `string`,
        validate: validateHumanBool,
      }
    } else {
      schema[id] = {
        type,
      }
    }
  }

  return schema
}

function getQueryModelForSchema<TModel>(
  fields: Array<FieldDefinition<TModel>>,
): GetQueryModel<TModel> {
  return getQueryModel

  function getQueryModel(row: TModel) {
    const queryModel: QueryModel = {}

    for (const field of fields) {
      const definition = parseFieldDefinition<TModel>(field)
      const { id, aliasOf, type } = definition
      const value = row[aliasOf]

      queryModel[id] = type === `boolean` ? toHumanBool(value) : value
    }

    return queryModel
  }
}

function toHumanBool(value) {
  return value ? `y` : `n`
}

function validateHumanBool(value) {
  if (value !== `y` && value !== `n`) {
    throw new Error(`Expected "y" or "n"`)
  }
}
