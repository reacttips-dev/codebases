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
import { debounce } from 'lodash'

import { EuiFieldText } from '@elastic/eui'

interface Props {
  debounceTimeout?: number
  value: string
  onChange: (value: string) => any
  ['data-test-id']?: string
  [attribute: string]: any
}

interface State {
  value: string
}

export class DebouncedInput extends Component<Props, State> {
  state: State = {
    value: this.props.value,
  }

  constructor(props) {
    super(props)
    this.sendTextChange = debounce(this.sendTextChange, this.props.debounceTimeout || 100)
  }

  render() {
    const {
      /* eslint-disable no-unused-vars,@typescript-eslint/no-unused-vars */
      onChange,
      value,
      debounceTimeout,
      ['data-test-id']: dataTestId,
      /* eslint-enable no-unused-vars,@typescript-eslint/no-unused-vars */
      ...rest
    } = this.props

    return (
      <div data-test-id={dataTestId}>
        <EuiFieldText onChange={this.handleTextChange} value={this.state.value} {...rest} />
      </div>
    )
  }

  handleTextChange = (e) => {
    this.setState({ value: e.target.value })
    this.sendTextChange(e.target.value)
  }

  sendTextChange = (text) => this.props.onChange(text)
}

export default DebouncedInput
