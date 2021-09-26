import React from 'react'

import StyledIcon from './'

const Resend = ({ height, width, color, ...props }) => (
  <StyledIcon color={color} height={height} width={width} {...props}>
    <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.725 4.391a4.453 4.453 0 014.651.621 4.393 4.393 0 011.375 2 4.364 4.364 0 01-1.104 4.52 4.435 4.435 0 01-2.146 1.152l.426 1.955a6.434 6.434 0 003.115-1.674 6.386 6.386 0 001.752-3.063 6.363 6.363 0 00-.146-3.524l-.85.284.85-.284a6.393 6.393 0 00-2-2.91 6.453 6.453 0 00-6.743-.901 6.417 6.417 0 00-2.7 2.28c-.572.854-.894 1.76-1.018 3.064L2.137 6.81l-.69-.724L0 7.466l.69.724 2.92 3.062.705.74.724-.72 3.08-3.063.709-.705-1.41-1.418-.71.705L5.16 8.33c.085-1.202.337-1.818.708-2.37a4.416 4.416 0 011.858-1.57z"
        fill="currentColor"
      />
    </svg>
  </StyledIcon>
)
Resend.defaultProps = {
  width: '16',
  height: '16'
}

export default Resend
