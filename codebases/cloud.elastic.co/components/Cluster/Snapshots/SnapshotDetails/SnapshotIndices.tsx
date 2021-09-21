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

import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiButton, EuiCode, EuiSpacer } from '@elastic/eui'

type Props = {
  indices: string[]
  limit?: number
}

type State = {
  showAll: boolean
}

class SnapshotIndices extends Component<Props, State> {
  state: State = {
    showAll: false,
  }

  render() {
    return (
      <div>
        {this.getIndices().map((index) => (
          <div key={index}>
            <EuiCode>{index}</EuiCode>
          </div>
        ))}

        {this.shouldLimit() && (
          <Fragment>
            <EuiSpacer size='m' />

            <EuiButton
              size='s'
              color='secondary'
              className='cluster-snapshot-indices-show-all'
              onClick={this.showAll}
            >
              <FormattedMessage
                id='snapshot-indices.show-all'
                defaultMessage='Show all { indices, number } indices'
                values={{
                  indices: this.props.indices.length,
                }}
              />
            </EuiButton>
          </Fragment>
        )}
      </div>
    )
  }

  showAll = () => {
    this.setState({
      showAll: true,
    })
  }

  shouldLimit() {
    const { indices, limit } = this.props

    return limit != null && indices.length > limit && !this.state.showAll
  }

  getIndices() {
    const indices = this.props.indices.slice().sort()
    return this.shouldLimit() ? indices.slice(0, this.props.limit) : indices
  }
}

export default SnapshotIndices
