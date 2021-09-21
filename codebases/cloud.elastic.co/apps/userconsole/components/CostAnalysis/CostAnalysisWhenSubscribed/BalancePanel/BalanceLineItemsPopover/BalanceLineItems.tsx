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
import { FormattedDate, FormattedMessage } from 'react-intl'

import {
  EuiDescriptionList,
  EuiDescriptionListDescription,
  EuiDescriptionListTitle,
  EuiText,
  EuiTextAlign,
  EuiTitle,
} from '@elastic/eui'

import { CuiRouterLinkButtonEmpty } from '../../../../../../../cui'

import ElasticConsumptionUnits from '../../../../formatters/ElasticConsumptionUnits'

import { longDate } from '../../../../../../../config/dates'
import { SimplifiedLineItem } from '../../../../../../../lib/api/v1/types'

interface Props {
  items: SimplifiedLineItem[]
}

const BalanceLineItems: FunctionComponent<Props> = ({ items }) => {
  const listItems = items.slice(0, 2)

  return (
    <div style={{ width: 300 }}>
      {listItems.map(({ ecu_balance, end }, index) => {
        const lineNumber = index + 1

        return (
          <EuiDescriptionList key={lineNumber} className='balance-line-items'>
            <EuiDescriptionListTitle>
              <EuiTitle size='xxs'>
                <h3>
                  <FormattedMessage
                    id='balance-line-item.title'
                    defaultMessage='Order line {lineNumber}'
                    values={{ lineNumber }}
                  />
                </h3>
              </EuiTitle>
            </EuiDescriptionListTitle>

            <EuiDescriptionListDescription>
              <EuiDescriptionList
                type='column'
                listItems={[
                  {
                    title: (
                      <EuiText size='s'>
                        <FormattedMessage
                          id='balance-line-item.remaining-balance'
                          defaultMessage='Remaining balance'
                        />
                      </EuiText>
                    ),
                    description: <ElasticConsumptionUnits unit='none' value={ecu_balance} />,
                  },
                  {
                    title: (
                      <EuiText size='s'>
                        <FormattedMessage
                          id='balance-line-item.expiration-date'
                          defaultMessage='Expiration date'
                        />
                      </EuiText>
                    ),
                    description: <FormattedDate value={end} {...longDate} />,
                  },
                ]}
              />
            </EuiDescriptionListDescription>
          </EuiDescriptionList>
        )
      })}

      {items.length > 2 && (
        <EuiTextAlign textAlign='right'>
          <CuiRouterLinkButtonEmpty to='/account/billing'>
            <FormattedMessage
              id='balance-line-items.show-all'
              defaultMessage='Show all order lines'
            />
          </CuiRouterLinkButtonEmpty>
        </EuiTextAlign>
      )}
    </div>
  )
}

export default BalanceLineItems
