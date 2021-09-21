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

import { isEmpty } from 'lodash'
import React, { Fragment, FunctionComponent } from 'react'

import { EuiFormHelpText } from '@elastic/eui'

import { hasHighlightedTitle } from './lib/highlighting'

import sanitizeHtml from '../../lib/sanitizeHtml'

import { RefinedSearchResult } from '../../types'

type Props = {
  searchResult: RefinedSearchResult
}

const SearchResultHighlights: FunctionComponent<Props> = ({ searchResult }) => {
  const { highlighting } = searchResult

  if (isEmpty(highlighting)) {
    return null
  }

  if (hasHighlightedTitle(searchResult)) {
    return null
  }

  return (
    <Fragment>
      {Object.keys(highlighting).map((field) => (
        <EuiFormHelpText key={field} className='searchResult-highlights'>
          <span>{field}</span>

          {`: `}

          <span>{sanitizeHtml(highlighting[field].join(` `))}</span>
        </EuiFormHelpText>
      ))}
    </Fragment>
  )
}

export default SearchResultHighlights
