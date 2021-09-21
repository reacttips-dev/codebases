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
import { EuiFilterButton, EuiIcon, EuiToolTip } from '@elastic/eui'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'

interface Props extends WrappedComponentProps {
  data: any // can be anything that can be converted to json
  fileName: string
}

const messages = defineMessages({
  download: {
    id: `json-blob-download-button.explanation`,
    defaultMessage: `Download the content of this page as a JSON file for debugging purposes.`,
  },
})

function CuiJsonBlobDownloadButton({ intl, data, fileName }: Props) {
  const { formatMessage } = intl
  const dataAsJson = JSON.stringify(data, null, 2)
  const blob = new window.Blob([dataAsJson], {
    type: `application/json;charset=utf-8`,
  })

  const blobUrl = window.URL.createObjectURL(blob)

  return (
    <EuiFilterButton style={{ width: `40px` }} download={fileName} href={blobUrl}>
      <EuiToolTip content={formatMessage(messages.download)}>
        <EuiIcon type='importAction' />
      </EuiToolTip>
    </EuiFilterButton>
  )
}

const CuiJsonBlobDownloadButtonWithIntl = injectIntl(CuiJsonBlobDownloadButton)

export { CuiJsonBlobDownloadButtonWithIntl as CuiJsonBlobDownloadButton }
