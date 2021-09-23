/* eslint-disable react/no-danger */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Block from './Block'

export function reloadPlayers() {
  if (window.embetter) {
    window.embetter.reloadPlayers()
  }
}

class EmbedBlock extends Component {

  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  componentDidMount() {
    reloadPlayers()
  }

  componentDidUpdate() {
    reloadPlayers()
  }

  render() {
    const dataJS = this.props.data.toJS()
    const { service, url, thumbnailLargeUrl, id } = dataJS
    const children = window.embetter.utils.playerHTML(
      window.embetter.services[service],
      url,
      thumbnailLargeUrl,
      id,
    )
    return (
      <Block {...this.props}>
        <div
          className="editable embed"
          dangerouslySetInnerHTML={{ __html: children }}
        />
      </Block>
    )
  }

}

export default EmbedBlock

