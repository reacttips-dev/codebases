import React from 'react';
import Icon from './Icon';

const Box = (props) => (
  <Icon viewBox="0 0 200 200" {...props}>
    <title>Box</title>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g>
        <circle fill="#ebebeb" cx="100" cy="100" r="100"></circle>
        <g transform="translate(54.500000, 51.000000)" fill="#FFFFFF">
          <rect x="0" y="30.2528736" width="94" height="63.7471264"></rect>
          <polygon points="19.8423259 0 45.3793103 0 45.3793103 27.0114943 1.08045977 27.0114943"></polygon>
          <polygon transform="translate(70.770115, 13.505747) scale(-1, 1) translate(-70.770115, -13.505747) " points="67.3825558 0 92.9195402 0 92.9195402 27.0114943 48.6206897 27.0114943"></polygon>
        </g>
      </g>
    </g>
  </Icon>
);

export default Box;
