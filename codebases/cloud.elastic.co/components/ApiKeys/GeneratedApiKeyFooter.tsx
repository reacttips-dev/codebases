/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
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

import moment from 'moment'

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiButton, EuiButtonEmpty, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import messages from './messages'

import { ApiKeyResponse } from '../../lib/api/v1/types'

type Props = {
  apiKey: ApiKeyResponse
  onClose: () => void
}

const GeneratedApiKeyFooter: FunctionComponent<Props> = (props) => {
  const { onClose, apiKey } = props
  const { key, description } = apiKey
  const blob = new window.Blob([key!], {
    type: `text/csv;charset=utf-8`,
  })
  const fileName = description.replace(/ /g, '-')
  const blobUrl = window.URL.createObjectURL(blob)
  const timestamp = moment().format(`YYYY-MMM-DD--HH_mm_ss`)
  const blobName = `${fileName}-${timestamp}.csv`

  return (
    <div>
      <EuiFlexGroup gutterSize='m' alignItems='flexEnd' responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiButtonEmpty onClick={() => onClose()}>
            <FormattedMessage {...messages.generateKeyClose} />
          </EuiButtonEmpty>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiButton href={blobUrl} download={blobName} fill={true}>
            <FormattedMessage {...messages.downloadKey} />
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  )
}

export default GeneratedApiKeyFooter
