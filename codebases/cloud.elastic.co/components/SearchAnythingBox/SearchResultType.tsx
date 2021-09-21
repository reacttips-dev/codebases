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
import { capitalize } from 'lodash'

import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiText } from '@elastic/eui'

import { getSliderPrettyName, getSliderIconType, isSliderInstanceType } from '../../lib/sliders'

import { RefinedSearchResult } from '../../types'

type Props = {
  searchResult: RefinedSearchResult
}

const SearchResultType: FunctionComponent<Props> = ({ searchResult: { kind } }) => (
  <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
    <EuiFlexItem grow={false}>
      <EuiText size='xs' color='subdued' data-test-id='search-result-type'>
        {prettifyName(kind)}
      </EuiText>
    </EuiFlexItem>

    <EuiFlexItem grow={false}>
      <EuiIcon type={getIconType(kind)} />
    </EuiFlexItem>
  </EuiFlexGroup>
)

function prettifyName(kind: RefinedSearchResult['kind']) {
  if (isSliderInstanceType(kind)) {
    return <FormattedMessage {...getSliderPrettyName({ sliderInstanceType: kind })} />
  }

  if (kind === `elasticsearch`) {
    return `Elasticsearch`
  }

  return capitalize(kind)
}

function getIconType(kind: RefinedSearchResult['kind']) {
  if (isSliderInstanceType(kind)) {
    return getSliderIconType({ sliderInstanceType: kind })
  }

  if (kind === `elasticsearch`) {
    return `logoElasticsearch`
  }

  return 'logoCloud'
}

export default SearchResultType
