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
import Markdown, { Options } from 'markdown-it'

import './cuiMarkdown.scss'

interface Props {
  source: string
  options: Options
}

type State = {
  options: Options
  md: Markdown
}

const defaultMarkdownOptions: Options = {
  html: false, // disable HTML tags in source
  linkify: true, // autoconvert URL-like text to links
}

export class CuiMarkdown extends Component<Props, State> {
  state: State = getDerivedStateFromOptions(this.props.options)

  static defaultProps: Partial<Props> = {
    options: defaultMarkdownOptions,
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    const { options } = nextProps

    if (options !== prevState.options) {
      return getDerivedStateFromOptions(options)
    }

    return null
  }

  render() {
    const { source = `` } = this.props
    const { md } = this.state
    const compiledHtml = md.render(String(source))

    return (
      <div
        className='cuiMarkdown'
        dangerouslySetInnerHTML={{
          __html: compiledHtml,
        }}
      />
    )
  }
}

function getDerivedStateFromOptions(options: Options): State {
  return { options, md: new Markdown(options) }
}
