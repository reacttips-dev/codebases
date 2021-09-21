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

import React, { Component, ComponentType } from 'react'
import hoistStatics from 'hoist-non-react-statics'
import { get, isEqual } from 'lodash'

import { getDisplayName } from './getDisplayName'
import { allSettled } from './schedule/allSettled'

const getProps = (props, keys) => keys.map((key) => get(props, key))

const propsChangedForKeys = (keys) => (oldProps, newProps) =>
  !isEqual(getProps(oldProps, keys), getProps(newProps, keys))

type PollingConfig<Props> = {
  interval?: number
  onPoll: (() => Promise<any>) | Array<() => Promise<any>>
  pollImmediately?: ((prevProps: Props, nextProps: Props) => boolean) | Array<string | string[]>
  stopPolling?: boolean
}

export default function withPolling<Props = any>(
  WrappedComponent: ComponentType<Props>,
  getConfig: (props) => PollingConfig<Props>,
): ComponentType<Props> {
  class PollingComponent extends Component<Props> {
    static displayName: string

    private timeout: number | null = null

    private unmounted: boolean = false

    componentDidMount() {
      this.getData()
    }

    componentDidUpdate(prevProps: Props) {
      const { pollImmediately } = getConfig(this.props)

      if (!pollImmediately) {
        return
      }

      const shouldPollImmediately = Array.isArray(pollImmediately)
        ? propsChangedForKeys(pollImmediately)
        : pollImmediately

      if (shouldPollImmediately(prevProps, this.props)) {
        this.getData()
      }
    }

    componentWillUnmount() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      this.unmounted = true
    }

    render() {
      return <WrappedComponent {...this.props} />
    }

    getData = () => {
      const { onPoll } = getConfig(this.props)

      const pollPromise = Array.isArray(onPoll) ? allSettled(onPoll.map((fn) => fn())) : onPoll()

      return pollPromise.then(this.nextReq, this.nextReq)
    }

    nextReq = () => {
      const { interval = 60, stopPolling = false } = getConfig(this.props)

      if (this.timeout) {
        window.clearTimeout(this.timeout)
      }

      if (!stopPolling && !this.unmounted) {
        this.timeout = window.setTimeout(this.getData, interval * 1000)
      }
    }
  }

  PollingComponent.displayName = `withPolling(${getDisplayName(WrappedComponent)})`

  return hoistStatics(PollingComponent, WrappedComponent)
}
