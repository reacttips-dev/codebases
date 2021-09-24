import React from 'react'

import Section from './Section'

const Banner = ({ variant, ...props }) => (
  <Section {...props} py={variant === 'button' ? '21px' : 4} />
)

Banner.defaultProps = {
  ...Section.defaultProps,
  display: 'flex',
  flexWrap: ['wrap', 'nowrap'],
  alignItems: 'center',
  p: null,
  py: 4,
  px: 4
}

export default Banner
