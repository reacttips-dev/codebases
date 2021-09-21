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

import React, { Fragment, FunctionComponent } from 'react'
import { EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui'
import IconTip from '../../IconTip'

import { Info } from '../../../../../../types'

import './ratePanelInfo.scss'

interface Props {
  info: Info[]
}

const RatePanelInfo: FunctionComponent<Props> = ({ info }) => (
  <EuiFlexGroup
    gutterSize='xs'
    alignItems='center'
    responsive={false}
    className='cost-analysis-rate-panel-info'
  >
    {info.map((infoItem, index) => {
      const { tip } = infoItem

      return (
        <Fragment key={index}>
          {index > 0 && (
            <EuiFlexItem grow={false}>
              <EuiText color='subdued' size='s'>
                |
              </EuiText>
            </EuiFlexItem>
          )}

          <EuiFlexItem grow={false} className='cost-analysis-rate-panel-info-text-wrapper'>
            <EuiText
              color='subdued'
              size='s'
              data-test-id='cost-analysis-rate-panel-info-text'
              className='cost-analysis-rate-panel-info-text'
            >
              <span data-test-id='cost-analysis-rate-panel-info-text-price'>{infoItem.text}</span>
            </EuiText>
          </EuiFlexItem>

          {tip && (
            <EuiFlexItem data-test-id='cost-analysis-rate-panel-info-tips'>
              <IconTip
                title={tip.title}
                content={
                  <EuiText size='xs' color='subdued'>
                    {tip.content}
                  </EuiText>
                }
              />
            </EuiFlexItem>
          )}
        </Fragment>
      )
    })}
  </EuiFlexGroup>
)

export default RatePanelInfo
