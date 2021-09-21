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

import React from 'react'

import { CuiCodeBlock } from '../../../cui'

import linkify from '../../../lib/linkify'
import stringify from '../../../lib/stringify'
import { DeprecationsResponse } from '../../../types/deprecations'

// Prevent the <CuiAlert> underneath opening or closing when the API response is clicked.
const stopPropagation = (e: React.FormEvent<HTMLElement>) => e.stopPropagation()

const DeprecationDetails = ({ data, ...rest }: { data: DeprecationsResponse }) => (
  <CuiCodeBlock
    overflowHeight={300}
    className='deprecation-details'
    onClick={stopPropagation}
    {...rest}
  >
    {linkify(stringify(data))}
  </CuiCodeBlock>
)

export default DeprecationDetails
