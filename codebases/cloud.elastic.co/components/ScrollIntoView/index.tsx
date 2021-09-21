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

import React, { createRef, PureComponent } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import scrollIntoView from 'scroll-into-view-if-needed'

import { Location } from 'history'

export interface Props extends RouteComponentProps {
  whenLocationMatches?: (hash: string, location: Location) => boolean
}

export class ScrollIntoView extends PureComponent<Props> {
  private readonly viewRef = createRef<HTMLDivElement>()

  componentDidMount() {
    this.scrollIntoView()
  }

  render() {
    return <div ref={this.viewRef}>{this.props.children}</div>
  }

  scrollIntoView() {
    const { current } = this.viewRef

    if (!current) {
      return
    }

    if (!this.shouldScrollIntoView()) {
      return
    }

    scrollIntoView(current, {
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    })
  }

  shouldScrollIntoView() {
    const { location, whenLocationMatches = always } = this.props
    const hash = location.hash.slice(1)

    return whenLocationMatches(hash, location)
  }
}

export default withRouter(ScrollIntoView)

function always() {
  return true
}
