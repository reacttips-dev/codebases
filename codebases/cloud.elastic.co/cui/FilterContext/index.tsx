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

import React, { Component, Fragment, ReactNode, ReactElement } from 'react'

import { flatMap, isEmpty, isEqual, isObject, mapKeys, mapValues } from 'lodash'

import { get, set } from 'local-storage'

import {
  EuiFilterGroup,
  EuiSearchBar,
  EuiSearchBarProps,
  EuiSpacer,
  SearchFilterConfig,
} from '@elastic/eui'

import FilterContextHelp from './FilterContextHelp'

import { CuiAlert } from '../Alert'

import PrivacySensitiveContainer from '../../components/PrivacySensitiveContainer'

import { getConfigForKey } from '../../store'

import { getQueryString, setQueryString } from '../lib/querystring'

import LocalStorageKey from '../../constants/localStorageKeys'

export type ObjectQuery = any | null
export type ControlledFilterQuery = string | null

type PersistedQueries = {
  [envSpecificKey: string]: ControlledFilterQuery
}

export type FilterSchemaField = {
  type: 'string' | 'number'
  validate?: (value: any) => void
}

export type FilterSchema = {
  strict?: boolean
  fields: {
    [field: string]: FilterSchemaField
  }
}

export type QueryModel = { [queryableField: string]: any }

export type OnChangeParams<TModel> = {
  query?: ObjectQuery
  queryText: ControlledFilterQuery
  queryResults: TModel[]
}

export type OnChange<TModel> = (params: OnChangeParams<TModel>) => void
export type ExecuteQuery<TModel> = (params: { query: ObjectQuery; records?: TModel[] }) => TModel[]

export type GetQueryModel<TModel> = (record: TModel) => QueryModel

type AliasMap = {
  [alias: string]: {
    aliasOf?: string
    booleanCast?: boolean
  }
}

export type Props<TModel = any> = {
  query: ControlledFilterQuery
  onChange: OnChange<TModel>
  isLoading?: boolean
  incremental: boolean
  disabled?: boolean
  readOnly?: boolean
  records?: TModel[]
  schema: FilterSchema
  filters?: SearchFilterConfig[]
  executeQuery: ExecuteQuery<TModel>
  placeholder?: string
  help?: ReactNode | null
  helpTitle?: string
  emptyMessage?: ReactNode | null
  actions?: ReactElement | null
  tools?: ReactNode[] | null
  toolsLeft?: ReactNode[] | null
}

type State<TModel = any> = {
  showHelp: boolean
  stickError: boolean
  error: any | null
  query: ObjectQuery
  queryResults: TModel[]
}

const { Query } = EuiSearchBar

const nullEsQuery = {}
const matchAllEsQuery = { match_all: {} }

export class CuiFilterContext<TModel> extends Component<Props<TModel>, State<TModel>> {
  static defaultProps: Partial<Props> = {
    executeQuery: createQueryExecutor(),
    incremental: true,
  }

  state: State<TModel> = {
    showHelp: false,
    stickError: false,
    error: null,
    query: null,
    queryResults: [],
  }

  static getDerivedStateFromProps<TModel>(
    nextProps: Props<TModel>,
    prevState: State<TModel>,
  ): Partial<State<TModel>> | null {
    const { records, schema, executeQuery, query: controlledQuery } = nextProps
    const { error: stateError, stickError } = prevState
    const { error: queryError, query } = parseQuery({ query: controlledQuery, schema })

    const stickyStateError = stickError ? stateError : null
    const error = stickyStateError || queryError

    if (error) {
      return {
        error,
      }
    }

    const queryResults = executeQuery({ query, records })

    return {
      stickError: false,
      error: null,
      query,
      queryResults,
    }
  }

  componentDidMount() {
    this.updateQueryResults()
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.records, this.props.records)) {
      this.updateQueryResults()
    }
  }

  render() {
    const { disabled, filters, incremental, isLoading, placeholder, readOnly, schema } = this.props

    const { query } = this.state

    return (
      <PrivacySensitiveContainer>
        <EuiSearchBar
          query={query}
          box={{
            disabled,
            incremental,
            isLoading,
            placeholder,
            readOnly,
            schema,
            'data-test-subj': `searchFilterContext`,
          }}
          filters={filters}
          onChange={this.onChange}
          toolsLeft={this.renderToolsLeft()}
          toolsRight={this.renderTools()}
        />

        {this.renderMessages()}
      </PrivacySensitiveContainer>
    )
  }

  renderToolsLeft(): EuiSearchBarProps['toolsLeft'] {
    const { toolsLeft } = this.props
    const filterTools = toolsLeft || []

    if (isEmpty(filterTools)) {
      return undefined
    }

    return <EuiFilterGroup>{filterTools}</EuiFilterGroup>
  }

  renderTools(): EuiSearchBarProps['toolsRight'] {
    const { tools, actions } = this.props
    const help = this.renderHelp()

    const filterTools = tools || []
    const filterItems = [...filterTools, help].filter(Boolean)

    const wrappedFilters = isEmpty(filterItems) ? null : (
      <EuiFilterGroup key='filters'>{filterItems}</EuiFilterGroup>
    )

    const wrappedActions = isEmpty(actions) ? null : <div key='actions'>{actions}</div>

    const toolbox: ReactElement[] = [wrappedFilters!, wrappedActions!].filter(Boolean)

    if (isEmpty(toolbox)) {
      return undefined
    }

    return toolbox
  }

  renderMessages() {
    const { records, emptyMessage } = this.props
    const { error, queryResults } = this.state

    const errorMessage = error && (
      <Fragment>
        <EuiSpacer size='l' />

        <CuiAlert type='warning'>{error}</CuiAlert>
      </Fragment>
    )

    const loadedButNoMatches = records && isEmpty(queryResults)

    if (loadedButNoMatches) {
      if (errorMessage) {
        return errorMessage
      }

      if (emptyMessage) {
        return (
          <Fragment>
            <EuiSpacer size='l' />

            <CuiAlert type='info'>{emptyMessage}</CuiAlert>
          </Fragment>
        )
      }
    }

    return <Fragment>{errorMessage}</Fragment>
  }

  renderHelp() {
    const { help, helpTitle } = this.props

    if (!help || !helpTitle) {
      return null
    }

    return <FilterContextHelp key='filter-context-help' help={help} helpTitle={helpTitle} />
  }

  onChange = ({ query, queryText, error }) => {
    const { records, onChange, executeQuery } = this.props
    const queryResults = executeQuery!({ query, records })

    this.setState({
      error: getErrorMessage(error),
      stickError: true,
    })

    if (error) {
      return
    }

    onChange({
      query,
      queryText,
      queryResults,
    })
  }

  updateQueryResults() {
    const { schema } = this.props
    const { error, query: stateQuery } = this.state

    const query = stateQuery || getNullQuery({ schema })
    const queryText = query.text

    this.onChange({
      error,
      query,
      queryText,
    })
  }
}

function getNullQuery({ schema }): ObjectQuery {
  const { query: nullQuery } = parseQuery({ query: ``, schema })
  return nullQuery
}

export function parseQuery({ query: input, schema }): {
  query: ObjectQuery
  error: string | null
} {
  const queryText = input instanceof Query ? input.text : input

  try {
    const query = Query.parse(queryText, { schema })
    return { query, error: null }
  } catch (schemaError) {
    try {
      // merely a schema validation error, or a query syntax error?
      const query = Query.parse(queryText)

      return { query, error: getErrorMessage(schemaError) }
    } catch (schemalessError) {
      return { query: null, error: getErrorMessage(schemalessError) }
    }
  }
}

function getErrorMessage(error): string | null {
  if (!error) {
    return null
  }

  if (typeof error === `string`) {
    return error
  }

  return error.message.replace(/`/g, `"`)
}

export function nullQueryExecutor<TModel = any>({ records }: { records?: TModel[] }): TModel[] {
  return records || []
}

export function createQueryExecutor<TModel = any>({
  getQueryModel = () => ({}),
  defaultFields = [],
}: {
  getQueryModel?: GetQueryModel<TModel>
  defaultFields?: string[]
} = {}) {
  return function executeQuery({
    query,
    records,
  }: {
    query: ObjectQuery
    records?: TModel[]
  }): TModel[] {
    if (!records) {
      return []
    }

    const recordsForQuery = records.map((record) => ({
      ...getQueryModel(record),
      _raw: record,
    }))

    try {
      const matches = Query.execute(query, recordsForQuery, {
        defaultFields,
      })

      const queryResults: TModel[] = matches.map((result) => result._raw)
      return queryResults
    } catch (err) {
      return []
    }
  }
}

export function isEmptyQuery(query: ObjectQuery): boolean {
  if (query === null || query === undefined) {
    return true
  }

  if (isEqual(query, nullEsQuery) || isEqual(query, matchAllEsQuery)) {
    return true
  }

  if (typeof query === `string`) {
    return query === ``
  }

  const isQueryObject = query instanceof Query

  if (isQueryObject) {
    return query.text === ``
  }

  const plainEmptyQuery = {
    match_all: {},
  }

  const matchesEmptyQuery = isEqual(query, plainEmptyQuery)

  return matchesEmptyQuery
}

export function getFieldValues({ query: input, schema, field }): any[] {
  const { query } = parseQuery({ query: input, schema })

  if (query === null) {
    return []
  }

  return query.ast._clauses.filter((clause) => clause.field === field).map((clause) => clause.value)
}

export function toggleFieldValue({ query: input, schema, field, value }) {
  const { query } = parseQuery({ query: input, schema })

  if (query === null) {
    return null
  }

  const values = getFieldValues({ query, schema, field })

  const isSelected = values.some((fieldValue) => isEqual(fieldValue, value))

  const updatedQuery = isSelected
    ? query.removeSimpleFieldValue(field, value)
    : query.addSimpleFieldValue(field, value)

  return updatedQuery
}

function getEnvSpecificStorageKey(storageKey?: string): string | undefined {
  if (!storageKey) {
    return
  }

  return `${getConfigForKey(`CLOUD_UI_APP`)}:${getConfigForKey(`CLOUD_UI_ENV`)}:${storageKey}`
}

export function getFilterQueryString({
  qsKey = `q`,
  storageKey,
}: {
  qsKey?: string
  storageKey?: string
} = {}) {
  const qs = getQueryString({ key: qsKey })

  if (!isEmpty(qs) || !storageKey) {
    return qs
  }

  // fall back to localStorage if possible, pull out the last filter
  const store = get<PersistedQueries>(LocalStorageKey.filterContextQueries)

  if (store === null) {
    return qs
  }

  const perEnvStorageKey = getEnvSpecificStorageKey(storageKey)

  if (!perEnvStorageKey || !(perEnvStorageKey in store)) {
    return qs
  }

  return store[perEnvStorageKey]
}

export function setFilterQueryString({
  qsKey = `q`,
  storageKey,
  queryText,
}: {
  qsKey?: string
  storageKey?: string
  queryText: ControlledFilterQuery
}) {
  if (storageKey !== null) {
    const store = get<PersistedQueries>(LocalStorageKey.filterContextQueries) || {}
    const perEnvStorageKey = getEnvSpecificStorageKey(storageKey)!
    store[perEnvStorageKey] = queryText
    set(LocalStorageKey.filterContextQueries, store)
  }

  return setQueryString({ key: qsKey, value: queryText })
}

export function getFilterEsQuery({ query: input, schema, strict = true }) {
  const { query, error } = parseQuery({ query: input, schema })

  if (error !== null && strict) {
    return null
  }

  if (query === null) {
    return null
  }

  return Query.toESQuery(query)
}

function defaultTransform(_path, node) {
  return node
}

function defaultTransformObject(node) {
  return node
}

export function transformFilterEsQuery({
  transform = defaultTransform,
  transformObject = defaultTransformObject,
  defaultFields = [],
}: {
  transform?: (path: string, node: any) => any
  transformObject?: (node: any) => any
  defaultFields?: string[]
}) {
  return function transformTree(node, path = ``) {
    if (node === null) {
      return node
    }

    if (Array.isArray(node)) {
      return node.map(transformValue)
    }

    if (isObject(node)) {
      const transformed = transformObject(node)

      const nodeValue = transformed !== undefined ? transformed : node

      return mapKeys(mapValues(nodeValue, transformValue), transformKey)
    }

    return transformNode()

    function transformKey(_value, key) {
      // TODO: <should_be_handled_by_eui>
      if (key === `simple_query_string`) {
        return `bool`
      }

      // </should_be_handled_by_eui>

      return transformTree(key, `${path}.$keys.${key}`)
    }

    function transformValue(value, key) {
      // TODO: <should_be_handled_by_eui>
      if (key === `simple_query_string`) {
        return transformTree(transformSimpleQuery(value), `${path}.${key}`)
      }

      // </should_be_handled_by_eui>

      return transformTree(value, `${path}.${key}`)
    }

    function transformNode() {
      const transformedNode = transform(path, node)

      if (transformedNode === undefined) {
        return node
      }

      return transformedNode
    }

    // TODO: <should_be_handled_by_eui>
    function transformSimpleQuery({ query }) {
      const fields = defaultFields.map(getEsField)

      return {
        should: flatMap(fields, (field) => [
          {
            match: {
              [field]: { query },
            },
          },
          {
            prefix: {
              [field]: { value: query },
            },
          },
        ]),
      }
    }

    function getEsField(field) {
      const transformedKey = transform(`$keys.${field}`, null)

      if (transformedKey === undefined || transformedKey === null) {
        return field
      }

      return transformedKey
    }

    // </should_be_handled_by_eui>
  }
}

/* Simple queries can be aliased with an alias mapping,
 * so that queries on the UI are succint while they're mapped to
 * the real underlying ES objects under the hood.
 * This functionality also understands that we prefer y|n for boolean queries,
 * while boolean fields are persisted in ES as `"true"` or `"false"`
 */
export function transformAliases(mapping: AliasMap, path: string, value: any) {
  const aliases = Object.keys(mapping)

  for (const alias of aliases) {
    const { aliasOf, booleanCast } = mapping[alias]

    if (aliasOf) {
      if (path.endsWith(`$keys.${alias}`)) {
        return aliasOf
      }
    }

    if (booleanCast) {
      if (path.endsWith(`match.${alias}.query`)) {
        return value === `y` ? `true` : `false`
      }
    }
  }
}

/* Removes filters for fields that don't exist in the schema declaration
 * This is useful so that when we remove an schema field based on the environment,
 * filter controls that rely on those inexistent schema fields are not rendered on the UI.
 */
export function excludeSchemalessFields({
  filters,
  schema,
}: {
  filters: SearchFilterConfig[]
  schema: FilterSchema
}): SearchFilterConfig[] {
  const schemaFields = Object.keys(schema.fields)
  const schemaBasedFilters = filters.filter(isSchemaField)

  for (const filter of schemaBasedFilters) {
    if (filter.type === 'field_value_selection') {
      if (Array.isArray(filter.options)) {
        filter.options = filter.options.filter(isSchemaField)
      }
    }
  }

  return schemaBasedFilters

  function isSchemaField(filter): boolean {
    const { field } = filter

    if (typeof field !== `string`) {
      return true
    }

    return schemaFields.includes(filter.field)
  }
}

/*
 * This function lets consumers of `<CuiFilterContext>` raise query changes from the outside.
 *
 * A badge click handler may call `executeReplacedQuery({ queryText: 'healthy', … })`,
 * triggering the behavior one would expect if the user typed `healthy` into `EuiSearchBar`.
 *
 * The signature is a little more convoluted than one would hope for, given
 * that both `executeQuery` and `schema` are configurable.
 *
 * See also: `toggleFieldValue` and `getFieldValues` for a way to properly tweak a query
 * without discarding existing clauses.
 */
export function executeReplacedQuery<TModel>({
  queryText,
  executeQuery = createQueryExecutor(),
  records,
  schema,
}: {
  records?: TModel[]
  schema: FilterSchema
  queryText: ControlledFilterQuery
  executeQuery?: ExecuteQuery<TModel>
}): OnChangeParams<TModel> {
  const { query } = parseQuery({ query: queryText, schema })
  const queryResults = executeQuery({ query, records })

  return { query, queryText, queryResults }
}
