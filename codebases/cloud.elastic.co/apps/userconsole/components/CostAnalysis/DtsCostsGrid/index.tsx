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

import React, { PureComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiEmptyPrompt, EuiSpacer, EuiTitle } from '@elastic/eui'

import { CuiTable, CuiTableColumn } from '../../../../../cui/Table'
import FormattedUnit from '../FormattedUnit'
import CostColumnName from '../CostColumnName'

import { AsyncRequestState } from '../../../../../types'
import { DtsDimensionCosts, ItemsCosts } from '../../../../../lib/api/v1/types'

interface Props {
  deploymentItemsCosts: ItemsCosts
  fetchRequest: AsyncRequestState
}

class DtsCostsGrid extends PureComponent<Props> {
  render(): ReactElement {
    const { fetchRequest, deploymentItemsCosts } = this.props

    const rows = this.getGridRows()

    if (!fetchRequest.inProgress && rows && rows.length === 0) {
      return (
        <EuiEmptyPrompt
          title={this.renderTitle()}
          body={
            <FormattedMessage
              id='cost-analysis.dts-grid.empty-body'
              defaultMessage='Breakdown of data transfer costs will be here.'
            />
          }
        />
      )
    }

    return (
      <div className='dts-grid' data-test-id='cost-analysis-dts-grid'>
        {this.renderTitle()}

        <EuiSpacer size='m' />

        <CuiTable<DtsDimensionCosts>
          getRowId={({ sku }, rowIndex) => `${sku}-${rowIndex.toString()}`}
          rows={rows}
          columns={this.getGridColumns()}
          hasFooterRow={true}
          initialLoading={!deploymentItemsCosts || fetchRequest.inProgress}
        />
      </div>
    )
  }

  renderTitle(): ReactElement {
    return (
      <EuiTitle size='xs'>
        <h4>
          <FormattedMessage
            id='cost-analysis.dts-grid.title'
            defaultMessage='Data transfer and storage'
          />
        </h4>
      </EuiTitle>
    )
  }

  getGridRows(): DtsDimensionCosts[] | [] {
    const { deploymentItemsCosts } = this.props

    if (!deploymentItemsCosts) {
      return []
    }

    return deploymentItemsCosts.data_transfer_and_storage
  }

  getGridColumns(): Array<CuiTableColumn<any>> {
    return [
      {
        id: 'dts-grid.charge-concept',
        label: <FormattedMessage id='dts-grid.charge-concept' defaultMessage='Charge' />,
        render: ({ name }: DtsDimensionCosts) => name,
        footer: {
          render: () => <FormattedMessage id='dts-grid.total' defaultMessage='Total' />,
        },
      },
      {
        id: 'dts-grid.quantity',
        label: <FormattedMessage id='dts-grid.quantity' defaultMessage='Quantity' />,
        render: ({ quantity: { formatted_value } }: DtsDimensionCosts) => formatted_value,
        width: '20%',
        footer: {
          render: () => null,
        },
      },
      {
        id: 'dts-grid.rate',
        label: <FormattedMessage id='dts-grid.rate' defaultMessage='Rate' />,
        render: ({ rate: { formatted_value } }: DtsDimensionCosts) => formatted_value,
        width: '20%',
        footer: {
          render: () => null,
        },
      },
      {
        id: 'dts-grid.cost',
        label: (
          <CostColumnName>
            <FormattedMessage id='dts-grid.cost' defaultMessage='Cost' />
          </CostColumnName>
        ),
        render: ({ cost }: DtsDimensionCosts) => (
          <FormattedUnit withSymbol={false} value={cost} dp={2} />
        ),
        width: '140px',
        align: 'right',
        footer: {
          render: () => (
            <span data-test-id='cost-analysis-dts-grid-total'>
              <FormattedUnit withSymbol={false} value={this.getTotalCost()} dp={2} />
            </span>
          ),
        },
      },
    ]
  }

  getTotalCost(): number {
    const { deploymentItemsCosts } = this.props

    if (!deploymentItemsCosts) {
      return 0
    }

    return deploymentItemsCosts.costs.data_transfer_and_storage
  }
}

export default DtsCostsGrid
