import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { height, width, border, color, fontSize, variant } from 'styled-system'
import gradientAvatar from 'gradient-avatar'

import { transition } from '../../utils/style'

export const avatarStyle = variant({ key: 'avatarStyles', prop: 'variant' })

export const SIZE_PROPS = {
  small: {
    fontSize: 10,
    height: 22,
    width: 22
  },
  medium: {
    fontSize: 20,
    height: 34,
    width: 34
  },
  large: {
    fontSize: 30,
    height: 75,
    width: 75
  }
}

const Image = styled.img`
  background: white;
  display: inline-block;
  object-fit: cover;
  vertical-align: middle;
  ${transition('border-color')};
  ${avatarStyle}
  ${border}
  ${color}
  ${height}
  ${width}
}
`
Image.defaultProps = {
  variant: 'default',
  borderRadius: '50%',
  borderStyle: 'solid',
  borderWidth: '2px'
}

const Placeholder = styled(Image)`
  align-items: center;
  display: flex;
  ${fontSize}
`
Placeholder.defaultProps = {
  as: 'div'
}

const Avatar = ({ name, url, email, size, ...props }) => {
  const sizeProps = SIZE_PROPS[size]

  if (url) {
    return <Image alt={name} src={url} {...sizeProps} {...props} />
  } else {
    const uid = name || email || new Date()

    return (
      <Image
        alt={name}
        src={`data:image/svg+xml;base64,${btoa(gradientAvatar(uid))}`}
        {...sizeProps}
        {...props}
      />
    )
  }
}

Avatar.propTypes = {
  size: PropTypes.oneOf(Object.keys(SIZE_PROPS)),
  name: PropTypes.string.isRequired,
  email: PropTypes.string
}

Avatar.defaultProps = {
  name: '',
  variant: 'default',
  size: 'medium'
}

export default Avatar
