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

import { isEmpty } from 'lodash'

import React, { Component, Fragment, ReactNode, ReactElement } from 'react'

import { EuiSpacer, SearchFilterConfig } from '@elastic/eui'

import {
  getFilterQueryString,
  setFilterQueryString,
  ControlledFilterQuery,
  OnChangeParams as OnFilterChangeParams,
} from '../FilterContext'

import BasicFilterContextImpl from './BasicFilterContextImpl'

import { FieldDefinition } from './types'

export type Props<TModel = any> = {
  rows?: TModel[]
  children: (rows?: TModel[]) => ReactNode
  schemaFields: Array<FieldDefinition<TModel>>
  schemaDefaultFields?: string[]
  filters?: SearchFilterConfig[]
  isLoading?: boolean
  storageKey?: string
  actions?: ReactElement | null
  tools?: ReactNode[] | null
  toolsLeft?: ReactNode[] | null
}

type State<TModel = any> = {
  query: ControlledFilterQuery
  queryResults: TModel[]
}

export class CuiBasicFilterContext<TModel> extends Component<Props<TModel>, State<TModel>> {
  state: State<TModel> = {
    query: getFilterQueryString({ storageKey: this.props.storageKey }),
    queryResults: [],
  }

  render() {
    const {
      rows,
      isLoading,
      schemaFields,
      schemaDefaultFields,
      filters,
      actions,
      tools,
      toolsLeft,
    } = this.props

    const { query } = this.state

    return (
      <Fragment>
        <BasicFilterContextImpl<TModel>
          query={query}
          onChange={this.onChange}
          rows={rows}
          isLoading={isLoading}
          schemaFields={schemaFields}
          schemaDefaultFields={schemaDefaultFields}
          filters={filters}
          actions={actions}
          tools={tools}
          toolsLeft={toolsLeft}
        />

        {this.renderChildren()}
      </Fragment>
    )
  }

  renderChildren() {
    const { rows, children } = this.props
    const { queryResults } = this.state

    const loadedButNoMatches = rows && isEmpty(queryResults)

    if (loadedButNoMatches) {
      return null
    }

    return (
      <Fragment>
        <EuiSpacer size='l' />

        {children(queryResults)}
      </Fragment>
    )
  }

  onChange = ({ queryText, queryResults }: OnFilterChangeParams<TModel>) => {
    const { storageKey } = this.props

    this.setState({
      query: queryText,
      queryResults,
    })

    setFilterQueryString({ storageKey, queryText })
  }
}
