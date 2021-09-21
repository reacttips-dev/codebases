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

import React, { Component, ReactChild } from 'react'
import { findLastIndex } from 'lodash'

import { EuiGlobalToastList, EuiGlobalToastListToast, IconType } from '@elastic/eui'

interface CuiToast extends Omit<EuiGlobalToastListToast, 'id'> {
  dataTestSubj?: string
  family?: string
  color: 'primary' | 'success' | 'warning' | 'danger'
  iconType: IconType
  title?: string
  text?: ReactChild
}

interface CuiToastWithId extends CuiToast {
  id: string
}

interface Props {}

interface State {
  toasts: CuiToastWithId[]
}

type AddToastHandler = (toast: CuiToast) => string
type RemoveToastHandler = (toastId: string) => void
type RemoveAllToastsHandler = () => void

const toastLifetime = 6000

let nextToastId = 0

let addToastHandler: AddToastHandler = addToastWarning
let removeToastHandler: RemoveToastHandler = removeToastWarning
let removeAllToastsHandler: RemoveAllToastsHandler = removeAllToastsWarning

export class CuiToasts extends Component<Props, State> {
  state: State = {
    toasts: [],
  }

  componentDidMount() {
    setToastHandling({
      addToast: this.addToast,
      removeToast: this.removeToast,
      removeAllToasts: this.removeAllToasts,
    })
  }

  componentWillUnmount() {
    setToastHandling()
  }

  render() {
    return (
      <EuiGlobalToastList
        toasts={this.getToasts()}
        dismissToast={(toast) => this.removeToast(toast.id)}
        toastLifeTimeMs={toastLifetime}
      />
    )
  }

  getToasts = () => {
    /* In order to avoid dilluted meaning and repetitive notifications,
     * we can categorize toasts under families.
     *
     * [1] Uncategorized toasts are always preserved.
     * [2] When toasts are grouped into a family,
     *     we preserve the most recent one in each family.
     */

    const { toasts } = this.state
    const lastIndices = {}

    return toasts.filter(({ family }, toastIndex) => {
      if (typeof family !== `string`) {
        // [1]
        return true
      }

      if (lastIndices[family] === undefined) {
        lastIndices[family] = findLastIndex(toasts, { family })
      }

      return toastIndex === lastIndices[family] // [2]
    })
  }

  addToast: AddToastHandler = (toast) => {
    const { toasts: oldToasts } = this.state
    const dataTestSubj = toast.dataTestSubj || toast.family || `cui-toast`

    const nextToast = {
      id: String(nextToastId++),
      'data-test-id': dataTestSubj,
      ...toast,
    }

    this.setState({ toasts: oldToasts.concat(nextToast) })

    return nextToast.id
  }

  removeToast: RemoveToastHandler = (toastId) => {
    this.setState((prevState) => ({
      toasts: prevState.toasts.filter((toast) => toast.id !== toastId),
    }))
  }

  removeAllToasts: RemoveAllToastsHandler = () => {
    this.setState({ toasts: [] })
  }
}

/*
 * exported because test cases where we don't care about toasts.
 * e.g.:
 * - toasts sometime fire in actions
 * - we might want to unit test actions.
 * no need to set up react and render toasts for that
 */
export function setToastHandling({
  addToast = addToastWarning,
  removeToast = removeToastWarning,
  removeAllToasts = removeAllToastsWarning,
}: {
  addToast?: AddToastHandler
  removeToast?: RemoveToastHandler
  removeAllToasts?: RemoveAllToastsHandler
} = {}) {
  addToastHandler = addToast
  removeToastHandler = removeToast
  removeAllToastsHandler = removeAllToasts
}

export function addToast(toast) {
  return addToastHandler(toast)
}

export function removeToast(toastId) {
  return removeToastHandler(toastId)
}

export function removeAllToasts() {
  return removeAllToastsHandler()
}

function addToastWarning(): string {
  throw new Error(`<CuiToasts /> is not mounted at this time.`)
}

function removeToastWarning() {
  throw new Error(`<CuiToasts /> is not mounted at this time.`)
}

function removeAllToastsWarning() {
  throw new Error(`<CuiToasts /> is not mounted at this time.`)
}
