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

import { getTitleParts } from './lib/highlighting'

import sanitizeHtml from '../../lib/sanitizeHtml'

import { RefinedSearchResult } from '../../types'

type Props = {
  searchResult: RefinedSearchResult
}

const SearchResultName: FunctionComponent<Props> = ({ searchResult }) => {
  const { title, subtitle } = getTitleParts(searchResult)
  const sanitizedTitle = sanitizeHtml(title)

  return (
    <div data-test-id='search-result-description'>
      {sanitizedTitle} {subtitle}
    </div>
  )
}

export default SearchResultName
