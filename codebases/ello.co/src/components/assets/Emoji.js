import React from 'react'
import PropTypes from 'prop-types'
import { css } from '../../styles/jss'
import * as s from '../../styles/jso'
import * as ENV from '../../../env'

const baseStyle = css(s.inlineBlock)

const Emoji = (props) => {
  const { alt, name, size, src, title, width, height } = props
  const tip = name.replace(/_|-/, ' ')
  return (
    <img
      {...props}
      alt={alt || tip}
      className={baseStyle}
      src={src || `${ENV.AUTH_DOMAIN}/images/emoji/${name}.png`}
      title={title || tip}
      width={width || size}
      height={height || size}
      size={null}
      name={null}
    />
  )
}

Emoji.propTypes = {
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
  src: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}
Emoji.defaultProps = {
  alt: 'ello',
  name: 'ello',
  size: 20,
  src: null,
  title: 'ello',
  width: 20,
  height: 20,
}

export default Emoji

