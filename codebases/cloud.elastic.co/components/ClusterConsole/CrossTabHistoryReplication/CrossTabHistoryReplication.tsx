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

import { Component } from 'react'
import { off, on } from 'local-storage'

import { ConsoleRequestState } from '../../../reducers/clusterConsole'

import LocalStorageKey from '../../../constants/localStorageKeys'

type Props = {
  setClusterConsoleRequestHistory: (history: ConsoleRequestState[]) => void
}

type NullableHistory = ConsoleRequestState[] | null

export default class CrossTabHistoryReplication extends Component<Props> {
  componentDidMount() {
    on<NullableHistory>(LocalStorageKey.clusterConsoleHistory, this.onChange)
  }

  componentWillUnmount() {
    off<NullableHistory>(LocalStorageKey.clusterConsoleHistory, this.onChange)
  }

  render() {
    return null
  }

  onChange = (currentHistory) => {
    this.props.setClusterConsoleRequestHistory(currentHistory)
  }
}
