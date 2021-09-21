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

import { EuiEmptyPrompt, EuiText } from '@elastic/eui'

const DefaultEmptyTableMessage: FunctionComponent = () => (
  <EuiEmptyPrompt
    title={
      <h3>
        <FormattedMessage id='cui-table.no-items' defaultMessage='No items' />
      </h3>
    }
    titleSize='xs'
    body={
      <EuiText>
        <p>
          <FormattedMessage
            id='cui-table.looks-like-no-items'
            defaultMessage="Looks like there aren't any items."
          />
        </p>
      </EuiText>
    }
  />
)

export default DefaultEmptyTableMessage
