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

import { FunctionComponent, ReactElement } from 'react'
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'

type Props = WrappedComponentProps & {
  children: (props: { placeholder: string; emptyMessage: string }) => ReactElement
}

const messages = defineMessages({
  searchBarPlaceholder: {
    id: `basic-filter-context.placeholder`,
    defaultMessage: `Search`,
  },
  emptyMessage: {
    id: `basic-filter-context.no-matches`,
    defaultMessage: `No records match your query`,
  },
})

const BasicFilterContextIntlProvider: FunctionComponent<Props> = ({ intl, children }) => {
  const { formatMessage } = intl
  const placeholder = formatMessage(messages.searchBarPlaceholder)
  const emptyMessage = formatMessage(messages.emptyMessage)

  return children({ placeholder, emptyMessage })
}

export default injectIntl(BasicFilterContextIntlProvider)
