import React from 'react'
import { string } from 'prop-types'
import { DownloadStudio, DownloadCraft } from '@invisionapp/nux-tools-ui'

export default class DownloadTools extends React.PureComponent {
  render () {
    const { tool } = this.props

    if (tool === 'downloadCraft') {
      return <DownloadCraft />
    }

    return <DownloadStudio />
  }
}

DownloadTools.propTypes = {
  tool: string
}
