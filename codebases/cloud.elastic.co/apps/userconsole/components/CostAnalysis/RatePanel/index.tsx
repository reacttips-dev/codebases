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

import React, { PureComponent, Fragment, ReactElement } from 'react'
import {
  EuiDescriptionList,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import RatePanelInfo from './RatePanelInfo'
import FormattedUnit from '../FormattedUnit'
import IconTip from '../IconTip'

import { Info } from '../../../../../types'

import './ratePanel.scss'

export interface Rate {
  name: React.ReactChild
  description?: React.ReactChild
  rate?: number
}

export interface Props {
  description: Info
  info?: Info[]
  rate?: number
  rates?: Rate[]
  color?: 'default' | 'secondary'
  dp?: number
}

class RatePanel extends PureComponent<Props> {
  render(): ReactElement {
    const { rates } = this.props

    if (rates instanceof Array) {
      return (
        <EuiPanel paddingSize='m' className='cost-analysis-rate-panel'>
          {this.renderItemisedRateInfo()}
        </EuiPanel>
      )
    }

    return (
      <EuiPanel paddingSize='m' className='cost-analysis-rate-panel'>
        {this.renderBasicRateInfo()}
      </EuiPanel>
    )
  }

  renderPanelDescription(): ReactElement {
    const { description } = this.props
    const { tip } = description

    return (
      <EuiText>
        <EuiFlexGroup gutterSize='xs' alignItems='center' responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiText size='s' data-test-id='cost-analysis-rate-panel-description'>
              <strong>{description.text}</strong>
            </EuiText>
          </EuiFlexItem>

          {tip && (
            <EuiFlexItem grow={false} data-test-id='cost-analysis-rate-panel-description-tip'>
              <IconTip
                title={tip.title}
                content={
                  <EuiText size='xs' color='subdued'>
                    <strong>{tip.content}</strong>
                  </EuiText>
                }
              />
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      </EuiText>
    )
  }

  renderBasicRateInfo(): ReactElement | null {
    const { dp = 2, info, rate } = this.props

    if (!info || typeof rate === 'undefined') {
      return null
    }

    return (
      <Fragment>
        {this.renderPanelDescription()}

        <EuiSpacer size='m' />

        {rate !== null && (
          <EuiTitle size='m'>
            <h3>
              <span data-test-id='cost-analysis-rate-panel-price'>
                <FormattedUnit value={rate} dp={dp} />
              </span>
            </h3>
          </EuiTitle>
        )}

        <EuiSpacer size='m' />

        <RatePanelInfo info={info} />
      </Fragment>
    )
  }

  renderItemisedRateInfo(): ReactElement {
    const { description, dp, rate, rates } = this.props

    return (
      <Fragment>
        {rate ? (
          <EuiDescriptionList
            type='column'
            listItems={[
              {
                title: <strong>{description.text}</strong>,
                description: (
                  <strong data-test-id='cost-analysis-rate-panel-summary-total'>
                    <FormattedUnit value={rate} dp={dp} />
                  </strong>
                ),
              },
            ]}
            className='cost-analysis-rate-panel-summary'
          />
        ) : (
          <strong>{description.text}</strong>
        )}

        <EuiHorizontalRule margin='s' />

        <EuiSpacer size='m' />

        <EuiDescriptionList
          type='column'
          listItems={rates!.map((item) => ({
            title: item.name,
            description: item.description ? (
              item.description
            ) : (
              <FormattedUnit value={item.rate!} dp={dp} />
            ),
          }))}
          data-test-id='cost-analysis-rate-panel-summary'
          className='cost-analysis-rate-panel-summary'
        />
      </Fragment>
    )
  }
}

export default RatePanel
