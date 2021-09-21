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
import PropTypes, { ValidationMap } from 'prop-types'
import invariant from 'invariant'
import hoistStatics from 'hoist-non-react-statics'
import { constant, get } from 'lodash'
import shallowEqual from 'shallowequal'
import isPromise from 'is-promise'

type RescheduleCondition = string | string[]

const neverReschedule = constant(false)

/**
 * Higher-order component for scheduling actions. The schedule is controlled by the
 * app-wide `POLLING_INTERVAL` configuration key.
 *
 * @param {Component} WrappedComponent - the React component that will be rendered
 *     at scheduled intervals.
 *
 * @param {Function} getActions - a function that receives props and executes the
 *     appropriate actions for the schedule. Returns either nothing (void), null,
 *     or a Promise that resolves when the actions have completed.
 *
 * @param {Function|Array} shouldReschedule Determines whether the current schedule
 *     needs to be reset. If a function is passed then it is called with the
 *     current and new props, and must return true if the current schedule should
 *     be restarted. If an array is passed, then the values are used to identify
 *     specific prop values. These values will be compared between the current
 *     and new props. If they differ, the schedule will be restarted. The default is
 *     never to interrupt the schedule. For example, when the user is viewing cluster
 *     information and they switch to view a different cluster, the information must
 *     be updated immediately, not when the schedule next activates.
 *
 * @return {Component} a wrapped React component
 */
function schedule<Props = any>(
  WrappedComponent: ComponentType<Props>,
  getActions: (props: Props) => Promise<any> | null | void,
  shouldReschedule:
    | ((prevProps: Props, nextProps: Props) => boolean)
    | RescheduleCondition[] = neverReschedule,
): ComponentType<Props> {
  invariant(typeof getActions === `function`, `getActions must be a function`)
  invariant(
    typeof shouldReschedule === `function` || Array.isArray(shouldReschedule),
    `shouldReschedule must be either an array or a function`,
  )

  class Schedule extends Component<Props> {
    static displayName: string

    static contextTypes: ValidationMap<any>

    shouldReschedule: (props: Props, nextProps: Props) => boolean = Array.isArray(shouldReschedule)
      ? didSomePropChangeForKeys(shouldReschedule)
      : shouldReschedule

    cancelSchedule: () => void

    componentDidMount() {
      this.schedule(this.props)
    }

    componentDidUpdate(prevProps: Props) {
      if (this.shouldReschedule(prevProps, this.props)) {
        this.cancelSchedule()
        this.schedule(this.props)
      }
    }

    componentWillUnmount() {
      if (this.cancelSchedule) {
        this.cancelSchedule() // sanity
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }

    schedule(props) {
      const { register } = this.context.scheduler
      this.cancelSchedule = register(() => {
        const actionsToRegister = getActions(props)
        invariant(
          actionsToRegister == null || isPromise(actionsToRegister),
          `Actions must be a promise`,
        )
        return actionsToRegister
      })
    }
  }

  Schedule.displayName = `Schedule(${getDisplayName(WrappedComponent)})`
  Schedule.contextTypes = {
    scheduler: PropTypes.shape({
      register: PropTypes.func.isRequired,
    }).isRequired,
  }

  return hoistStatics(Schedule, WrappedComponent)
}

export default schedule

function getDisplayName(WrappedComponent: ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || `Component`
}

function getProps<Props>(props: Props, keys: RescheduleCondition[]) {
  return keys.map((key) => get(props, key))
}

function didSomePropChangeForKeys<Props>(keys: RescheduleCondition[]) {
  return (oldProps: Props, newProps: Props): boolean =>
    !shallowEqual(getProps(oldProps, keys), getProps(newProps, keys))
}
