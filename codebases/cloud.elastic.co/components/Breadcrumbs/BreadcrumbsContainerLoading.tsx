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

import React, { Component, Ref } from 'react'

import { EuiLoadingContent } from '@elastic/eui'

import { withSmallErrorBoundary } from '../../cui'

import BreadcrumbsImpl from './BreadcrumbsImpl'
import BreadcrumbsWrapper from './BreadcrumbsWrapper'

const SAD_TIMEOUT = 8000

type Props = {
  containerRef: Ref<HTMLDivElement> | null
}

type State = {
  sadTimeout: boolean
}

class BreadcrumbsContainerLoading extends Component<Props, State> {
  state: State = {
    sadTimeout: false,
  }

  _mounted: boolean = false

  _sadTimer: number | null = null

  componentDidMount() {
    this._sadTimer = window.setTimeout(this._sadTimeoutCallback, SAD_TIMEOUT)
    this._mounted = true
  }

  componentWillUnmount() {
    if (this._sadTimer) {
      window.clearTimeout(this._sadTimer)
      this._sadTimer = null
    }

    this._mounted = false
  }

  render() {
    const { sadTimeout } = this.state

    if (sadTimeout) {
      // something went wrong, at least render breadcrumbs for the application root
      return <BreadcrumbsImpl linkAll={true} />
    }

    return (
      <BreadcrumbsWrapper>
        <div className='header-breadcrumbs-loading'>
          <EuiLoadingContent lines={1} />
        </div>
      </BreadcrumbsWrapper>
    )
  }

  _sadTimeoutCallback = () => {
    if (!this._mounted) {
      return // can't set state, component unmounted gracefully
    }

    const containerRefEl = this.getContainerRefEl()

    if (!containerRefEl) {
      return // can't set state, no container element ref
    }

    this.circuitbreakLoadingIndicator(containerRefEl)
  }

  circuitbreakLoadingIndicator(container: HTMLDivElement | null) {
    if (!container) {
      return // sanity
    }

    if (!container.querySelector('.header-breadcrumbs-loading')) {
      /*
       * Shouldn't change state: most likely `<ContentResetPortal>` has removed this loading indicator
       * (without going through a normal React flow).
       * Attempts to set state will cause DOM errors.
       */
      return
    }

    this.setState({ sadTimeout: true })
  }

  getContainerRefEl(): HTMLDivElement | null {
    const { containerRef } = this.props

    if (!containerRef) {
      return null
    }

    if (typeof containerRef === 'function') {
      return null // sanity, shouldn't happen
    }

    if (containerRef.current) {
      return containerRef.current
    }

    return null
  }
}

export default withSmallErrorBoundary(BreadcrumbsContainerLoading)
