import React, { Component } from 'react'
import * as Utils from 'marketing-site/src/library/utils'

interface IProps {
  children: React.ReactNode
}

export class MediaProvider extends Component<IProps> {
  initContext = () => {
    if (typeof window !== 'undefined') {
      return Utils.initMediaContext()
    }
    return Utils.initServerSideMediaContext()
  }

  state = {
    initContext: this.initContext,
  }

  render() {
    const { children } = this.props
    return (
      <Utils.MediaContext.Provider value={this.state.initContext()}>
        {children}
      </Utils.MediaContext.Provider>
    )
  }
}
