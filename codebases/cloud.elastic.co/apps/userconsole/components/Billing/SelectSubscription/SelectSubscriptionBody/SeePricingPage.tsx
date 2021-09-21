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
import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiText } from '@elastic/eui'

import { CuiLink } from '../../../../../../cui'

import { pricingUrl } from '../../../../urls'

import { BillingSubscriptionLevel } from '../../../../../../types'

type Props = {
  level: BillingSubscriptionLevel
}

const SeePricingPage: FunctionComponent<Props> = ({ level }) => (
  <EuiText size='s'>
    <FormattedMessage
      id='update-subscription.see-pricing-page'
      defaultMessage='See our {pricingCalculator}'
      values={{
        pricingCalculator: (
          <Fragment>
            <br />
            <CuiLink target='_blank' to={pricingUrl({ level })}>
              <FormattedMessage
                id='update-subscription.see-pricing-calculator.link'
                defaultMessage='pricing calculator'
              />
            </CuiLink>
          </Fragment>
        ),
      }}
    />
  </EuiText>
)

export default SeePricingPage
