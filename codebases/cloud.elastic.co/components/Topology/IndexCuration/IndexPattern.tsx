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
import { isEmpty } from 'lodash'

import { EuiFieldText } from '@elastic/eui'

import PrivacySensitiveContainer from '../../PrivacySensitiveContainer'

import { ClusterCurationSpec } from '../../../lib/api/v1/types'

type Props = {
  indexPattern: ClusterCurationSpec
  onChange: (spec: Partial<ClusterCurationSpec>) => void
}

const IndexPattern: FunctionComponent<Props> = ({ indexPattern, onChange }) => {
  const { index_pattern } = indexPattern

  return (
    <PrivacySensitiveContainer>
      <EuiFieldText
        value={index_pattern}
        isInvalid={isEmpty(index_pattern)}
        onChange={(e) => {
          const nextPattern = (e.target as HTMLInputElement).value
          onChange({ index_pattern: nextPattern })
        }}
      />
    </PrivacySensitiveContainer>
  )
}

export default IndexPattern
