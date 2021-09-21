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

import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiTitle } from '@elastic/eui'

import EsVersionSelectInput from './EsVersionSelectInput'
import { CuiInset } from '../../../cui'

import { VersionNumber } from '../../../types'

type Props = {
  id: string
  version: VersionNumber
  onUpdate: (version: VersionNumber) => void
  availableVersions: VersionNumber[]
}

export default function CreateEsVersion({ id, version, onUpdate, availableVersions }: Props) {
  return (
    <Fragment>
      <EuiTitle size='xs'>
        <h3>
          <FormattedMessage
            id='deployment-configure-es-version.elasticsearch-version'
            defaultMessage='Elasticsearch version'
          />
        </h3>
      </EuiTitle>
      <CuiInset>
        <EsVersionSelectInput
          id={id}
          version={version}
          onUpdate={onUpdate}
          availableVersions={availableVersions}
        />
      </CuiInset>
    </Fragment>
  )
}
