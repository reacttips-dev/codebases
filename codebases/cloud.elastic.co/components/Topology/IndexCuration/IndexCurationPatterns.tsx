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

import React, { Component } from 'react'
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import { EuiButtonIcon } from '@elastic/eui'

import { CuiTable } from '../../../cui'

import { ClusterCurationSpec } from '../../../lib/api/v1/types'

import IndexPattern from './IndexPattern'
import IndexPatternHalflife from './IndexPatternHalflife'

const messages = defineMessages({
  indexPatternLabel: {
    id: `index-curation-settings.index-pattern-label`,
    defaultMessage: `Index pattern`,
  },
  moveIndicesLabel: {
    id: `index-curation-settings.move-indices-label`,
    defaultMessage: `Move indices to warm node after`,
  },
  actionsLabel: {
    id: `index-curation-settings.actions-label`,
    defaultMessage: `Actions`,
  },
  removePatternIcon: {
    id: `index-curation-settings.remove-index-pattern`,
    defaultMessage: `Remove this index pattern`,
  },
})

interface Props extends WrappedComponentProps {
  indexPatterns: ClusterCurationSpec[]
  setIndexPatterns: (specs: ClusterCurationSpec[]) => void
}

class IndexCurationPatterns extends Component<Props> {
  render() {
    const {
      intl: { formatMessage },
      indexPatterns,
    } = this.props

    const columns = [
      {
        label: <FormattedMessage {...messages.indexPatternLabel} />,
        render: (indexPattern) => (
          <IndexPattern indexPattern={indexPattern} onChange={this.onChange(indexPattern)} />
        ),
        sortKey: `index_pattern`,
      },
      {
        label: <FormattedMessage {...messages.moveIndicesLabel} />,
        render: (indexPattern) => (
          <IndexPatternHalflife
            indexPattern={indexPattern}
            onChange={this.onChange(indexPattern)}
          />
        ),
        sortKey: `trigger_interval_seconds`,
      },
      {
        mobile: {
          label: <FormattedMessage {...messages.actionsLabel} />,
        },
        width: `40px`,
        render: (indexPattern) => (
          <EuiButtonIcon
            onClick={() => {
              this.onRemove(indexPattern)
            }}
            iconType='cross'
            aria-label={formatMessage(messages.removePatternIcon)}
          />
        ),
      },
    ]

    return (
      <CuiTable rows={indexPatterns} columns={columns} getRowId={(_, index) => String(index)} />
    )
  }

  onChange = (indexPattern) => (changes) => {
    const { indexPatterns, setIndexPatterns } = this.props
    const newIndexPatterns = indexPatterns.concat()
    const index = indexPatterns.indexOf(indexPattern)
    newIndexPatterns[index] = { ...indexPattern, ...changes }
    setIndexPatterns(newIndexPatterns)
  }

  onRemove = (indexPattern) => {
    const { indexPatterns, setIndexPatterns } = this.props
    const newIndexPatterns = indexPatterns.concat()
    const index = indexPatterns.indexOf(indexPattern)
    newIndexPatterns.splice(index, 1)
    setIndexPatterns(newIndexPatterns)
  }
}

export default injectIntl(IndexCurationPatterns)
