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

import React, { Fragment, PureComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiSpacer, EuiTableHeaderCell, EuiText, EuiTitle } from '@elastic/eui'

import { CuiTable, CuiTableColumn } from '../../../../../cui'
import Header from './Header'
import ProviderAndRegionControl from '../../../../../components/Field/controls/ProviderAndRegionControl'

import { Price } from '../../../../../lib/api/v1/types'
import { StateProps, DispatchProps } from './types'

import './stackDeploymentPricingTable.scss'

interface Props extends StateProps, DispatchProps {}

class StackDeploymentPricingTable extends PureComponent<Props> {
  render(): ReactElement {
    const { fetchElasticSearchServicePricesRequest, query } = this.props
    const defaultProvider = query?.provider as string

    return (
      <div className='stack-deployment-pricing-table-page'>
        <Header />

        <EuiSpacer size='m' />

        {this.renderTitle()}

        <EuiSpacer size='l' />

        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <ProviderAndRegionControl
            disabled={fetchElasticSearchServicePricesRequest.inProgress}
            defaultProvider={defaultProvider}
            onSelect={this.onSelectProviderRegion}
          />
        </div>

        <EuiSpacer size='l' />

        {this.renderPriceListGrid()}
      </div>
    )
  }

  renderTitle(): ReactElement {
    return (
      <Fragment>
        <EuiTitle className='stack-deployment-pricing-table-title' size='m'>
          <h1>
            <FormattedMessage
              id='stack-deployment-pricing-table-page.title'
              defaultMessage='Deployment pricing table'
            />
          </h1>
        </EuiTitle>

        <EuiSpacer size='m' />

        <EuiText>
          <FormattedMessage
            id='stack-deployment-pricing-table-page.sub-title'
            defaultMessage='Check the hourly rates for your chosen Cloud provider and region.'
          />
        </EuiText>
      </Fragment>
    )
  }

  renderPriceListGrid(): ReactElement {
    const { elasticSearchServicePrices, fetchElasticSearchServicePricesRequest } = this.props
    const columns = this.getGridColumns()
    const isLoading =
      !elasticSearchServicePrices || fetchElasticSearchServicePricesRequest.inProgress

    return (
      <CuiTable
        getRowId={(item) => item.instance_type}
        rows={this.getGridRows()}
        columns={columns.items}
        initialSort={columns.initialSort}
        initialSortDirection='desc'
        initialLoading={isLoading}
      />
    )
  }

  getGridColumns(): { initialSort: CuiTableColumn<Price>; items: Array<CuiTableColumn<Price>> } {
    const productColumn = {
      label: (
        <FormattedMessage id='stack-deployment-pricing-table.product' defaultMessage='Product' />
      ),
      render: (item: Price) => item.instance_type,
    }
    const standardLabel = (
      <FormattedMessage id='stack-deployment-pricing-table.standard' defaultMessage='Standard' />
    )
    const goldLabel = (
      <FormattedMessage id='stack-deployment-pricing-table.gold' defaultMessage='Gold' />
    )
    const platinumLabel = (
      <FormattedMessage id='stack-deployment-pricing-table.platinum' defaultMessage='Platinum' />
    )
    const enterpriseLabel = (
      <FormattedMessage
        id='stack-deployment-pricing-table.enterprise'
        defaultMessage='Enterprise'
      />
    )
    return {
      initialSort: productColumn,
      items: [
        productColumn,
        {
          label: standardLabel,
          render: (item: Price) => item.standard,
          textOnly: false,
          align: 'right',
          header: {
            renderCell: () => (
              <EuiTableHeaderCell
                className='stack-deployment-pricing-table-standard-header-cell'
                width='15%'
                align='right'
                key='stack-deployment-pricing-table-standard-header-cell'
              >
                {standardLabel}
              </EuiTableHeaderCell>
            ),
          },
        },
        {
          label: goldLabel,
          render: (item: Price) => item.gold,
          textOnly: false,
          align: 'right',
          header: {
            renderCell: () => (
              <EuiTableHeaderCell
                className='stack-deployment-pricing-table-gold-header-cell'
                width='15%'
                align='right'
                key='stack-deployment-pricing-table-gold-header-cell'
              >
                {goldLabel}
              </EuiTableHeaderCell>
            ),
          },
        },
        {
          label: platinumLabel,
          render: (item: Price) => item.platinum,
          textOnly: false,
          align: 'right',
          className: 'stack-deployment-pricing-table-platinum-header-cell',
          header: {
            renderCell: () => (
              <EuiTableHeaderCell
                className='stack-deployment-pricing-table-platinum-header-cell'
                width='15%'
                align='right'
                key='stack-deployment-pricing-table-platinum-header-cell'
              >
                {platinumLabel}
              </EuiTableHeaderCell>
            ),
          },
        },
        {
          label: enterpriseLabel,
          render: (item: Price) => item.enterprise,
          textOnly: false,
          align: 'right',
          header: {
            renderCell: () => (
              <EuiTableHeaderCell
                className='stack-deployment-pricing-table-enterprise-header-cell'
                width='15%'
                align='right'
                key='stack-deployment-pricing-table-enterprise-header-cell'
              >
                {enterpriseLabel}
              </EuiTableHeaderCell>
            ),
          },
        },
        {
          label: (
            <FormattedMessage id='stack-deployment-pricing-table.unit' defaultMessage='Unit' />
          ),
          render: (item: Price) => item.unit,
          textOnly: false,
          width: `120px`,
        },
      ],
    }
  }

  getGridRows(): Price[] {
    const { elasticSearchServicePrices } = this.props

    if (!elasticSearchServicePrices) {
      return []
    }

    return elasticSearchServicePrices.values || []
  }

  onSelectProviderRegion = ({ region }: { region: string }): void => {
    const { fetchElasticSearchServicePrices, query } = this.props
    const isMarketplace = query ? query.is_marketplace === 'true' : false

    fetchElasticSearchServicePrices({ region, isMarketplace })
  }
}

export default StackDeploymentPricingTable
