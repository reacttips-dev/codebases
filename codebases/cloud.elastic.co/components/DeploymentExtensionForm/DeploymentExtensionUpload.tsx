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

import { EuiSpacer, EuiFormLabel, EuiFilePicker } from '@elastic/eui'

import { Extension } from '../../lib/api/v1/types'

export type Props = {
  extensionType: Extension['extension_type']
  canEditPlugins: boolean
  canEditBundles: boolean
  onChange: (file: File) => void
}

const zipMimeTypes = [
  `application/zip`,
  `application/x-zip-compressed`,
  `application/x-compressed`,
  `multipart/x-zip`,
].join(`,`)

const DeploymentExtensionUpload: FunctionComponent<Props> = ({
  extensionType,
  canEditPlugins,
  canEditBundles,
  onChange,
}) => {
  const canEdit =
    (extensionType === `bundle` && canEditBundles) || (extensionType === `plugin` && canEditPlugins)

  if (!canEdit) {
    return null
  }

  return (
    <Fragment>
      <EuiFormLabel>
        {extensionType === `bundle` ? (
          <FormattedMessage
            id='deployment-extension-upload.bundle-file'
            defaultMessage='Bundle file'
          />
        ) : (
          <FormattedMessage
            id='deployment-extension-upload.plugin-file'
            defaultMessage='Plugin file'
          />
        )}
      </EuiFormLabel>

      <EuiSpacer size='xs' />

      <EuiFilePicker
        accept={zipMimeTypes}
        onChange={(files) => {
          if (files) {
            onChange(files[0])
          }
        }}
      />
    </Fragment>
  )
}

export default DeploymentExtensionUpload
