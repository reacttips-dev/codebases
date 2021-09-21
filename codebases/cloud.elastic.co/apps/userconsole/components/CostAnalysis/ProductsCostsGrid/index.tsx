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

import React, { PureComponent, ReactElement, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiIcon,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui'

import { CuiTable, CuiTableColumn } from '../../../../../cui/Table'
import ClusterDateTime from '../ClusterDateTime'
import FormattedUnit from '../FormattedUnit'
import CostColumnName from '../CostColumnName'

import { getSliderIconType } from '../../../../../lib/sliders'
import { ItemsCosts, ItemCosts } from '../../../../../lib/api/v1/types'

import './productCostsGrid.scss'

interface Props {
  deploymentItemsCosts: ItemsCosts
  initialLoading: boolean
  showActivityPeriod?: boolean
}

class ProductsCostsGrid extends PureComponent<Props> {
  render(): ReactElement {
    const { initialLoading, deploymentItemsCosts } = this.props
    const rows = this.getGridRows()

    if (!initialLoading && rows && rows.length === 0) {
      return (
        <Fragment>
          <EuiEmptyPrompt
            title={this.renderTitle()}
            body={
              <FormattedMessage
                id='cost-analysis.deployment-items-cost-grid.empty-body'
                defaultMessage='Products breakdown will show up here'
              />
            }
          />
          <EuiSpacer size='xl' />
          <EuiHorizontalRule size='half' />
        </Fragment>
      )
    }

    return (
      <div className='deployment-items-cost-grid' data-test-id='deployment-items-cost-grid'>
        {this.renderTitle()}

        <EuiSpacer size='m' />

        <CuiTable<ItemCosts>
          getRowId={({ sku }, rowIndex) => `${sku}-${rowIndex.toString()}`}
          rows={rows}
          columns={this.getGridColumns()}
          hasFooterRow={true}
          initialLoading={!deploymentItemsCosts || initialLoading}
        />
      </div>
    )
  }

  renderTitle(): ReactElement {
    return (
      <EuiTitle size='xs'>
        <h4>
          <FormattedMessage
            id='cost-analysis.deployment-items-cost-grid.title'
            defaultMessage='Elastic Cloud products'
          />
        </h4>
      </EuiTitle>
    )
  }

  getGridRows(): ItemCosts[] {
    const { deploymentItemsCosts } = this.props

    if (!deploymentItemsCosts) {
      return []
    }

    return deploymentItemsCosts.resources
  }

  getGridColumns(): Array<CuiTableColumn<any>> {
    const { showActivityPeriod } = this.props
    const columns: Array<CuiTableColumn<any>> = [
      {
        id: 'deployment-items-cost-grid.product-name',
        label: (
          <FormattedMessage
            id='deployment-items-cost-grid.product-name'
            defaultMessage='Product name'
          />
        ),
        render: ({ kind, name }: ItemCosts) => (
          <EuiFlexGroup gutterSize='s' component='span'>
            <EuiFlexItem grow={false} component='span'>
              <EuiIcon type={getSliderIconType({ sliderInstanceType: kind })} />
            </EuiFlexItem>
            <EuiFlexItem component='span'>{name}</EuiFlexItem>
          </EuiFlexGroup>
        ),
        textOnly: false,
        className: 'deployment-items-cost-grid-product-name',
        footer: {
          render: () => (
            <FormattedMessage id='deployment-items-cost-grid.total' defaultMessage='Total' />
          ),
        },
      },
      {
        id: 'deployment-items-cost-grid.instances',
        label: (
          <FormattedMessage id='deployment-items-cost-grid.instances' defaultMessage='Instances' />
        ),
        render: ({ instance_count }: ItemCosts) => instance_count,
        align: 'right',
        width: '75px',
        footer: {
          render: () => null,
        },
      },
      {
        id: 'deployment-items-cost-grid.hours',
        label: <FormattedMessage id='deployment-items-cost-grid.hours' defaultMessage='Hours' />,
        render: ({ hours }: ItemCosts) => hours,
        align: 'right',
        width: '75px',
        footer: {
          render: () => null,
        },
      },
      {
        id: 'deployment-items-cost-grid.hourly-rate',
        label: (
          <CostColumnName>
            <FormattedMessage
              id='deployment-items-cost-grid.hourly-rate'
              defaultMessage='Hourly rate'
            />
          </CostColumnName>
        ),
        render: ({ price_per_hour }: ItemCosts) => (
          <FormattedUnit withSymbol={false} value={price_per_hour} dp={4} />
        ),
        align: 'right',
        width: '135px',
        footer: {
          render: () => null,
        },
      },
      {
        id: 'deployment-items-cost-grid.cost',
        label: (
          <CostColumnName>
            <FormattedMessage id='deployment-items-cost-grid.cost' defaultMessage='Cost' />
          </CostColumnName>
        ),
        render: ({ price }: ItemCosts) => <FormattedUnit withSymbol={false} value={price} dp={2} />,
        align: 'right',
        width: '140px',
        footer: {
          render: () => (
            <span data-test-id='deployment-items-cost-grid-total'>
              <FormattedUnit withSymbol={false} value={this.getResourcesCost()} dp={2} />
            </span>
          ),
        },
      },
    ]

    if (showActivityPeriod) {
      columns.splice(4, 0, {
        id: 'deployment-items-cost-grid.period-of-activity',
        label: (
          <FormattedMessage
            id='deployment-items-cost-grid.period-of-activity'
            defaultMessage='Period of activity'
          />
        ),
        render: (product: any) => {
          const { period } = product

          return (
            <EuiFlexGroup gutterSize='s' alignItems='center' component='span'>
              <EuiFlexItem grow={false} component='span'>
                <ClusterDateTime value={period.start} />
              </EuiFlexItem>
              <EuiFlexItem component='span'>-</EuiFlexItem>
              <EuiFlexItem grow={false} component='span'>
                <ClusterDateTime value={period.end} />
              </EuiFlexItem>
            </EuiFlexGroup>
          )
        },
        width: `35%`,
        footer: {
          render: () => null,
        },
      })
    }

    return columns
  }

  getResourcesCost(): number {
    const { deploymentItemsCosts } = this.props

    if (!deploymentItemsCosts) {
      return 0
    }

    // we use costs.resources here instead of costs.total because we
    // need the cost of the non-DTS usage.
    return deploymentItemsCosts.costs.resources
  }
}

export default ProductsCostsGrid
