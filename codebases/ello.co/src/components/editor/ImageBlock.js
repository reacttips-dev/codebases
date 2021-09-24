import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Block from './Block'
import ImageAsset from '../assets/ImageAsset'
import { ArrowIcon } from '../assets/Icons'
import { css } from '../../styles/jss'
import * as s from '../../styles/jso'

const busyWrapperStyle = css(
  s.absolute,
  s.flex,
  s.itemsCenter,
  s.justifyCenter,
  { backgroundColor: 'rgba(0, 0, 0, 0.5)', top: 0, right: -40, bottom: 0, left: -40 },
)

const arrowStyle = css(
  s.relative,
  s.colorA,
  s.bgcWhite,
  {
    padding: 4,
    borderRadius: '50%',
    transform: 'rotate(-90deg)',
  },
)

const Busy = () =>
  (<div className={busyWrapperStyle}>
    <div className={arrowStyle}>
      <ArrowIcon isAnimated />
    </div>
  </div>)

export default class ImageBlock extends Component {

  static propTypes = {
    blob: PropTypes.string,
    data: PropTypes.object,
    isUploading: PropTypes.bool,
  }

  static defaultProps = {
    blob: null,
    data: Immutable.Map(),
    isUploading: false,
  }

  onLoadSuccess = () => {
    const { data } = this.props
    URL.revokeObjectURL(data.get('src'))
  }

  render() {
    const { blob, data, isUploading } = this.props
    return (
      <Block {...this.props}>
        <div className={classNames('editable image', { isUploading })}>
          {isUploading && <Busy /> }
          <ImageAsset
            alt={data.get('alt')}
            onLoadSuccess={this.onLoadSuccess}
            src={blob || data.get('url')}
          />
        </div>
      </Block>
    )
  }
}

