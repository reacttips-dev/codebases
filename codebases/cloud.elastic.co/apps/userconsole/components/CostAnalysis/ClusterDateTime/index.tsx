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
import { FormattedDate } from 'react-intl'

interface Props {
  value?: string | number | Date
}

const ClusterDateTime: FunctionComponent<Props> = ({ value }) => (
  <FormattedDate
    value={value}
    year='numeric'
    month='short'
    day='numeric'
    hour='2-digit'
    minute='2-digit'
    timeZone='utc'
    timeZoneName='short'
  />
)

export default ClusterDateTime
