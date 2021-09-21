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

import { once } from 'lodash'

import { runFullStory } from '../../lib/fullStorySnippet'

type Props = {
  isFullStoryEnabled: boolean
  fullStoryId: string
}

const runFullStoryOnce = once((id) => runFullStory(id))

class FullStoryTracking extends Component<Props> {
  componentDidMount() {
    this.setupFullStory()
  }

  render() {
    const { children } = this.props
    return children
  }

  setupFullStory() {
    const { isFullStoryEnabled, fullStoryId } = this.props

    if (!isFullStoryEnabled) {
      return
    }

    runFullStoryOnce(fullStoryId)
  }
}

export default FullStoryTracking
