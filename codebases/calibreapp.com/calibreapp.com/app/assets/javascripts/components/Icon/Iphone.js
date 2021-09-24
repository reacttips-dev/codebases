import React from 'react'

import StyledIcon from './'

const Ipad = ({ width, height, color, ...props }) => (
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
        <path d="M328.2,64H183.8C170.7,64,160,74.7,160,87.9v336.3c0,13.1,10.7,23.8,23.8,23.8h144.3c13.1,0,23.8-10.7,23.8-23.8V87.9 C352,74.7,341.3,64,328.2,64z M240,99.9c0-2.1,1.7-3.9,3.9-3.9h24.3c2.1,0,3.9,1.7,3.9,3.9v0.3c0,2.1-1.7,3.9-3.9,3.9h-24.3 c-2.1,0-3.9-1.7-3.9-3.9V99.9z M228,96c2.2,0,4,1.8,4,4c0,2.2-1.8,4-4,4s-4-1.8-4-4C224,97.8,225.8,96,228,96z M256,432.1 c-8.9,0-16.1-7.2-16.1-16.1c0-8.9,7.2-16.1,16.1-16.1c8.9,0,16.1,7.2,16.1,16.1C272.1,424.9,264.8,432.1,256,432.1z M336,384H176 V128h160V384z" />
      </g>
    </svg>
  </StyledIcon>
)

Ipad.defaultProps = {
  pathColor: 'rgb(145,145,145)',
  width: 20,
  height: 20
}

export default Ipad
