import React from 'react'
import styled from 'styled-components'

const Img = styled.img`
  border-radius: 100%;
  display: inline-block;
  vertical-align: middle;
  object-fit: cover;
`

const Favicon = ({ name, src, width, height }) => (
  <Img
    src={src}
    onError={event => (event.target.src = '/favicon.ico')}
    alt={name}
    loading="lazy"
    width={width}
    height={height}
  />
)

Favicon.defaultProps = {
  width: '33px',
  height: '33px'
}

export default Favicon
