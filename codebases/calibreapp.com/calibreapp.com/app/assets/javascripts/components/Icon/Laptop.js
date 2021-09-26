import React from 'react'

import StyledIcon from './'

const Laptop = ({ width, height, color, ...props }) => (
  <StyledIcon width={width} height={height} color={color} {...props}>
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="512px"
      height="512px"
      viewBox="0 0 512 512"
      enableBackground="new 0 0 512 512"
    >
      <g fill="currentColor">
        <path d="M480,106.3c0-5.6-4.1-10.3-9.6-10.3H42.2c-5.5,0-10.2,4.6-10.2,10.3V368h448V106.3z M448,336H64V128h384V336z" />
        <path d="M0,388.7C70.2,408.6,115.8,416,256,416c140.2,0,185.8-7.3,256-27.3V384H0V388.7z" />
      </g>
    </svg>
  </StyledIcon>
)

Laptop.defaultProps = {
  color: 'rgb(145,145,145)',
  width: 20,
  height: 20
}

export default Laptop
