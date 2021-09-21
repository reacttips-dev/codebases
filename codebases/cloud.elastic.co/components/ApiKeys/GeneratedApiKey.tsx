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

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiCodeBlock, EuiFormLabel, EuiSpacer } from '@elastic/eui'

import { CuiAlert } from '../../cui'

import messages from './messages'

import { ApiKeyResponse } from '../../lib/api/v1/types'

type Props = {
  apiKey: ApiKeyResponse
}

const GeneratedApiKey: FunctionComponent<Props> = (props) => {
  const { apiKey } = props
  const { key } = apiKey

  return (
    <div className='apiKey-form'>
      <EuiFormLabel>
        <FormattedMessage {...messages.generatedApiKey} />
      </EuiFormLabel>

      <EuiSpacer size='xs' />

      <EuiCodeBlock paddingSize='s' className='apiKey-key' isCopyable={true}>
        {key}
      </EuiCodeBlock>

      <EuiSpacer size='m' />

      <CuiAlert type='warning' size='s'>
        <FormattedMessage {...messages.generatedApiKeyWarning} />
      </CuiAlert>
    </div>
  )
}

export default GeneratedApiKey
