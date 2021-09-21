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
import { FormattedMessage, injectIntl, defineMessages, IntlShape } from 'react-intl'

import { CuiHelpTipIcon } from '../../cui'

type Props = {
  intl: IntlShape
  price: string
}

const messages = defineMessages({
  tieBreakerInfo: {
    id: `tiebreaker.tiebreaker-info`,
    defaultMessage: 'Tiebreaker info',
  },
  tieBreaker: {
    id: 'tiebreaker.tiebreaker-icon',
    defaultMessage:
      'We automatically include a single 1GB master tiebreaker node for your deployment, to help prevent a split-brain situation during master elections. This has a billing impact of {price} per hour.',
  },
})

const TiebreakerPopover: FunctionComponent<Props> = ({ intl: { formatMessage }, price }) => (
  <CuiHelpTipIcon
    aria-label={formatMessage(messages.tieBreakerInfo)}
    textSize='xs'
    textColor='subdued'
  >
    <FormattedMessage {...messages.tieBreaker} values={{ price }} />
  </CuiHelpTipIcon>
)

export default injectIntl(TiebreakerPopover)
