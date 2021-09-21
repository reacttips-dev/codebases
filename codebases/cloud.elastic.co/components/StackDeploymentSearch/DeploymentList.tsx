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

import { sortBy } from 'lodash'

import {
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormHelpText,
  EuiPagination,
  EuiSpacer,
} from '@elastic/eui'

import DeploymentCard from './DeploymentCard'
import DeploymentsTable from './DeploymentsTable'

import { isEsStopped, getDisplayName, getDisplayId } from '../../lib/stackDeployments'

import { DeploymentSearchResponse } from '../../lib/api/v1/types'

import './deploymentList.scss'

type Props = {
  displayMode: 'grid' | 'table'
  deployments: DeploymentSearchResponse[]
  pageSize: number | null
  shownCount: number | null
  matchCount: number | null
}

type PageParams = {
  page: number
  currentPageSize: number
}

type State = {
  page: number
}

export default class DeploymentList extends Component<Props, State> {
  static defaultProps = {
    pageSize: 30, // 10 rows, with 3 cards each
  }

  state = {
    page: 0,
  }

  render() {
    return (
      <Fragment>
        {this.renderDeployments()}
        {this.renderPagination()}
      </Fragment>
    )
  }

  renderDeployments() {
    const { displayMode } = this.props

    if (displayMode === `table`) {
      return this.renderDeploymentTable()
    }

    return this.renderDeploymentGrid()
  }

  renderDeploymentTable() {
    const { rows } = this.getRows()

    return <DeploymentsTable deployments={rows} />
  }

  renderDeploymentGrid() {
    const { rows } = this.getRows()

    return (
      <EuiFlexGrid>
        {rows.map((deployment) => (
          <EuiFlexItem key={deployment.id} className='deploymentCard-wrapper'>
            <DeploymentCard deployment={deployment} />
          </EuiFlexItem>
        ))}
      </EuiFlexGrid>
    )
  }

  renderPagination() {
    const { shownCount, matchCount } = this.props

    const { rows, hasPagination, pageCount, page } = this.getRows()

    if ((shownCount === null || matchCount === null) && !hasPagination) {
      return null
    }

    return (
      <Fragment>
        <EuiSpacer size='m' />

        <EuiFlexGroup alignItems='center' justifyContent='spaceBetween'>
          <EuiFlexItem grow={false}>
            {shownCount !== null && matchCount !== null && (
              <EuiFormHelpText>
                {this.renderMatchSummary({ page, currentPageSize: rows.length })}
              </EuiFormHelpText>
            )}
          </EuiFlexItem>

          {hasPagination && (
            <EuiFlexItem grow={false}>
              <EuiPagination
                pageCount={pageCount}
                activePage={page}
                onPageClick={(nextPage) => this.setState({ page: nextPage })}
              />
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      </Fragment>
    )
  }

  renderMatchSummary({ page, currentPageSize }: PageParams) {
    const { shownCount: rowCount, matchCount: totalCount, pageSize } = this.props

    if (!pageSize || !rowCount || rowCount <= pageSize) {
      if (totalCount === rowCount) {
        return null
      }

      return (
        <span data-test-id='match-underflowed'>
          <FormattedMessage
            id='deployment-list.match-underflowed'
            defaultMessage='Showing { rowCount } matching {rowCount, plural, one {deployment} other {deployments}} out of a total of {totalCount} {totalCount, plural, one {deployment} other {deployments}}'
            values={{
              rowCount,
              totalCount,
            }}
          />
        </span>
      )
    }

    if (rowCount === totalCount) {
      return (
        <FormattedMessage
          id='deployment-list.page-match-full'
          defaultMessage='Showing page { page } with { currentPageSize } of { rowCount } {rowCount, plural, one {deployment} other {deployments}}'
          values={{
            page: page + 1,
            currentPageSize,
            rowCount,
          }}
        />
      )
    }

    return (
      <span data-test-id='match-overflowed'>
        <FormattedMessage
          id='deployment-list.page-match-overflowed'
          defaultMessage='Showing page { page } with { currentPageSize } of { rowCount } matches out of a total of {totalCount} {totalCount, plural, one {deployment} other {deployments}}'
          values={{
            page: page + 1,
            currentPageSize,
            rowCount,
            totalCount,
          }}
        />
      </span>
    )
  }

  getRows() {
    const { page: pageState } = this.state

    const { deployments, pageSize } = this.props

    const sortedDeployments = sortBy<DeploymentSearchResponse>(
      deployments,
      (deployment) => isEsStopped({ deployment }),
      (deployment) => getDisplayName({ deployment }),
      (deployment) => getDisplayId({ deployment }),
    )

    const rowCount = deployments.length

    if (pageSize === null || rowCount <= pageSize) {
      return {
        rows: sortedDeployments,
        hasPagination: false,
        pageCount: 1,
        page: 1,
      }
    }

    const pageCount = Math.ceil(rowCount / pageSize)
    const page = Math.min(pageState, pageCount - 1)
    const pageStart = page * pageSize
    const pageEnd = pageStart + pageSize

    const rows = sortedDeployments.slice(pageStart, pageEnd)

    return {
      rows,
      hasPagination: true,
      pageCount,
      page,
    }
  }
}
